---
status: to-do
skill-level: junior
parent-type: change
parent-id: move-root-files-to-workspace
---

# Task: Update create command for PROGRESS.md path

## End Goal
`plx create progress` creates PROGRESS.md in `workspace/` instead of project root.

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
- [ ] `plx create progress --change-id <id>` creates `workspace/PROGRESS.md`
- [ ] Existing PROGRESS.md content/format unchanged

## Implementation Checklist
- [ ] 4.1 Update `createProgress()` in `src/commands/create.ts` to use `workspacePath`
- [ ] 4.2 Update any tests that verify PROGRESS.md location

## Notes
Simple path change, no logic changes needed.
