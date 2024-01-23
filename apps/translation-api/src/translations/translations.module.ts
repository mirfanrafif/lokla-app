import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectModel, ProjectSchema } from '../projects/Project.schema';
import { TranslationModel, TranslationSchema } from './Translation.schema';
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
    ]),
  ],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
