import { access, constants } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_YAML_FILENAME, DEFAULT_MD_FILENAME, DEFAULT_JSON_FILENAME, DEFAULT_HTML_FILENAME } from '../constants.js';
import type { OutputFormat } from '../schema/types.js';

export function resolveModelCardPath(dir?: string): string {
  return resolve(dir ?? process.cwd(), DEFAULT_YAML_FILENAME);
}

export function resolveOutputPath(format: OutputFormat, dir?: string): string {
  const filenames: Record<OutputFormat, string> = {
    markdown: DEFAULT_MD_FILENAME,
    json: DEFAULT_JSON_FILENAME,
    html: DEFAULT_HTML_FILENAME,
  };
  return resolve(dir ?? process.cwd(), filenames[format]);
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** Get the package root directory (where package.json lives) */
export function getPackageRoot(): string {
  const currentFile = fileURLToPath(import.meta.url);
  // src/utils/files.ts → go up 3 levels to package root
  return resolve(dirname(currentFile), '..', '..');
}

/** Get the templates directory */
export function getTemplatesDir(): string {
  return resolve(getPackageRoot(), 'templates');
}
