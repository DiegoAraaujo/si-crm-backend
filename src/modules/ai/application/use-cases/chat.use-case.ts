import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

interface Message {
  role: string
  content: string
}

interface ChatInput {
  message: string
  history: Message[]
}

@Injectable()
export class ChatUseCase {
  constructor(private readonly httpService: HttpService) {}

  async execute(input: ChatInput): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.post(process.env.AI_SERVICE_URL ?? 'http://localhost:8000/chat', {
        message: input.message,
        history: input.history,
      }),
    )
    return data.response
  }
}