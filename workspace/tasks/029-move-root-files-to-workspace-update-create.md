---
status: done
skill-level: junior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update create command for PROGRESS.md path

## End Goal
`splx create progress` creates PROGRESS.md in `workspace/` instead of project root.

## Currently
`src/commands/create.ts` line 521:
```typescript
const projectRoot = path.dirname(change.workspacePath);
const progressPath = path.join(projectRoot, 'PROGRESS.md');
```

## Should
`src/commands/create.ts`:
```typescript
const progressPath = path.join(change.workspacePath, 'PROGRESS.md');
```

## Constraints
- [ ] Only modify the path calculation
- [ ] Keep all other PROGRESS.md content generation unchanged

## Acceptance Criteria
- [ ] `splx create progress --change-id <id>` creates `workspace/PROGRESS.md`
- [ ] Existing PROGRESS.md content/format unchanged

## Implementation Checklist
- [x] 4.1 Update `createProgress()` in `src/commands/create.ts` to use `workspacePath`
- [x] 4.2 Update any tests that verify PROGRESS.md location

## Notes
CANCELLED: PROGRESS.md concept has been removed from the application. This task is no longer relevant.
