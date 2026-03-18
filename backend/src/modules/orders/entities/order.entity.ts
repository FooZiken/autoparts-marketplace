import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerId: string;

  @Column()
  printerId: string;

  @Column('decimal')
  totalPrice: number;

  @Column()
  status: string; // pending, printing, shipped, completed

  @Column('text')
  deliveryAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}