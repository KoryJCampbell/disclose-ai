import { input, confirm, select } from '@inquirer/prompts';
import { logger } from '../utils/logger.js';
import type { Manage } from '../schema/types.js';

export async function promptManage(existing: Manage): Promise<Manage> {
  logger.heading('MANAGE — Risk Prioritization & Response');
  logger.dim('NIST AI RMF: Prioritize and act upon identified risks\n');

  // Limitations
  logger.nist('MANAGE 2.2', 'Known Limitations');
  const known_limitations = await promptList('Known limitation', existing.limitations.known_limitations);
  const failure_modes = await promptList('Failure mode', existing.limitations.failure_modes);
  const edge_cases = await promptList('Edge case', existing.limitations.edge_cases);

  // Mitigations
  logger.nist('MANAGE 2.1 / 2.3', 'Mitigation Strategies');
  const strategies = await promptStrategies(existing.mitigations.strategies);
  const human_oversight_plan = await input({
    message: 'Human oversight plan (optional):',
    default: existing.mitigations.human_oversight_plan || undefined,
  });

  // Monitoring
  logger.nist('MANAGE 4.1', 'Monitoring');
  const has_monitoring_plan = await confirm({
    message: 'Is there a post-deployment monitoring plan?',
    default: existing.monitoring.has_plan,
  });
  let monitoring_frequency: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | undefined;
  let alert_thresholds: Array<{ metric: string; threshold: string | number; action: string }> = [];
  let dashboard_url: string | undefined;

  if (has_monitoring_plan) {
    monitoring_frequency = await select({
      message: 'Monitoring frequency:',
      choices: [
        { value: 'real-time' as const, name: 'Real-time' },
        { value: 'daily' as const, name: 'Daily' },
        { value: 'weekly' as const, name: 'Weekly' },
        { value: 'monthly' as const, name: 'Monthly' },
        { value: 'quarterly' as const, name: 'Quarterly' },
      ],
      default: existing.monitoring.frequency ?? 'monthly',
    });
    alert_thresholds = await promptAlertThresholds(existing.monitoring.alert_thresholds);
    dashboard_url = await input({
      message: 'Monitoring dashboard URL (optional):',
      default: existing.monitoring.dashboard_url || undefined,
    });
  }

  // Lifecycle
  logger.nist('MANAGE 4.2 / 3.2', 'Lifecycle Management');
  const update_frequency = await input({
    message: 'Model update frequency (optional):',
    default: existing.lifecycle.update_frequency || undefined,
  });
  const retraining_triggers = await promptList('Retraining trigger', existing.lifecycle.retraining_triggers);
  const retirement_criteria = await promptList('Retirement criterion', existing.lifecycle.retirement_criteria);
  const versioning_strategy = await input({
    message: 'Versioning strategy (optional):',
    default: existing.lifecycle.versioning_strategy || undefined,
  });

  return {
    limitations: {
      known_limitations,
      failure_modes,
      edge_cases,
    },
    mitigations: {
      strategies,
      ...(human_oversight_plan ? { human_oversight_plan } : {}),
    },
    monitoring: {
      has_plan: has_monitoring_plan,
      ...(monitoring_frequency ? { frequency: monitoring_frequency } : {}),
      alert_thresholds,
      ...(dashboard_url ? { dashboard_url } : {}),
    },
    lifecycle: {
      ...(update_frequency ? { update_frequency } : {}),
      retraining_triggers,
      retirement_criteria,
      ...(versioning_strategy ? { versioning_strategy } : {}),
    },
  };
}

async function promptList(label: string, existing: string[]): Promise<string[]> {
  const items = [...existing];
  if (items.length > 0) {
    logger.dim(`  Existing: ${items.join(', ')}`);
  }
  let addMore = items.length === 0
    ? true
    : await confirm({ message: `Add more ${label.toLowerCase()}s?`, default: false });

  while (addMore) {
    const value = await input({ message: `  ${label} (empty to stop):` });
    if (!value) break;
    items.push(value);
    addMore = await confirm({ message: '  Add another?', default: true });
  }
  return items;
}

async function promptStrategies(
  existing: Array<{ risk: string; strategy: string; status: 'planned' | 'in_progress' | 'implemented' | 'verified'; responsible_party?: string }>,
): Promise<Array<{ risk: string; strategy: string; status: 'planned' | 'in_progress' | 'implemented' | 'verified'; responsible_party?: string }>> {
  const strategies = [...existing];
  if (strategies.length > 0) {
    logger.dim(`  Existing strategies: ${strategies.map(s => s.risk).join(', ')}`);
  }
  let addMore = strategies.length === 0
    ? true
    : await confirm({ message: 'Add more mitigation strategies?', default: false });

  while (addMore) {
    const risk = await input({ message: '  Risk being mitigated (empty to stop):' });
    if (!risk) break;
    const strategy = await input({ message: '  Mitigation strategy:' });
    const status = await select({
      message: '  Status:',
      choices: [
        { value: 'planned' as const, name: 'Planned' },
        { value: 'in_progress' as const, name: 'In Progress' },
        { value: 'implemented' as const, name: 'Implemented' },
        { value: 'verified' as const, name: 'Verified' },
      ],
    });
    const responsible_party = await input({ message: '  Responsible party (optional):' });
    strategies.push({
      risk,
      strategy,
      status,
      ...(responsible_party ? { responsible_party } : {}),
    });
    addMore = await confirm({ message: '  Add another strategy?', default: false });
  }
  return strategies;
}

async function promptAlertThresholds(
  existing: Array<{ metric: string; threshold: string | number; action: string }>,
): Promise<Array<{ metric: string; threshold: string | number; action: string }>> {
  const thresholds = [...existing];
  if (thresholds.length > 0) {
    logger.dim(`  Existing thresholds: ${thresholds.map(t => t.metric).join(', ')}`);
  }
  let addMore = thresholds.length === 0
    ? await confirm({ message: 'Add alert thresholds?', default: true })
    : await confirm({ message: 'Add more alert thresholds?', default: false });

  while (addMore) {
    const metric = await input({ message: '  Metric name (empty to stop):' });
    if (!metric) break;
    const thresholdStr = await input({ message: `  ${metric} threshold value:` });
    const threshold = isNaN(Number(thresholdStr)) ? thresholdStr : Number(thresholdStr);
    const action = await input({ message: '  Action when threshold breached:' });
    thresholds.push({ metric, threshold, action });
    addMore = await confirm({ message: '  Add another threshold?', default: false });
  }
  return thresholds;
}
