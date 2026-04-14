import { API_BASE_URL } from "../../../shared/constants/api";
import type { ErrorResponse, ExtractRequest, ExtractResponse } from "../types";

export async function extractStructuredData(
    payload: ExtractRequest,
    accessToken?: string,
): Promise<ExtractResponse> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/extract`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || "Something went wrong");
    }

    return (await response.json()) as ExtractResponse;
}