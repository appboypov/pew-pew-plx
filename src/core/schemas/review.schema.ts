import { z } from 'zod';
import { TrackedIssueSchema } from './change.schema.js';

export const ReviewParentType = z.enum(['change', 'spec', 'task']);

export const ReviewSchema = z.object({
  parentType: ReviewParentType,
  parentId: z.string(),
  reviewedAt: z.string().datetime(),
  trackedIssues: z.array(TrackedIssueSchema).optional(),
});

export const ReviewTaskSchema = z.object({
  status: z.enum(['to-do', 'in-progress', 'done']),
});

export type ReviewParent = z.infer<typeof ReviewParentType>;
export type Review = z.infer<typeof ReviewSchema>;
export type ReviewTask = z.infer<typeof ReviewTaskSchema>;
