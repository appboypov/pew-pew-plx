# Change: Simplify slash command names to title case of filename

## Why
The current command names include a redundant `OpenSplx: ` prefix (e.g., `OpenSplx: Refine Architecture`). Since commands are already grouped by `category: OpenSplx`, the prefix adds noise without value. Clean title case names improve readability in command previews.

## What Changes
- Remove `OpenSplx: ` prefix from all command names in frontmatter
- Names become title case of filename: `refine-architecture.md` → `Refine Architecture`
- Category and tags remain unchanged (still grouped under `OpenSplx`)

**Before:**
```yaml
name: OpenSplx: Refine Architecture
```

**After:**
```yaml
name: Refine Architecture
```

## Impact
- Affected specs: splx-slash-commands
- Affected code: `src/core/configurators/slash/` (claude.ts, codebuddy.ts, crush.ts, qoder.ts)
- All 18 commands across 4 configurators with explicit frontmatter names
