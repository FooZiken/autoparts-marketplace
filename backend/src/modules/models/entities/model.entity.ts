import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { ModelVersion } from './model-version.entity';
import { ModelReview } from './model-review.entity';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  designerId: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ nullable: true })
  brandId: string;

  @Column({ nullable: true })
  carModelId: string;

  @Column({ nullable: true })
  bodyId: string;

  @Column({ nullable: true })
  oemNumber: string;

  @Column({ default: false })
  isCustomPart: boolean;

  @Column({ default: false })
  isTested: boolean;

// images (массив ключей MinIO)
  @Column('simple-array', { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ModelVersion, (version) => version.model)
  versions: ModelVersion[];

  @OneToMany(() => ModelReview, (review) => review.model)
  reviews: ModelReview[];
}