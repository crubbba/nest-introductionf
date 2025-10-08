import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'real', default: 0 })
  price: number;

  @Column({ default: false })
  isSold: boolean;

  @ManyToOne(() => User, (user) => user.books, { nullable: true, onDelete: 'SET NULL' })
  user?: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
