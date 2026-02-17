import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { renderMarkdown } from '../src/render/markdown.js';
import { renderJson } from '../src/render/json.js';
import { renderHtml } from '../src/render/html.js';
import type { ModelCard } from '../src/schema/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadCompleteFixture(): Promise<ModelCard> {
  const content = await readFile(resolve(__dirname, 'fixtures', 'complete-modelcard.yaml'), 'utf-8');
  return YAML.parse(content) as ModelCard;
}

describe('Markdown Renderer', () => {
  it('renders a complete model card', async () => {
    const data = await loadCompleteFixture();
    const md = await renderMarkdown(data);

    expect(md).toContain('# Model Card: Veterans Benefits Eligibility Predictor');
    expect(md).toContain('GOVERN');
    expect(md).toContain('MAP');
    expect(md).toContain('MEASURE');
    expect(md).toContain('MANAGE');
  });

  it('includes the header table with status', async () => {
    const data = await loadCompleteFixture();
    const md = await renderMarkdown(data);

    expect(md).toContain('In Review');
    expect(md).toContain('UNCLASSIFIED');
  });

  it('includes OMB M-24-10 warnings for rights-impacting systems', async () => {
    const data = await loadCompleteFixture();
    const md = await renderMarkdown(data);

    expect(md).toContain('OMB M-24-10');
    expect(md).toContain('rights-impacting');
  });

  it('includes the NIST traceability matrix', async () => {
    const data = await loadCompleteFixture();
    const md = await renderMarkdown(data);

    expect(md).toContain('NIST AI RMF Traceability Matrix');
    expect(md).toContain('GOVERN 1.1');
    expect(md).toContain('100%');
  });

  it('renders supply chain tables', async () => {
    const data = await loadCompleteFixture();
    const md = await renderMarkdown(data);

    expect(md).toContain('Azure OpenAI Service');
    expect(md).toContain('scikit-learn');
    expect(md).toContain('XGBoost');
  });

  it('renders mitigation strategy table', async () => {
    const data = await loadCompleteFixture();
    const md = await renderMarkdown(data);

    expect(md).toContain('Demographic bias');
    expect(md).toContain('Implemented');
  });

  it('renders performance metrics with disaggregated results', async () => {
    const data = await loadCompleteFixture();
    const md = await renderMarkdown(data);

    expect(md).toContain('AUC-ROC');
    expect(md).toContain('0.92');
    expect(md).toContain('Gender (Male)');
    expect(md).toContain('Gender (Female)');
  });
});

describe('JSON Renderer', () => {
  it('renders valid JSON with $schema', async () => {
    const data = await loadCompleteFixture();
    const json = renderJson(data);
    const parsed = JSON.parse(json);

    expect(parsed.$schema).toBeDefined();
    expect(parsed.metadata.status).toBe('review');
    expect(parsed.govern.ownership.organization).toBe('Department of Veterans Affairs');
  });

  it('includes schema definition', async () => {
    const data = await loadCompleteFixture();
    const json = renderJson(data);
    const parsed = JSON.parse(json);

    expect(parsed.$schemaDefinition).toBeDefined();
  });
});

describe('HTML Renderer', () => {
  it('renders valid HTML document', async () => {
    const data = await loadCompleteFixture();
    const html = await renderHtml(data);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('Veterans Benefits Eligibility Predictor');
    expect(html).toContain('</html>');
  });

  it('includes CSS styles', async () => {
    const data = await loadCompleteFixture();
    const html = await renderHtml(data);

    expect(html).toContain('<style>');
    expect(html).toContain('prefers-color-scheme: dark');
  });
});
