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
exports.RefreshUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const error_dictionary_1 = require("../../../../shared/domain/errors/error-dictionary");
const hash_util_1 = require("../../../../shared/utils/hash.util");
let RefreshUseCase = class RefreshUseCase {
    refreshTokenRepository;
    userRepository;
    jwtService;
    constructor(refreshTokenRepository, userRepository, jwtService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async execute(token) {
        const tokenHash = (0, hash_util_1.hashToken)(token);
        const refreshToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
        if (!refreshToken ||
            refreshToken.revoked ||
            refreshToken.expiresAt < new Date()) {
            throw error_dictionary_1.AppErrors.REFRESH_TOKEN_INVALID;
        }
        const user = await this.userRepository.findById(refreshToken.userId);
        if (!user) {
            throw error_dictionary_1.AppErrors.USER_NOT_FOUND;
        }
        await this.refreshTokenRepository.revokeByTokenHash(tokenHash);
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        const newRefreshToken = crypto.randomUUID();
        const newTokenHash = (0, hash_util_1.hashToken)(newRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenRepository.create({
            tokenHash: newTokenHash,
            userId: user.id,
            expiresAt,
        });
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
};
exports.RefreshUseCase = RefreshUseCase;
exports.RefreshUseCase = RefreshUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IRefreshTokenRepository')),
    __param(1, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, Object, jwt_1.JwtService])
], RefreshUseCase);
//# sourceMappingURL=refresh.use-case.js.map