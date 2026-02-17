import { logger } from '../utils/logger.js';
import { readYaml, writeYaml } from '../utils/yaml.js';
import { fileExists, resolveModelCardPath, resolveOutputPath } from '../utils/files.js';
import { ModelCardSchema } from '../schema/modelcard.schema.js';
import { createDefaultModelCard } from '../schema/defaults.js';
import { renderModelCard } from '../render/index.js';
import { runAllPrompts } from '../prompts/index.js';
import type { ModelCard, OutputFormat } from '../schema/types.js';

interface GenerateOptions {
  format: string;
  input?: string;
  output?: string;
  dir: string;
  ai?: boolean;
  repo?: string;
  interactive?: boolean;
}

export async function generateCommand(options: GenerateOptions): Promise<void> {
  const format = normalizeFormat(options.format);
  const yamlPath = options.input ?? resolveModelCardPath(options.dir);
  const outputPath = options.output ?? resolveOutputPath(format, options.dir);

  let data: ModelCard;

  if (options.ai) {
    data = await runAiAssist(yamlPath, options.repo ?? options.dir);
  } else if (await fileExists(yamlPath)) {
    logger.info(`Reading ${yamlPath}`);
    data = await readYaml(yamlPath);

    if (options.interactive !== false) {
      logger.info('Launching interactive prompts to fill missing fields...');
      data = await runAllPrompts(data);
    }
  } else {
    logger.info('No modelcard.yaml found. Starting interactive prompts...');
    data = await runAllPrompts(createDefaultModelCard());
  }

  // Validate
  const result = ModelCardSchema.safeParse(data);
  if (!result.success) {
    logger.warn('Validation warnings:');
    for (const issue of result.error.issues) {
      logger.dim(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    // Continue with best-effort data
  }

  // Save YAML
  await writeYaml(yamlPath, data);
  logger.success(`Saved ${yamlPath}`);

  // Render output
  await renderModelCard(data, format, outputPath);
  logger.success(`Generated ${outputPath}`);
}

async function runAiAssist(yamlPath: string, repoPath: string): Promise<ModelCard> {
  try {
    const { analyzeAndDraft } = await import('../ai/index.js');
    const existing = (await fileExists(yamlPath)) ? await readYaml(yamlPath) : undefined;
    return await analyzeAndDraft(repoPath, existing);
  } catch (err) {
    if (err instanceof Error && err.message.includes('Cannot find module')) {
      logger.error('AI-assist requires @anthropic-ai/sdk. Install it with:');
      logger.dim('  npm install @anthropic-ai/sdk');
      process.exit(1);
    }
    throw err;
  }
}

function normalizeFormat(format: string): OutputFormat {
  const map: Record<string, OutputFormat> = {
    markdown: 'markdown',
    md: 'markdown',
    json: 'json',
    html: 'html',
  };
  const normalized = map[format.toLowerCase()];
  if (!normalized) {
    logger.error(`Unknown format: ${format}. Use markdown, json, or html.`);
    process.exit(1);
  }
  return normalized;
}
