import os
from app.enums import Tier


class Config:
    @staticmethod
    def get_env_variable(var_name: str) -> str:
        key = os.getenv(var_name)
        if not key:
            raise ValueError(var_name + " is not set")
        return key


TIER_LIMITS = {
    "unauthenticated": {"saved_schemas": 0, "api_keys": 0, "requests_per_hour": 10},
    Tier.FREE: {"saved_schemas": 1, "api_keys": 0, "requests_per_hour": 50},
    Tier.PRO: {"saved_schemas": 5, "api_keys": 1, "requests_per_hour": 100},
    Tier.BUSINESS: {"saved_schemas": 20, "api_keys": 3, "requests_per_hour": 500},
}

STRIPE_PRICE_TO_TIER = {
    os.getenv("STRIPE_PRO_MONTHLY"): Tier.PRO,
    os.getenv("STRIPE_PRO_ANNUAL"): Tier.PRO,
    os.getenv("STRIPE_BUSINESS_MONTHLY"): Tier.BUSINESS,
    os.getenv("STRIPE_BUSINESS_ANNUAL"): Tier.BUSINESS,
}
