export enum ErrorMessage {
    // Server
    SERVER_ERROR = 'An unexpected error occurred. Please try again later.',
    
    // User
    USER_NOT_FOUND = 'User not found',
    NOT_FOUND = 'Resource not found',
    NO_ACCESS = 'You do not have permission to perform this action',
    JWT_SECRET_MISSING = 'JWT_SECRET is not defined in environment variables',
    
    // Auth
    INVALID_USER_CREDENTIALS = 'Invalid email or password',
    TOKEN_INVALID = 'Invalid or malformed token',
    TOKEN_EXPIRED_VERIFICATION = 'Verification code has expired. Please request a new one.',
    TOKEN_EXPIRED_RESET = 'Password reset link has expired',
    TOKEN_TYPE_INVALID = 'Invalid token type',
    
    // Password
    PASSWORD_NO_MATCH = 'Passwords do not match',
    PASSWORD_INVALID = 'Current password is incorrect',
    
    // Email
    EMAIL_TAKEN = 'Email is already registered',
    EMAIL_ALREADY_VERIFIED = 'Email is already verified',
    EMAIL_SEND_FAILED = 'Failed to send email. Please try again',
    
    // Account
    ACCOUNT_INACTIVE = 'Your account is inactive. Please contact support',
    
    // Collector
    LICENSE_ID_REQUIRED = 'License ID is required for collector accounts',
    LICENSE_ID_TAKEN = 'This license ID is already registered',
    
    // Legacy (keep if used elsewhere)
    ROLE_EXIST = 'User already has this role',
    ROLE_NOT_EXIST = 'Role does not exist',
    USERNAME_TAKEN = 'Username is already taken',
    PHONE_NUMBER_TAKEN = 'Phone number is already in use',
    REFRESH_TOKEN_NOT_FOUND = 'Refresh token not found',
    USER_STILL_IN_SESSION = 'An active session already exists. Please log out first',
    EMPTY_DATA = 'Request body cannot be empty',
}