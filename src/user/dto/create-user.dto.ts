import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long, include one uppercase letter and one number',
  })
  password: string;
}
