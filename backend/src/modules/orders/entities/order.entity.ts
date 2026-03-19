import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { PrintJob } from '../../print-jobs/entities/print-job.entity';

@Entity('orders')
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerId: string;

  // ❌ убрали printerId

  @Column('decimal')
  totalPrice: number;

  @Column()
  status: string; // pending, processing, completed, cancelled

  @Column('text')
  deliveryAddress: string;

  // ✅ связь с PrintJob
  @OneToMany(() => PrintJob, (printJob) => printJob.order, {
    cascade: true,
  })
  printJobs: PrintJob[];

  @CreateDateColumn()
  createdAt: Date;
}