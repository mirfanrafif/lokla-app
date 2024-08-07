import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TranslationModel,
  TranslationSchema,
} from '../translations/Translation.schema';
import { ProjectController } from './Project.controller';
import { ProjectModel, ProjectSchema } from './Project.schema';
import { ProjectService } from './Project.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProjectModel.name,
        schema: ProjectSchema,
      },
      {
        name: TranslationModel.name,
        schema: TranslationSchema,
      },
    ]),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [
    MongooseModule.forFeature([
      {
        name: ProjectModel.name,
        schema: ProjectSchema,
      },
    ]),
  ],
})
export class ProjectModule {}
