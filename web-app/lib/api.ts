const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: object;
    token?: string | null;
};

export async function apiRequest<T = unknown>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const { method = "GET", body, token } = options;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    return data as T;
}

export async function apiPost<T = unknown>(path: string, body: object) {
    return apiRequest<T>(path, { method: "POST", body });
}

export async function apiGet<T = unknown>(path: string, token?: string | null) {
    return apiRequest<T>(path, { method: "GET", token });
}