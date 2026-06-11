import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { AuthController } from './presentation/dtos/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { UserRepository } from '../users/infra/repositories/user.repository';
import { RefreshTokenRepository } from './infra/repositories/refresh-token.repository';
import { StatusRepository } from '../statuses/infra/repositories/status.repository';
import { JwtStrategy } from './infra/guards/jwt.strategy';
import { JwtGuard } from './infra/guards/jwt.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'si-crm-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    JwtStrategy,
    JwtGuard,
    PrismaService,
    UserRepository,
    RefreshTokenRepository,
    StatusRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
    {
      provide: 'IStatusRepository',
      useClass: StatusRepository,
    },
  ],
  exports: [JwtGuard, JwtStrategy, JwtModule],
})
export class AuthModule {}
