import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import {
  getPasswordMaxBytesMessage,
  MaxPasswordUtf8Bytes,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from './password-policy.js';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'İsim alanı zorunludur.' })
  name!: string;

  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @IsNotEmpty({ message: 'E-posta alanı zorunludur.' })
  email!: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: 'Şifre en az 8 karakter olmalıdır.',
  })
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_VALIDATION_MESSAGE,
  })
  @MaxPasswordUtf8Bytes({
    message: getPasswordMaxBytesMessage(),
  })
  @IsNotEmpty({ message: 'Şifre alanı zorunludur.' })
  password!: string;
}
