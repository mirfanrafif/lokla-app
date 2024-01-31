import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class OrganizationsModel {
  @Prop({
    required: true,
    type: String
  })
  name: string;

  @Prop({
    type: String
  })
  description: string;

  @Prop({
    required: true,
    type: String
  })
  identifier: string;

  @Prop({
    required: true,
    type: [String]
  })
  users: string[];

  @Prop({
    required: true,
    type: [String]
  })
  projects: string[];

  @Prop({
    required: true,
    type: [String]
  })
  languages: string[];
}

export const OrganizationsSchema = SchemaFactory.createForClass(OrganizationsModel);