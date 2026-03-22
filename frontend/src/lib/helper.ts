const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN ?? "acc_key";
const EXPIRY_KEY = import.meta.env.VITE_EXPIRY_TOKEN_TIME ?? "auth_expiry";
const ROLE_KEY = "userRole";

// ── Token persistence ─────────────────────────────────────────────────────────

export function saveToken(token: string) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp) {
            localStorage.setItem(EXPIRY_KEY, String(payload.exp * 1000)); // store as ms
        }
    } catch {
        // malformed JWT — skip expiry
    }
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

// ── Session checks ────────────────────────────────────────────────────────────

export function isAuthenticated(): boolean {
    const token = getToken();
    const expiry = Number(localStorage.getItem(EXPIRY_KEY) ?? 0);
    return !!token && expiry > Date.now();
}

export function isUnAuthenticated(): boolean {
    return !isAuthenticated();
}

export function isTokenExpired(): boolean {
    const expiry = Number(localStorage.getItem(EXPIRY_KEY) ?? 0);
    return expiry <= Date.now();
}

// ── Role ──────────────────────────────────────────────────────────────────────

export function setUserRole(role: "CUSTOMER" | "COLLECTOR") {
    localStorage.setItem(ROLE_KEY, role);
}

export function getUserRole(): string | null {
    return localStorage.getItem(ROLE_KEY);
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    localStorage.removeItem(ROLE_KEY);
}