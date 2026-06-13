import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { JwtGuard } from '../../auth/infra/guards/jwt.guard'
import { ChatUseCase } from '../application/use-cases/chat.use-case'
import { ChatDto } from './dtos/chat.dto'

@Controller('ai')
@UseGuards(JwtGuard)
export class AiController {
  constructor(private readonly chatUseCase: ChatUseCase) {}

  @Post('chat')
  async chat(@Req() req: Request, @Body() dto: ChatDto) {
    const response = await this.chatUseCase.execute({
      message: dto.message,
      history: dto.history,
    })
    return { response }
  }
}