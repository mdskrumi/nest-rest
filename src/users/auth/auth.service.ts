import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email is used.');
    }

    // Hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    // Create new user
    const newUser = await this.userService.create({
      email,
      password: hashedPassword,
    });

    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('email is not found.');
    }

    const [userSalt, userHash] = user.password.split('.');

    const hash = (await scrypt(password, userSalt, 32)) as Buffer;
    if (userHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong Password');
    }
    return user;
  }
}
