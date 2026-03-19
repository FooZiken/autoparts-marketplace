import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Printer } from '../../printers/entities/printer.entity';

@Entity()
export class Executor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string; // город или регион

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Printer, (printer) => printer.executor)
  printers: Printer[];
}