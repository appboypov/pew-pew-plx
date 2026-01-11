# Change: Simplify slash command names to title case of filename

## Why
The current command names include a redundant `Pew Pew Plx: ` prefix (e.g., `Pew Pew Plx: Refine Architecture`). Since commands are already grouped by `category: Pew Pew Plx`, the prefix adds noise without value. Clean title case names improve readability in command previews.

## What Changes
- Remove `Pew Pew Plx: ` prefix from all command names in frontmatter
- Names become title case of filename: `refine-architecture.md` → `Refine Architecture`
- Category and tags remain unchanged (still grouped under `Pew Pew Plx`)

**Before:**
```yaml
name: Pew Pew Plx: Refine Architecture
```

**After:**
```yaml
name: Refine Architecture
```

## Impact
- Affected specs: plx-slash-commands
- Affected code: `src/core/configurators/slash/` (claude.ts, codebuddy.ts, crush.ts, qoder.ts)
- All 18 commands across 4 configurators with explicit frontmatter names
