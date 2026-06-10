"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../../shared/infra/database/prisma.service");
const register_use_case_1 = require("./application/use-cases/register.use-case");
const login_use_case_1 = require("./application/use-cases/login.use-case");
const refresh_use_case_1 = require("./application/use-cases/refresh.use-case");
const logout_use_case_1 = require("./application/use-cases/logout.use-case");
const user_repository_1 = require("../users/infra/repositories/user.repository");
const refresh_token_repository_1 = require("./infra/repositories/refresh-token.repository");
const jwt_strategy_1 = require("./infra/guards/jwt.strategy");
const jwt_guard_1 = require("./infra/guards/jwt.guard");
const auth_controller_1 = require("./presentation/dtos/auth.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ?? 'si-crm-secret-key',
                signOptions: { expiresIn: '15m' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            register_use_case_1.RegisterUseCase,
            login_use_case_1.LoginUseCase,
            refresh_use_case_1.RefreshUseCase,
            logout_use_case_1.LogoutUseCase,
            jwt_strategy_1.JwtStrategy,
            jwt_guard_1.JwtGuard,
            prisma_service_1.PrismaService,
            user_repository_1.UserRepository,
            refresh_token_repository_1.RefreshTokenRepository,
            {
                provide: 'IUserRepository',
                useClass: user_repository_1.UserRepository,
            },
            {
                provide: 'IRefreshTokenRepository',
                useClass: refresh_token_repository_1.RefreshTokenRepository,
            },
        ],
        exports: [jwt_guard_1.JwtGuard, jwt_strategy_1.JwtStrategy, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map