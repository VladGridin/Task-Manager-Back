import { IsString } from 'class-validator';

export class FirebaseIdDto {
  @IsString()
  UserId: string;
}
