import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LeadOrigin, LeadType, PropertyType } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(LeadType)
  type!: LeadType;

  @IsEnum(PropertyType)
  propertyType!: PropertyType;

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

  @IsEnum(LeadOrigin)
  origin!: LeadOrigin;

  @IsOptional()
  @IsString()
  notes?: string;
}
