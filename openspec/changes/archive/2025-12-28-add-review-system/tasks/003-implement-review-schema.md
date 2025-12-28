---
status: done
---

# Task: Implement Review Schema

## End Goal

Zod schemas for the Review entity that validate review.md frontmatter and review task frontmatter.

## Currently

No schemas exist for reviews. Only Change and Spec schemas exist.

## Should

Create `/src/core/schemas/review.schema.ts` with:
- `ReviewStatusType`: enum('active', 'archived')
- `ReviewTargetType`: enum('change', 'spec', 'task', 'feedback-scan')
- `ReviewSchema`: validates review.md frontmatter
- `ReviewTaskSchema`: extends TaskSchema with spec-impact field

## Constraints

- Must follow existing schema patterns in `/src/core/schemas/`
- Must import and reuse TrackedIssueSchema from change.schema.ts
- Must export all schemas and types

## Acceptance Criteria

- [ ] ReviewSchema validates status field as active or archived
- [ ] ReviewSchema validates targetType as change, spec, task, or feedback-scan
- [ ] ReviewSchema validates targetId as nullable string
- [ ] ReviewSchema validates reviewedAt as datetime string
- [ ] ReviewSchema validates archivedAt as nullable datetime
- [ ] ReviewSchema validates specUpdatesApplied as boolean
- [ ] ReviewSchema validates optional trackedIssues array
- [ ] ReviewTaskSchema validates spec-impact as 'none' or spec-id string

## Implementation Checklist

- [x] Create `/src/core/schemas/review.schema.ts`
- [x] Define ReviewStatusType
- [x] Define ReviewTargetType
- [x] Define ReviewSchema
- [x] Define ReviewTaskSchema
- [x] Export all schemas and inferred types
- [x] Update `/src/core/schemas/index.ts` exports

## Notes

Schema structure from design.md:
```typescript
const ReviewSchema = z.object({
  status: ReviewStatusType,
  targetType: ReviewTargetType,
  targetId: z.string().nullable(),
  reviewedAt: z.string().datetime(),
  archivedAt: z.string().datetime().nullable(),
  specUpdatesApplied: z.boolean(),
  trackedIssues: z.array(TrackedIssueSchema).optional(),
});

const ReviewTaskSchema = z.object({
  status: z.enum(['to-do', 'in-progress', 'done']),
  specImpact: z.union([z.literal('none'), z.string()]).default('none'),
});
```
