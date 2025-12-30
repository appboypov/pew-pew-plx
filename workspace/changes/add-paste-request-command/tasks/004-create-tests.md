---
status: to-do
---

# Task: Create test files

## End Goal

Comprehensive tests for ClipboardUtils and PasteCommand.

## Currently

No tests exist for the new functionality.

## Should

- `test/utils/clipboard.test.ts` with mocked child_process tests
- `test/commands/paste.test.ts` with CLI integration tests

## Constraints

- [ ] Follow test patterns from `test/commands/complete.test.ts`
- [ ] Mock `child_process.execSync` for clipboard tests
- [ ] Use vitest for test framework

## Acceptance Criteria

- [ ] ClipboardUtils tests cover all OS paths
- [ ] PasteCommand tests verify file creation and JSON output
- [ ] All tests pass

## Implementation Checklist

- [ ] Create `test/utils/clipboard.test.ts`
- [ ] Test macOS clipboard reading (mock pbpaste)
- [ ] Test Windows clipboard reading (mock powershell)
- [ ] Test Linux clipboard reading (mock xclip)
- [ ] Test Linux xsel fallback
- [ ] Test empty clipboard error
- [ ] Test missing utility error on Linux
- [ ] Create `test/commands/paste.test.ts`
- [ ] Test successful paste to drafts
- [ ] Test overwriting existing request.md
- [ ] Test JSON output mode
- [ ] Test error handling

## Notes

Integration tests should use actual file system in temp directories, while ClipboardUtils tests should mock the child_process module.
