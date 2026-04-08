import { join } from 'node:path';
import type { TemplateFileEntry } from '../../../common/templates/template-registry.service.js';

const templatesDir = import.meta.dirname;

export const APPLICATION_TEMPLATE_FILES = [
  [
    'prompts/application-evaluation-system.md.hbs',
    join(templatesDir, './application-evaluation-system.md.hbs'),
  ],
  [
    'prompts/application-evaluation-user.md.hbs',
    join(templatesDir, './application-evaluation-user.md.hbs'),
  ],
] as const satisfies readonly TemplateFileEntry[];
