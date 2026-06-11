import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../auth/infra/guards/jwt.guard';
import { GetKanbanUseCase } from '../application/use-cases/get-kanban.use-case';
import { MoveLeadUseCase } from '../application/use-cases/move-lead.use-case';
import { MoveLeadDto } from './dtos/move-lead.dto';

@Controller('kanban')
@UseGuards(JwtGuard)
export class KanbanController {
  constructor(
    private readonly getKanbanUseCase: GetKanbanUseCase,
    private readonly moveLeadUseCase: MoveLeadUseCase,
  ) {}

  @Get()
  async getKanban(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.getKanbanUseCase.execute(user.id);
  }

  @Patch(':leadId/move')
  async moveLead(
    @Req() req: Request,
    @Param('leadId') leadId: string,
    @Body() dto: MoveLeadDto,
  ) {
    const user = req.user as { id: string };
    return this.moveLeadUseCase.execute({
      leadId,
      statusId: dto.statusId,
      userId: user.id,
    });
  }
}
