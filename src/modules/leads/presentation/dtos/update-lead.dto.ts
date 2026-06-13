import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LeadOrigin, LeadType, PropertyType } from '@prisma/client';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(LeadType)
  type?: LeadType;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @IsOptional()
  @IsEnum(LeadOrigin)
  origin?: LeadOrigin;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  statusId?: string;
}
