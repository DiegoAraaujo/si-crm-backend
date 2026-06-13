import { AppError } from './app.error';

export const AppErrors = {
  INVALID_CREDENTIALS: new AppError(
    'Invalid credentials',
    'INVALID_CREDENTIALS',
    401,
  ),
  TOKEN_EXPIRED: new AppError('Token expired', 'TOKEN_EXPIRED', 401),
  TOKEN_INVALID: new AppError('Token invalid', 'TOKEN_INVALID', 401),
  REFRESH_TOKEN_INVALID: new AppError(
    'Refresh token invalid',
    'REFRESH_TOKEN_INVALID',
    401,
  ),
  UNAUTHORIZED: new AppError('Unauthorized', 'UNAUTHORIZED', 401),

  USER_NOT_FOUND: new AppError('User not found', 'USER_NOT_FOUND', 404),
  USER_ALREADY_EXISTS: new AppError(
    'Email already in use',
    'USER_ALREADY_EXISTS',
    409,
  ),

  LEAD_NOT_FOUND: new AppError('Lead not found', 'LEAD_NOT_FOUND', 404),

  STATUS_NOT_FOUND: new AppError('Status not found', 'STATUS_NOT_FOUND', 404),
  STATUS_DEFAULT_DELETE: new AppError(
    'Cannot delete default status',
    'STATUS_DEFAULT_DELETE',
    400,
  ),

  INVALID_STATUS: new AppError('Invalid status', 'INVALID_STATUS', 400),

  INTERNAL_ERROR: new AppError('Internal server error', 'INTERNAL_ERROR', 500),
} as const;
