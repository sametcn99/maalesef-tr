import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import Handlebars from 'handlebars';

type TemplateContext = Record<string, unknown>;
type CompiledTemplate = (context: TemplateContext) => string;

@Injectable()
export class TemplateRendererService implements OnModuleInit {
  private readonly logger = new Logger(TemplateRendererService.name);
  private readonly templates = new Map<string, CompiledTemplate>();
  private readonly templateFiles = new Map<string, string>([
    [
      'mail/email-verification.html.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/email-verification.html.hbs',
      ),
    ],
    [
      'mail/email-verification.txt.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/email-verification.txt.hbs',
      ),
    ],
    [
      'mail/password-reset.html.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/password-reset.html.hbs',
      ),
    ],
    [
      'mail/password-reset.txt.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/password-reset.txt.hbs',
      ),
    ],
    [
      'mail/notification-summary.html.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/notification-summary.html.hbs',
      ),
    ],
    [
      'mail/notification-summary.txt.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/notification-summary.txt.hbs',
      ),
    ],
    [
      'mail/rejection.html.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/rejection.html.hbs',
      ),
    ],
    [
      'mail/rejection.txt.hbs',
      join(
        import.meta.dirname,
        '../../modules/mail/templates/rejection.txt.hbs',
      ),
    ],
    [
      'prompts/application-evaluation-system.md.hbs',
      join(
        import.meta.dirname,
        '../../modules/applications/templates/application-evaluation-system.md.hbs',
      ),
    ],
    [
      'prompts/application-evaluation-user.md.hbs',
      join(
        import.meta.dirname,
        '../../modules/applications/templates/application-evaluation-user.md.hbs',
      ),
    ],
  ]);
  private loadPromise: Promise<void> | null = null;

  async onModuleInit() {
    await this.ensureLoaded();
  }

  async renderMailHtml(templateName: string, context: TemplateContext) {
    await this.ensureLoaded();
    return this.render(`mail/${templateName}.html.hbs`, context);
  }

  async renderMailText(templateName: string, context: TemplateContext) {
    await this.ensureLoaded();
    return this.render(`mail/${templateName}.txt.hbs`, context);
  }

  async renderMarkdown(templateName: string, context: TemplateContext) {
    await this.ensureLoaded();
    return this.render(`prompts/${templateName}.md.hbs`, context);
  }

  private async ensureLoaded() {
    if (this.templates.size > 0) {
      return;
    }

    if (!this.loadPromise) {
      this.loadPromise = this.preloadTemplates();
    }

    await this.loadPromise;
  }

  private async preloadTemplates() {
    if (!this.templateFiles.size) {
      throw new Error('No template files configured');
    }

    await Promise.all(
      [...this.templateFiles.entries()].map(([templateKey, filePath]) =>
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

  private render(templateKey: string, context: TemplateContext) {
    const template = this.templates.get(templateKey);

    if (!template) {
      throw new Error(`Template is not loaded: ${templateKey}`);
    }

    return template(context).trim();
  }
}
