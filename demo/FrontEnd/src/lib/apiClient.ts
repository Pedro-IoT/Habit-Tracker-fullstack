const BASE_URL = '/api'; // Proxy prefix for API requests
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';

let csrfBootstrapPromise: Promise<void> | null = null;

function readCookie(name: string): string | null {
    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`));

    if (!cookie) {
        return null;
    }

    const [, value] = cookie.split('=');
    return value ? decodeURIComponent(value) : null;
}

function resolveUrl(endpoint: string): string {
    if (endpoint.startsWith('/webauthn') || endpoint.startsWith('/oauth2') || endpoint.startsWith('/login/')) {
        return endpoint;
    }
    return `${BASE_URL}${endpoint}`;
}

function isUnsafeHttpMethod(method: string): boolean {
    return !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method);
}

async function ensureCsrfCookie(): Promise<void> {
    if (readCookie(CSRF_COOKIE_NAME)) {
        return;
    }

    if (!csrfBootstrapPromise) {
        csrfBootstrapPromise = fetch(`${BASE_URL}/csrf`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(() => undefined)
            .finally(() => {
                csrfBootstrapPromise = null;
            });
    }

    await csrfBootstrapPromise;
}

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const method = (options?.method || 'GET').toUpperCase();

    if (isUnsafeHttpMethod(method)) {
        await ensureCsrfCookie();
    }

    const url = resolveUrl(endpoint);
    const csrfToken = readCookie(CSRF_COOKIE_NAME);
    const config: RequestInit = {
        ...options,
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : {}),
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