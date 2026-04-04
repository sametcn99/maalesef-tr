import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TemplateModule } from '../../common/templates/template.module.js';
import { MailService } from './mail.service.js';

@Module({
  imports: [ConfigModule, TemplateModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
