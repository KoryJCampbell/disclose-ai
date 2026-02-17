import { logger } from '../utils/logger.js';
import { readYaml } from '../utils/yaml.js';
import { fileExists, resolveModelCardPath } from '../utils/files.js';
import { validateSchema } from '../validators/schema-validator.js';
import { checkCompleteness } from '../validators/completeness-checker.js';
import { scoreNistCompliance } from '../validators/nist-compliance-scorer.js';

interface ValidateOptions {
  input?: string;
  dir: string;
  strict?: boolean;
}

export async function validateCommand(options: ValidateOptions): Promise<void> {
  const yamlPath = options.input ?? resolveModelCardPath(options.dir);

  if (!(await fileExists(yamlPath))) {
    logger.error(`File not found: ${yamlPath}`);
    logger.dim('Run `disclose-ai init` to create a starter template.');
    process.exit(1);
  }

  logger.info(`Validating ${yamlPath}\n`);
  const data = await readYaml(yamlPath);

  // 1. Schema validation
  const schemaResult = validateSchema(data);

  // 2. Completeness check
  const completeness = checkCompleteness(data);

  // 3. NIST compliance scoring
  const nistScore = scoreNistCompliance(data);

  // Report
  logger.heading('Schema Validation');
  if (schemaResult.valid) {
    logger.success('Schema validation passed');
  } else {
    logger.error(`Schema validation failed (${schemaResult.errors.length} errors)`);
    for (const err of schemaResult.errors) {
      logger.dim(`  ${err.path}: ${err.message}`);
    }
  }

  logger.heading('Completeness');
  logger.info(`Required fields: ${completeness.required.filled}/${completeness.required.total} (${completeness.required.percent}%)`);
  logger.info(`Optional fields: ${completeness.optional.filled}/${completeness.optional.total} (${completeness.optional.percent}%)`);
  if (completeness.missing.length > 0) {
    logger.warn(`Missing required fields:`);
    for (const field of completeness.missing) {
      logger.dim(`  - ${field}`);
    }
  }

  logger.heading('NIST AI RMF Coverage');
  logger.info(`Overall: ${nistScore.overall.percent}% (${nistScore.overall.covered}/${nistScore.overall.total} subcategories)`);
  for (const func of nistScore.byFunction) {
    const bar = progressBar(func.percent);
    logger.nist(func.function, `${bar} ${func.percent}% (${func.covered}/${func.total})`);
  }

  // Exit code
  const hasErrors = !schemaResult.valid || completeness.missing.length > 0;
  const hasWarnings = completeness.optional.filled < completeness.optional.total;

  if (hasErrors) {
    process.exit(1);
  } else if (options.strict && hasWarnings) {
    process.exit(1);
  }
}

function progressBar(percent: number): string {
  const filled = Math.round(percent / 5);
  const empty = 20 - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
}
