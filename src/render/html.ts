import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import { marked } from 'marked';
import { renderMarkdown } from './markdown.js';
import type { ModelCard } from '../schema/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function renderHtml(data: ModelCard): Promise<string> {
  const markdown = await renderMarkdown(data);
  const htmlContent = await marked(markdown);

  const templatePath = resolve(__dirname, '..', 'templates', 'html.hbs');
  const source = await readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(source, { noEscape: true });

  return template({ ...data, htmlContent });
}
