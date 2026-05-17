import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Distributor } from '../distributors/distributor.entity';
import { Farmer } from '../farmers/farmer.entity';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Distributor)
  distributor!: Distributor;

  @ManyToOne(() => Farmer)
  farmer!: Farmer;

  @Column()
  message!: string;

  @Column({
    default: 'PENDING',
  })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}