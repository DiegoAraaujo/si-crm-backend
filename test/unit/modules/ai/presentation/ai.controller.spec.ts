import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from 'src/modules/ai/presentation/ai.controller';
import { ChatUseCase } from 'src/modules/ai/application/use-cases/chat.use-case';
import { Request } from 'express';

const makeRequest = (): Partial<Request> => ({
  user: { id: 'user-id-123' },
});

describe('AiController', () => {
  let controller: AiController;
  let chatUseCase: jest.Mocked<ChatUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: ChatUseCase, useValue: { execute: jest.fn() } }],
    }).compile();

    controller = module.get<AiController>(AiController);
    chatUseCase = module.get(ChatUseCase);
  });

  describe('POST /ai/chat', () => {
    it('should call ChatUseCase with message and history', async () => {
      chatUseCase.execute.mockResolvedValue('Hello, how can I help you?');

      await controller.chat(makeRequest() as Request, {
        message: 'Hello',
        history: [],
      });

      expect(chatUseCase.execute).toHaveBeenCalledWith({
        message: 'Hello',
        history: [],
      });
    });

    it('should return response wrapped in an object', async () => {
      chatUseCase.execute.mockResolvedValue('Hello, how can I help you?');

      const result = await controller.chat(makeRequest() as Request, {
        message: 'Hello',
        history: [],
      });

      expect(result).toEqual({ response: 'Hello, how can I help you?' });
    });

    it('should forward history to ChatUseCase', async () => {
      chatUseCase.execute.mockResolvedValue('ok');

      const history = [
        { role: 'user' as const, content: 'First message' },
        { role: 'assistant' as const, content: 'First response' },
      ];

      await controller.chat(makeRequest() as Request, {
        message: 'Follow up',
        history,
      });

      expect(chatUseCase.execute).toHaveBeenCalledWith({
        message: 'Follow up',
        history,
      });
    });
  });
});
