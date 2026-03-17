import { IsString, IsNumber } from 'class-validator';

export class CreateMaterialDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  priceMultiplier: number;
}