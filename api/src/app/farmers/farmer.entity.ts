import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column
} from 'typeorm';


@Entity('farmers')
export class Farmer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;
}