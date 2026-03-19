import { IsString, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModelDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Number) // 🔥 ВАЖНО
  @IsNumber()
  price: number;

  @IsUUID()
  materialId: string;
}