import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { LeadRepository } from './infra/repositories/lead.repository';
import { LeadsController } from './presentation/leads.controller';
import { CreateLeadUseCase } from './application/use-cases/create-lead.use-case';
import { ListLeadsUseCase } from './application/use-cases/list-leads.use-case';
import { FindLeadUseCase } from './application/use-cases/find-lead.use-case';
import { UpdateLeadUseCase } from './application/use-cases/update-lead.use-case';
import { DeleteLeadUseCase } from './application/use-cases/delete-lead.use-case';
import { StatusRepository } from '../statuses/infra/repositories/status.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LeadsController],
  providers: [
    PrismaService,
    LeadRepository,
    StatusRepository,
    CreateLeadUseCase,
    ListLeadsUseCase,
    FindLeadUseCase,
    UpdateLeadUseCase,
    DeleteLeadUseCase,
    {
      provide: 'ILeadRepository',
      useClass: LeadRepository,
    },
    {
      provide: 'IStatusRepository',
      useClass: StatusRepository,
    },
  ],
  exports: [LeadRepository],
})
export class LeadsModule {}
