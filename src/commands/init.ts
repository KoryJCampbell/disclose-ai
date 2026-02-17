import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { input, confirm } from '@inquirer/prompts';
import { logger } from '../utils/logger.js';
import { fileExists, getTemplatesDir, resolveModelCardPath } from '../utils/files.js';
import { readYaml, writeYaml } from '../utils/yaml.js';
import type { ModelCard } from '../schema/types.js';

interface InitOptions {
  dir: string;
  quick?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const outputPath = resolveModelCardPath(options.dir);

  if (await fileExists(outputPath)) {
    const overwrite = await confirm({
      message: `${outputPath} already exists. Overwrite?`,
      default: false,
    });
    if (!overwrite) {
      logger.info('Cancelled.');
      return;
    }
  }

  const templatePath = resolve(getTemplatesDir(), 'disclosure.init.yaml');
  await copyFile(templatePath, outputPath);
  logger.success(`Created ${outputPath}`);

  if (options.quick) {
    await quickFill(outputPath);
  }

  logger.info('Next steps:');
  logger.dim('  1. Edit disclosure.yaml to fill in your AI system details');
  logger.dim('  2. Run `disclose-ai generate` to create your disclosure');
  logger.dim('  3. Run `disclose-ai validate` to check NIST coverage');
}

async function quickFill(filePath: string): Promise<void> {
  logger.heading('Quick Fill — Basic Information');

  const data = await readYaml(filePath) as ModelCard;

  data.map.model_overview.name = await input({ message: 'Model name:' });
  data.map.model_overview.version = await input({ message: 'Model version:', default: '1.0.0' });
  data.map.model_overview.type = await input({ message: 'Model type (e.g., classification, NLP):' });
  data.map.model_overview.description = await input({ message: 'Brief description:' });
  data.govern.ownership.organization = await input({ message: 'Organization:' });
  data.govern.ownership.model_owner = await input({ message: 'Model owner (name):' });
  data.govern.ownership.email = await input({ message: 'Contact email:' });

  await writeYaml(filePath, data);
  logger.success('Quick fill complete. Edit disclosure.yaml for full details.');
}
