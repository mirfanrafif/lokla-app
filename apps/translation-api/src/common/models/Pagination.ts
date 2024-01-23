import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class PaginationType {
  @IsString()
  @Transform((value) => Number(value))
  page: number;

  @IsString()
  @Transform((value) => Number(value))
  limit: number;
}
