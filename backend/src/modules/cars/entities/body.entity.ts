import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bodies')
export class Body {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // например: E70

  @Column()
  productionStart: number;

  @Column()
  productionEnd: number;

  @Column()
  carModelId: string;
}