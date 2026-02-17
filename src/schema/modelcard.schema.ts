import { z } from 'zod';

// --- Metadata ---
export const MetadataSchema = z.object({
  card_version: z.string().default('1.0.0'),
  created_date: z.string().describe('ISO 8601 date string'),
  last_updated: z.string().optional(),
  status: z.enum(['draft', 'review', 'approved', 'retired']).default('draft'),
  classification: z.enum(['unclassified', 'cui', 'confidential', 'secret', 'top_secret']).default('unclassified'),
  schema_version: z.string().default('1.0.0'),
});

// --- Govern ---
const OwnershipSchema = z.object({
  organization: z.string().describe('Organization responsible for the AI system'),
  model_owner: z.string().describe('Individual responsible for the model'),
  email: z.string().email().describe('Contact email'),
  chief_ai_officer: z.string().optional().describe('Agency Chief AI Officer'),
  team: z.string().optional().describe('Team or division'),
});

const ApprovalSchema = z.object({
  authority: z.string().describe('Approval authority name/role'),
  date: z.string().optional().describe('Approval date'),
  review_cadence: z.enum(['monthly', 'quarterly', 'semi-annually', 'annually']).default('annually'),
  next_review: z.string().optional().describe('Next scheduled review date'),
});

const IncidentResponseSchema = z.object({
  has_plan: z.boolean().default(false),
  contact: z.string().optional().describe('Incident response contact'),
  escalation_path: z.string().optional().describe('Escalation path description'),
  reporting_url: z.string().optional().describe('Incident reporting URL'),
});

const SupplyChainComponentSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  provider: z.string().optional(),
  license: z.string().optional(),
  risk_assessment: z.string().optional(),
});

const SupplyChainSchema = z.object({
  third_party_components: z.array(SupplyChainComponentSchema).default([]),
  open_source_components: z.array(SupplyChainComponentSchema).default([]),
  data_providers: z.array(z.string()).default([]),
});

export const GovernSchema = z.object({
  ownership: OwnershipSchema,
  approval: ApprovalSchema,
  incident_response: IncidentResponseSchema,
  supply_chain: SupplyChainSchema,
});

// --- Map ---
const ModelOverviewSchema = z.object({
  name: z.string().describe('Model name'),
  version: z.string().describe('Model version'),
  type: z.string().describe('Model type (e.g., classification, NLP, computer vision)'),
  architecture: z.string().optional().describe('Model architecture (e.g., transformer, CNN, random forest)'),
  description: z.string().describe('High-level description of what the model does'),
  framework: z.string().optional().describe('ML framework (e.g., PyTorch, TensorFlow, scikit-learn)'),
  size: z.string().optional().describe('Model size (parameters, file size)'),
  input_format: z.string().optional().describe('Expected input format'),
  output_format: z.string().optional().describe('Output format'),
});

const IntendedUseSchema = z.object({
  use_cases: z.array(z.string()).min(1).describe('Primary intended use cases'),
  users: z.array(z.string()).min(1).describe('Intended users'),
  deployment_context: z.string().describe('Deployment context (e.g., production, research, internal)'),
  interaction_mode: z.enum(['autonomous', 'semi-autonomous', 'human-in-the-loop', 'decision-support']).describe('How humans interact with the system'),
});

const OutOfScopeSchema = z.object({
  excluded_uses: z.array(z.string()).default([]).describe('Explicitly excluded use cases'),
  misuse_risks: z.array(z.string()).default([]).describe('Known misuse risks'),
  geographic_limitations: z.string().optional().describe('Geographic scope limitations'),
});

const RegulatorySchema = z.object({
  laws: z.array(z.string()).default([]).describe('Applicable laws and regulations'),
  policies: z.array(z.string()).default([]).describe('Applicable agency policies'),
  ato_status: z.enum(['none', 'in_progress', 'granted', 'expired']).default('none').describe('Authority to Operate status'),
  rights_impacting: z.boolean().default(false).describe('Per OMB M-24-10: impacts rights or safety'),
  safety_impacting: z.boolean().default(false).describe('Per OMB M-24-10: impacts safety'),
});

const ImpactAssessmentSchema = z.object({
  affected_populations: z.array(z.string()).default([]).describe('Populations affected by the system'),
  benefits: z.array(z.string()).default([]).describe('Expected benefits'),
  harms: z.array(z.string()).default([]).describe('Potential harms'),
  severity: z.enum(['negligible', 'minor', 'moderate', 'significant', 'critical']).optional(),
  likelihood: z.enum(['rare', 'unlikely', 'possible', 'likely', 'almost_certain']).optional(),
});

export const MapSchema = z.object({
  model_overview: ModelOverviewSchema,
  intended_use: IntendedUseSchema,
  out_of_scope: OutOfScopeSchema,
  regulatory: RegulatorySchema,
  impact_assessment: ImpactAssessmentSchema,
});

// --- Measure ---
const DataSourceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  size: z.string().optional(),
  license: z.string().optional(),
  collection_method: z.string().optional(),
});

const TrainingDataSchema = z.object({
  description: z.string().describe('Description of training data'),
  sources: z.array(DataSourceSchema).default([]),
  known_biases: z.array(z.string()).default([]),
  pii_present: z.boolean().default(false).describe('Whether PII is present in training data'),
  preprocessing: z.string().optional().describe('Data preprocessing steps'),
});

const EvaluationDataSchema = z.object({
  description: z.string().describe('Description of evaluation data'),
  methodology: z.string().optional().describe('Evaluation methodology'),
  test_set_size: z.string().optional(),
});

const MetricSchema = z.object({
  name: z.string(),
  value: z.union([z.string(), z.number()]),
  description: z.string().optional(),
  threshold: z.union([z.string(), z.number()]).optional(),
  confidence_interval: z.string().optional(),
});

const DisaggregatedResultSchema = z.object({
  group: z.string().describe('Demographic or subgroup'),
  metrics: z.array(MetricSchema),
});

const PerformanceMetricsSchema = z.object({
  metrics: z.array(MetricSchema).min(1),
  primary_metric: z.string().describe('Primary metric name'),
  disaggregated_results: z.array(DisaggregatedResultSchema).default([]),
});

const BiasEvaluationSchema = z.object({
  conducted: z.boolean().default(false),
  methodology: z.string().optional(),
  protected_attributes: z.array(z.string()).default([]),
  fairness_metrics: z.array(MetricSchema).default([]),
  findings: z.string().optional(),
});

const RobustnessSchema = z.object({
  adversarial_testing: z.boolean().default(false),
  stress_testing: z.boolean().default(false),
  data_drift_monitoring: z.boolean().default(false),
  findings: z.string().optional(),
});

export const MeasureSchema = z.object({
  training_data: TrainingDataSchema,
  evaluation_data: EvaluationDataSchema,
  performance_metrics: PerformanceMetricsSchema,
  bias_evaluation: BiasEvaluationSchema,
  robustness: RobustnessSchema,
});

// --- Manage ---
const LimitationsSchema = z.object({
  known_limitations: z.array(z.string()).default([]),
  failure_modes: z.array(z.string()).default([]),
  edge_cases: z.array(z.string()).default([]),
});

const MitigationStrategySchema = z.object({
  risk: z.string(),
  strategy: z.string(),
  status: z.enum(['planned', 'in_progress', 'implemented', 'verified']).default('planned'),
  responsible_party: z.string().optional(),
});

const MitigationsSchema = z.object({
  strategies: z.array(MitigationStrategySchema).default([]),
  human_oversight_plan: z.string().optional(),
});

const AlertThresholdSchema = z.object({
  metric: z.string(),
  threshold: z.union([z.string(), z.number()]),
  action: z.string(),
});

const MonitoringSchema = z.object({
  has_plan: z.boolean().default(false),
  frequency: z.enum(['real-time', 'daily', 'weekly', 'monthly', 'quarterly']).optional(),
  alert_thresholds: z.array(AlertThresholdSchema).default([]),
  dashboard_url: z.string().optional(),
});

const LifecycleSchema = z.object({
  update_frequency: z.string().optional(),
  retraining_triggers: z.array(z.string()).default([]),
  retirement_criteria: z.array(z.string()).default([]),
  versioning_strategy: z.string().optional(),
});

export const ManageSchema = z.object({
  limitations: LimitationsSchema,
  mitigations: MitigationsSchema,
  monitoring: MonitoringSchema,
  lifecycle: LifecycleSchema,
});

// --- Full Model Card Schema ---
export const ModelCardSchema = z.object({
  metadata: MetadataSchema,
  govern: GovernSchema,
  map: MapSchema,
  measure: MeasureSchema,
  manage: ManageSchema,
});
