import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthDto, RegisterDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKENS = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}
  // Login
  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }

  issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
  // validate user
  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    const isValidate = await verify(user.password, dto.password);
    if (!isValidate) throw new NotFoundException('Invalid login or password');
    return user;
  }

  async register(dto: RegisterDto) {
    const oldUser = await this.userService.getByEmail(dto.email);

    if (oldUser) throw new NotFoundException('Invalid login or password');

    const { password, ...user } = await this.userService.create(dto);

    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }

  addRefreshTokensToResponse(res: Response, refreshToken: string) {
    {
      const expiresIn = new Date();
      expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKENS);

      res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        domain: 'localhost',
        expires: expiresIn,
        secure: true,
        // product change to lax
        sameSite: 'none',
      });
    }
  }
  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');
    const { password, ...user } = await this.userService.getById(result.id);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  removeRefreshTokensToResponse(res: Response) {
    {
      res.cookie(this.REFRESH_TOKEN_NAME, '', {
        httpOnly: true,
        domain: 'localhost',
        expires: new Date(0),
        secure: true,
        // product change to lax
        sameSite: 'none',
      });
    }
  }
}
