import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultUser();
  }

  private async seedDefaultUser(): Promise<void> {
    const email = 'leobusta@example.com';
    const password = 'Hola123456';

    const existing = await this.userService.findByEmail(email);
    if (existing) {
      return;
    }

    await this.userService.create({
      name: 'Leonardo Bustamante',
      email,
      password,
    });
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { sub: user.id, email: user.email };

    return {
      token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
