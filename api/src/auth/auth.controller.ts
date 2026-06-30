import { Controller, Get, UseGuards, Request, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Request() req: any, @Res() res: Response) {
    const { accessToken, user } = this.authService.generateToken(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const params = new URLSearchParams({
      token: accessToken,
      user: JSON.stringify(user),
    });
    return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // Initiates GitHub OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Request() req: any, @Res() res: Response) {
    const { accessToken, user } = this.authService.generateToken(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const params = new URLSearchParams({
      token: accessToken,
      user: JSON.stringify(user),
    });
    return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  }
}
