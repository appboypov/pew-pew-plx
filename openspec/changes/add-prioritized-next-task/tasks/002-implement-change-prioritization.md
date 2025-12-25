# Task: Implement change prioritization

## End Goal

Create utilities for selecting the highest-priority change based on completion percentage and age.

## Currently

`getTaskProgressForChange` returns `{ total, completed }` but no completion percentage calculation exists. No mechanism to compare changes by priority or age.

## Should

New `src/utils/change-prioritization.ts` module provides:
- `getCompletionPercentage(progress: TaskProgress): number` - calculates 0-100 percentage
- `getChangeCreatedAt(changesDir: string, changeId: string): Promise<Date>` - gets proposal.md birthtime
- `getPrioritizedChange(changesDir: string): Promise<PrioritizedChange | null>` - selects highest priority change
- `PrioritizedChange` interface with id, completionPercentage, createdAt, taskProgress, hasInProgressTask

## Constraints

- [ ] Must integrate with existing `getTaskStructureForChange` from task-progress.ts
- [ ] Must fall back to mtime if birthtime unavailable
- [ ] Must handle empty changes directory gracefully

## Acceptance Criteria

- [ ] `getCompletionPercentage` returns 0 for 0/0 tasks
- [ ] `getCompletionPercentage` returns 50 for 1/2 tasks
- [ ] `getCompletionPercentage` returns 100 for 3/3 tasks
- [ ] `getPrioritizedChange` selects change with highest completion
- [ ] `getPrioritizedChange` selects oldest when completion tied
- [ ] `getPrioritizedChange` returns null for empty directory

## Implementation Checklist

- [x] 2.1 Create `src/utils/change-prioritization.ts` with interfaces
- [x] 2.2 Implement `getCompletionPercentage` function
- [x] 2.3 Implement `getChangeCreatedAt` using fs.stat birthtime
- [x] 2.4 Implement `getPrioritizedChange` with sorting logic
- [x] 2.5 Add detection of in-progress tasks across change files
- [x] 2.6 Export from `src/utils/index.ts`
- [x] 2.7 Add unit tests in `test/utils/change-prioritization.test.ts`

## Notes

For age comparison, use proposal.md `stat.birthtime`. If birthtime equals epoch (0), fall back to mtime.
