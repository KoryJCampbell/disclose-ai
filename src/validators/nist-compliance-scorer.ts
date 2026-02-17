import { NIST_FIELD_MAPPING, getUniqueSubcategories } from '../schema/nist-mapping.js';

export interface NistScore {
  overall: { covered: number; total: number; percent: number };
  byFunction: Array<{
    function: string;
    covered: number;
    total: number;
    percent: number;
    subcategories: Array<{ id: string; covered: boolean }>;
  }>;
  traceabilityMatrix: Array<{
    subcategoryId: string;
    description: string;
    fields: string[];
    covered: boolean;
  }>;
}

export function scoreNistCompliance(data: unknown): NistScore {
  const obj = data as Record<string, unknown>;
  const allSubcategories = getUniqueSubcategories();

  // For each subcategory, check if at least one mapped field is filled
  const traceabilityMatrix = allSubcategories.map(sub => {
    const fields = Object.entries(NIST_FIELD_MAPPING)
      .filter(([, s]) => s.id === sub.id)
      .map(([field]) => field);

    const covered = fields.some(field => isFieldFilled(obj, field));

    return {
      subcategoryId: sub.id,
      description: sub.description,
      fields,
      covered,
    };
  });

  // Group by function
  const functions = ['GOVERN', 'MAP', 'MEASURE', 'MANAGE'];
  const byFunction = functions.map(fn => {
    const subcats = traceabilityMatrix.filter(t => t.subcategoryId.startsWith(fn));
    const covered = subcats.filter(t => t.covered).length;
    return {
      function: fn,
      covered,
      total: subcats.length,
      percent: subcats.length > 0 ? Math.round((covered / subcats.length) * 100) : 0,
      subcategories: subcats.map(s => ({ id: s.subcategoryId, covered: s.covered })),
    };
  });

  const totalCovered = traceabilityMatrix.filter(t => t.covered).length;

  return {
    overall: {
      covered: totalCovered,
      total: traceabilityMatrix.length,
      percent: Math.round((totalCovered / traceabilityMatrix.length) * 100),
    },
    byFunction,
    traceabilityMatrix,
  };
}

function isFieldFilled(obj: Record<string, unknown>, path: string): boolean {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current == null || typeof current !== 'object') return false;
    current = (current as Record<string, unknown>)[part];
  }

  if (current == null) return false;
  if (typeof current === 'string') return current.length > 0;
  if (typeof current === 'boolean') return true;
  if (Array.isArray(current)) return current.length > 0;
  if (typeof current === 'number') return true;

  return true;
}
