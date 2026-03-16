const BASE_URL = '/api'; // Proxy prefix for API requests

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const config: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        },
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        const errorText = await response.json().catch(() => null);
        throw new Error(errorText?.message || `API request failed with status ${response.status}`);
    }

    if (response.status === 204) { // No Content
        return null as T;
    }

    const text = await response.text();

    if (!text) return null as T;

    try {
        return JSON.parse(text);
    } catch (error) {
        return text as unknown as T;
    }
}