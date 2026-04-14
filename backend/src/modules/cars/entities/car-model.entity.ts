import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('car_models')
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  brandId: string;
}