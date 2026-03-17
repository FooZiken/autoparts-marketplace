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

  // теперь относится к версии
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  stlKey?: string;

  @IsOptional()
  @IsString()
  material?: string;

}