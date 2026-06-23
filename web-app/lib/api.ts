const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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

    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new Error(
            `Cannot reach API at ${API_BASE}. Is horeca-api running? (npm run dev)`
        );
    }

    let data: unknown;
    try {
        data = await res.json();
    } catch {
        throw new Error(`API returned non-JSON response (${res.status})`);
    }

    return data as T;
}

export async function apiPost<T = unknown>(
    path: string,
    body: object,
    withAuth = false
) {
    return apiRequest<T>(path, {
        method: "POST",
        body,
        token: withAuth ? getAccessToken() : undefined,
    });
}

export async function apiGet<T = unknown>(path: string, token?: string | null) {
    return apiRequest<T>(path, { method: "GET", token });
}
export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
}

export async function apiPatch<T = unknown>(path: string, body: object) {
    return apiRequest<T>(path, {
        method: "PATCH",
        body,
        token: getAccessToken(),
    });
}