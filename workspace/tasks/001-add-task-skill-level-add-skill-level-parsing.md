---
status: done
skill-level: medior
parent-type: change
parent-id: add-task-skill-level
---
# Task: Add Skill Level Parsing

## End Goal

Task files support an optional `skill-level` field in YAML frontmatter that can be parsed and used throughout the system.

## Currently

Task frontmatter only supports a `status` field. There is no mechanism to indicate task complexity or required expertise level.

## Should

- `src/utils/task-status.ts` extended with skill level parsing functions
- New type `SkillLevel = 'junior' | 'medior' | 'senior'`
- Function `parseSkillLevel(content: string): SkillLevel | undefined`
- Function `getTaskSkillLevel(filePath: string): Promise<SkillLevel | undefined>`

## Constraints

- [ ] Skill level is optional—missing field returns undefined, not an error
- [ ] Invalid values (not junior/medior/senior) return undefined
- [ ] Parsing uses same YAML frontmatter pattern as status parsing

## Acceptance Criteria

- [ ] `parseSkillLevel` correctly extracts skill level from content
- [ ] `getTaskSkillLevel` reads file and returns skill level
- [ ] Invalid or missing skill levels return undefined gracefully

## Implementation Checklist

- [x] Add `SkillLevel` type export to `src/utils/task-status.ts`
- [x] Add `SKILL_LEVEL_LINE_REGEX` constant for parsing
- [x] Implement `parseSkillLevel(content: string)` function
- [x] Implement `getTaskSkillLevel(filePath: string)` async function
- [x] Export new functions from the module

## Notes

Follow the existing pattern from `parseStatus` and `getTaskStatus` functions.
