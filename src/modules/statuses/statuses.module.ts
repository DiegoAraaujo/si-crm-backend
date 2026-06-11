import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { StatusRepository } from './infra/repositories/status.repository';
import { StatusesController } from './presentation/statuses.controller';
import { ListStatusesUseCase } from './application/use-cases/list-statuses.use-case';
import { CreateStatusUseCase } from './application/use-cases/create-status.use-case';
import { UpdateStatusUseCase } from './application/use-cases/update-status.use-case';
import { DeleteStatusUseCase } from './application/use-cases/delete-status.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StatusesController],
  providers: [
    PrismaService,
    StatusRepository,
    ListStatusesUseCase,
    CreateStatusUseCase,
    UpdateStatusUseCase,
    DeleteStatusUseCase,
    {
      provide: 'IStatusRepository',
      useClass: StatusRepository,
    },
  ],
  exports: [StatusRepository],
})
export class StatusesModule {}
