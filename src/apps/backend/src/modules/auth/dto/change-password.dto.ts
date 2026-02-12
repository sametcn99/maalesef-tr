import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mevcut şifre gereklidir.' })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'Yeni şifre en az 8 karakter olmalıdır.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Yeni şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.',
  })
  @IsNotEmpty({ message: 'Yeni şifre gereklidir.' })
  newPassword!: string;
}
