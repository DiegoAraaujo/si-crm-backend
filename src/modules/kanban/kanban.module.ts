import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { KanbanRepository } from './infra/repositories/kanban.repository';
import { KanbanController } from './presentation/kanban.controller';
import { GetKanbanUseCase } from './application/use-cases/get-kanban.use-case';
import { MoveLeadUseCase } from './application/use-cases/move-lead.use-case';
import { StatusRepository } from '../statuses/infra/repositories/status.repository';
import { LeadRepository } from '../leads/infra/repositories/lead.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [KanbanController],
  providers: [
    PrismaService,
    KanbanRepository,
    StatusRepository,
    LeadRepository,
    GetKanbanUseCase,
    MoveLeadUseCase,
    {
      provide: 'IKanbanRepository',
      useClass: KanbanRepository,
    },
    {
      provide: 'IStatusRepository',
      useClass: StatusRepository,
    },
    {
      provide: 'ILeadRepository',
      useClass: LeadRepository,
    },
  ],
})
export class KanbanModule {}
