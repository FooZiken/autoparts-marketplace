import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('printers')
export class Printer {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // размеры печати
  @Column('float')
  maxWidth: number;

  @Column('float')
  maxHeight: number;

  @Column('float')
  maxDepth: number;

  // координаты (упрощённо)
  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;
}