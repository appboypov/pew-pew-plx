# Add Parent Linkage to Feedback Markers

## Summary

Replace the `(spec:id)` spec-impact suffix in feedback markers with a unified parent linkage syntax. Each marker specifies which parent entity (task, change, or spec) it belongs to using `{type}:{id} |` prefix. This enables mixed-parent markers in a single scan with automatic grouping into separate reviews.

## Motivation

Current feedback markers use `(spec:id)` to indicate "spec impact" - which specs are affected by the feedback. The parent linkage (change/spec/task) is determined by CLI flags, not marker content. This creates a disconnect:
- The AI reviewer must remember to pass the correct `--change-id` or `--spec-id` flag
- All markers in a scan must share the same parent
- There's no way to create feedback for multiple parents in one review pass

## Approach

Change the marker format to include parent linkage directly in the marker:

**Current:** `#FEEDBACK #TODO | {feedback text} (spec:{spec-id})`
**New:** `#FEEDBACK #TODO | {type}:{id} | {feedback text}`

Where `type` is `task`, `change`, or `spec`.

### Key Changes

1. **New marker format** - Parent linkage in marker, not CLI
2. **Remove spec-impact** - The `specImpact` field is eliminated entirely
3. **Allow mixed parents** - Different markers can have different parent IDs
4. **Group by parent** - `parse-feedback` groups markers and creates separate reviews per parent
5. **Interactive fallback** - Markers without parent ID require CLI flag or interactive prompt

## Scope

- Modify `cli-parse-feedback` spec (delta)
- Update `comment-markers.ts`, `feedback-scanner.ts`, `parse-feedback.ts`
- Update `review.schema.ts` to remove `specImpact`
- Update slash command templates
- Update tests

## Non-Goals

- Backward compatibility with old `(spec:id)` format (breaking change)
- Changes to review archival flow
- Changes to review display commands
