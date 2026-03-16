import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';

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

  @Column()
  stlKey: string;

  @Column('decimal')
  price: number;

  @Column({
    default: 'draft'
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ModelReview, (review) => review.model)
  reviews: ModelReview[];

}