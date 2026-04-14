import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModelDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsUUID()
  materialId: string;

  // --- NEW FIELDS ---

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsUUID()
  carModelId?: string;

  @IsOptional()
  @IsUUID()
  bodyId?: string;

  @IsOptional()
  @IsString()
  oemNumber?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCustomPart?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isTested?: boolean;
}