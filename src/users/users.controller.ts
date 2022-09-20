import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  async signout(@Session() session: any) {
    session.userId = null;
    return 'Signed out';
  }

  // @Get('whoami')
  // findUserBySessionId(@Session() session) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get('whoami')
  @UseGuards(AuthGuard)
  findUserBySessionId(@CurrentUser() user) {
    console.log(user);
    return user;
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
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
