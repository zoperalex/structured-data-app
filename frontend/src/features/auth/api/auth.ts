import { API_BASE_URL } from "../../../shared/constants/api";

export type Profile = {
    user_id: string;
    username: string | null;
    tier: string;
    created_at: string;
};

export type UsageData = {
    requests_this_hour: number;
    requests_today: number;
    limit_per_hour: number;
};

export type ApiKey = {
    id: number;
    name: string;
    key_prefix: string;
    created_at: string;
    last_used_at: string | null;
};

export type GeneratedApiKey = {
    raw_key: string;
    key_prefix: string;
    name: string;
};

export async function getUsage(accessToken: string): Promise<UsageData> {
    const response = await fetch(`${API_BASE_URL}/auth/usage`, {
        headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to fetch usage");
    return response.json();
}

export async function getApiKeys(accessToken: string): Promise<ApiKey[]> {
    const response = await fetch(`${API_BASE_URL}/api-keys/`, {
        headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to fetch API keys");
    return response.json();
}

export async function generateApiKey(
    accessToken: string,
    name: string
): Promise<GeneratedApiKey> {
    const response = await fetch(`${API_BASE_URL}/api-keys/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate API key");
    }
    return response.json();
}

export async function revokeApiKey(
    accessToken: string,
    keyId: number
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api-keys/${keyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to revoke API key");
}

export async function getProfile(accessToken: string): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
}

export async function updateUsername(
    accessToken: string,
    username: string
): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update username");
    }

    return response.json();
}

export async function createCheckoutSession(
    accessToken: string,
    priceId: string
): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE_URL}/billing/create-checkout-session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ price_id: priceId }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create checkout session");
    }

    return response.json();
}

export async function cancelSubscription(accessToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/billing/cancel-subscription`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel subscription");
    }
}