"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrors = void 0;
const app_error_1 = require("./app.error");
exports.AppErrors = {
    INVALID_CREDENTIALS: new app_error_1.AppError('Invalid credentials', 'INVALID_CREDENTIALS', 401),
    TOKEN_EXPIRED: new app_error_1.AppError('Token expired', 'TOKEN_EXPIRED', 401),
    TOKEN_INVALID: new app_error_1.AppError('Token invalid', 'TOKEN_INVALID', 401),
    REFRESH_TOKEN_INVALID: new app_error_1.AppError('Refresh token invalid', 'REFRESH_TOKEN_INVALID', 401),
    UNAUTHORIZED: new app_error_1.AppError('Unauthorized', 'UNAUTHORIZED', 401),
    USER_NOT_FOUND: new app_error_1.AppError('User not found', 'USER_NOT_FOUND', 404),
    USER_ALREADY_EXISTS: new app_error_1.AppError('Email already in use', 'USER_ALREADY_EXISTS', 409),
    LEAD_NOT_FOUND: new app_error_1.AppError('Lead not found', 'LEAD_NOT_FOUND', 404),
    STATUS_NOT_FOUND: new app_error_1.AppError('Status not found', 'STATUS_NOT_FOUND', 404),
    STATUS_DEFAULT_DELETE: new app_error_1.AppError('Cannot delete default status', 'STATUS_DEFAULT_DELETE', 400),
    INVALID_STATUS: new app_error_1.AppError('Invalid status', 'INVALID_STATUS', 400),
    INTERNAL_ERROR: new app_error_1.AppError('Internal server error', 'INTERNAL_ERROR', 500),
};
//# sourceMappingURL=error-dictionary.js.map