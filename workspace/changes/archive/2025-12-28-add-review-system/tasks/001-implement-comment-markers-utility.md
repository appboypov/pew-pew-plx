---
status: done
---

# Task: Implement Comment Markers Utility

## End Goal

A utility module that provides language-aware comment marker detection and formatting for feedback markers across all supported file types.

## Currently

No utility exists for working with language-specific comment syntax.

## Should

Create `/src/utils/comment-markers.ts` with:
- `COMMENT_STYLES` constant mapping extensions to comment prefixes/suffixes
- `getCommentStyle(filepath)` function returning { prefix, suffix? }
- `formatFeedbackMarker(filepath, feedback, specImpact?)` function
- `parseFeedbackMarker(line)` function returning parsed marker or null
- `FEEDBACK_PATTERN` regex for matching markers

## Constraints

- Must support all file extensions defined in design.md
- Must handle both single-line and block comment styles
- Must parse spec-impact suffix when present
- Must return null for non-matching lines (not throw)

## Acceptance Criteria

- [ ] Single-line comments work for JS/TS/C/Java/Go/Rust/Dart/Kotlin/Swift
- [ ] Hash comments work for Python/Ruby/Shell/YAML
- [ ] Double-dash comments work for SQL/Lua/Haskell
- [ ] Semicolon comments work for Lisp/Clojure/Emacs Lisp
- [ ] Block comments work for HTML/XML/Markdown
- [ ] Block comments work for CSS/SCSS/LESS
- [ ] Spec-impact suffix `(spec:id)` is parsed correctly
- [ ] Unknown extensions default to `//` prefix

## Implementation Checklist

- [x] Create `/src/utils/comment-markers.ts`
- [x] Define COMMENT_STYLES mapping
- [x] Implement getCommentStyle(filepath)
- [x] Implement formatFeedbackMarker(filepath, feedback, specImpact?)
- [x] Implement parseFeedbackMarker(line)
- [x] Export FEEDBACK_PATTERN regex
- [x] Add to `/src/utils/index.ts` exports

## Notes

File extensions mapping (from design.md):
- `//`: .js, .ts, .jsx, .tsx, .c, .cpp, .java, .swift, .go, .rs, .dart, .kt, .scala, .m
- `#`: .py, .rb, .sh, .bash, .zsh, .yaml, .yml, .toml, .pl, .r
- `--`: .sql, .lua, .hs
- `;`: .lisp, .clj, .el
- `<!-- -->`: .html, .xml, .svg, .md
- `/* */`: .css, .scss, .less
