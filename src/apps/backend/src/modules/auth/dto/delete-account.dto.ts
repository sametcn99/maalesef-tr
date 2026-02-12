import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'Hesabınızı silmek için şifrenizi girmelisiniz.' })
  password!: string;
}
