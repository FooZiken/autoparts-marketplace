import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Executor } from '../../executors/entities/executor.entity';

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

  // 🔥 связь с исполнителем
  @ManyToOne(() => Executor, (executor) => executor.printers, {
    nullable: true,
    eager: true,
  })
  executor: Executor;
}