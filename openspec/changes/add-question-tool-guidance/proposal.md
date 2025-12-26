---
tracked-issues:
  - tracker: linear
    id: PLX-8
    url: https://linear.app/de-app-specialist/issue/PLX-8/improve-question-handling-to-use-available-question-tools-instead-of
---

# Change: Add question tool guidance

## Why

AI assistants currently ask clarification questions in chat instead of using their available question tools. This reduces tracking, workflow integration, and consistency across different AI tool integrations.

## What Changes

- Add a requirement to `docs-agent-instructions` spec for using question tools when gathering clarifications
- Update AGENTS.md template to include question tool guidance at relevant points
- Update slash command templates to include a base guardrail about question tool usage

## Impact

- Affected specs: docs-agent-instructions
- Affected code: `src/core/templates/agents-template.ts`, `src/core/templates/slash-command-templates.ts`
