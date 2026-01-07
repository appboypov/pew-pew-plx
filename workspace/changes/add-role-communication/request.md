# Request: Add Role Communication System

## Source Input

> "I want to create a system where the roles can communicate with each other through markdown or json files preferably. I want you to research the best way to approach this in a markdown framework type that we are creating."

## Current Understanding

The user wants to add **inter-role communication** to Pew Pew Plx using file-based messaging (markdown or JSON).

### What We Know
- Communication medium: Markdown or JSON files (user preference)
- Context: Part of the Pew Pew Plx "markdown framework"
- Goal: Enable roles to communicate with each other

### Current System State (from research)
- **Existing roles** (implicit via slash commands): Planner, Implementer, Orchestrator, Reviewer, Release Manager
- **Current communication**: State-based via file updates (frontmatter status, checkboxes)
- **Gaps identified**:
  - No explicit message passing between agents
  - No dependency/blocking relationships between tasks
  - No event/notification system for state changes
  - Limited bi-directional communication (mostly one-way flows)
  - No formal role registry or capability declarations

## Identified Ambiguities

1. **Role definition**: What constitutes a "role"?
   - AI agents (Claude, different models)?
   - Slash command personas (Planner, Implementer, Reviewer)?
   - Human participants (developer, reviewer, PM)?
   - External tools/services?

2. **Communication type**: What kind of messages?
   - Status updates / notifications?
   - Direct requests / questions?
   - Data handoffs / context sharing?
   - Blocking dependencies ("wait for X")?

3. **Communication pattern**: How should messages flow?
   - Point-to-point (Agent A → Agent B)?
   - Broadcast (Agent A → all)?
   - Pub/sub (subscribe to topics)?
   - Request/response vs fire-and-forget?

4. **Synchronicity**: When are messages processed?
   - Synchronous (wait for response)?
   - Asynchronous (queue for later)?
   - Polling vs push notifications?

5. **Message format preference**: Markdown vs JSON?
   - Markdown: Human-readable, fits existing patterns
   - JSON: Machine-parseable, structured
   - Hybrid: YAML frontmatter + markdown body?

6. **Scope**: Where does this live?
   - Per-change communication (within a change proposal)?
   - Workspace-level (shared across all changes)?
   - Global (cross-workspace)?

7. **Persistence**: How long do messages live?
   - Ephemeral (delete after read)?
   - Persistent (audit trail)?
   - TTL-based (expire after X)?

8. **Integration**: How does this interact with existing systems?
   - Extend task files with message capabilities?
   - Create new artifact type (message files)?
   - Add to existing slash command workflows?

## Decisions

_(To be populated as questions are answered)_

## Final Intent

_(To be populated when all ambiguities are resolved)_
