import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

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

}