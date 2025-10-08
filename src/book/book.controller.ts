import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get('author/:author')
  findByAuthor(@Param('author') author: string) {
    return this.bookService.findByAuthor(author);
  }

  @Get('status/available')
  getAvailableBooks() {
    return this.bookService.getAvailableBooks();
  }

  @Get('status/sold')
  getSoldBooks() {
    return this.bookService.getSoldBooks();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.bookService.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book with id: ${id} not found`);
    }

    return book;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removed = await this.bookService.remove(id);

    if (!removed) {
      throw new NotFoundException(`Book with id: ${id} not found`);
    }

    return removed;
  }
}
