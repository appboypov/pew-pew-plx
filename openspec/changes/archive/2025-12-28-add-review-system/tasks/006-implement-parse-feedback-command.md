---
status: done
---

# Task: Implement Parse Feedback CLI Command

## End Goal

A CLI command `plx parse feedback [review-name]` that scans the codebase for feedback markers and generates a review entity.

## Currently

No parse feedback command exists.

## Should

Create `/src/commands/parse-feedback.ts` with `ParseFeedbackCommand` class:
- `execute(reviewName?, options?)`: Main command handler
- Uses FeedbackScannerService for scanning and generation
- Supports `--json` output option
- Prompts for review name if not provided

Register in `/src/cli/index.ts` under `plx parse feedback`.

## Constraints

- Must validate review name doesn't already exist
- Must use FeedbackScannerService
- Must handle "no markers found" case gracefully
- Must support --json output

## Acceptance Criteria

- [ ] `plx parse feedback my-review` creates review entity
- [ ] `plx parse feedback` prompts for review name
- [ ] Command fails if review already exists
- [ ] Command succeeds with no markers (displays message, no entity created)
- [ ] `--json` outputs JSON with markersFound, tasksCreated, etc.
- [ ] Text output shows summary and next steps

## Implementation Checklist

- [x] Create `/src/commands/parse-feedback.ts`
- [x] Implement ParseFeedbackCommand class
- [x] Implement execute(reviewName?, options?) method
- [x] Add interactive prompt for missing review name
- [x] Add validation for existing review name
- [x] Integrate FeedbackScannerService
- [x] Implement text output format
- [x] Implement JSON output format
- [x] Register in `/src/cli/index.ts`
- [x] Add `parse` command group with `feedback` subcommand

## Notes

CLI registration pattern:
```typescript
const parseCmd = program.command('parse').description('Parse project artifacts');
parseCmd.command('feedback [review-name]')
  .description('Scan codebase for feedback markers and generate review tasks')
  .option('--json', 'Output as JSON')
  .action(async (reviewName?: string, options?: { json?: boolean }) => {
    const command = new ParseFeedbackCommand();
    await command.execute(reviewName, options);
  });
```
