import { getActiveChangeIds, getSpecIds, getActiveReviewIds } from '../../utils/item-discovery.js';

/**
 * Cache entry for completion data
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Provides dynamic completion suggestions for PLX items (changes and specs).
 * Implements a 2-second cache to avoid excessive file system operations during
 * tab completion.
 */
export class CompletionProvider {
  private readonly cacheTTL: number;
  private changeCache: CacheEntry<string[]> | null = null;
  private specCache: CacheEntry<string[]> | null = null;
  private reviewCache: CacheEntry<string[]> | null = null;

  /**
   * Creates a new completion provider
   *
   * @param cacheTTLMs - Cache time-to-live in milliseconds (default: 2000ms)
   * @param projectRoot - Project root directory (default: process.cwd())
   */
  constructor(
    private readonly cacheTTLMs: number = 2000,
    private readonly projectRoot: string = process.cwd()
  ) {
    this.cacheTTL = cacheTTLMs;
  }

  /**
   * Get all active change IDs for completion
   *
   * @returns Array of change IDs
   */
  async getChangeIds(): Promise<string[]> {
    const now = Date.now();

    // Check if cache is valid
    if (this.changeCache && now - this.changeCache.timestamp < this.cacheTTL) {
      return this.changeCache.data;
    }

    // Fetch fresh data
    const changeIds = await getActiveChangeIds(this.projectRoot);

    // Update cache
    this.changeCache = {
      data: changeIds,
      timestamp: now,
    };

    return changeIds;
  }

  /**
   * Get all spec IDs for completion
   *
   * @returns Array of spec IDs
   */
  async getSpecIds(): Promise<string[]> {
    const now = Date.now();

    // Check if cache is valid
    if (this.specCache && now - this.specCache.timestamp < this.cacheTTL) {
      return this.specCache.data;
    }

    // Fetch fresh data
    const specIds = await getSpecIds(this.projectRoot);

    // Update cache
    this.specCache = {
      data: specIds,
      timestamp: now,
    };

    return specIds;
  }

  /**
   * Get all review IDs for completion
   *
   * @returns Array of review IDs
   */
  async getReviewIds(): Promise<string[]> {
    const now = Date.now();

    // Check if cache is valid
    if (this.reviewCache && now - this.reviewCache.timestamp < this.cacheTTL) {
      return this.reviewCache.data;
    }

    // Fetch fresh data
    const reviewIds = await getActiveReviewIds(this.projectRoot);

    // Update cache
    this.reviewCache = {
      data: reviewIds,
      timestamp: now,
    };

    return reviewIds;
  }

  /**
   * Get change, spec, and review IDs for completion
   *
   * @returns Object with changeIds, specIds, and reviewIds arrays
   */
  async getAllIds(): Promise<{ changeIds: string[]; specIds: string[]; reviewIds: string[] }> {
    const [changeIds, specIds, reviewIds] = await Promise.all([
      this.getChangeIds(),
      this.getSpecIds(),
      this.getReviewIds(),
    ]);

    return { changeIds, specIds, reviewIds };
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.changeCache = null;
    this.specCache = null;
    this.reviewCache = null;
  }

  /**
   * Get cache statistics for debugging
   *
   * @returns Cache status information
   */
  getCacheStats(): {
    changeCache: { valid: boolean; age?: number };
    specCache: { valid: boolean; age?: number };
    reviewCache: { valid: boolean; age?: number };
  } {
    const now = Date.now();

    return {
      changeCache: {
        valid: this.changeCache !== null && now - this.changeCache.timestamp < this.cacheTTL,
        age: this.changeCache ? now - this.changeCache.timestamp : undefined,
      },
      specCache: {
        valid: this.specCache !== null && now - this.specCache.timestamp < this.cacheTTL,
        age: this.specCache ? now - this.specCache.timestamp : undefined,
      },
      reviewCache: {
        valid: this.reviewCache !== null && now - this.reviewCache.timestamp < this.cacheTTL,
        age: this.reviewCache ? now - this.reviewCache.timestamp : undefined,
      },
    };
  }
}
