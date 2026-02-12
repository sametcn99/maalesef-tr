import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsIn,
  IsBoolean,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobQuestionDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsIn(['text', 'textarea', 'select'])
  type!: 'text' | 'textarea' | 'select';

  @IsString()
  @IsOptional()
  placeholder?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsBoolean()
  required!: boolean;
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'İlan başlığı zorunludur.' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Şirket adı zorunludur.' })
  company!: string;

  @IsString()
  @IsNotEmpty({ message: 'Konum bilgisi zorunludur.' })
  location!: string;

  @IsString()
  @IsNotEmpty({ message: 'Kısa açıklama zorunludur.' })
  shortDescription!: string;

  @IsString()
  @IsNotEmpty({ message: 'Detaylı açıklama zorunludur.' })
  fullDescription!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'En az bir gereksinim belirtilmelidir.' })
  requirements!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobQuestionDto)
  questions!: CreateJobQuestionDto[];
}
