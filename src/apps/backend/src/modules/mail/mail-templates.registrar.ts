import { Injectable, OnModuleInit } from '@nestjs/common';
import { TemplateRegistryService } from '../../common/templates/template-registry.service.js';
import { MAIL_TEMPLATE_FILES } from './templates/mail-template-files.js';

@Injectable()
export class MailTemplatesRegistrar implements OnModuleInit {
  constructor(private readonly templateRegistry: TemplateRegistryService) {}

  onModuleInit(): void {
    this.templateRegistry.registerMany(MAIL_TEMPLATE_FILES);
  }
}
