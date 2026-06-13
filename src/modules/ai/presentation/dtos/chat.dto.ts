import { IsString, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {
  @IsIn(['user', 'assistant'])
  role!: 'user' | 'assistant';

  @IsString()
  content!: string;
}

export class ChatDto {
  @IsString()
  message!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  history!: MessageDto[];
}
