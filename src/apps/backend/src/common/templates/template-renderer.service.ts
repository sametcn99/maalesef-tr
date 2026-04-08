import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import { TemplateRegistryService } from './template-registry.service.js';

type TemplateContext = Record<string, unknown>;
type CompiledTemplate = (context: TemplateContext) => string;

@Injectable()
export class TemplateRendererService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TemplateRendererService.name);
  private readonly templates = new Map<string, CompiledTemplate>();
  constructor(private readonly templateRegistry: TemplateRegistryService) {}

  async onApplicationBootstrap() {
    await this.preloadTemplates();
  }

  async renderMailHtml(templateName: string, context: TemplateContext) {
    return this.render(`mail/${templateName}.html.hbs`, context);
  }

  async renderMailText(templateName: string, context: TemplateContext) {
    return this.render(`mail/${templateName}.txt.hbs`, context);
  }

  async renderMarkdown(templateName: string, context: TemplateContext) {
    return this.render(`prompts/${templateName}.md.hbs`, context);
  }

  private async preloadTemplates() {
    const templateEntries = this.templateRegistry.entries();

    if (!templateEntries.length) {
      this.logger.warn('No templates registered');
      return;
    }

    await Promise.all(
      templateEntries.map(([templateKey, filePath]) =>
        this.loadTemplate(templateKey, filePath),
      ),
    );

    this.logger.log(`Loaded ${this.templates.size} templates`);
  }

  private async loadTemplate(templateKey: string, filePath: string) {
    const source = await readFile(filePath, 'utf8');
    const noEscape =
      templateKey.endsWith('.txt.hbs') || templateKey.endsWith('.md.hbs');

    this.templates.set(
      templateKey,
      Handlebars.compile<TemplateContext>(source, { noEscape }),
    );
  }

  private async ensureTemplateLoaded(templateKey: string) {
    if (this.templates.has(templateKey)) {
      return;
    }

    const filePath = this.templateRegistry.get(templateKey);

    if (!filePath) {
      throw new Error(`Template is not registered: ${templateKey}`);
    }

    await this.loadTemplate(templateKey, filePath);
  }

  private async render(templateKey: string, context: TemplateContext) {
    await this.ensureTemplateLoaded(templateKey);

    const template = this.templates.get(templateKey);

    if (!template) {
      throw new Error(`Template is not loaded: ${templateKey}`);
    }

    return template(context).trim();
  }
}
