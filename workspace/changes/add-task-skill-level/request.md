# Request: Add Task Skill Level Indicator

## Source Input

From Linear issue PLX-46:

Tasks include a skill level classification (junior/medior/senior) that AI agents use to select the appropriate model for execution.

**Currently:** All tasks are treated equally regardless of complexity. AI agents have no guidance on which model to use for different task types.

**Should:**
- Each task has a skill level field in its frontmatter (junior, medior, or senior)
- AI agents receive clear instructions on how to map skill levels to model selection
- The skill level reflects the complexity and expertise required for the task
- The plx/orchestrate command should be updated to instruct to choose the appropriate model based on task level if present, otherwise determine itself

**Constraints:**
- Skill levels are limited to three tiers: junior, medior, senior
- The skill level is set at task creation time
- Model selection guidance is provided to agents, not enforced by the system

**Acceptance Criteria:**
- Task frontmatter supports a `skill-level` field with values: junior, medior, senior
- Agent instructions document the mapping between skill levels and recommended models
- Existing tasks without skill level continue to work (field is optional)

## Current Understanding

1. **Frontmatter extension**: Add optional `skill-level` field to task YAML frontmatter with values: junior, medior, senior
2. **Documentation update**: Update workspace/AGENTS.md and slash commands to provide model selection guidance
3. **Orchestrate command update**: Update plx/orchestrate.md to include model selection logic based on skill level
4. **Backward compatible**: Existing tasks without skill-level continue to work normally
5. **Advisory only**: The skill level is guidance for agents, not system-enforced

## Identified Ambiguities

1. What AI model mapping should be recommended? (e.g., junior→haiku, medior→sonnet, senior→opus)
2. Should the CLI display skill level when showing tasks?
3. Should validation warn about missing skill level, or is it purely optional?
4. Should the task template in AGENTS.md include skill-level by default?
5. Should plx/plan-proposal auto-assign skill levels to generated tasks?

## Decisions

1. **Model mapping**: For Claude models: junior→haiku, medior→sonnet, senior→opus. For non-Claude models or unavailable models: agent determines equivalent or ignores skill level.
2. **CLI display**: Show skill level in CLI task output (both human-readable and JSON formats).
3. **Validation**: Warn (not error) in `--strict` mode when skill-level is missing from tasks.
4. **Task template**: Include `skill-level` in the frontmatter example in workspace/AGENTS.md.
5. **Auto-assignment**: `plx/plan-proposal` should auto-assign skill levels based on task complexity heuristics.
6. **Sub-agent only**: Model selection based on skill level only applies when spawning sub-agents (e.g., in plx/orchestrate). The executing model cannot change itself.

## Final Intent

Add an optional `skill-level` field to task frontmatter (values: junior, medior, senior) that AI agents use for model selection when spawning sub-agents.

**Scope:**
1. **Task frontmatter**: Add optional `skill-level` field (junior/medior/senior)
2. **CLI output**: Display skill level in `plx get task` and `plx get tasks` (human + JSON)
3. **Validation**: Warn in `--strict` mode when skill-level is missing
4. **AGENTS.md template**: Include skill-level in the task file example
5. **plx/plan-proposal**: Auto-assign skill levels based on complexity heuristics
6. **plx/orchestrate**: Select sub-agent model based on skill level (haiku/sonnet/opus for Claude; equivalent for other models)

**Model mapping (Claude):**
- junior → haiku (fast, simple tasks)
- medior → sonnet (balanced tasks)
- senior → opus (complex, reasoning-heavy tasks)

**Non-Claude/unavailable models:** Agent determines equivalent or ignores.

**Backward compatibility:** Existing tasks without skill-level continue to work normally.
