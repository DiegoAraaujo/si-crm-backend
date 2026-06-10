import { IsString, MinLength } from 'class-validator';

export class UpdateMeDto {
  @IsString()
  @MinLength(2)
  name!: string;
}
