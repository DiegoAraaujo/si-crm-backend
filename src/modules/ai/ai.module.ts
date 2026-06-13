import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { AiController } from './presentation/ai.controller'
import { ChatUseCase } from './application/use-cases/chat.use-case'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [AiController],
  providers: [ChatUseCase],
})
export class AiModule {}