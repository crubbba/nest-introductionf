import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [
    TypeOrmModule.forFeature([
      Book, User
    ]),
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => AuthModule)
  ],
  exports: [BookService],
})
export class BookModule {}
