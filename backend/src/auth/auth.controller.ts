import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
