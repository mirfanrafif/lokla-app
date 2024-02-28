import { IsNotEmpty, IsString } from 'class-validator';

export class RequestCreateProject {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString({ each: true })
  languages: string[];

  @IsString()
  @IsNotEmpty()
  defaultLanguage: string;
}

export class RequestGenerateApiKey {
  @IsString()
  projectId: string;
}
