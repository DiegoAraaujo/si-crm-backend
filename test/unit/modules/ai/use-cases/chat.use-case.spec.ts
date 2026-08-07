import { ChatUseCase } from 'src/modules/ai/application/use-cases/chat.use-case';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

const makeHttpService = (): jest.Mocked<HttpService> =>
  ({ post: jest.fn() }) as any;

describe('ChatUseCase', () => {
  let useCase: ChatUseCase;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpService = makeHttpService();
    useCase = new ChatUseCase(httpService);
  });

  describe('when AI service responds successfully', () => {
    it('should return the response string from the AI service', async () => {
      httpService.post.mockReturnValue(
        of({ data: { response: 'Hello, how can I help you?' } } as any),
      );

      const result = await useCase.execute({
        message: 'Hello',
        history: [],
      });

      expect(result).toBe('Hello, how can I help you?');
    });

    it('should call the AI service with the correct message and history', async () => {
      httpService.post.mockReturnValue(of({ data: { response: 'ok' } } as any));

      const history = [{ role: 'user', content: 'Previous message' }];

      await useCase.execute({ message: 'New message', history });

      expect(httpService.post).toHaveBeenCalledWith(expect.any(String), {
        message: 'New message',
        history,
      });
    });

    it('should pass empty history when no history is provided', async () => {
      httpService.post.mockReturnValue(of({ data: { response: 'ok' } } as any));

      await useCase.execute({ message: 'Hello', history: [] });

      expect(httpService.post).toHaveBeenCalledWith(expect.any(String), {
        message: 'Hello',
        history: [],
      });
    });
  });
});
