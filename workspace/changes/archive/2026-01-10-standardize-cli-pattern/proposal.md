# Change: Standardize CLI Pattern

## Why

The PLX CLI has inconsistent command patterns across different operations. Some commands use `splx {noun} {verb}` (e.g., `splx change show`), others use `splx {verb}` with type flags (e.g., `splx list --specs`), and there are multiple ways to achieve the same outcome (e.g., `splx list`, `splx change list`, `splx show`). This inconsistency increases cognitive load and makes the CLI harder to learn.

## What Changes

- **Standardize `splx get` command** with singular/plural entity distinction:
  - `splx get task --id <id>` (singular: specific lookup)
  - `splx get tasks` (plural: list all)
  - `splx get tasks --parent-id <id>` (plural with filter)
  - Same pattern for `change`/`changes`, `spec`/`specs`, `review`/`reviews`
- **Add `--parent-type` flag** to `splx get tasks` for filtering by parent type (optional, searches all if omitted)
- **Merge `splx show` options into `splx get change`**: `--deltas-only`, `--requirements`, `--no-scenarios`, `-r <id>`
- **Deprecate commands**:
  - `splx list` (replaced by `splx get changes`, `splx get specs`, `splx get reviews`)
  - `splx show` (replaced by `splx get change`, `splx get spec`, `splx get review`)
  - `splx change` parent command (subcommands move to `splx get change`, `splx validate change`)
  - `splx spec` parent command (subcommands move to `splx get spec`, `splx validate spec`)
- **Standardize `splx validate`**:
  - `splx validate change --id <id>` (singular: specific validation)
  - `splx validate changes` (plural: validate all)
  - Same pattern for specs
- **Standardize `splx archive`**:
  - `splx archive change --id <id>`
  - `splx archive review --id <id>`
- **Standardize `splx review`**:
  - `splx review change --id <id>` (review a change)
  - `splx review spec --id <id>` (review a spec)
  - `splx review task --id <id>` (review a task)
  - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
- **Standardize `splx parse feedback`**:
  - `splx parse feedback "name" --parent-id <id> --parent-type change|spec|task`
  - Deprecate `--change-id`, `--spec-id`, `--task-id` flags
- **Keep `splx view` unchanged** (interactive dashboard has different purpose)

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
