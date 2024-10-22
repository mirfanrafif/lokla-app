import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TranslationChangeLogEvent } from 'lib/enums/TranslationChangeLogEvent';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { flatten, unflatten } from 'safe-flat';

import { ProjectModel } from '../projects/Project.schema';
import { UserModel } from '../users/User.schema';
import {
  RequestDeleteTranslation,
  RequestExportTranslation,
  RequestGetTranslationList,
  RequestGetTranslationStatistics,
  RequestImportTranslationFromCi,
  RequestImportTranslationFromJson,
  RequestUpdateTranslation,
} from './Translation.dto';
import { TranslationData, TranslationModel } from './Translation.schema';
import { TranslationChangeLogModel } from './TranslationChangeLog';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectModel(TranslationModel.name)
    private translationModel: Model<TranslationModel>,
    @InjectModel(ProjectModel.name)
    private projectModel: Model<ProjectModel>
  ) {}

  async getLocales(projectId: string) {
    const data = await this.projectModel.findOne({
      identifier: projectId,
    });

    return Array.from(new Set([data.defaultLanguage, ...data.languages]));
  }

  async getTranslationList(query: RequestGetTranslationList) {
    let filters: FilterQuery<TranslationModel> = {};

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
          $search: `"${query.search}"`,
        },
      };
    }

    if (query.filter === 'not_translated') {
      filters = {
        ...filters,
        translated: false,
      };
    }

    if (query.filter === 'need_to_verify') {
      filters = {
        ...filters,
        needToVerify: true,
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
      query.search
        ? {
            score: {
              $meta: 'textScore',
            },
          }
        : undefined,
      {
        skip: query.page * query.limit,
        limit: query.limit,
      }
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
    body: RequestImportTranslationFromJson
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
    body: RequestImportTranslationFromCi
  ) {
    const fileJson = body.data;

    await this.processJson(fileJson, query);

    return {
      success: true,
    };
  }

  private async processJson(
    json: object,
    body: RequestImportTranslationFromJson
  ) {
    const flatJson = flatten(json);

    const project = await this.projectModel.findOne({
      identifier: body.project,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const keys = Object.keys(flatJson);

    const data = await this.translationModel.find({
      namespace: body.namespace,
      project: body.project,
    });

    const existingKeys = data.filter((item) => keys.includes(item.key));

    await this.updateExistingKeys(flatJson, existingKeys, body, project);

    if (body.locale === project.defaultLanguage) {
      const deletedKeys = data.filter((item) => !keys.includes(item.key));

      await this.setKeysToUnused(deletedKeys, body, project);
    }

    // new keys
    const newKeys = keys.filter(
      (item) => !existingKeys.find((existingItem) => existingItem.key === item)
    );

    await this.createNewKeys(newKeys, flatJson, body);

    return true;
  }

  private async updateExistingKeys(
    flatJson: object,
    existingKeys: TranslationModel[],
    body: RequestImportTranslationFromJson,
    project: ProjectModel
  ) {
    // update existing
    for (const item of existingKeys) {
      try {
        const newValue = flatJson[item.key];

        const updateQuery: UpdateQuery<TranslationModel> = {};

        if (item.unused === true) {
          updateQuery.unused = false;
        }

        const existingLocale: TranslationData = item.translations.find(
          (item) => item.locale === body.locale
        );

        const isSame =
          existingLocale !== undefined && existingLocale.value === newValue;

        if (isSame) {
          // Check if update query is not empty and update if is something to update
          await this.updateIfSomethingToUpdate(updateQuery, item);
          // Update current translation unused to false
          continue;
        }

        const isTargetLanguageUpdatedByEditor = () => {
          return (
            item.changeLogs.find(
              (item) =>
                item.locale === body.locale &&
                item.locale !== project.defaultLanguage &&
                item.userId !== null
            ) !== undefined
          );
        };

        if (isTargetLanguageUpdatedByEditor()) {
          // Check if update query is not empty and update if is something to update
          await this.updateIfSomethingToUpdate(updateQuery, item);
          continue;
        }

        const newTranslation = [
          ...item.translations.filter((item) => item.locale !== body.locale),
          {
            locale: body.locale,
            value: newValue,
          },
        ];

        updateQuery.translations = newTranslation;

        const languages = await this.getLocales(body.project);

        updateQuery.translated = newTranslation.length === languages.length;

        updateQuery.changeLogs = [
          ...item.changeLogs,
          {
            eventType:
              existingLocale !== undefined
                ? TranslationChangeLogEvent.UPDATE
                : TranslationChangeLogEvent.CREATE,
            before: existingLocale?.value ?? '',
            after: newValue,
            locale: body.locale,
            date: new Date(),
            userId: null,
          },
        ];

        const isBaseLanguageUpdated = () => {
          if (existingLocale === undefined) {
            return false;
          }

          if (
            body.locale === project.defaultLanguage &&
            existingLocale.value !== newValue
          ) {
            return true;
          }

          return item.needToVerify;
        };

        updateQuery.needToVerify = isBaseLanguageUpdated();

        await this.translationModel.findOneAndUpdate(
          {
            key: item.key,
            namespace: body.namespace,
            project: body.project,
          },
          updateQuery
        );
      } catch (error) {
        throw new InternalServerErrorException(
          `Error when updating translation on locale ${body.locale} for namespace ${body.namespace}`
        );
      }
    }
  }

  private async updateIfSomethingToUpdate(
    updateQuery: UpdateQuery<TranslationModel>,
    item: TranslationModel
  ) {
    if (Object.keys(updateQuery).length === 0) {
      return;
    }

    await this.translationModel.findOneAndUpdate(
      {
        key: item.key,
        namespace: item.namespace,
        project: item.project,
      },
      updateQuery
    );
  }

  private async setKeysToUnused(
    deletedKeys: TranslationModel[],
    body: RequestImportTranslationFromJson,
    project: ProjectModel
  ) {
    if (body.locale === project.defaultLanguage) {
      await this.translationModel.updateMany(
        {
          key: {
            $in: deletedKeys.map((item) => item.key),
          },
        },
        {
          unused: true,
        }
      );

      for (const item of deletedKeys) {
        await this.translationModel.findOneAndUpdate(
          {
            key: item.key,
            namespace: body.namespace,
            project: body.project,
          },
          {
            changeLogs: [
              ...item.changeLogs,
              {
                eventType: TranslationChangeLogEvent.DELETE,
                before:
                  item.translations
                    .find((item) => item.locale === body.locale)
                    ?.value.toString() ?? '',
                after: '',
                locale: body.locale,
                date: new Date(),
                userId: null,
              },
            ],
          }
        );
      }
    }
  }

  private async createNewKeys(
    newKeys: string[],
    flatJson: object,
    body: RequestImportTranslationFromJson
  ) {
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
      needToVerify: false,
      changeLogs: [
        {
          eventType: TranslationChangeLogEvent.CREATE,
          before: '',
          after: flatJson[item],
          locale: body.locale,
          date: new Date(),
          userId: null,
        },
      ],
    }));

    await this.translationModel.insertMany(requests);
  }

  async updateTranslation(request: RequestUpdateTranslation, user: UserModel) {
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
            (existingItem) => existingItem.locale === item.locale
          ) ||
          existingTranslation.translations.find(
            (existingItem) =>
              existingItem.locale === item.locale &&
              existingItem.value !== item.value
          )
      )
      .map((item) => ({
        eventType: TranslationChangeLogEvent.UPDATE,
        before:
          existingTranslation.translations.find(
            (existingItem) => existingItem.locale === item.locale
          )?.value ?? '',
        after: item.value,
        locale: item.locale,
        date: new Date(),
        userId: user.email,
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
        needToVerify: false,
        changeLogs: [...existingTranslation.changeLogs, ...changeLog],
      }
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
      $or: [{ unused: false }, { unused: { $exists: false } }],
    });
    const outputObject: {
      [key: string]: string;
    } = {};
    for (const translationItem of translationData) {
      const translationValue = translationItem.translations.find(
        (item) => item.locale === request.locale
      );

      if (!translationValue) {
        continue;
      }

      outputObject[translationItem.key] = translationValue.value;
    }

    const unflattenObject = unflatten(outputObject);

    const sortedObject = this.sortKeys(unflattenObject);

    const result = JSON.stringify(sortedObject, null, 2);

    return `${result}`;
  }

  ignoreTranslation(key: string) {
    return this.translationModel.findOneAndUpdate(
      {
        key,
      },
      {
        translated: true,
        needToVerify: false,
      }
    );
  }

  private sortKeys(
    object,
    options = {
      deep: true,
      compare: (a, b) => a.localeCompare(b),
    }
  ) {
    if (!this.isPlainObject(object) && !Array.isArray(object)) {
      throw new TypeError('Expected a plain object or array');
    }

    const { deep, compare } = options;
    const cache = new WeakMap();

    const deepSortArray = (array) => {
      const resultFromCache = cache.get(array);
      if (resultFromCache !== undefined) {
        return resultFromCache;
      }

      const result = [];
      cache.set(array, result);

      result.push(
        ...array.map((item) => {
          if (Array.isArray(item)) {
            return deepSortArray(item);
          }

          if (this.isPlainObject(item)) {
            return _sortKeys(item);
          }

          return item;
        })
      );

      return result;
    };

    const _sortKeys = (object) => {
      const resultFromCache = cache.get(object);
      if (resultFromCache !== undefined) {
        return resultFromCache;
      }

      const result = {};
      const keys = Object.keys(object).sort(compare);

      cache.set(object, result);

      for (const key of keys) {
        const value = object[key];
        let newValue;

        if (deep && Array.isArray(value)) {
          newValue = deepSortArray(value);
        } else {
          newValue =
            deep && this.isPlainObject(value) ? _sortKeys(value) : value;
        }

        Object.defineProperty(result, key, {
          ...Object.getOwnPropertyDescriptor(object, key),
          value: newValue,
        });
      }

      return result;
    };

    if (Array.isArray(object)) {
      return deep ? deepSortArray(object) : [...object];
    }

    return _sortKeys(object);
  }

  private isPlainObject(value: any) {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return (
      (prototype === null ||
        prototype === Object.prototype ||
        Object.getPrototypeOf(prototype) === null) &&
      !(Symbol.toStringTag in value) &&
      !(Symbol.iterator in value)
    );
  }

  getStatistics(query: RequestGetTranslationStatistics) {
    // get percentage of translated keys group by namespace
    return this.translationModel.aggregate([
      {
        $match: {
          project: query.project,
        },
      },
      {
        $group: {
          _id: '$namespace',
          total: {
            $sum: 1,
          },
          translated: {
            $sum: {
              $cond: [
                {
                  $eq: ['$translated', true],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          namespace: '$_id',
          total: 1,
          translated: 1,
          percentage: {
            $multiply: [
              {
                $divide: ['$translated', '$total'],
              },
              100,
            ],
          },
        },
      },
    ]);
  }
}
