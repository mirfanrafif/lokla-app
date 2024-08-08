import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';

import { TranslationModel } from '../translations/Translation.schema';
import { RequestCreateProject } from './Project.dto';
import { ProjectModel } from './Project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel.name) private projectModel: Model<ProjectModel>,
    @InjectModel(TranslationModel.name)
    private translationModel: Model<TranslationModel>
  ) {}

  async getAllProjects() {
    const projectList = await this.projectModel.find({});

    const statisticsPerProject = await this.translationModel.aggregate([
      {
        $unwind: '$translations', // Unwind the translations array
      },
      {
        $group: {
          _id: { project: '$project', locale: '$translations.locale' }, // Group by project and locale
          count: { $sum: 1 }, // Count the number of documents in each group
        },
      },
      {
        $group: {
          _id: '$_id.project', // Group by project
          translations: {
            $push: {
              locale: '$_id.locale',
              count: '$count',
            },
          },
        },
      },
    ]);

    const result = projectList.map((project) => ({
      ...project.toJSON(),
      statistics:
        statisticsPerProject.find((stat) => stat._id === project.identifier)
          ?.translations ?? [],
    }));

    return result;
  }

  async getProjectByIdentifier(identifier: string) {
    const project = await this.projectModel.findOne({ identifier });

    if (!project) {
      return null;
    }

    const statistics = await this.translationModel.aggregate([
      {
        $match: {
          project: project.identifier,
        },
      },
      {
        $unwind: '$translations',
      },
      {
        $group: {
          _id: '$translations.locale',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      ...project.toJSON(),
      statistics,
    };
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
      }
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
      }
    );
  }
}
