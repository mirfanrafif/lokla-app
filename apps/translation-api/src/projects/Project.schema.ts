import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class ProjectModel {
  @Prop({
    required: true,
    unique: true,
  })
  identifier: string;

  @Prop({
    required: true,
  })
  name: string;
}

export type ProjectDocument = HydratedDocument<ProjectModel>;

export const ProjectSchema = SchemaFactory.createForClass(ProjectModel);
