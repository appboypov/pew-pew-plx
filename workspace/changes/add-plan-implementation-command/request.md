# Request: Add plan-implementation Command

## Source Input

User wants to introduce a `plan-implementation` command that:

1. Outputs a PROGRESS.md file (similar to `/log-progress` command structure)
2. Shows each task as a markdown checklist with:
   - The entire task content embedded
   - Instructions for an agent to pick up that specific task
3. Instructions must NOT mention PROGRESS.md (this is for orchestrating/reviewing/verifying agent only)
4. Agent must be clearly instructed to ONLY focus on that task and use `plx` CLI to complete it when done
5. After task completion, user tells orchestrator "it's done"
6. Orchestrator verifies completeness, scope adherence, instruction adherence
7. If feedback arises, orchestrator updates the progress task with a "subtask" - a direct communication message for the agent
8. This message must be understandable by a fresh agent (full context)
9. User copies this to a new agent, repeats until task is done
10. Process repeats for each task until all tasks are complete

## Current Understanding

The command creates a handoff protocol for multi-agent workflows:

1. **Orchestrator generates PROGRESS.md** with:
   - Checklist of all tasks
   - Per-task: embedded content + agent pickup instructions

2. **Agent instructions** are standalone, context-complete blocks that:
   - Focus on one task only
   - Don't reference PROGRESS.md
   - Include `plx complete task --id <id>` instruction

3. **Review loop** after each agent completes:
   - Orchestrator verifies work
   - Creates feedback "subtask" if issues found
   - Feedback is copy-pastable to new agent

## Identified Ambiguities

1. Command location: PLX slash command or global command?
2. Input: Does it require a change-id, or infers from context?
3. Task selection: All tasks, or filter by status?
4. Feedback format: New task file, or inline in PROGRESS.md?
5. Verification scope: What exactly does orchestrator verify?

## Decisions

1. **Location**: PLX slash command in `.claude/commands/plx/` + new CLI command `plx create progress --change-id <id>`
2. **Two components**:
   - `plx create progress --change-id <id>` - CLI command that generates PROGRESS.md template with all tasks
   - `/plx:plan-implementation` - Slash command that guides the orchestrator workflow
3. **Output**: CLI writes directly to PROGRESS.md file
4. **Feedback mechanism**:
   - Inline in PROGRESS.md under the task section
   - Also output to chat for immediate copy to agent
5. **Task filter**: Non-completed tasks only (to-do and in-progress)
6. **Agent context**: Include relevant parts of proposal.md within task instructions, but focus strictly on the single task
7. **Verification scope**: Full verification - scope adherence, TracelessChanges, project conventions, tests pass, acceptance criteria met
8. **File location**: Project root (PROGRESS.md)
9. **Slash command name**: `/plx:plan-implementation`

## Final Intent

### Components

1. **CLI Command**: `plx create progress --change-id <id>`
   - Creates PROGRESS.md at project root
   - Includes non-completed tasks (to-do, in-progress) only
   - Each task section contains:
     - Checkbox for completion tracking
     - Full task content embedded
     - Relevant proposal context (focused on that task)
     - Agent instructions (no PROGRESS.md mention)
     - `plx complete task --id <id>` command at end

2. **Slash Command**: `/plx:plan-implementation`
   - Takes change-id as argument
   - Calls `plx create progress --change-id <id>` to generate PROGRESS.md
   - Outputs the first task block to chat for immediate copy
   - Enters review loop:
     - Wait for user to report "done"
     - Verify: scope, TracelessChanges, conventions, tests, acceptance criteria
     - If pass: mark task complete, output next task block
     - If fail: output feedback block to chat + append to PROGRESS.md
   - Repeat until all tasks complete

### Agent Instruction Block Format

Self-contained context block that:
- Contains task title, end goal, constraints, acceptance criteria, implementation checklist
- Contains relevant proposal context (why, what changes)
- Instructs agent to focus ONLY on this task
- Instructs agent to run `plx complete task --id <id>` when done
- Does NOT mention PROGRESS.md

### Feedback Block Format

Self-contained feedback block that:
- References the task by name
- Lists specific issues found
- Provides actionable guidance
- Is understandable by a fresh agent
- Does NOT require reading PROGRESS.md history

### Workflow

1. User runs `/plx:plan-implementation <change-id>`
2. Command generates PROGRESS.md with all non-completed tasks
3. Command outputs first task block to chat
4. User copies task block to new agent
5. Agent implements and reports done
6. User tells orchestrator "done"
7. Orchestrator verifies (scope, traceless, conventions, tests, AC)
8. If issues: outputs feedback block + appends to PROGRESS.md
9. User copies feedback to agent (same or new)
10. Repeat 5-9 until task passes
11. Orchestrator marks task complete, outputs next task block
12. Repeat 4-11 until all tasks done
