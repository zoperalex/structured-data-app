import stripe
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.config import Config, STRIPE_PRICE_TO_TIER
from app.models.profile import Profile
from app.use_cases.get_or_create_profile import GetOrCreateProfileUseCase
from app.adapters.db.session import db
from app.enums import Tier
from app.services.email_service import (
    send_payment_failed_email,
    send_downgrade_notice_email,
)

stripe.api_key = Config.get_env_variable("STRIPE_SECRET_KEY")

billing_blueprint = Blueprint("billing", __name__, url_prefix="/billing")


@billing_blueprint.route("/create-checkout-session", methods=["POST"])
@jwt_required()
def create_checkout_session():
    user_id = get_jwt_identity()
    body = request.get_json()
    price_id = body.get("price_id")

    if not price_id:
        return jsonify({"error": "price_id is required"}), 400

    if price_id not in STRIPE_PRICE_TO_TIER:
        return jsonify({"error": "Invalid price_id"}), 400

    profile = GetOrCreateProfileUseCase().execute(user_id)

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=Config.get_env_variable("STRIPE_SUCCESS_REDIRECT_URL"),
            cancel_url=Config.get_env_variable("STRIPE_CANCEL_REDIRECT_URL"),
            metadata={"user_id": user_id},
            customer_email=None,
        )
        return jsonify({"url": checkout_session.url})
    except stripe.StripeError as e:
        return jsonify({"error": str(e)}), 500


@billing_blueprint.route("/cancel-subscription", methods=["POST"])
@jwt_required()
def cancel_subscription():
    user_id = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=user_id).first()

    if not profile or not profile.stripe_subscription_id:
        return jsonify({"error": "No active subscription found"}), 404

    try:
        stripe.Subscription.modify(
            profile.stripe_subscription_id,
            cancel_at_period_end=True,
        )
        return jsonify(
            {
                "message": "Subscription will be cancelled at the end of the billing period"
            }
        )
    except stripe.StripeError as e:
        return jsonify({"error": str(e)}), 500


@billing_blueprint.route("/webhook", methods=["POST"])
def webhook():
    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature")
    webhook_secret = Config.get_env_variable("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except stripe.errors.SignatureVerificationError as e:
        return jsonify({"error": "Invalid signature"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        if event["type"] == "checkout.session.completed":
            session_data = event["data"]["object"]
            metadata = session_data["metadata"]
            user_id = (
                metadata["user_id"] if metadata and "user_id" in metadata else None
            )
            subscription_id = session_data["subscription"]

            if user_id and subscription_id:
                subscription = stripe.Subscription.retrieve(subscription_id)
                price_id = subscription["items"]["data"][0]["price"]["id"]

                if price_id in STRIPE_PRICE_TO_TIER:
                    tier = STRIPE_PRICE_TO_TIER[price_id]
                    profile = Profile.query.filter_by(user_id=user_id).first()
                    if profile:
                        profile.tier = tier
                        profile.stripe_subscription_id = subscription_id
                        db.session.commit()

        elif event["type"] == "invoice.payment_failed":
            invoice = event["data"]["object"]
            customer_email = (
                invoice["customer_email"]
                if "customer_email" in invoice and invoice["customer_email"]
                else (
                    invoice["customer_details"]["email"]
                    if "customer_details" in invoice
                    else None
                )
            )
            if customer_email:
                try:
                    send_payment_failed_email(customer_email)
                except Exception as e:
                    print(f"Failed to send payment failed email: {e}")

        elif event["type"] == "customer.subscription.updated":
            subscription = event["data"]["object"]
            price_id = subscription["items"]["data"][0]["price"]["id"]

            if price_id not in STRIPE_PRICE_TO_TIER:
                return jsonify({"status": "ok"})

            checkout_sessions = stripe.checkout.Session.list(
                subscription=subscription["id"], limit=1
            )
            user_id = None
            customer_email = None
            if checkout_sessions.data:
                session_data = checkout_sessions.data[0]
                user_id = (
                    session_data.metadata["user_id"]
                    if "user_id" in session_data.metadata
                    else None
                )
                customer_email = (
                    session_data["customer_details"]["email"]
                    if "customer_details" in session_data
                    else None
                )

            if user_id and price_id in STRIPE_PRICE_TO_TIER:
                new_tier = STRIPE_PRICE_TO_TIER[price_id]
                profile = Profile.query.filter_by(user_id=user_id).first()
                if profile:
                    old_tier = profile.tier
                    profile.tier = new_tier
                    db.session.commit()

                    if old_tier != new_tier:
                        from app.use_cases.revoke_excess_api_keys import (
                            RevokeExcessApiKeysUseCase,
                        )

                        keys_revoked = RevokeExcessApiKeysUseCase().execute(
                            user_id, new_tier
                        )

                        if customer_email and keys_revoked > 0:
                            try:
                                send_downgrade_notice_email(
                                    to_email=customer_email,
                                    old_tier=old_tier.value,
                                    new_tier=new_tier.value,
                                    keys_revoked=keys_revoked,
                                )
                            except Exception as e:
                                print(f"Failed to send downgrade email: {e}")

        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            checkout_sessions = stripe.checkout.Session.list(
                subscription=subscription["id"], limit=1
            )
            if checkout_sessions.data:
                session_data = checkout_sessions.data[0]
                user_id = (
                    session_data.metadata["user_id"]
                    if "user_id" in session_data.metadata
                    else None
                )
                customer_email = (
                    session_data["customer_details"]["email"]
                    if "customer_details" in session_data
                    else None
                )

                if user_id:
                    profile = Profile.query.filter_by(user_id=user_id).first()
                    if profile:
                        old_tier = profile.tier
                        profile.tier = Tier.FREE
                        db.session.commit()

                        from app.use_cases.revoke_excess_api_keys import (
                            RevokeExcessApiKeysUseCase,
                        )

                        keys_revoked = RevokeExcessApiKeysUseCase().execute(
                            user_id, Tier.FREE
                        )

                        if customer_email:
                            try:
                                send_downgrade_notice_email(
                                    to_email=customer_email,
                                    old_tier=old_tier.value,
                                    new_tier="free",
                                    keys_revoked=keys_revoked,
                                )
                            except Exception as e:
                                print(f"Failed to send downgrade email: {e}")

    except Exception as e:
        print(f"Webhook processing error: {e}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    return jsonify({"status": "ok"})
