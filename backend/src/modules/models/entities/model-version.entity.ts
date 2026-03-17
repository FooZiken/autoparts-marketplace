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

  @Column()
  modelId: string;

  @ManyToOne(() => Model, (model) => model.versions)
  @JoinColumn({ name: 'modelId' })
  model: Model;

  @Column()
  version: number;

  @Column()
  stlKey: string;

  // Геометрия (пока можно null)
  @Column({ type: 'float', nullable: true })
  width: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  depth: number;

  @Column({ type: 'float', nullable: true })
  volume: number;

  // бизнес
  @Column('decimal', { default: 0 })
  price: number;

  @Column({ nullable: true })
  material: string;

  @CreateDateColumn()
  createdAt: Date;
}