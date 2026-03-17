import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Model } from './model.entity';

@Entity('model_versions')
export class ModelVersion {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Model, (model) => model.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'modelId' })
  model: Model;

  @Column()
  modelId: string;

  @Column()
  version: number;

  @Column()
  stlKey: string;

  @Column()
  materialId: string;

  @Column('decimal', { default: 0 })
  price: number;

  @Column({ type: 'float', nullable: true })
  width: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  depth: number;

  @Column({ type: 'float', nullable: true })
  volume: number;

  @CreateDateColumn()
  createdAt: Date;
}