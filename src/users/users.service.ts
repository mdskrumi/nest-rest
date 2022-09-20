import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(body: CreateUserDto) {
    const user = this.repo.create(body);
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id: id } });
    if (!user || !id) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  find(email: string) {
    return this.repo.find({ where: { email: email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}
