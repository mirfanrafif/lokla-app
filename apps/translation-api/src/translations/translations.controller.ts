import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Multer from 'multer';

import { JwtAuthGuard } from '../auth/Auth.guard';
import {
  RequestDeleteTranslation,
  RequestExportTranslation,
  RequestGetTranslationList,
  RequestImportTranslationFromCi,
  RequestImportTranslationFromJson,
  RequestUpdateTranslation,
} from './Translation.dto';
import { TranslationsService } from './translations.service';

@Controller('translations')
export class TranslationsController {
  constructor(private service: TranslationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllTranslation(@Query() query: RequestGetTranslationList) {
    return this.service.getTranslationList(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importTranslationFromJson(
    @Body() body: RequestImportTranslationFromJson,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.importTranslationFromJson(file, body);
  }

  @Post('import/ci')
  @UseInterceptors(FileInterceptor('file'))
  importTranslationFromJsonCi(
    @Query() body: RequestImportTranslationFromJson,
    @Body() data: RequestImportTranslationFromCi,
  ) {
    return this.service.importTranslationFromJsonCi(body, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateTranslation(@Body() request: RequestUpdateTranslation) {
    return this.service.updateTranslation(request);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteTranslation(@Query() request: RequestDeleteTranslation) {
    return this.service.deleteTranslation(request);
  }

  @Get('export')
  exportTranslation(@Query() request: RequestExportTranslation) {
    return this.service.exportTranslation(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('namespaces')
  getNamespaces(@Query('project') project: string) {
    return this.service.getNamespaces(project);
  }
}
