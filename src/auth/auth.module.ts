import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { FirebaseProvider } from './firebase.provider';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [FirebaseProvider, AuthService, FirebaseService, JwtStrategy],
})
export class AuthModule {}
