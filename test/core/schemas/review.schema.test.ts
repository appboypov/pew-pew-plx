import { describe, it, expect } from 'vitest';
import {
  ReviewParentType,
  ReviewSchema,
  ReviewTaskSchema,
} from '../../../src/core/schemas/review.schema.js';

describe('review.schema', () => {
  describe('ReviewParentType', () => {
    it('accepts "change" as valid', () => {
      const result = ReviewParentType.safeParse('change');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('change');
      }
    });

    it('accepts "spec" as valid', () => {
      const result = ReviewParentType.safeParse('spec');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('spec');
      }
    });

    it('accepts "task" as valid', () => {
      const result = ReviewParentType.safeParse('task');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('task');
      }
    });

    it('rejects invalid parent types', () => {
      expect(ReviewParentType.safeParse('invalid').success).toBe(false);
      expect(ReviewParentType.safeParse('review').success).toBe(false);
      expect(ReviewParentType.safeParse('').success).toBe(false);
      expect(ReviewParentType.safeParse(null).success).toBe(false);
      expect(ReviewParentType.safeParse(undefined).success).toBe(false);
    });
  });

  describe('ReviewSchema', () => {
    const validReview = {
      parentType: 'change',
      parentId: 'add-feature-x',
      reviewedAt: '2025-01-15T10:30:00Z',
    };

    it('accepts valid review object', () => {
      const result = ReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.parentType).toBe('change');
        expect(result.data.parentId).toBe('add-feature-x');
        expect(result.data.reviewedAt).toBe('2025-01-15T10:30:00Z');
      }
    });

    it('accepts review with trackedIssues', () => {
      const reviewWithIssues = {
        ...validReview,
        trackedIssues: [
          {
            tracker: 'linear',
            id: 'PLX-123',
            url: 'https://linear.app/team/issue/PLX-123',
          },
        ],
      };
      const result = ReviewSchema.safeParse(reviewWithIssues);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trackedIssues).toHaveLength(1);
        expect(result.data.trackedIssues![0].tracker).toBe('linear');
      }
    });

    it('accepts review without trackedIssues', () => {
      const result = ReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.trackedIssues).toBeUndefined();
      }
    });

    it('accepts all parent types', () => {
      for (const parentType of ['change', 'spec', 'task']) {
        const result = ReviewSchema.safeParse({
          ...validReview,
          parentType,
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid parentType', () => {
      const result = ReviewSchema.safeParse({
        ...validReview,
        parentType: 'invalid',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing parentId', () => {
      const { parentId, ...incomplete } = validReview;
      const result = ReviewSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it('rejects missing reviewedAt', () => {
      const { reviewedAt, ...incomplete } = validReview;
      const result = ReviewSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it('rejects invalid datetime format', () => {
      const result = ReviewSchema.safeParse({
        ...validReview,
        reviewedAt: 'not-a-date',
      });
      expect(result.success).toBe(false);
    });

    it('rejects datetime with timezone offset (only Z suffix accepted)', () => {
      const result = ReviewSchema.safeParse({
        ...validReview,
        reviewedAt: '2025-01-15T10:30:00+05:00',
      });
      // Zod .datetime() without { offset: true } only accepts Z suffix
      expect(result.success).toBe(false);
    });

    it('accepts datetime with milliseconds', () => {
      const result = ReviewSchema.safeParse({
        ...validReview,
        reviewedAt: '2025-01-15T10:30:00.123Z',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('ReviewTaskSchema', () => {
    it('accepts valid task with to-do status', () => {
      const result = ReviewTaskSchema.safeParse({ status: 'to-do' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('to-do');
      }
    });

    it('accepts valid task with in-progress status', () => {
      const result = ReviewTaskSchema.safeParse({ status: 'in-progress' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('in-progress');
      }
    });

    it('accepts valid task with done status', () => {
      const result = ReviewTaskSchema.safeParse({ status: 'done' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('done');
      }
    });

    it('rejects invalid status', () => {
      expect(ReviewTaskSchema.safeParse({ status: 'pending' }).success).toBe(false);
      expect(ReviewTaskSchema.safeParse({ status: 'completed' }).success).toBe(false);
      expect(ReviewTaskSchema.safeParse({ status: '' }).success).toBe(false);
    });

    it('rejects missing status', () => {
      const result = ReviewTaskSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('strips unknown fields', () => {
      const result = ReviewTaskSchema.safeParse({
        status: 'to-do',
        unknownField: 'value',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ status: 'to-do' });
        expect((result.data as Record<string, unknown>).unknownField).toBeUndefined();
      }
    });
  });
});
