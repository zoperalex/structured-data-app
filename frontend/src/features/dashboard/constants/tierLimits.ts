export const TIER_LIMITS = {
    free: {
        saved_schemas: 1,
        api_keys: 0,
        requests_per_hour: 50,
    },
    pro: {
        saved_schemas: 5,
        api_keys: 1,
        requests_per_hour: 100,
    },
    business: {
        saved_schemas: 20,
        api_keys: 3,
        requests_per_hour: 500,
    },
};

export const STRIPE_PRICES = {
    pro: {
        monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY,
        annual: import.meta.env.VITE_STRIPE_PRO_ANNUAL,
    },
    business: {
        monthly: import.meta.env.VITE_STRIPE_BUSINESS_MONTHLY,
        annual: import.meta.env.VITE_STRIPE_BUSINESS_ANNUAL,
    },
};