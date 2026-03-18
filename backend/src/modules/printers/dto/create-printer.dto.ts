import { IsString, IsNumber } from 'class-validator';

export class CreatePrinterDto {

  @IsString()
  name: string;

  @IsNumber()
  maxWidth: number;

  @IsNumber()
  maxHeight: number;

  @IsNumber()
  maxDepth: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}