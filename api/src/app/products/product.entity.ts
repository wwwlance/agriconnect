import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne 
} from 'typeorm';

import { Farmer } from '../farmers/farmer.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @Column()
  imageUrl?: string;

  @ManyToOne(() => Farmer, (farmer) => farmer.id, { onDelete: 'CASCADE' })
  farmer!: Farmer;
}