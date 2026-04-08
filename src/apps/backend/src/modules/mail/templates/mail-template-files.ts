import { join } from 'node:path';
import type { TemplateFileEntry } from '../../../common/templates/template-registry.service.js';

const templatesDir = import.meta.dirname;

export const MAIL_TEMPLATE_FILES = [
  [
    'mail/email-verification.html.hbs',
    join(templatesDir, './email-verification.html.hbs'),
  ],
  [
    'mail/email-verification.txt.hbs',
    join(templatesDir, './email-verification.txt.hbs'),
  ],
  [
    'mail/password-reset.html.hbs',
    join(templatesDir, './password-reset.html.hbs'),
  ],
  [
    'mail/password-reset.txt.hbs',
    join(templatesDir, './password-reset.txt.hbs'),
  ],
  [
    'mail/notification-summary.html.hbs',
    join(templatesDir, './notification-summary.html.hbs'),
  ],
  [
    'mail/notification-summary.txt.hbs',
    join(templatesDir, './notification-summary.txt.hbs'),
  ],
  ['mail/rejection.html.hbs', join(templatesDir, './rejection.html.hbs')],
  ['mail/rejection.txt.hbs', join(templatesDir, './rejection.txt.hbs')],
] as const satisfies readonly TemplateFileEntry[];
