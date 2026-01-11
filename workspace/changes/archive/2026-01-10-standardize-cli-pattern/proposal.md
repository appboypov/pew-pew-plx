# Change: Standardize CLI Pattern

## Why

The PLX CLI has inconsistent command patterns across different operations. Some commands use `plx {noun} {verb}` (e.g., `plx change show`), others use `plx {verb}` with type flags (e.g., `plx list --specs`), and there are multiple ways to achieve the same outcome (e.g., `plx list`, `plx change list`, `plx show`). This inconsistency increases cognitive load and makes the CLI harder to learn.

## What Changes

- **Standardize `plx get` command** with singular/plural entity distinction:
  - `plx get task --id <id>` (singular: specific lookup)
  - `plx get tasks` (plural: list all)
  - `plx get tasks --parent-id <id>` (plural with filter)
  - Same pattern for `change`/`changes`, `spec`/`specs`, `review`/`reviews`
- **Add `--parent-type` flag** to `plx get tasks` for filtering by parent type (optional, searches all if omitted)
- **Merge `plx show` options into `plx get change`**: `--deltas-only`, `--requirements`, `--no-scenarios`, `-r <id>`
- **Deprecate commands**:
  - `plx list` (replaced by `plx get changes`, `plx get specs`, `plx get reviews`)
  - `plx show` (replaced by `plx get change`, `plx get spec`, `plx get review`)
  - `plx change` parent command (subcommands move to `plx get change`, `plx validate change`)
  - `plx spec` parent command (subcommands move to `plx get spec`, `plx validate spec`)
- **Standardize `plx validate`**:
  - `plx validate change --id <id>` (singular: specific validation)
  - `plx validate changes` (plural: validate all)
  - Same pattern for specs
- **Standardize `plx archive`**:
  - `plx archive change --id <id>`
  - `plx archive review --id <id>`
- **Standardize `plx review`**:
  - `plx review change --id <id>` (review a change)
  - `plx review spec --id <id>` (review a spec)
  - `plx review task --id <id>` (review a task)
  - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
- **Standardize `plx parse feedback`**:
  - `plx parse feedback "name" --parent-id <id> --parent-type change|spec|task`
  - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
- **Keep `plx view` unchanged** (interactive dashboard has different purpose)

## Impact

- Affected specs:
  - `cli-get-task` (extend with reviews, add `--parent-type`)
  - `cli-list` (deprecate, add deprecation warnings)
  - `cli-show` (deprecate, merge into get)
  - `cli-validate` (standardize to entity pattern)
  - `cli-archive` (standardize to entity pattern)
  - `cli-review` (standardize to entity pattern)
  - `cli-parse-feedback` (standardize to entity pattern)
  - `cli-change` (deprecate parent command)
  - `cli-spec` (deprecate parent command)
- Affected code:
  - `src/commands/get.ts` (primary extension)
  - `src/commands/validate.ts` (pattern standardization)
  - `src/commands/review.ts` (pattern standardization)
  - `src/commands/parse-feedback.ts` (pattern standardization)
  - `src/core/archive.ts` (pattern standardization)
  - `src/core/list.ts` (deprecation warnings)
  - `src/commands/show.ts` (deprecation warnings)
  - `src/commands/change.ts` (deprecation warnings)
  - `src/commands/spec.ts` (deprecation warnings)
  - `src/cli/index.ts` (command registration)
  - Shell completion registry
- **BREAKING**: Deprecated commands will show warnings but continue to work in this release
