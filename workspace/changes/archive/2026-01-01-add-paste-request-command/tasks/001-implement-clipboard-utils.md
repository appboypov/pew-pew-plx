---
status: to-do
---

# Task: Implement ClipboardUtils class

## End Goal

Cross-platform clipboard reading utility that works on macOS, Windows, and Linux without external npm dependencies.

## Currently

No clipboard reading capability exists in the codebase.

## Should

A `ClipboardUtils` class in `src/utils/clipboard.ts` that:
- Uses `pbpaste` on macOS
- Uses PowerShell `Get-Clipboard` on Windows
- Uses `xclip` with fallback to `xsel` on Linux
- Throws descriptive errors for empty clipboard or missing utilities

## Constraints

- [ ] Use `child_process.execSync` with `{ encoding: 'utf-8' }`
- [ ] No external npm dependencies
- [ ] Follow existing utility class patterns from `src/utils/file-system.ts`

## Acceptance Criteria

- [ ] ClipboardUtils.read() returns clipboard content on macOS
- [ ] Empty clipboard throws "Clipboard is empty" error
- [ ] Missing utilities on Linux throws descriptive error

## Implementation Checklist

- [ ] Create `src/utils/clipboard.ts` file
- [ ] Implement static `read()` method
- [ ] Implement private `readDarwin()` method for macOS
- [ ] Implement private `readWindows()` method for Windows
- [ ] Implement private `readLinux()` method with xclip/xsel fallback
- [ ] Add error handling for empty clipboard
- [ ] Add error handling for unsupported OS

## Notes

The utility should preserve the raw clipboard content without trimming, as users may intentionally have leading/trailing whitespace. Only trim when checking for empty clipboard.
