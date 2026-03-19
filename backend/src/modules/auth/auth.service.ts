import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ✅ правильная валидация
  async validateUser(email: string, password: string) {
    // 🔥 ищем напрямую (сделай метод в users.service если нет)
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // ✅ логин
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user, // 🔥 ВАЖНО!
    };
  }

  // ✅ регистрация
  async register(data: any) {
  const { email, password, roles } = data;

  // ❌ УБИРАЕМ bcrypt здесь

  const user = await this.usersService.create({
    email,
    password, // передаём сырой пароль
    roles,
  });

  return user;
}
}
