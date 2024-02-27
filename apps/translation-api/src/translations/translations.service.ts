import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TranslationChangeLogEvent } from 'enums/TranslationChangeLogEvent';
import { Model } from 'mongoose';
import { flatten, unflatten } from 'safe-flat';

import { languages } from 'constants/languages';

import { ProjectModel } from '../projects/Project.schema';
import {
  RequestDeleteTranslation,
  RequestExportTranslation,
  RequestGetTranslationList,
  RequestImportTranslationFromCi,
  RequestImportTranslationFromJson,
  RequestUpdateTranslation,
} from './Translation.dto';
import { TranslationData, TranslationModel } from './Translation.schema';

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

    if (query.filter === 'unused') {
      filters = {
        ...filters,
        unused: true,
      };
    }

    if (query.filter === 'duplicated') {
      // check if some of the translation value is same with other locale

      const allTranslations = await this.translationModel.find(filters);

      const duplicatedKeys = allTranslations.filter((item) => {
        const values = item.translations.map((item) => item.value);

        return new Set(values).size !== values.length;
      });

      return {
        data: duplicatedKeys,
        meta: {
          total_data: duplicatedKeys.length,
          total_page: 1,
        },
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

  private async processJson(
    json: object,
    body: RequestImportTranslationFromJson,
  ) {
    const flatJson = flatten(json);

    const isProjectValid = await this.projectModel.findOne({
      identifier: body.project,
    });

    if (!isProjectValid) {
      throw new Error('Project not found');
    }

    const keys = Object.keys(flatJson);

    const data = await this.translationModel.find({
      namespace: body.namespace,
      project: body.project,
    });

    const existingKeys = data.filter((item) => keys.includes(item.key));

    // update existing
    for (const item of existingKeys) {
      try {
        const existingLocale: TranslationData = item.translations.find(
          (item) => item.locale === body.locale,
        );

        const isSame =
          existingLocale !== undefined &&
          existingLocale.value === flatJson[item.key];

        if (isSame) {
          continue;
        }

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
            translated: isCompleted && !isSame,
            unused: false,
            changeLogs: [
              ...item.changeLogs,
              {
                eventType:
                  existingLocale !== undefined
                    ? TranslationChangeLogEvent.UPDATE
                    : TranslationChangeLogEvent.CREATE,
                before: existingLocale?.value ?? '',
                after: flatJson[item.key],
                locale: body.locale,
                date: new Date(),
              },
            ],
          },
        );
      } catch (error) {
        throw new InternalServerErrorException(
          `Error when updating translation on locale ${body.locale} for namespace ${body.namespace}`,
        );
      }
    }

    const deletedKeys = data.filter((item) => !keys.includes(item.key));

    //TODO: change after adding default locale on company settings
    if (body.locale === 'en') {
      await this.translationModel.updateMany(
        {
          key: {
            $in: deletedKeys.map((item) => item.key),
          },
        },
        {
          unused: true,
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
      unused: false,
      changeLogs: [
        {
          eventType: TranslationChangeLogEvent.CREATE,
          before: '',
          after: flatJson[item],
          locale: body.locale,
          date: new Date(),
        },
      ],
    }));

    await this.translationModel.insertMany(requests);

    return true;
  }

  async updateTranslation(request: RequestUpdateTranslation) {
    const existingTranslation = await this.translationModel.findOne({
      key: request.oldKey,
      namespace: request.namespace,
      project: request.project,
    });

    if (!existingTranslation) {
      throw new Error('Translation not found');
    }

    const changeLog = request.translations
      .filter(
        (item) =>
          !existingTranslation.translations.find(
            (existingItem) => existingItem.locale === item.locale,
          ) ||
          existingTranslation.translations.find(
            (existingItem) =>
              existingItem.locale === item.locale &&
              existingItem.value !== item.value,
          ),
      )
      .map((item) => ({
        eventType: TranslationChangeLogEvent.UPDATE,
        before:
          existingTranslation.translations.find(
            (existingItem) => existingItem.locale === item.locale,
          )?.value ?? '',
        after: item.value,
        locale: item.locale,
        date: new Date(),
      }));

    if (changeLog.length === 0) {
      return {
        success: true,
        data: existingTranslation,
      };
    }

    const response = await this.translationModel.findOneAndUpdate(
      {
        key: request.oldKey,
        namespace: request.namespace,
        project: request.project,
      },
      {
        translations: request.translations,
        translated: true,
        changeLogs: [...existingTranslation.changeLogs, ...changeLog],
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

  ignoreTranslation(key: string) {
    return this.translationModel.findOneAndUpdate(
      {
        key,
      },
      {
        translated: true,
      },
    );
  }
}
