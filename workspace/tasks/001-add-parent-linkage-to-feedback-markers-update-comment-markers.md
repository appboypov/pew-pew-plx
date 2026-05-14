---
status: done
parent-type: change
parent-id: add-parent-linkage-to-feedback-markers
---
# Task: Update comment-markers.ts

## End Goal
Update the feedback marker regex and interfaces to support parent linkage syntax.

## Currently
- `FEEDBACK_PATTERN` regex matches `#FEEDBACK #TODO | {text} (spec:{id})`
- `ParsedFeedbackMarker` has `specImpact: string | null`
- `formatFeedbackMarker` accepts `specImpact?: string`

## Should
- `FEEDBACK_PATTERN` regex matches `#FEEDBACK #TODO | {type}:{id} | {text}` with optional parent prefix
- `ParsedFeedbackMarker` has `parentType: 'task' | 'change' | 'spec' | null` and `parentId: string | null`
- `formatFeedbackMarker` accepts `parent?: { type: 'task' | 'change' | 'spec'; id: string }`

## Constraints
- [x] Regex must handle all existing comment styles (C-style, Python, HTML, etc.)
- [x] Regex must correctly strip trailing block comment suffixes (`-->`, `*/`)
- [x] Parent linkage is optional - markers without parent must still parse

## Acceptance Criteria
- [x] New regex pattern correctly parses markers with parent linkage
- [x] New regex pattern correctly parses markers without parent linkage
- [x] `parseFeedbackMarker` returns `parentType` and `parentId` instead of `specImpact`
- [x] `formatFeedbackMarker` formats markers with optional parent prefix

## Implementation Checklist
- [x] Update `FEEDBACK_PATTERN` regex
- [x] Update `ParsedFeedbackMarker` interface
- [x] Update `parseFeedbackMarker()` function
- [x] Update `formatFeedbackMarker()` function signature and implementation

## Notes
File: `src/utils/comment-markers.ts`
