import { input, confirm, select } from '@inquirer/prompts';
import { logger } from '../utils/logger.js';
import type { Measure } from '../schema/types.js';

export async function promptMeasure(existing: Measure): Promise<Measure> {
  logger.heading('MEASURE — Risk Assessment & Analysis');
  logger.dim('NIST AI RMF: Assess, analyze, and track identified risks\n');

  // Training Data
  logger.nist('MEASURE 2.6-2.7', 'Training Data');
  const training_description = await input({
    message: 'Describe the training data:',
    default: existing.training_data.description || undefined,
  });
  const training_sources = await promptDataSources('training', existing.training_data.sources);
  const known_biases = await promptList('Known bias in training data', existing.training_data.known_biases);
  const pii_present = await confirm({
    message: 'Does the training data contain PII?',
    default: existing.training_data.pii_present,
  });
  const preprocessing = await input({
    message: 'Data preprocessing steps (optional):',
    default: existing.training_data.preprocessing || undefined,
  });

  // Evaluation Data
  logger.nist('MEASURE 2.6', 'Evaluation Data');
  const eval_description = await input({
    message: 'Describe the evaluation/test data:',
    default: existing.evaluation_data.description || undefined,
  });
  const eval_methodology = await input({
    message: 'Evaluation methodology (optional):',
    default: existing.evaluation_data.methodology || undefined,
  });
  const test_set_size = await input({
    message: 'Test set size (optional):',
    default: existing.evaluation_data.test_set_size || undefined,
  });

  // Performance Metrics
  logger.nist('MEASURE 2.5', 'Performance Metrics');
  const metrics = await promptMetrics(existing.performance_metrics.metrics);
  const primary_metric = await input({
    message: 'Primary metric name:',
    default: existing.performance_metrics.primary_metric || metrics[0]?.name || undefined,
  });
  const wantDisaggregated = await confirm({
    message: 'Do you have disaggregated results (by demographic/subgroup)?',
    default: existing.performance_metrics.disaggregated_results.length > 0,
  });
  const disaggregated_results = wantDisaggregated
    ? await promptDisaggregated(existing.performance_metrics.disaggregated_results)
    : existing.performance_metrics.disaggregated_results;

  // Bias Evaluation
  logger.nist('MEASURE 2.11', 'Bias & Fairness');
  const bias_conducted = await confirm({
    message: 'Has a bias evaluation been conducted?',
    default: existing.bias_evaluation.conducted,
  });
  let bias_methodology: string | undefined;
  let protected_attributes: string[] = [];
  let fairness_metrics: Array<{ name: string; value: string | number; description?: string }> = [];
  let bias_findings: string | undefined;

  if (bias_conducted) {
    bias_methodology = await input({
      message: 'Bias evaluation methodology:',
      default: existing.bias_evaluation.methodology || undefined,
    });
    protected_attributes = await promptList('Protected attribute evaluated', existing.bias_evaluation.protected_attributes);
    fairness_metrics = await promptMetrics(existing.bias_evaluation.fairness_metrics);
    bias_findings = await input({
      message: 'Key findings (optional):',
      default: existing.bias_evaluation.findings || undefined,
    });
  }

  // Robustness
  logger.nist('MEASURE 2.7-2.8', 'Robustness & Security');
  const adversarial_testing = await confirm({
    message: 'Has adversarial testing been conducted?',
    default: existing.robustness.adversarial_testing,
  });
  const stress_testing = await confirm({
    message: 'Has stress testing been conducted?',
    default: existing.robustness.stress_testing,
  });
  const data_drift_monitoring = await confirm({
    message: 'Is data drift monitoring in place?',
    default: existing.robustness.data_drift_monitoring,
  });
  const robustness_findings = await input({
    message: 'Robustness findings (optional):',
    default: existing.robustness.findings || undefined,
  });

  return {
    training_data: {
      description: training_description,
      sources: training_sources,
      known_biases,
      pii_present,
      ...(preprocessing ? { preprocessing } : {}),
    },
    evaluation_data: {
      description: eval_description,
      ...(eval_methodology ? { methodology: eval_methodology } : {}),
      ...(test_set_size ? { test_set_size } : {}),
    },
    performance_metrics: {
      metrics,
      primary_metric,
      disaggregated_results,
    },
    bias_evaluation: {
      conducted: bias_conducted,
      ...(bias_methodology ? { methodology: bias_methodology } : {}),
      protected_attributes,
      fairness_metrics,
      ...(bias_findings ? { findings: bias_findings } : {}),
    },
    robustness: {
      adversarial_testing,
      stress_testing,
      data_drift_monitoring,
      ...(robustness_findings ? { findings: robustness_findings } : {}),
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
    addMore = await confirm({ message: `  Add another?`, default: true });
  }
  return items;
}

async function promptDataSources(
  label: string,
  existing: Array<{ name: string; description?: string; size?: string; license?: string; collection_method?: string }>,
): Promise<Array<{ name: string; description?: string; size?: string; license?: string; collection_method?: string }>> {
  const sources = [...existing];
  if (sources.length > 0) {
    logger.dim(`  Existing ${label} sources: ${sources.map(s => s.name).join(', ')}`);
  }
  let addMore = sources.length === 0
    ? true
    : await confirm({ message: `Add more ${label} data sources?`, default: false });

  while (addMore) {
    const name = await input({ message: `  Source name (empty to stop):` });
    if (!name) break;
    const description = await input({ message: `  Description (optional):` });
    const size = await input({ message: `  Size (optional):` });
    sources.push({
      name,
      ...(description ? { description } : {}),
      ...(size ? { size } : {}),
    });
    addMore = await confirm({ message: `  Add another source?`, default: false });
  }
  return sources;
}

async function promptMetrics(
  existing: Array<{ name: string; value: string | number; description?: string; threshold?: string | number; confidence_interval?: string }>,
): Promise<Array<{ name: string; value: string | number; description?: string; threshold?: string | number; confidence_interval?: string }>> {
  const metrics = [...existing];
  if (metrics.length > 0) {
    logger.dim(`  Existing metrics: ${metrics.map(m => `${m.name}=${m.value}`).join(', ')}`);
  }
  let addMore = metrics.length === 0 || (metrics.length === 1 && !metrics[0].name)
    ? true
    : await confirm({ message: 'Add more metrics?', default: false });

  // Clear placeholder metric
  if (metrics.length === 1 && !metrics[0].name) {
    metrics.length = 0;
  }

  while (addMore) {
    const name = await input({ message: '  Metric name (empty to stop):' });
    if (!name) break;
    const valueStr = await input({ message: `  ${name} value:` });
    const value = isNaN(Number(valueStr)) ? valueStr : Number(valueStr);
    const threshold = await input({ message: '  Threshold (optional):' });
    metrics.push({
      name,
      value,
      ...(threshold ? { threshold: isNaN(Number(threshold)) ? threshold : Number(threshold) } : {}),
    });
    addMore = await confirm({ message: '  Add another metric?', default: true });
  }
  return metrics;
}

async function promptDisaggregated(
  existing: Array<{ group: string; metrics: Array<{ name: string; value: string | number }> }>,
): Promise<Array<{ group: string; metrics: Array<{ name: string; value: string | number }> }>> {
  const results = [...existing];
  let addMore = results.length === 0
    ? true
    : await confirm({ message: 'Add more disaggregated result groups?', default: false });

  while (addMore) {
    const group = await input({ message: '  Group name (e.g., demographic, empty to stop):' });
    if (!group) break;
    const groupMetrics = await promptMetrics([]);
    results.push({ group, metrics: groupMetrics });
    addMore = await confirm({ message: '  Add another group?', default: false });
  }
  return results;
}
