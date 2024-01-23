import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { languages } from 'constants/languages';
import { Model } from 'mongoose';
import { flatten, unflatten } from 'safe-flat';

import { ProjectModel } from '../projects/Project.schema';
import {
  RequestDeleteTranslation,
  RequestExportTranslation,
  RequestGetTranslationList,
  RequestImportTranslationFromCi,
  RequestImportTranslationFromJson,
  RequestUpdateTranslation,
} from './Translation.dto';
import { TranslationModel } from './Translation.schema';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectModel(TranslationModel.name)
    private translationModel: Model<TranslationModel>,
    @InjectModel(ProjectModel.name)
    private projectModel: Model<ProjectModel>,
  ) {}

  async getTranslationList(query: RequestGetTranslationList) {
    let filters = {};

    if (query.ns !== '' && query.ns !== undefined) {
      filters = {
        ...filters,
        namespace: query.ns,
      };
    }

    if (query.project !== '' && query.project !== undefined) {
      filters = {
        ...filters,
        project: query.project,
      };
    }

    if (query.search !== '' && query.search !== undefined) {
      filters = {
        ...filters,
        $text: {
          $search: query.search,
        },
      };
    }

    if (query.filter === 'not_translated') {
      filters = {
        ...filters,
        translated: false,
      };
    }

    const result = await this.translationModel.find(
      {
        ...filters,
      },
      undefined,
      {
        skip: query.page * query.limit,
        limit: query.limit,
      },
    );

    const pagination = await this.getPagination(filters, query.limit);

    return {
      data: result,
      meta: pagination,
    };
  }

  private async getPagination(filters: unknown, limit: number) {
    const totalData = await this.translationModel.countDocuments(filters);

    const totalPage = Math.ceil(totalData / limit);

    return {
      total_data: totalData,
      total_page: totalPage,
    };
  }

  async importTranslationFromJson(
    file: Express.Multer.File,
    body: RequestImportTranslationFromJson,
  ) {
    const fileString = Buffer.from(file.buffer).toString('utf-8');

    const fileJson = JSON.parse(fileString);

    await this.processJson(fileJson, body);

    return {
      success: true,
    };
  }

  async importTranslationFromJsonCi(
    query: RequestImportTranslationFromJson,
    body: RequestImportTranslationFromCi,
  ) {
    const fileJson = body.data;

    await this.processJson(fileJson, query);

    return {
      success: true,
    };
  }

  async processJson(json: object, body: RequestImportTranslationFromJson) {
    const flatJson = flatten(json);

    const isProjectValid = await this.projectModel.findOne({
      identifier: body.project,
    });

    if (!isProjectValid) {
      throw new Error('Project not found');
    }

    const keys = Object.keys(flatJson);

    const existingKeys = await this.translationModel.find({
      key: {
        $in: keys,
      },
      namespace: body.namespace,
      project: body.project,
    });

    // update existing
    for (const item of existingKeys) {
      const existingLocale = item.translations.find(
        (item) => item.locale === body.locale,
      );

      const isUpdated = existingLocale
        ? flatJson[item.key] !== existingLocale.value
        : false;

      const newTranslation = [
        ...item.translations.filter((item) => item.locale !== body.locale),
        {
          locale: body.locale,
          value: flatJson[item.key],
        },
      ];

      const isCompleted = newTranslation.length === languages.length;

      await this.translationModel.findOneAndUpdate(
        {
          key: item.key,
          namespace: body.namespace,
          project: body.project,
        },
        {
          translations: newTranslation,
          translated: isCompleted && !isUpdated,
        },
      );
    }

    // new keys

    const newKeys = keys.filter(
      (item) => !existingKeys.find((existingItem) => existingItem.key === item),
    );

    const requests: TranslationModel[] = newKeys.map((item) => ({
      key: item,
      project: body.project,
      namespace: body.namespace,
      translations: [
        {
          locale: body.locale,
          value: flatJson[item],
        },
      ],
      translated: false,
    }));

    await this.translationModel.insertMany(requests);

    return true;
  }

  async updateTranslation(request: RequestUpdateTranslation) {
    const response = await this.translationModel.findOneAndUpdate(
      {
        key: request.oldKey,
        namespace: request.namespace,
        project: request.project,
      },
      {
        translations: request.translations,
      },
    );

    return {
      success: true,
      data: response,
    };
  }

  async deleteTranslation(request: RequestDeleteTranslation) {
    return await this.translationModel.deleteMany({
      key: request.key,
    });
  }

  async getNamespaces(project: string | undefined) {
    let filters = {};

    if (project) {
      filters = {
        ...filters,
        project,
      };
    }

    const response = await this.translationModel
      .find(filters)
      .distinct('namespace');

    return response;
  }

  async exportTranslation(request: RequestExportTranslation) {
    const translationData = await this.translationModel.find({
      project: request.project,
      namespace: request.namespace,
    });
    const outputObject: {
      [key: string]: string;
    } = {};
    for (const translationItem of translationData) {
      const translationValue = translationItem.translations.find(
        (item) => item.locale === request.locale,
      );

      if (!translationValue) {
        continue;
      }

      outputObject[translationItem.key] = translationValue.value;
    }

    const result = JSON.stringify(unflatten(outputObject), null, 2);

    return `${result}`;
  }
}
