import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../auth/infra/guards/jwt.guard';
import { CreateLeadUseCase } from '../application/use-cases/create-lead.use-case';
import { ListLeadsUseCase } from '../application/use-cases/list-leads.use-case';
import { FindLeadUseCase } from '../application/use-cases/find-lead.use-case';
import { UpdateLeadUseCase } from '../application/use-cases/update-lead.use-case';
import { DeleteLeadUseCase } from '../application/use-cases/delete-lead.use-case';
import { CreateLeadDto } from './dtos/create-lead.dto';
import { UpdateLeadDto } from './dtos/update-lead.dto';

@Controller('leads')
@UseGuards(JwtGuard)
export class LeadsController {
  constructor(
    private readonly createLeadUseCase: CreateLeadUseCase,
    private readonly listLeadsUseCase: ListLeadsUseCase,
    private readonly findLeadUseCase: FindLeadUseCase,
    private readonly updateLeadUseCase: UpdateLeadUseCase,
    private readonly deleteLeadUseCase: DeleteLeadUseCase,
  ) {}

  @Get()
  async list(
    @Req() req: Request,
    @Query('statusId') statusId?: string,
    @Query('origin') origin?: string,
    @Query('search') search?: string,
  ) {
    const user = req.user as { id: string };
    return this.listLeadsUseCase.execute({
      userId: user.id,
      statusId,
      origin,
      search,
    });
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateLeadDto) {
    const user = req.user as { id: string };
    return this.createLeadUseCase.execute({ ...dto, userId: user.id });
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string };
    return this.findLeadUseCase.execute({ id, userId: user.id });
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    const user = req.user as { id: string };
    return this.updateLeadUseCase.execute({ id, userId: user.id, ...dto });
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string };
    await this.deleteLeadUseCase.execute({ id, userId: user.id });
  }
}
