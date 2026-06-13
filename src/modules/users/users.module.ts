import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { UserRepository } from './infra/repositories/user.repository';
import { UsersController } from './presentation/users.controller';
import { GetMeUseCase } from './application/use-cases/get-me.use-case';
import { UpdateMeUseCase } from './application/use-cases/update-me.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    PrismaService,
    UserRepository,
    GetMeUseCase,
    UpdateMeUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
