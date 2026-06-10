import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../auth/infra/guards/jwt.guard';
import { GetMeUseCase } from '../application/use-cases/get-me.use-case';
import { UpdateMeUseCase } from '../application/use-cases/update-me.use-case';
import { UpdateMeDto } from './dtos/update-me.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(
    private readonly getMeUseCase: GetMeUseCase,
    private readonly updateMeUseCase: UpdateMeUseCase,
  ) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.getMeUseCase.execute(user.id);
  }

  @Patch('me')
  async updateMe(@Req() req: Request, @Body() dto: UpdateMeDto) {
    const user = req.user as { id: string };
    return this.updateMeUseCase.execute({ userId: user.id, name: dto.name });
  }
}
