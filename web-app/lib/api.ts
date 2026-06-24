const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: object;
    token?: string | null;
};

export function resolveMediaUrl(url: string): string {
    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:") ||
        url.startsWith("blob:")
    ) {
        return url;
    }
    // Only uploaded files live on the API server; other / paths are web-app public assets
    if (url.startsWith("/uploads/")) {
        return `${API_BASE}${url}`;
    }
    return url.startsWith("/") ? url : `/${url}`;
}

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

export async function apiUpload<T = unknown>(path: string, file: File): Promise<T> {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers,
            body: formData,
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