import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  Matches,
} from 'class-validator';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from './password-policy.js';

export class ResetPasswordDto {
  @IsUUID('4', { message: 'Geçerli bir sıfırlama bağlantısı gereklidir.' })
  token!: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: 'Yeni şifre en az 8 karakter olmalıdır.',
  })
  @Matches(PASSWORD_REGEX, {
    message: `Yeni ${PASSWORD_VALIDATION_MESSAGE.toLowerCase()}`,
  })
  @IsNotEmpty({ message: 'Yeni şifre gereklidir.' })
  newPassword!: string;
}
