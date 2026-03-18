import { IsString, IsArray } from 'class-validator';

export class CreateOrderDto {

  @IsArray()
  modelIds: string[];

  @IsString()
  deliveryAddress: string;
}