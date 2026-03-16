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

  @IsNumber()
  price: number;

  @IsString()
  stlKey: string;

}