# Request: Add Sync Workspace Command

## Source Input

> I want to create a command called plx/sync-workspace - which goes over all current open changes, all current open tasks, all completed changes - and assess their current state using sub agents - then suggest actions to take (update changes, archive changes, create new tasks if applicable) etc etc. then user chooses what to do and the agent executes those actions. It's kind of a maintenance thing. It should also be able to take an argument for a specific change or task - if none given it should do a global sync check on the workspace.

## Current Understanding

A Claude Code slash command (`/plx/sync-workspace`) that performs workspace maintenance by:

1. **Scanning workspace state**: Reviews open changes, open tasks, and completed changes
2. **Assessment via sub-agents**: Uses sub-agents to analyze the current state of each item
3. **Suggesting actions**: Proposes maintenance actions like:
   - Archive completed changes
   - Update stale changes
   - Create new tasks where needed
   - Other maintenance operations
4. **User selection**: Presents options for user to choose which actions to execute
5. **Execution**: Carries out selected actions via agents
6. **Scoping**: Can target a specific change/task or run globally on entire workspace

## Identified Ambiguities

1. What constitutes "assessment" of a change/task state?
2. What triggers "staleness" detection for changes?
3. Should completed changes be auto-detected or only those in archive/?
4. What sub-agent types should be spawned for assessment?
5. How should action priorities be presented?
6. Should there be a dry-run mode?
7. What output format for suggestions (interactive selection vs batch)?

## Decisions

1. **Assessment scope**: As stated in source - assess open changes, open tasks, completed changes. No additional staleness detection beyond what's explicitly stated.
2. **Action selection UI**: Numbered list of suggested actions. Use AskUserQuestion tool for selection if suggestions fit within max questions limit (multi-select enabled). Otherwise present numbered list and let user specify which numbers to execute.
3. **Sub-agent usage**: Context-dependent. Use sub-agents when assessment would consume too much context (preserves room for subsequent actions). For simpler single-item checks, do inline assessment.
4. **Action types**: All of the following plus any other maintenance actions that emerge from assessment:
   - Archive ready changes (all tasks done)
   - Create missing tasks
   - Update stale proposals/designs
   - Validate and fix issues
   - Any other maintenance actions the sub-agent identifies as needed
5. **Summary report**: Yes, detailed summary after execution showing what was done, what succeeded, what failed.
6. **Completed changes definition**: Changes in workspace/changes/ where all tasks are marked done but not yet archived (not the archive/ folder).

## Final Intent

Create a Claude Code slash command `/plx/sync-workspace` that performs workspace maintenance:

**Invocation:**
- `/plx/sync-workspace` - Global sync check on entire workspace
- `/plx/sync-workspace <change-id|task-id>` - Targeted sync check on specific item

**Workflow:**
1. **Scan** workspace state:
   - Open changes (in workspace/changes/, not archived)
   - Open tasks (tasks with status to-do or in-progress)
   - Completed changes (all tasks done, not yet archived)

2. **Assess** each item:
   - Use sub-agents for complex/context-heavy assessments
   - Do inline assessment for simpler single-item checks
   - Identify maintenance needs

3. **Suggest** actions:
   - Archive ready changes (all tasks done)
   - Create missing tasks where needed
   - Update stale proposals/designs
   - Validate and fix issues
   - Any other maintenance actions identified

4. **Present** numbered list of suggestions:
   - Use AskUserQuestion tool with multi-select if suggestions fit within limit
   - Otherwise present numbered list for user to specify selections

5. **Execute** selected actions via agents

6. **Report** detailed summary:
   - What was done
   - What succeeded
   - What failed
