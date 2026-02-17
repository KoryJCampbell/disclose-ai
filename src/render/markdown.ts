import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import { registerHelpers } from '../templates/helpers.js';
import { scoreNistCompliance } from '../validators/nist-compliance-scorer.js';
import type { ModelCard } from '../schema/types.js';

let compiledTemplate: HandlebarsTemplateDelegate | undefined;

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getTemplate(): Promise<HandlebarsTemplateDelegate> {
  if (compiledTemplate) return compiledTemplate;
  registerHelpers();

  const templatePath = resolve(__dirname, '..', 'templates', 'markdown.hbs');
  const source = await readFile(templatePath, 'utf-8');
  compiledTemplate = Handlebars.compile(source, { noEscape: true });
  return compiledTemplate;
}

export async function renderMarkdown(data: ModelCard): Promise<string> {
  const template = await getTemplate();
  const nistScore = scoreNistCompliance(data);

  const context = {
    ...data,
    nistTraceability: nistScore.traceabilityMatrix,
    nistCoverage: nistScore,
  };

  return template(context);
}
