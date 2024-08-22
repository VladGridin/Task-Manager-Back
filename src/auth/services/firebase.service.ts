import { Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { UserService } from 'src/user/user.service';
import { FirebaseIdDto } from '../dto/firebaseId.dto';
import { AuthService } from './auth.service';

@Injectable()
export class FirebaseService {
  constructor(
    private userService: UserService,
    private readonly AuthService: AuthService,
  ) {}

  async authByGoogle(dto: FirebaseIdDto) {
    const getGoogleUser = await auth().verifyIdToken(dto.UserId).then();
    if (!getGoogleUser) throw new UnauthorizedException('Invalid user Id');
    const OldUser = await this.userService.getByEmail(getGoogleUser.email);
    if (!OldUser) {
      const { password, ...user } = await this.userService.create({
        email: getGoogleUser.email,
        password: getGoogleUser.uid,
        name: getGoogleUser.name,
      });
      const tokens = this.AuthService.issueTokens(user.id);
      return { user, ...tokens };
    }
    const { password, ...user } = OldUser;
    const tokens = this.AuthService.issueTokens(user.id);

    return { user, ...tokens };
  }
}
