import { ExecutionContext } from '@nestjs/common';
declare const JwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtGuard extends JwtGuard_base {
    handleRequest<TUser = any>(err: any, user: any, _info: any, _context: ExecutionContext): TUser;
}
export {};
