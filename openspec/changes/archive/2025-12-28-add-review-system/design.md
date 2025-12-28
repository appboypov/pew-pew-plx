# Design: Review System Architecture

## Overview

This design describes the review system architecture, focusing on:
1. Review entity structure and lifecycle
2. Feedback marker parsing and task generation
3. Review archiving with spec updates
4. Integration with existing CLI commands

## Review Entity Structure

### Directory Layout

```
openspec/reviews/
├── <review-id>/
│   ├── review.md           # Review metadata
│   ├── tasks/              # Generated feedback tasks
│   │   ├── 001-fix-bug.md
│   │   └── 002-add-validation.md
│   └── specs/              # Delta specs (optional)
│       └── cli-get-task/
│           └── spec.md     # ADDED/MODIFIED/REMOVED deltas
└── archive/
    └── YYYY-MM-DD-<review-id>/
```

### review.md Format

Reviews have a mandatory parent (change, spec, or task). Status is derived from tasks (like changes).

```yaml
---
parent-type: change | spec | task
parent-id: add-feature-x
reviewed-at: 2025-01-15T10:30:00Z
tracked-issues:
  - tracker: linear
    id: PLX-23
    url: https://linear.app/...
---

# Review: add-feature-x

## Summary
[Brief summary of findings]

## Scope
- Files reviewed: src/commands/*.ts, src/core/*.ts
- Specs referenced: cli-get-task, cli-archive

## Spec Impact Findings
- **cli-get-task**: Missing validation for empty input
- **cli-archive**: Unclear error message requirements
```

### Review Task Format

Tasks generated from feedback markers include a `spec-impact` field:

```yaml
---
status: to-do
spec-impact: cli-get-task | none
---

# Task: Add input validation

## Feedback
Missing validation for empty input (spec:cli-get-task)

## End Goal
Validate input before processing to prevent undefined behavior.

## Currently
No validation occurs when input is empty.

## Should
Validate that input is non-empty before processing.

## Constraints
- Must not break existing behavior for valid inputs

## Acceptance Criteria
- [ ] Empty input returns descriptive error

## Implementation Checklist
- [ ] Add validation check
- [ ] Add error message
- [ ] Add test case

## Notes
Generated from feedback marker at src/commands/get.ts:42
```

## Language-Aware Comment Markers

### Comment Style Mapping

| Extension | Comment Style | Example |
|-----------|--------------|---------|
| .js, .ts, .jsx, .tsx, .c, .cpp, .java, .swift, .go, .rs, .dart, .kt, .scala, .m | `//` | `// #FEEDBACK #TODO \| ...` |
| .py, .rb, .sh, .bash, .zsh, .yaml, .yml, .toml, .pl, .r | `#` | `# #FEEDBACK #TODO \| ...` |
| .sql, .lua, .hs | `--` | `-- #FEEDBACK #TODO \| ...` |
| .lisp, .clj, .el | `;` | `; #FEEDBACK #TODO \| ...` |
| .html, .xml, .svg, .md | `<!-- -->` | `<!-- #FEEDBACK #TODO \| ... -->` |
| .css, .scss, .less | `/* */` | `/* #FEEDBACK #TODO \| ... */` |

### Marker Format

Standard: `{comment-prefix} #FEEDBACK #TODO | {feedback text}`

With spec impact: `{comment-prefix} #FEEDBACK #TODO | {feedback text} (spec:{spec-id})`

### Parsing Rules

1. Match pattern: `#FEEDBACK\s+#TODO\s*\|\s*(.+?)(?:\s*\(spec:([a-z0-9-]+)\))?`
2. Extract `feedback` from group 1
3. Extract `specImpact` from group 2 (optional, defaults to `none`)
4. Track source file and line number

## Parse Feedback Command

### CLI Interface

```bash
plx parse feedback [review-name] [options]

Options:
  --change-id <id>  Link review to a change (required)
  --spec-id <id>    Link review to a spec (required)
  --task-id <id>    Link review to a task (required)
  --json            Output as JSON
```

One of `--change-id`, `--spec-id`, or `--task-id` is required (or prompted interactively).

### Execution Flow

```
1. Determine parent type and id (from options or interactive prompt)
2. If review-name not provided, prompt for name
3. Scan codebase for feedback markers (respect .gitignore)
4. Group markers by file
5. Create openspec/reviews/<review-name>/
6. Create review.md with parent linkage
7. Generate task files in tasks/ directory
8. Output summary (N markers found, N tasks created)
```

### Generated Review.md

```yaml
---
parent-type: change
parent-id: add-feature-x
reviewed-at: 2025-01-15T10:30:00Z
---

# Review: <review-name>

## Summary
Parsed N feedback markers from M files.

## Scope
- Files scanned: [list of files with markers]
- Specs referenced: [unique spec-ids from markers]

## Spec Impact Findings
[Auto-generated from markers with spec references]
```

## Review Archiving

### Pre-Archive Validation

1. Verify all tasks in `reviews/<id>/tasks/` have status: `done`
2. If `reviews/<id>/specs/` exists and has content:
   - Validate delta format using existing `parseDeltaSpec()` logic
   - Check for conflicts with current specs
3. Warn if incomplete tasks found, require confirmation

### Archive Flow

```
1. Verify all tasks in reviews/<id>/tasks/ have status: done
2. If specs/ directory exists with delta content:
   a. Display spec update confirmation (like change archive)
   b. Apply deltas using buildUpdatedSpec()
   c. Validate rebuilt specs
3. Create archive directory: reviews/archive/YYYY-MM-DD-<id>/
4. Move review directory to archive
5. Display success message with spec update summary
```

### Archive Options

- `--yes` / `-y`: Skip confirmation prompts
- `--skip-specs`: Skip spec updates, archive tasks only

## Integration Points

### CLI Index (src/cli/index.ts)

Add verb-first commands:
- `plx review --change-id <id>` - Output review context for a change
- `plx review --spec-id <id>` - Output review context for a spec
- `plx review --task-id <id>` - Output review context for a task
- `plx parse feedback [review-name] --change-id <id>` - Parse markers linked to a change

### List Command (src/core/list.ts)

Add `--reviews` mode that scans `openspec/reviews/` like changes.

### Archive Command (src/core/archive.ts)

Extend to detect entity type:
1. Check if ID exists in `openspec/changes/` → archive as change
2. Check if ID exists in `openspec/reviews/` → archive as review
3. If ambiguous, use `--type change|review` flag

### Item Discovery (src/utils/item-discovery.ts)

Add functions:
- `getActiveReviewIds(root?)`: Scan `openspec/reviews/` excluding archive
- `getArchivedReviewIds(root?)`: Scan `openspec/reviews/archive/`

### Feedback Scanner Service (src/services/feedback-scanner.ts)

New service with:
- `scanDirectory(dir)`: Find all feedback markers
- `generateReview(reviewId, markers)`: Create review entity
- `removeFeedbackMarkers(markers)`: Clean up after archive (optional)

### Comment Markers Utility (src/utils/comment-markers.ts)

New utility with:
- `getCommentStyle(filepath)`: Return comment prefix/suffix for file type
- `formatFeedbackMarker(filepath, feedback)`: Format marker for file type
- `parseFeedbackMarker(line)`: Parse marker from any comment style
- `FEEDBACK_PATTERN`: Regex for matching markers

## Slash Command Templates

### plx/review

```markdown
**Guardrails**
- Use CLI to retrieve review context
- Output feedback as language-aware markers
- For spec-impacting feedback, include spec reference

**Steps**
1. Run `plx review --change-id <id>` (or --spec-id, --task-id)
2. Read the output: REVIEW.md guidelines + parent documents
3. Review implementation against constraints/acceptance criteria
4. Insert feedback markers in relevant code
5. Summarize findings
6. Instruct to run `plx parse feedback <name> --change-id <id>`
```

### plx/refine-architecture

```markdown
**Guardrails**
- Focus on practical documentation
- Preserve user content

**Steps**
1. Check if ARCHITECTURE.md exists
2. If not: create from template
3. If exists: read and update
```

### plx/refine-review

```markdown
**Guardrails**
- Use REVIEW.md template structure
- Preserve existing guidelines

**Steps**
1. Check if REVIEW.md exists
2. If not: create from template
3. If exists: read and update
```

### plx/parse-feedback

```markdown
**Guardrails**
- Scan only tracked files
- Generate one task per marker
- Require parent linkage

**Steps**
1. Run `plx parse feedback <name> --change-id <id>`
2. Review generated tasks
3. Address feedback
4. Archive when complete
```

## REVIEW.md Template

Located at project root (like ARCHITECTURE.md).

```markdown
# Review Guidelines

## Purpose
This file defines how code reviews should be conducted in this project.
Customize sections to match your team's practices.

## Review Types
- Implementation Review: Verify code matches spec requirements
- Architecture Review: Assess structural decisions
- Security Review: Check for vulnerabilities

## Feedback Format
Reviews output feedback using inline markers:
`#FEEDBACK #TODO | {feedback}`

For spec-impacting feedback:
`#FEEDBACK #TODO | {feedback} (spec:<spec-id>)`

## Review Checklist
- [ ] Code follows project conventions
- [ ] Tests cover new functionality
- [ ] Documentation updated
```

## Schema Definitions

### ReviewSchema

```typescript
const ReviewParentType = z.enum(['change', 'spec', 'task']);

const ReviewSchema = z.object({
  parentType: ReviewParentType,
  parentId: z.string(),
  reviewedAt: z.string().datetime(),
  trackedIssues: z.array(TrackedIssueSchema).optional(),
});
```

Note: Reviews have no status field. Status is derived from tasks (like changes).

### ReviewTaskSchema

```typescript
const ReviewTaskSchema = z.object({
  status: z.enum(['to-do', 'in-progress', 'done']),
  specImpact: z.union([z.literal('none'), z.string()]).default('none'),
});
```

## File Changes Summary

### New Files

| File | Purpose |
|------|---------|
| `src/utils/comment-markers.ts` | Language-aware comment utilities |
| `src/core/templates/review-template.ts` | REVIEW.md template |
| `src/core/schemas/review.schema.ts` | Review entity schema |
| `src/services/feedback-scanner.ts` | Feedback marker scanning |
| `src/commands/parse-feedback.ts` | Parse feedback CLI command |
| `src/commands/review.ts` | Review context output CLI command |

### Modified Files

| File | Changes |
|------|---------|
| `src/core/templates/plx-slash-command-templates.ts` | Add 4 new command templates |
| `src/core/configurators/slash/plx-*.ts` | Add paths for new commands |
| `src/utils/item-discovery.ts` | Add review discovery functions |
| `src/core/templates/index.ts` | Export review template |
| `src/core/init.ts` | Create REVIEW.md if missing |
| `src/core/update.ts` | Create REVIEW.md if missing |
| `src/core/list.ts` | Add --reviews mode |
| `src/commands/show.ts` | Add review item type |
| `src/core/archive.ts` | Support review archiving |
| `src/cli/index.ts` | Register new commands |
