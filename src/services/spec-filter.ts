import type { Spec } from '../core/schemas/index.js';

export interface SpecFilterOptions {
  requirements?: boolean;
  scenarios?: boolean;
  requirement?: string;
}

export class SpecFilterService {
  /**
   * Validate requirement index and convert to 0-based.
   * @param spec The spec to validate against
   * @param requirementOpt The 1-based requirement index string
   * @returns 0-based index, or undefined if no requirement specified
   * @throws Error if requirement index is invalid
   */
  private validateRequirementIndex(spec: Spec, requirementOpt?: string): number | undefined {
    if (!requirementOpt) return undefined;
    const index = Number.parseInt(requirementOpt, 10);
    if (!Number.isInteger(index) || index < 1 || index > spec.requirements.length) {
      throw new Error(`Requirement ${requirementOpt} not found`);
    }
    return index - 1;
  }

  /**
   * Filter spec content based on provided options.
   * @param spec The spec to filter
   * @param options Filtering options
   * @returns Filtered spec
   */
  filterSpec(spec: Spec, options: SpecFilterOptions): Spec {
    const requirementIndex = this.validateRequirementIndex(spec, options.requirement);
    const includeScenarios = options.scenarios !== false && !options.requirements;

    const filteredRequirements = (requirementIndex !== undefined
      ? [spec.requirements[requirementIndex]]
      : spec.requirements
    ).map(req => ({
      text: req.text,
      scenarios: includeScenarios ? req.scenarios : [],
    }));

    const metadata = spec.metadata ?? { version: '1.0.0', format: 'plx' as const };

    return {
      name: spec.name,
      overview: spec.overview,
      requirements: filteredRequirements,
      metadata,
    };
  }
}
