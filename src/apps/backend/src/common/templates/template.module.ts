import { Module } from '@nestjs/common';
import { TemplateRendererService } from './template-renderer.service.js';

@Module({
  providers: [TemplateRendererService],
  exports: [TemplateRendererService],
})
export class TemplateModule {}
