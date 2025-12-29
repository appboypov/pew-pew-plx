---
tracked-issues:
  - tracker: linear
    id: PLX-23
    url: https://linear.app/de-app-specialist/issue/PLX-23
---

# Add Review System

## Why

There is no dedicated workflow for validating implementations against specifications. Code reviews happen ad-hoc without structured feedback capture, and review findings are lost instead of being tracked as actionable tasks. The system needs a way to:

1. Review implementations against defined constraints, acceptance criteria, and requirements
2. Capture feedback inline in code using parseable markers
3. Generate trackable tasks from feedback
4. Apply spec updates when review findings reveal missing or incorrect requirements

## What Changes

### New Slash Commands

1. **plx/review** - Guides users through reviewing implementations against specs/changes/tasks
2. **plx/refine-architecture** - Combines init-architecture + update-architecture into single command
3. **plx/refine-review** - Creates/updates REVIEW.md template at project root
4. **plx/parse-feedback** - Instructs to run CLI command for parsing feedback markers

### New CLI Commands

1. **plx review --change-id <id>** - Output review context for a change
2. **plx review --spec-id <id>** - Output review context for a spec
3. **plx review --task-id <id>** - Output review context for a task
4. **plx parse feedback [review-name] --change-id <id>** - Scans codebase for feedback markers, generates review tasks linked to parent

### New Entity: Reviews

Reviews live in `workspace/reviews/` alongside changes and specs. Each review has a mandatory parent (change, spec, or task). Reviews have no status field - status is derived from tasks (like changes).

```
workspace/reviews/
├── <review-id>/
│   ├── review.md           # Review metadata (parent-type, parent-id, reviewed-at)
│   ├── tasks/              # Generated feedback tasks
│   │   ├── 001-*.md
│   │   └── 002-*.md
│   └── specs/              # Delta specs (if spec-impacting feedback)
│       └── <capability>/
│           └── spec.md
└── archive/
    └── YYYY-MM-DD-<review-id>/
```

### New Template: REVIEW.md

Created at project root during `plx init` or `plx update` (if not exists). Contains meta-instructions for writing project-specific review guidelines.

### Feedback Marker System

Language-aware inline markers:
- `// #FEEDBACK #TODO | {feedback}` for C-style languages
- `# #FEEDBACK #TODO | {feedback}` for Python/Ruby/Shell
- `-- #FEEDBACK #TODO | {feedback}` for SQL/Lua
- `<!-- #FEEDBACK #TODO | {feedback} -->` for HTML/XML/Markdown

For spec-impacting feedback: `// #FEEDBACK #TODO | {feedback} (spec:<spec-id>)`

### Review Archiving with Spec Updates

When archiving a review:
1. Verify all tasks complete
2. If `reviews/<id>/specs/` contains delta content, apply to main specs
3. Move to `reviews/archive/YYYY-MM-DD-<id>/`

## Deltas

### cli-review (NEW)

New spec for `plx review` CLI command:
- `plx review --change-id <id>` - Output review context for a change
- `plx review --spec-id <id>` - Output review context for a spec
- `plx review --task-id <id>` - Output review context for a task

### cli-parse-feedback (NEW)

New spec for `plx parse feedback` CLI command:
- Scan codebase for `#FEEDBACK #TODO |` markers
- Support language-aware comment detection
- Generate review entity with tasks
- Require parent linkage via `--change-id`, `--spec-id`, or `--task-id`

### cli-list (MODIFIED)

Add `--reviews` flag to list active reviews.

### cli-archive (MODIFIED)

Extend archive command to support review entity type alongside changes.

### plx-slash-commands (MODIFIED)

Add new PLX slash commands:
- `plx/review`
- `plx/refine-architecture`
- `plx/refine-review`
- `plx/parse-feedback`
