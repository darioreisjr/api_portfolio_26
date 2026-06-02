import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LoginDto } from './dto/login.dto';
import { IAuthResult } from './interfaces/auth-result.interface';

@Injectable()
export class AuthService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>('supabase.url')!;
    const key = this.config.get<string>('supabase.serviceRoleKey')!;
    this.supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async login(dto: LoginDto): Promise<IAuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      accessToken: data.session.access_token,
      tokenType: 'Bearer',
      expiresIn: data.session.expires_in,
    };
  }
}
