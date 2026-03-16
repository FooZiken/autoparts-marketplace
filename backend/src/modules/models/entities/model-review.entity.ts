import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Model } from './model.entity';

@Entity('model_reviews')
export class ModelReview {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modelId: string;

  @Column()
  adminId: string;

  @Column()
  status: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Model, (model) => model.reviews)
  @JoinColumn({ name: 'modelId' })
  model: Model;

}