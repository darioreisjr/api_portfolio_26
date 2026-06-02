import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { IAuthResult } from './interfaces/auth-result.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login com email e senha do Supabase' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiBearerAuth()
  login(@Body() dto: LoginDto): Promise<IAuthResult> {
    return this.authService.login(dto);
  }
}
