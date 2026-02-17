import { readFile, writeFile } from 'node:fs/promises';
import YAML from 'yaml';
import type { ModelCard } from '../schema/types.js';

export async function readYaml(filePath: string): Promise<ModelCard> {
  const content = await readFile(filePath, 'utf-8');
  return YAML.parse(content) as ModelCard;
}

export async function writeYaml(filePath: string, data: ModelCard): Promise<void> {
  const content = YAML.stringify(data, {
    indent: 2,
    lineWidth: 120,
    defaultStringType: 'PLAIN',
    defaultKeyType: 'PLAIN',
  });
  await writeFile(filePath, content, 'utf-8');
}

export function parseYamlString(content: string): unknown {
  return YAML.parse(content);
}

export function stringifyYaml(data: unknown): string {
  return YAML.stringify(data, {
    indent: 2,
    lineWidth: 120,
    defaultStringType: 'PLAIN',
    defaultKeyType: 'PLAIN',
  });
}
