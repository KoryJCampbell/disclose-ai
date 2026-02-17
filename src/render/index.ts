import { writeFile } from 'node:fs/promises';
import { renderMarkdown } from './markdown.js';
import { renderJson } from './json.js';
import { renderHtml } from './html.js';
import type { ModelCard, OutputFormat } from '../schema/types.js';

export async function renderModelCard(
  data: ModelCard,
  format: OutputFormat,
  outputPath: string,
): Promise<void> {
  let content: string;

  switch (format) {
    case 'markdown':
      content = await renderMarkdown(data);
      break;
    case 'json':
      content = renderJson(data);
      break;
    case 'html':
      content = await renderHtml(data);
      break;
  }

  await writeFile(outputPath, content, 'utf-8');
}

export { renderMarkdown, renderJson, renderHtml };
