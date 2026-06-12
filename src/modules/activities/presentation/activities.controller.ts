import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../auth/infra/guards/jwt.guard';
import { ListActivitiesUseCase } from '../application/use-cases/list-activities.use-case';

@Controller('activities')
@UseGuards(JwtGuard)
export class ActivitiesController {
  constructor(private readonly listActivitiesUseCase: ListActivitiesUseCase) {}

  @Get()
  async list(@Req() req: Request, @Query('leadId') leadId?: string) {
    const user = req.user as { id: string };
    return this.listActivitiesUseCase.execute({ userId: user.id, leadId });
  }
}
