import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { ActivityRepository } from './infra/repositories/activity.repository';
import { ActivitiesController } from './presentation/activities.controller';
import { ListActivitiesUseCase } from './application/use-cases/list-activities.use-case';
import { CreateActivityUseCase } from './application/use-cases/create-activity.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ActivitiesController],
  providers: [
    PrismaService,
    ActivityRepository,
    ListActivitiesUseCase,
    CreateActivityUseCase,
    {
      provide: 'IActivityRepository',
      useClass: ActivityRepository,
    },
  ],
  exports: [
    CreateActivityUseCase,
    ActivityRepository,
    { provide: 'IActivityRepository', useClass: ActivityRepository },
  ],
})
export class ActivitiesModule {}
