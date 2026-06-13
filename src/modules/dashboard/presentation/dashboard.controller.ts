import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../auth/infra/guards/jwt.guard';
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case';

@Controller('dashboard')
@UseGuards(JwtGuard)
export class DashboardController {
  constructor(private readonly getDashboardUseCase: GetDashboardUseCase) {}

  @Get()
  async getDashboard(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.getDashboardUseCase.execute(user.id);
  }
}
