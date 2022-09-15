import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    console.log('handler is called');
    return this.userService.findOne(+id);
  }

  @Get('')
  findUsersByEmail(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete(':id')
  DeleteUserById(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch('update/:id')
  updateUser(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    return this.userService.update(+id, body);
  }
}
