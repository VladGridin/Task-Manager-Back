import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDto, RegisterDto } from './dto/auth.dto';
import { FirebaseIdDto } from './dto/firebaseId.dto';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly FirebaseService: FirebaseService,
  ) {}
  // login

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokensToResponse(res, refreshToken);

    return response;
  }

  // registration

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokensToResponse(res, refreshToken);

    return response;
  }
  // Auth by google
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('auth-by-google')
  async authByGoogle(
    @Body() dto: FirebaseIdDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.FirebaseService.authByGoogle(dto);
    this.authService.addRefreshTokensToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokensToResponse(res);
      throw new UnauthorizedException('Refresh token not passed');
    }
    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );
    this.authService.addRefreshTokensToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokensToResponse(res);
    return true;
  }
}
