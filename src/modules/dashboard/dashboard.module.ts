import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { DashboardController } from './presentation/dashboard.controller';
import { GetDashboardUseCase } from './application/use-cases/get-dashboard.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DashboardController],
  providers: [PrismaService, GetDashboardUseCase],
})
export class DashboardModule {}
