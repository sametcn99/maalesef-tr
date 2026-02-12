import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty({ message: 'İş ilanı ID zorunludur.' })
  jobId!: string;

  @IsString()
  @IsNotEmpty({ message: 'İş başlığı zorunludur.' })
  jobTitle!: string;

  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (parsed && typeof parsed === 'object') {
          return parsed as Record<string, string>;
        }
        return {} satisfies Record<string, string>;
      } catch {
        return {} satisfies Record<string, string>;
      }
    }

    if (value && typeof value === 'object') {
      return value as Record<string, string>;
    }

    return {} satisfies Record<string, string>;
  })
  answers!: Record<string, string>;

  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  @IsOptional()
  aiConsent!: boolean;
}
