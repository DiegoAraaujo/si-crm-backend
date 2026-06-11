import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../auth/infra/guards/jwt.guard';
import { ListStatusesUseCase } from '../application/use-cases/list-statuses.use-case';
import { CreateStatusUseCase } from '../application/use-cases/create-status.use-case';
import { UpdateStatusUseCase } from '../application/use-cases/update-status.use-case';
import { DeleteStatusUseCase } from '../application/use-cases/delete-status.use-case';
import { CreateStatusDto } from './dtos/create-status.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';

@Controller('statuses')
@UseGuards(JwtGuard)
export class StatusesController {
  constructor(
    private readonly listStatusesUseCase: ListStatusesUseCase,
    private readonly createStatusUseCase: CreateStatusUseCase,
    private readonly updateStatusUseCase: UpdateStatusUseCase,
    private readonly deleteStatusUseCase: DeleteStatusUseCase,
  ) {}

  @Get()
  async list(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.listStatusesUseCase.execute(user.id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateStatusDto) {
    const user = req.user as { id: string };
    return this.createStatusUseCase.execute({ ...dto, userId: user.id });
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    const user = req.user as { id: string };
    return this.updateStatusUseCase.execute({ id, userId: user.id, ...dto });
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string };
    await this.deleteStatusUseCase.execute({ id, userId: user.id });
  }
}
