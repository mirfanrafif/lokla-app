import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TranslationChangeLogModel {
  @Prop({
    required: true,
  })
  eventType: string;

  @Prop({
    required: true,
  })
  before: string;

  @Prop({
    required: true,
  })
  after: string;

  @Prop({
    required: true,
  })
  locale: string;

  @Prop({
    required: true,
  })
  date: Date;
}

export const TranslationChangeLogSchema = SchemaFactory.createForClass(
  TranslationChangeLogModel,
);
