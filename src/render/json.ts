import { zodToJsonSchema } from 'zod-to-json-schema';
import { ModelCardSchema } from '../schema/modelcard.schema.js';
import type { ModelCard } from '../schema/types.js';

export function renderJson(data: ModelCard): string {
  const jsonSchema = zodToJsonSchema(ModelCardSchema, 'ModelCard');
  const output = {
    $schema: 'https://legacybridge.dev/schemas/modelcard/v1.json',
    $schemaDefinition: jsonSchema,
    ...data,
  };
  return JSON.stringify(output, null, 2);
}
