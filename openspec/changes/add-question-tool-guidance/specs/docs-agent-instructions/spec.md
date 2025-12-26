## ADDED Requirements

### Requirement: Question Tool Usage

`openspec/AGENTS.md` and slash command templates SHALL instruct AI assistants to use their available question tools for gathering clarifications instead of asking questions directly in chat.

#### Scenario: Base guardrail for question tool usage

- **WHEN** an AI assistant reads the slash command guardrails
- **THEN** find an instruction to use available question tools (if one exists) for gathering clarifications
- **AND** find a fallback instruction to ask in chat when no question tool is available

#### Scenario: AGENTS.md references question tools

- **WHEN** an AI assistant reads the "Before Creating Specs" section in `openspec/AGENTS.md`
- **THEN** find guidance to use question tools when gathering clarifications for ambiguous requests
- **AND** find the same pattern in the error recovery section

#### Scenario: Generic tool-agnostic phrasing

- **WHEN** an AI assistant reads question tool guidance
- **THEN** find tool-agnostic phrasing like "your available question tool" rather than specific tool names
- **AND** understand the guidance applies regardless of which AI tool is being used
