import type { z } from 'zod';
import type {
  ModelCardSchema,
  MetadataSchema,
  GovernSchema,
  MapSchema,
  MeasureSchema,
  ManageSchema,
} from './modelcard.schema.js';

export type ModelCard = z.infer<typeof ModelCardSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type Govern = z.infer<typeof GovernSchema>;
export type MapSection = z.infer<typeof MapSchema>;
export type Measure = z.infer<typeof MeasureSchema>;
export type Manage = z.infer<typeof ManageSchema>;

export type ModelCardStatus = ModelCard['metadata']['status'];
export type Classification = ModelCard['metadata']['classification'];
export type InteractionMode = ModelCard['map']['intended_use']['interaction_mode'];
export type ReviewCadence = ModelCard['govern']['approval']['review_cadence'];
export type ATOStatus = ModelCard['map']['regulatory']['ato_status'];
export type Severity = NonNullable<ModelCard['map']['impact_assessment']['severity']>;
export type Likelihood = NonNullable<ModelCard['map']['impact_assessment']['likelihood']>;
export type MitigationStatus = ModelCard['manage']['mitigations']['strategies'][number]['status'];
export type MonitoringFrequency = NonNullable<ModelCard['manage']['monitoring']['frequency']>;

export type OutputFormat = 'markdown' | 'json' | 'html';
