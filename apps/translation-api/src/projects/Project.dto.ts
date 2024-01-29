import { IsString } from 'class-validator';

export type RequestCreateProject = {
  name: string;
  identifier: string;
};

export class RequestGenerateApiKey {
  @IsString()
  projectId: string;
}
