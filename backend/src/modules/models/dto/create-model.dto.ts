import {
  IsString,
  IsNumber,
  IsNotEmpty
} from 'class-validator';

export class CreateModelDto {

  @IsString()
  @IsNotEmpty()
  name: string;

 @IsString()
  description: string;

  @IsString()
  stlKey: string;

  @IsNumber()
  price: number;

  @IsString()
  material: string;
}