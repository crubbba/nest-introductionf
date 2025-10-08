import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Book, (book) => book.user, { cascade: false })
  books?: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) {
      return;
    }

    const alreadyHashed = this.password.startsWith('$2b$');
    if (alreadyHashed) {
      return;
    }

    this.password = await bcrypt.hash(this.password, 10);
  }
}
