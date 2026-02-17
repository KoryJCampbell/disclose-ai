import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { ModelCardSchema } from '../src/schema/modelcard.schema.js';
import { createDefaultModelCard } from '../src/schema/defaults.js';
import { getUniqueSubcategories, getFieldsForSubcategory, NIST_FIELD_MAPPING } from '../src/schema/nist-mapping.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(__dirname, 'fixtures');

async function loadFixture(name: string) {
  const content = await readFile(resolve(fixturesDir, name), 'utf-8');
  return YAML.parse(content);
}

describe('ModelCardSchema', () => {
  it('validates a complete model card', async () => {
    const data = await loadFixture('complete-modelcard.yaml');
    const result = ModelCardSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('validates a minimal model card', async () => {
    const data = await loadFixture('minimal-modelcard.yaml');
    const result = ModelCardSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid model card', async () => {
    const data = await loadFixture('invalid-modelcard.yaml');
    const result = ModelCardSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('rejects invalid status values', () => {
    const data = createDefaultModelCard();
    (data.metadata as Record<string, unknown>).status = 'invalid';
    const result = ModelCardSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const data = createDefaultModelCard();
    data.govern.ownership.email = 'not-an-email';
    const result = ModelCardSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('requires at least one use case', () => {
    const data = createDefaultModelCard();
    data.map.intended_use.use_cases = [];
    const result = ModelCardSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('requires at least one metric', () => {
    const data = createDefaultModelCard();
    data.measure.performance_metrics.metrics = [];
    const result = ModelCardSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('createDefaultModelCard', () => {
  it('creates a valid default structure', () => {
    const card = createDefaultModelCard();
    expect(card.metadata.status).toBe('draft');
    expect(card.metadata.card_version).toBe('1.0.0');
    expect(card.govern.ownership.organization).toBe('');
    expect(card.map.model_overview.name).toBe('');
  });

  it('sets created_date to today', () => {
    const card = createDefaultModelCard();
    const today = new Date().toISOString().split('T')[0];
    expect(card.metadata.created_date).toBe(today);
  });
});

describe('NIST Mapping', () => {
  it('has mappings for all four functions', () => {
    const subcategories = getUniqueSubcategories();
    const functions = new Set(subcategories.map(s => s.id.split(' ')[0]));
    expect(functions.has('GOVERN')).toBe(true);
    expect(functions.has('MAP')).toBe(true);
    expect(functions.has('MEASURE')).toBe(true);
    expect(functions.has('MANAGE')).toBe(true);
  });

  it('returns fields for a subcategory', () => {
    const fields = getFieldsForSubcategory('GOVERN 1.1');
    expect(fields.length).toBeGreaterThan(0);
    expect(fields[0]).toContain('govern.');
  });

  it('has no orphaned field mappings', () => {
    for (const fieldPath of Object.keys(NIST_FIELD_MAPPING)) {
      const parts = fieldPath.split('.');
      expect(parts.length).toBeGreaterThanOrEqual(2);
      expect(['govern', 'map', 'measure', 'manage']).toContain(parts[0]);
    }
  });
});
