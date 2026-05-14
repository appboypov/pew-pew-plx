# Change: Fix Review Task Retrieval and List Command Path Resolution

## Why

After running `splx parse feedback <review-name> --change-id <change-id>`, review tasks are created in `workspace/reviews/<review-id>/tasks/` but cannot be retrieved via `splx get tasks --id <review-id>` or `splx get task --id <review-id>/<task-id>`. The `ItemRetrievalService` only searches `workspace/changes`, ignoring reviews entirely. Additionally, `splx list` fails with "No PLX changes directory found" due to a path resolution bug.

## What Changes

- **ItemRetrievalService**: Extend to search both `workspace/changes` AND `workspace/reviews` for task retrieval
- **ListCommand**: Fix path resolution by using `path.resolve()` on the `targetPath` parameter
- **Task prioritization**: Include review tasks in `splx get task` workflow via `getAllOpenTasks()`

## Impact

- Affected specs: `cli-get-task` (modify Get Tasks Command requirement)
- Affected code:
  - `src/services/item-retrieval.ts` - Add `reviewsPath`, extend search methods
  - `src/core/list.ts` - Add `path.resolve(targetPath)`
  - `test/services/item-retrieval.test.ts` - Add review task retrieval tests
