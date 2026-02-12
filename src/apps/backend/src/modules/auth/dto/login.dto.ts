import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @IsNotEmpty({ message: 'E-posta alanı zorunludur.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Şifre alanı zorunludur.' })
  password!: string;
}
