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
    Tier.FREE: {"saved_schemas": 1, "api_keys": 0},
    Tier.PRO: {"saved_schemas": 5, "api_keys": 1},
    Tier.BUSINESS: {"saved_schemas": 20, "api_keys": 3},
}
