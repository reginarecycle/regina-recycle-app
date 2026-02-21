

export const isAuthenticated = () => {
    const now = Date.now();
    const expireTime = +(
        localStorage.getItem(import.meta.env.VITE_EXPIRY_TOKEN_TIME) || 0
    );
    const token = localStorage.getItem(import.meta.env.VITE_EXPIRY_TOKEN_TIME);
    const sessionIsValid = expireTime > now && !!token;
    return sessionIsValid;
};
export const isUnAuthenticated = () => {
    const now = Date.now();
    const expireTime = +(
        localStorage.getItem(import.meta.env.VITE_EXPIRY_TOKEN_TIME) || 0
    );
    const token = localStorage.getItem(import.meta.env.VITE_EXPIRY_TOKEN_TIME);
    const sessionIsInvalid = expireTime <= now || !token;
    return sessionIsInvalid;
};

export const setUserRole = (role: 'user' | 'collector') => {
    localStorage.setItem('userRole', role);
};

// export const getUserRole = (): 'user' | 'collector' | null => {
//     return localStorage.getItem('userRole') as 'user' | 'collector' | null;
// };

export const clearAuth = () => {
    localStorage.removeItem(import.meta.env.VITE_EXPIRY_TOKEN_TIME);
    localStorage.removeItem('userRole');
    // Remove any other auth-related items
};