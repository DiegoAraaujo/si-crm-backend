import { IsString, IsNumber, IsHexColor, Min } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  name!: string;

  @IsHexColor()
  color!: string;

  @IsNumber()
  @Min(0)
  order!: number;
}
