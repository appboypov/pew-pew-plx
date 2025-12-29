import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  getActiveReviewIds,
  getArchivedReviewIds,
} from '../../src/utils/item-discovery.js';

describe('item-discovery (reviews)', () => {
  let tempDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = path.join(os.tmpdir(), `item-discovery-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  async function createReview(reviewId: string): Promise<void> {
    const reviewDir = path.join(tempDir, 'workspace', 'reviews', reviewId);
    await fs.mkdir(reviewDir, { recursive: true });
    const content = `---
parent-type: change
parent-id: test-change
reviewed-at: ${new Date().toISOString()}
---

# Review: ${reviewId}
`;
    await fs.writeFile(path.join(reviewDir, 'review.md'), content);
  }

  async function createArchivedReview(reviewId: string): Promise<void> {
    const archiveDir = path.join(
      tempDir,
      'workspace',
      'reviews',
      'archive',
      reviewId
    );
    await fs.mkdir(archiveDir, { recursive: true });
    const content = `---
parent-type: change
parent-id: test-change
reviewed-at: ${new Date().toISOString()}
---

# Review: ${reviewId}
`;
    await fs.writeFile(path.join(archiveDir, 'review.md'), content);
  }

  describe('getActiveReviewIds', () => {
    it('returns empty array when reviews directory does not exist', async () => {
      const result = await getActiveReviewIds(tempDir);
      expect(result).toEqual([]);
    });

    it('returns empty array when reviews directory is empty', async () => {
      await fs.mkdir(path.join(tempDir, 'workspace', 'reviews'), {
        recursive: true,
      });
      const result = await getActiveReviewIds(tempDir);
      expect(result).toEqual([]);
    });

    it('returns single review id', async () => {
      await createReview('review-one');
      const result = await getActiveReviewIds(tempDir);
      expect(result).toEqual(['review-one']);
    });

    it('returns multiple review ids sorted', async () => {
      await createReview('zebra-review');
      await createReview('alpha-review');
      await createReview('beta-review');
      const result = await getActiveReviewIds(tempDir);
      expect(result).toEqual(['alpha-review', 'beta-review', 'zebra-review']);
    });

    it('excludes archive directory', async () => {
      await createReview('active-review');
      await createArchivedReview('archived-review');
      const result = await getActiveReviewIds(tempDir);
      expect(result).toEqual(['active-review']);
      expect(result).not.toContain('archived-review');
    });

    it('excludes directories without review.md', async () => {
      await createReview('valid-review');
      // Create a directory without review.md
      const invalidDir = path.join(tempDir, 'workspace', 'reviews', 'invalid-review');
      await fs.mkdir(invalidDir, { recursive: true });
      await fs.writeFile(path.join(invalidDir, 'other.md'), 'content');

      const result = await getActiveReviewIds(tempDir);
      expect(result).toEqual(['valid-review']);
    });

    it('excludes hidden directories', async () => {
      await createReview('visible-review');
      const hiddenDir = path.join(tempDir, 'workspace', 'reviews', '.hidden-review');
      await fs.mkdir(hiddenDir, { recursive: true });
      await fs.writeFile(path.join(hiddenDir, 'review.md'), 'content');

      const result = await getActiveReviewIds(tempDir);
      expect(result).toEqual(['visible-review']);
    });

    it('uses cwd when root is not specified', async () => {
      process.chdir(tempDir);
      await createReview('cwd-review');
      const result = await getActiveReviewIds();
      expect(result).toEqual(['cwd-review']);
    });
  });

  describe('getArchivedReviewIds', () => {
    it('returns empty array when archive directory does not exist', async () => {
      const result = await getArchivedReviewIds(tempDir);
      expect(result).toEqual([]);
    });

    it('returns empty array when archive directory is empty', async () => {
      await fs.mkdir(path.join(tempDir, 'workspace', 'reviews', 'archive'), {
        recursive: true,
      });
      const result = await getArchivedReviewIds(tempDir);
      expect(result).toEqual([]);
    });

    it('returns single archived review id', async () => {
      await createArchivedReview('2025-01-15-review-one');
      const result = await getArchivedReviewIds(tempDir);
      expect(result).toEqual(['2025-01-15-review-one']);
    });

    it('returns multiple archived review ids sorted', async () => {
      await createArchivedReview('2025-01-15-zebra');
      await createArchivedReview('2025-01-14-alpha');
      await createArchivedReview('2025-01-16-beta');
      const result = await getArchivedReviewIds(tempDir);
      expect(result).toEqual([
        '2025-01-14-alpha',
        '2025-01-15-zebra',
        '2025-01-16-beta',
      ]);
    });

    it('excludes directories without review.md', async () => {
      await createArchivedReview('2025-01-15-valid');
      // Create a directory without review.md
      const invalidDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'archive',
        '2025-01-15-invalid'
      );
      await fs.mkdir(invalidDir, { recursive: true });
      await fs.writeFile(path.join(invalidDir, 'other.md'), 'content');

      const result = await getArchivedReviewIds(tempDir);
      expect(result).toEqual(['2025-01-15-valid']);
    });

    it('excludes hidden directories', async () => {
      await createArchivedReview('2025-01-15-visible');
      const hiddenDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'archive',
        '.2025-01-15-hidden'
      );
      await fs.mkdir(hiddenDir, { recursive: true });
      await fs.writeFile(path.join(hiddenDir, 'review.md'), 'content');

      const result = await getArchivedReviewIds(tempDir);
      expect(result).toEqual(['2025-01-15-visible']);
    });

    it('uses cwd when root is not specified', async () => {
      process.chdir(tempDir);
      await createArchivedReview('2025-01-15-cwd-review');
      const result = await getArchivedReviewIds();
      expect(result).toEqual(['2025-01-15-cwd-review']);
    });
  });
});
