import { AppError } from './app.error';
export declare const AppErrors: {
    readonly INVALID_CREDENTIALS: AppError;
    readonly TOKEN_EXPIRED: AppError;
    readonly TOKEN_INVALID: AppError;
    readonly REFRESH_TOKEN_INVALID: AppError;
    readonly UNAUTHORIZED: AppError;
    readonly USER_NOT_FOUND: AppError;
    readonly USER_ALREADY_EXISTS: AppError;
    readonly LEAD_NOT_FOUND: AppError;
    readonly STATUS_NOT_FOUND: AppError;
    readonly STATUS_DEFAULT_DELETE: AppError;
    readonly INVALID_STATUS: AppError;
    readonly INTERNAL_ERROR: AppError;
};
