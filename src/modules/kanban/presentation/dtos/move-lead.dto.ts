import { IsString } from 'class-validator';

export class MoveLeadDto {
  @IsString()
  statusId!: string;
}
