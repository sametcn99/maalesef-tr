import { Injectable } from '@nestjs/common';

export type TemplateFileEntry = readonly [
  templateKey: string,
  filePath: string,
];

@Injectable()
export class TemplateRegistryService {
  private readonly templateFiles = new Map<string, string>();

  register(templateKey: string, filePath: string): void {
    const existingPath = this.templateFiles.get(templateKey);

    if (existingPath && existingPath !== filePath) {
      throw new Error(
        `Template key is already registered with a different file: ${templateKey}`,
      );
    }

    this.templateFiles.set(templateKey, filePath);
  }

  registerMany(entries: readonly TemplateFileEntry[]): void {
    entries.forEach(([templateKey, filePath]) => {
      this.register(templateKey, filePath);
    });
  }

  get(templateKey: string): string | undefined {
    return this.templateFiles.get(templateKey);
  }

  entries(): readonly TemplateFileEntry[] {
    return [...this.templateFiles.entries()];
  }
}
