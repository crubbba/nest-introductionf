import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: { user: true },
    });
  }

  findOne(id: string): Promise<Book | null> {
    return this.bookRepository.findOneBy({ id });
  }

  findByAuthor(author: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: { author },
    });
  }

  async markAsSold(id: string): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found`);
    }

    if (book.isSold) {
      return book;
    }

    book.isSold = true;
    return this.bookRepository.save(book);
  }

  getAvailableBooks(): Promise<Book[]> {
    return this.bookRepository.find({
      where: { isSold: false },
    });
  }

  getSoldBooks(): Promise<Book[]> {
    return this.bookRepository.find({
      where: { isSold: true },
    });
  }

  async buyBook(userId: string, bookId: string): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with id: ${bookId} not found`);
    }

    if (book.isSold) {
      throw new NotFoundException('Book already sold');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }

    await this.markAsSold(bookId);

    book.user = user;
    book.isSold = true;
    return this.bookRepository.save(book);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.preload({
      id,
      ...updateBookDto,
    });

    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found`);
    }

    return this.bookRepository.save(book);
  }

  async remove(id: string): Promise<Book | undefined> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      return undefined;
    }

    return this.bookRepository.remove(book);
  }
}
