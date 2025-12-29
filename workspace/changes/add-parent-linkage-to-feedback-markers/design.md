# Design: Add Parent Linkage to Feedback Markers

## New Marker Format

### Syntax

```
#FEEDBACK #TODO | {type}:{id} | {feedback text}
```

Where `type` is one of: `task`, `change`, or `spec`.

### Examples

```typescript
// #FEEDBACK #TODO | task:001-implement | Add validation logic
// #FEEDBACK #TODO | change:add-auth | Missing error handling
// #FEEDBACK #TODO | spec:cli-design | Requirement unclear
// #FEEDBACK #TODO | Fix typo (no parent - requires CLI or interactive)
```

### Regex Pattern

```typescript
export const FEEDBACK_PATTERN =
  /#FEEDBACK\s+#TODO\s*\|\s*(?:(task|change|spec):([a-z0-9-]+)\s*\|\s*)?(.+?)\s*(?:-->|\*\/)?$/;
```

- Group 1: Parent type (optional): `task`, `change`, or `spec`
- Group 2: Parent ID (optional): kebab-case identifier
- Group 3: Feedback text (required)

## Interface Changes

### ParsedFeedbackMarker

```typescript
// Before
export interface ParsedFeedbackMarker {
  feedback: string;
  specImpact: string | null;
}

// After
export interface ParsedFeedbackMarker {
  feedback: string;
  parentType: 'task' | 'change' | 'spec' | null;
  parentId: string | null;
}
```

### FeedbackMarker

```typescript
// Before
export interface FeedbackMarker {
  file: string;
  line: number;
  feedback: string;
  specImpact: string | null;
  commentStyle: CommentStyle;
}

// After
export interface FeedbackMarker {
  file: string;
  line: number;
  feedback: string;
  parentType: 'task' | 'change' | 'spec' | null;
  parentId: string | null;
  commentStyle: CommentStyle;
}
```

### ReviewTaskSchema

```typescript
// Before
export const ReviewTaskSchema = z.object({
  status: z.enum(['to-do', 'in-progress', 'done']),
  specImpact: z.union([z.literal('none'), z.string()]).default('none'),
});

// After
export const ReviewTaskSchema = z.object({
  status: z.enum(['to-do', 'in-progress', 'done']),
});
```

## Grouping Logic

### New Types

```typescript
export interface GroupedMarkers {
  parentType: ReviewParent;
  parentId: string;
  markers: FeedbackMarker[];
}

export interface MarkerGroups {
  assigned: GroupedMarkers[];
  unassigned: FeedbackMarker[];
}
```

### Grouping Method

```typescript
groupMarkersByParent(markers: FeedbackMarker[]): MarkerGroups {
  const groups = new Map<string, GroupedMarkers>();
  const unassigned: FeedbackMarker[] = [];

  for (const marker of markers) {
    if (marker.parentType && marker.parentId) {
      const key = `${marker.parentType}:${marker.parentId}`;
      const existing = groups.get(key);
      if (existing) {
        existing.markers.push(marker);
      } else {
        groups.set(key, {
          parentType: marker.parentType,
          parentId: marker.parentId,
          markers: [marker],
        });
      }
    } else {
      unassigned.push(marker);
    }
  }

  return {
    assigned: Array.from(groups.values()),
    unassigned,
  };
}
```

## Parse Feedback Flow

```
1. Scan for markers
   ↓
2. Group markers by parent
   ↓
3. Handle unassigned markers:
   - If CLI flag (--change-id, --spec-id, --task-id) → assign to that parent
   - Else if interactive → prompt user to select parent
   - Else → fail with error
   ↓
4. Create reviews:
   - Single parent group → use reviewName as-is
   - Multiple groups → suffix names: {reviewName}-{parentType}-{index}
   ↓
5. Output summary
```

## Multi-Review Output

When markers have different parents:

```
$ plx parse feedback my-review

✓ Created 3 reviews:
  - my-review-change-1 (change:add-auth) - 5 tasks
  - my-review-task-2 (task:001-implement) - 2 tasks
  - my-review-spec-3 (spec:cli-design) - 1 task

Total: 8 markers found, 8 tasks created
```

## JSON Output

```json
{
  "reviews": [
    {
      "reviewId": "my-review-change-1",
      "parentType": "change",
      "parentId": "add-auth",
      "markersFound": 5,
      "tasksCreated": 5,
      "files": ["src/auth.ts", "src/login.ts"]
    }
  ],
  "totalMarkers": 8,
  "totalTasks": 8
}
```

## File Changes

| File | Changes |
|------|---------|
| `src/utils/comment-markers.ts` | New regex, updated interfaces and functions |
| `src/services/feedback-scanner.ts` | Updated interface, grouping method, remove specImpact |
| `src/core/schemas/review.schema.ts` | Remove specImpact from ReviewTaskSchema |
| `src/commands/parse-feedback.ts` | Grouping logic, multi-review, unassigned handling |
| `src/core/templates/plx-slash-command-templates.ts` | Updated review/parse-feedback instructions |
| `.claude/commands/plx/review.md` | Updated marker format documentation |
| Tests | Update for new format |
