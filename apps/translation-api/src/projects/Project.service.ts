import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';

import { RequestCreateProject } from './Project.dto';
import { ProjectModel } from './Project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel.name) private projectModel: Model<ProjectModel>,
  ) {}

  getAllProjects() {
    return this.projectModel.find({});
  }

  addProject(request: RequestCreateProject) {
    return this.projectModel.create({
      name: request.name,
      identifier: request.identifier,
      apiKey: v4(),
      defaultLanguage: request.defaultLanguage,
      languages: request.languages,
    });
  }

  generateApiKey(projectId: string) {
    return this.projectModel.findOneAndUpdate(
      {
        identifier: projectId,
      },
      {
        apiKey: v4(),
      },
    );
  }

  updateProject(request: RequestCreateProject) {
    return this.projectModel.findOneAndUpdate(
      {
        identifier: request.identifier,
      },
      {
        name: request.name,
        languages: request.languages,
        defaultLanguage: request.defaultLanguage,
      },
    );
  }
}
