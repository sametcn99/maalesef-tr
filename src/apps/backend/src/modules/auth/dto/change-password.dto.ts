import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import {
  getPasswordMaxBytesMessage,
  MaxPasswordUtf8Bytes,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from './password-policy.js';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mevcut şifre gereklidir.' })
  currentPassword!: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: 'Yeni şifre en az 8 karakter olmalıdır.',
  })
  @Matches(PASSWORD_REGEX, {
    message: `Yeni ${PASSWORD_VALIDATION_MESSAGE.toLowerCase()}`,
  })
  @MaxPasswordUtf8Bytes({
    message: getPasswordMaxBytesMessage('Yeni şifre'),
  })
  @IsNotEmpty({ message: 'Yeni şifre gereklidir.' })
  newPassword!: string;
}
