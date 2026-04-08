import { Injectable, OnModuleInit } from '@nestjs/common';
import { TemplateRegistryService } from '../../common/templates/template-registry.service.js';
import { APPLICATION_TEMPLATE_FILES } from './templates/application-template-files.js';

@Injectable()
export class ApplicationTemplatesRegistrar implements OnModuleInit {
  constructor(private readonly templateRegistry: TemplateRegistryService) {}

  onModuleInit(): void {
    this.templateRegistry.registerMany(APPLICATION_TEMPLATE_FILES);
  }
}
