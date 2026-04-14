import resend
from app.config import Config

resend.api_key = Config.get_env_variable("RESEND_API_KEY")

FROM_EMAIL = Config.get_env_variable("RESEND_FROM_EMAIL")


def send_payment_failed_email(to_email: str) -> None:
    resend.Emails.send(
        {
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": "Payment failed — action required",
            "html": """
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
            <h1 style="font-size: 24px; font-weight: 700; color: #000000; margin-bottom: 8px;">
                Payment failed
            </h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                We were unable to process your subscription payment. Please update your
                payment method to avoid losing access to your current plan.
            </p>
            <a href="https://jsonextract.com/dashboard"
               style="display: inline-block; margin-top: 24px; padding: 12px 24px;
                      background: #000000; color: #ffffff; text-decoration: none;
                      border-radius: 8px; font-weight: 600; font-size: 15px;">
                Update payment method
            </a>
            <p style="margin-top: 32px; color: #999999; font-size: 14px; line-height: 1.6;">
                If you continue to experience issues, please reply to this email and
                we'll be happy to help.
            </p>
        </div>
        """,
        }
    )


def send_downgrade_notice_email(
    to_email: str, old_tier: str, new_tier: str, keys_revoked: int
) -> None:
    keys_message = ""
    if keys_revoked > 0:
        keys_message = f"""
        <div style="margin-top: 24px; padding: 16px; background: #f5f5f5;
                    border-radius: 8px; border-left: 4px solid #000000;">
            <p style="margin: 0; color: #333333; font-size: 15px; font-weight: 600;">
                {keys_revoked} API key{'s' if keys_revoked != 1 else ''} revoked
            </p>
            <p style="margin: 8px 0 0; color: #666666; font-size: 14px;">
                Due to your plan change, {keys_revoked} of your API
                key{'s have' if keys_revoked != 1 else ' has'} been revoked.
                You can generate new keys if you upgrade again.
            </p>
        </div>
        """

    resend.Emails.send(
        {
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": f"Your plan has been changed to {new_tier.capitalize()}",
            "html": f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
            <h1 style="font-size: 24px; font-weight: 700; color: #000000; margin-bottom: 8px;">
                Plan changed
            </h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                Your plan has been changed from <strong>{old_tier.capitalize()}</strong>
                to <strong>{new_tier.capitalize()}</strong>.
            </p>
            {keys_message}
            <a href="https://jsonextract.com/dashboard"
               style="display: inline-block; margin-top: 24px; padding: 12px 24px;
                      background: #000000; color: #ffffff; text-decoration: none;
                      border-radius: 8px; font-weight: 600; font-size: 15px;">
                View dashboard
            </a>
            <p style="margin-top: 32px; color: #999999; font-size: 14px; line-height: 1.6;">
                If you have any questions about your plan change, please reply to
                this email and we'll be happy to help.
            </p>
        </div>
        """,
        }
    )
