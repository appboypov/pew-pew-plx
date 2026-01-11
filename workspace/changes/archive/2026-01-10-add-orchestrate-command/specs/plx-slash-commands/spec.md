# plx-slash-commands Delta

## ADDED Requirements

### Requirement: Orchestrate Command

The system SHALL provide a `plx/orchestrate` slash command that guides AI agents through sub-agent orchestration for completing multi-task work collaboratively.

#### Scenario: Generating orchestrate command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/orchestrate.md`
- **AND** include frontmatter with name "Pew Pew Plx: Orchestrate", description "Orchestrate sub-agents to complete work collaboratively", category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers

#### Scenario: Orchestrate command guardrails

- **WHEN** the orchestrate command is invoked
- **THEN** include guardrails for:
  - Spawning exactly one sub-agent per task (never parallelize task execution)
  - Reviewing each sub-agent's work before accepting it
  - Maintaining ongoing conversations with sub-agents
  - Acting as a senior team member guiding talented colleagues
  - Enforcing TracelessChanges (no comments referencing removed code, no "we don't do X" statements, no clarifications about previous states)
  - Verifying scope adherence (no unnecessary additions)
  - Verifying project convention alignment

#### Scenario: Orchestrate command steps

- **WHEN** the orchestrate command is invoked
- **THEN** include steps for:
  1. Understanding work scope (run `plx get tasks` for changes, identify review aspects for reviews, enumerate discrete units for other work)
  2. For each unit of work: get detailed context, spawn a sub-agent with clear instructions, wait for completion
  3. Reviewing sub-agent output for scope adherence, convention alignment, TracelessChanges compliance, and quality
  4. If issues found: provide specific feedback and request revision
  5. If approved: mark complete and proceed to next unit
  6. Continue until all work complete
  7. Final validation with `plx validate` if applicable

#### Scenario: Orchestrate command reference section

- **WHEN** the orchestrate command is generated
- **THEN** include reference section with:
  - `plx show <change-id>` for proposal context
  - `plx list` for changes and progress
  - `plx review` for review context
  - `plx parse feedback` for converting review feedback to tasks
