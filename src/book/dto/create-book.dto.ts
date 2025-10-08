import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  isSold?: boolean;
}
