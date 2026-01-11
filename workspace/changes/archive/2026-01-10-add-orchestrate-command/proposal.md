# Change: Add Orchestrate Command

## Why

When implementing multi-task changes, users need a structured way to delegate work to sub-agents while maintaining quality control. The current `implement` command is sequential but doesn't explicitly guide sub-agent orchestration. Users have been adding inline instructions for orchestration, indicating a need for a dedicated command.

## What Changes

- **NEW** `plx/orchestrate` slash command for sub-agent orchestration
- **MODIFIED** `plx-slash-commands` spec to add orchestrate command requirement

## Impact

- Affected specs: `plx-slash-commands`
