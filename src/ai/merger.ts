import type { ModelCard } from '../schema/types.js';

/**
 * Merge AI-generated data with existing manual data.
 * Priority: manual > AI > defaults
 *
 * For strings: manual wins if non-empty
 * For arrays: union of both (manual first, deduplicated)
 * For booleans: manual wins if the overall section has any manual data
 * For objects: recursive merge
 */
export function mergeModelCards(manual: Partial<ModelCard> | undefined, ai: ModelCard): ModelCard {
  if (!manual) return ai;
  return deepMerge(ai, manual) as ModelCard;
}

function deepMerge(base: unknown, override: unknown): unknown {
  if (override === undefined || override === null) return base;
  if (base === undefined || base === null) return override;

  // Arrays: union
  if (Array.isArray(base) && Array.isArray(override)) {
    if (override.length > 0) return override;
    return base;
  }

  // Objects: recursive
  if (typeof base === 'object' && typeof override === 'object' && !Array.isArray(base)) {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
      result[key] = deepMerge(result[key], value);
    }
    return result;
  }

  // Strings: override wins if non-empty
  if (typeof override === 'string') {
    return override.length > 0 ? override : base;
  }

  // Primitives: override wins
  return override;
}
