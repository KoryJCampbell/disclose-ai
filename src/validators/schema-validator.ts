import { ModelCardSchema } from '../schema/modelcard.schema.js';

export interface SchemaValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    code: string;
  }>;
}

export function validateSchema(data: unknown): SchemaValidationResult {
  const result = ModelCardSchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })),
  };
}
