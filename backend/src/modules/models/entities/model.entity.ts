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

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ModelVersion, (version) => version.model)
  versions: ModelVersion[];

  @OneToMany(() => ModelReview, (review) => review.model)
  reviews: ModelReview[];
}