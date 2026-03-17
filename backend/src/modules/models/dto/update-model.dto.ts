import {
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class UpdateModelDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  stlKey?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  materialId?: string;
}