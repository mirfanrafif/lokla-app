import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TranslationDocument = HydratedDocument<TranslationModel>;

export type TranslationData = {
  locale: string;
  value: string;
};

@Schema()
export class TranslationModel {
  @Prop({
    required: true,
  })
  namespace: string;

  @Prop({
    required: true,
  })
  key: string;

  @Prop({
    type: [
      {
        locale: {
          type: String,
        },
        value: {
          type: String,
          index: 'text',
        },
      },
    ],
  })
  translations: TranslationData[];

  @Prop()
  project: string;

  @Prop()
  translated: boolean;
}

export const TranslationSchema = SchemaFactory.createForClass(TranslationModel);
