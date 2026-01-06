export interface TaskContext {
  title: string;
  skillLevel?: 'junior' | 'medior' | 'senior';
  parentType?: 'change' | 'review';
  parentId?: string;
}

export const taskTemplate = (context: TaskContext): string => `---
status: to-do${context.skillLevel ? `\nskill-level: ${context.skillLevel}` : ''}${context.parentType ? `\nparent-type: ${context.parentType}` : ''}${context.parentId ? `\nparent-id: ${context.parentId}` : ''}
---

# Task: ${context.title}

## End Goal
TBD - What this task accomplishes.

## Currently
TBD - Current state before this task.

## Should
TBD - Expected state after this task.

## Constraints
- [ ] TBD

## Acceptance Criteria
- [ ] TBD

## Implementation Checklist
- [ ] 1.1 TBD

## Notes
TBD - Additional context if needed.
`;
