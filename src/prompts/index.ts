import chalk from 'chalk';
import { promptGovern } from './govern.js';
import { promptMap } from './map.js';
import { promptMeasure } from './measure.js';
import { promptManage } from './manage.js';
import type { ModelCard } from '../schema/types.js';

const SECTIONS = [
  { name: 'GOVERN', fn: 'govern' as const },
  { name: 'MAP', fn: 'map' as const },
  { name: 'MEASURE', fn: 'measure' as const },
  { name: 'MANAGE', fn: 'manage' as const },
] as const;

export async function runAllPrompts(data: ModelCard): Promise<ModelCard> {
  console.log(chalk.bold('\n  DiscloseAI — NIST AI RMF Disclosure Generator'));
  console.log(chalk.dim('  Walk through each section to document your AI system.\n'));

  const result = { ...data, metadata: { ...data.metadata, last_updated: new Date().toISOString().split('T')[0] } };

  for (let i = 0; i < SECTIONS.length; i++) {
    const section = SECTIONS[i];
    const progress = chalk.dim(`[${i + 1}/${SECTIONS.length}]`);
    console.log(`\n${progress} ${chalk.bold.cyan(`━━━ ${section.name} ━━━`)}\n`);

    switch (section.fn) {
      case 'govern':
        result.govern = await promptGovern(result.govern);
        break;
      case 'map':
        result.map = await promptMap(result.map);
        break;
      case 'measure':
        result.measure = await promptMeasure(result.measure);
        break;
      case 'manage':
        result.manage = await promptManage(result.manage);
        break;
    }
  }

  console.log(chalk.green('\n  ✓ All sections complete!\n'));
  return result;
}
