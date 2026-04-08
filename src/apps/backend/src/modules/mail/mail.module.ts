import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TemplateModule } from '../../common/templates/template.module.js';
import { MailTemplatesRegistrar } from './mail-templates.registrar.js';
import { MailService } from './mail.service.js';

@Module({
  imports: [ConfigModule, TemplateModule],
  providers: [MailService, MailTemplatesRegistrar],
  exports: [MailService],
})
export class MailModule {}
