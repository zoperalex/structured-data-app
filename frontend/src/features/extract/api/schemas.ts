import { API_BASE_URL } from "../../../shared/constants/api";
import type { SchemaField } from "../types";

export type SavedSchema = {
    id: number;
    name: string;
    fields: SchemaField[];
    created_at: string;
};

export async function saveSchema(
    accessToken: string,
    name: string,
    fields: SchemaField[]
): Promise<SavedSchema> {
    const response = await fetch(`${API_BASE_URL}/schemas/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, fields }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save schema");
    }

    return response.json();
}

export async function getSchemas(accessToken: string): Promise<SavedSchema[]> {
    const response = await fetch(`${API_BASE_URL}/schemas/`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch schemas");
    }

    return response.json();
}

export async function deleteSchema(
    accessToken: string,
    schemaId: number
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/schemas/${schemaId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete schema");
    }
}