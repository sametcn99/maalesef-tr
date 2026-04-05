import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const JOB_INTERACTION_FILTER_VALUES = ['all', 'only', 'hide'] as const;
export type JobInteractionFilterValue =
  (typeof JOB_INTERACTION_FILTER_VALUES)[number];

export const JOB_SORT_VALUES = [
  'newest',
  'oldest',
  'most_applied',
  'title_asc',
  'title_desc',
  'company_asc',
  'company_desc',
] as const;
export type JobSortValue = (typeof JOB_SORT_VALUES)[number];

function trimToUndefined({ value }: { value: unknown }) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export class GetJobsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  @IsOptional()
  limit: number = 12;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  search?: string;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  company?: string;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  location?: string;

  @IsIn(JOB_SORT_VALUES)
  @IsOptional()
  sort: JobSortValue = 'newest';

  @IsIn(JOB_INTERACTION_FILTER_VALUES)
  @IsOptional()
  applied: JobInteractionFilterValue = 'all';

  @IsIn(JOB_INTERACTION_FILTER_VALUES)
  @IsOptional()
  viewed: JobInteractionFilterValue = 'all';
}
