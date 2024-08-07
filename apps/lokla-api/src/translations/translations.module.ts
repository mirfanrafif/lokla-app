import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectModel, ProjectSchema } from '../projects/Project.schema';
import { TranslationModel, TranslationSchema } from './Translation.schema';
import {
  TranslationChangeLogModel,
  TranslationChangeLogSchema,
} from './TranslationChangeLog';
import { TranslationsController } from './translations.controller';
import { TranslationsService } from './translations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TranslationModel.name,
        schema: TranslationSchema,
      },
      {
        name: ProjectModel.name,
        schema: ProjectSchema,
      },
      {
        name: TranslationChangeLogModel.name,
        schema: TranslationChangeLogSchema,
      },
    ]),
  ],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
