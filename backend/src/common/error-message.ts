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

    // Address
    ADDRESS_NOT_FOUND = 'Address not found',
    ADDRESS_NO_ACCESS = 'You don\'t have enough permission to access this address',
    ADDRESS_PRIMARY_DELETE = 'Cannot delete primary address. Please set another address as primary first.',
    ADDRESS_ALREADY_PRIMARY = 'Address is already set as primary',
    NO_PRIMARY_ADDRESS = 'No primary address found for this user',
    ADDRESS_ALREADY_EXISTS = 'This address already exists for this user',

    //Tips
    TIP_NOT_FOUND = 'Tip not found',
    TIP_ALREADY_EXISTS = 'A tip with this content already exists',

    //Wallet
    WALLET_NOT_FOUND = 'Wallet not found',
    TRANSACTION_NOT_FOUND = 'Transaction not found',
    INVALID_AMOUNT = 'Invalid amount inputted, please try a different amount',
    INSUFFICIENT_BALANCE = 'Insufficient balance',
    WALLET_NO_ACCESS = 'You do not have access to this wallet',
    PAYMENT_METHOD_NOT_FOUND = 'Payment method not found',
    TRANSACTION_NO_ACCESS = 'You do not have access to this transaction'
}