import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyEmailDto {
  @IsUUID('4', { message: 'Geçerli bir doğrulama tokenı gereklidir.' })
  @IsNotEmpty({ message: 'Doğrulama tokenı zorunludur.' })
  token!: string;
}
