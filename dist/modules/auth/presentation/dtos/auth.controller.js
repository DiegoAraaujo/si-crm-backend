"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const login_use_case_1 = require("../../application/use-cases/login.use-case");
const register_use_case_1 = require("../../application/use-cases/register.use-case");
const refresh_use_case_1 = require("../../application/use-cases/refresh.use-case");
const logout_use_case_1 = require("../../application/use-cases/logout.use-case");
const register_dto_1 = require("./register.dto");
const login_dto_1 = require("./login.dto");
const error_dictionary_1 = require("../../../../shared/domain/errors/error-dictionary");
let AuthController = class AuthController {
    registerUseCase;
    loginUseCase;
    refreshUseCase;
    logoutUseCase;
    constructor(registerUseCase, loginUseCase, refreshUseCase, logoutUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.refreshUseCase = refreshUseCase;
        this.logoutUseCase = logoutUseCase;
    }
    async register(dto, res) {
        const { accessToken, refreshToken, user } = await this.registerUseCase.execute(dto);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ accessToken, user });
    }
    async login(dto, res) {
        const { accessToken, refreshToken, user } = await this.loginUseCase.execute(dto);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ accessToken, user });
    }
    async refresh(req, res) {
        const token = req.cookies['refresh_token'];
        if (!token)
            throw error_dictionary_1.AppErrors.REFRESH_TOKEN_INVALID;
        const { accessToken, refreshToken } = await this.refreshUseCase.execute(token);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ accessToken });
    }
    async logout(req, res) {
        const token = req.cookies['refresh_token'];
        if (!token)
            throw error_dictionary_1.AppErrors.REFRESH_TOKEN_INVALID;
        await this.logoutUseCase.execute(token);
        res.clearCookie('refresh_token');
        return res.status(204).send();
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_use_case_1.RegisterUseCase,
        login_use_case_1.LoginUseCase,
        refresh_use_case_1.RefreshUseCase,
        logout_use_case_1.LogoutUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map