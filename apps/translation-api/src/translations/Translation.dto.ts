import { Type } from 'class-transformer';
import { PaginationType } from '../common/models/Pagination';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class TranslationValue {
  @IsString()
  @IsNotEmpty()
  locale: string;

  @IsString()
  value: string;
}

export class RequestUpdateTranslation {
  @IsString()
  @IsNotEmpty()
  oldKey: string;

  @IsString()
  @IsNotEmpty()
  newKey: string;

  @IsString()
  @IsNotEmpty()
  namespace: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsArray()
  @Type(() => TranslationValue)
  translations: TranslationValue[];
}

export class RequestImportTranslationFromJson {
  @IsString()
  @IsNotEmpty()
  namespace: string;

  @IsString()
  @IsNotEmpty()
  locale: string;

  @IsString()
  @IsNotEmpty()
  project: string;
}

export class RequestImportTranslationFromCi {
  data: object;
}

export class RequestGetTranslationList extends PaginationType {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  filter?: string;

  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  ns?: string;
}

export class RequestDeleteTranslation {
  @IsString()
  @IsNotEmpty()
  key: string;
}

export class RequestExportTranslation {
  @IsString()
  @IsNotEmpty()
  namespace: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsString()
  @IsNotEmpty()
  locale: string;
}
