import { IsString } from 'class-validator';

export class PaginationType {
  @IsString()
  page: number;

  @IsString()
  limit: number;
}
