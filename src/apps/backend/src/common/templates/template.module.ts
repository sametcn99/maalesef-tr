import { Module } from '@nestjs/common';
import { TemplateRegistryService } from './template-registry.service.js';
import { TemplateRendererService } from './template-renderer.service.js';

@Module({
  providers: [TemplateRegistryService, TemplateRendererService],
  exports: [TemplateRegistryService, TemplateRendererService],
})
export class TemplateModule {}
