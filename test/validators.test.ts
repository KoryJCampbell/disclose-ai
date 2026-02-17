import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { validateSchema } from '../src/validators/schema-validator.js';
import { checkCompleteness } from '../src/validators/completeness-checker.js';
import { scoreNistCompliance } from '../src/validators/nist-compliance-scorer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(__dirname, 'fixtures');

async function loadFixture(name: string) {
  const content = await readFile(resolve(fixturesDir, name), 'utf-8');
  return YAML.parse(content);
}

describe('Schema Validator', () => {
  it('passes for a complete model card', async () => {
    const data = await loadFixture('complete-modelcard.yaml');
    const result = validateSchema(data);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('passes for a minimal model card', async () => {
    const data = await loadFixture('minimal-modelcard.yaml');
    const result = validateSchema(data);
    expect(result.valid).toBe(true);
  });

  it('fails for an invalid model card', async () => {
    const data = await loadFixture('invalid-modelcard.yaml');
    const result = validateSchema(data);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('provides error paths', async () => {
    const data = await loadFixture('invalid-modelcard.yaml');
    const result = validateSchema(data);
    const paths = result.errors.map(e => e.path);
    expect(paths.some(p => p.includes('email') || p.includes('status'))).toBe(true);
  });
});

describe('Completeness Checker', () => {
  it('reports 100% for complete model card', async () => {
    const data = await loadFixture('complete-modelcard.yaml');
    const result = checkCompleteness(data);
    expect(result.required.percent).toBe(100);
    expect(result.missing).toHaveLength(0);
  });

  it('reports missing fields for minimal model card', async () => {
    const data = await loadFixture('minimal-modelcard.yaml');
    const result = checkCompleteness(data);
    // Minimal has required fields, but some optional are missing
    expect(result.required.percent).toBeGreaterThanOrEqual(80);
    expect(result.optional.percent).toBeLessThan(100);
  });

  it('reports many missing fields for invalid model card', async () => {
    const data = await loadFixture('invalid-modelcard.yaml');
    const result = checkCompleteness(data);
    expect(result.missing.length).toBeGreaterThan(5);
    expect(result.required.percent).toBeLessThan(50);
  });
});

describe('NIST Compliance Scorer', () => {
  it('scores 100% for complete model card', async () => {
    const data = await loadFixture('complete-modelcard.yaml');
    const score = scoreNistCompliance(data);
    expect(score.overall.percent).toBe(100);
    expect(score.overall.covered).toBe(score.overall.total);
  });

  it('reports all four functions', async () => {
    const data = await loadFixture('complete-modelcard.yaml');
    const score = scoreNistCompliance(data);
    expect(score.byFunction).toHaveLength(4);
    const functions = score.byFunction.map(f => f.function);
    expect(functions).toEqual(['GOVERN', 'MAP', 'MEASURE', 'MANAGE']);
  });

  it('generates traceability matrix', async () => {
    const data = await loadFixture('complete-modelcard.yaml');
    const score = scoreNistCompliance(data);
    expect(score.traceabilityMatrix.length).toBeGreaterThan(0);
    for (const entry of score.traceabilityMatrix) {
      expect(entry.subcategoryId).toBeDefined();
      expect(entry.description).toBeDefined();
      expect(entry.fields.length).toBeGreaterThan(0);
    }
  });

  it('scores lower for minimal model card', async () => {
    const data = await loadFixture('minimal-modelcard.yaml');
    const score = scoreNistCompliance(data);
    expect(score.overall.percent).toBeLessThan(100);
    expect(score.overall.percent).toBeGreaterThan(0);
  });

  it('each function has subcategories', async () => {
    const data = await loadFixture('complete-modelcard.yaml');
    const score = scoreNistCompliance(data);
    for (const func of score.byFunction) {
      expect(func.total).toBeGreaterThan(0);
      expect(func.subcategories.length).toBe(func.total);
    }
  });
});
