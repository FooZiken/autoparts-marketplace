import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Model } from '../../models/entities/model.entity';
import { Material } from '../../materials/entities/material.entity';
import { Printer } from '../../printers/entities/printer.entity';
import { Order } from '../../orders/entities/order.entity';
import { Executor } from '../../executors/entities/executor.entity';
@Entity()
export class PrintJob {
  @PrimaryGeneratedColumn()
  id: number;

  // Связь с моделью (STL)
  @ManyToOne(() => Model, { eager: true })
  model: Model;

  // Выбранный материал
  @ManyToOne(() => Material, { eager: true })
  material: Material;

  // Выбранный принтер
  @ManyToOne(() => Printer, { eager: true })
  printer: Printer;

  // Объем модели (из STL analyzer)
  @Column('float')
  volume: number;

  // Стоимость печати (без цены дизайна)
  @Column('float')
  manufacturingCost: number;

  // Сгенерированный G-code (путь в storage)
  @Column({ nullable: true })
  gcodePath: string;

  @ManyToOne(() => Order, (order) => order.printJobs, {
  onDelete: 'CASCADE',
})
order: Order;

@ManyToOne(() => Executor, { nullable: true, eager: true })
executor: Executor;

  // Статус производства
  @Column({
    default: 'pending',
  })
  status: 'pending' | 'slicing' | 'ready' | 'sent_to_executor' |'completed' | 'failed';

  @CreateDateColumn()
  createdAt: Date;
}