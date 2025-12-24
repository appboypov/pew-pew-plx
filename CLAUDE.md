<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# OpenSplx Fork Configuration

This is a fork of `Fission-AI/OpenSpec`. The git remotes are configured as:
- `origin` → `appboypov/OpenSplx` (this fork, PRs go here)
- `sync` → `Fission-AI/OpenSpec` (upstream, sync only)

## Syncing with Upstream

Use merge (not rebase) to preserve upstream commit SHAs and enable PR review.

### Sync Workflow

1. **Fetch upstream:**
   ```bash
   git fetch sync
   ```

2. **Create sync branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b sync/vX.X.X-YYYY-MM-DD
   ```
   Example: `sync/v0.1.0-2024-12-24`

3. **Merge upstream (not rebase):**
   ```bash
   git merge sync/main
   ```

4. **Resolve conflicts intentionally:**
   - For package.json: keep fork's name (`@appboypov/opensplx`) and version
   - All other conflicts must be discussed with the user before resolving

5. **Push and create PR:**
   ```bash
   git push -u origin sync/vX.X.X-YYYY-MM-DD
   ```
   Create PR: `sync/vX.X.X-YYYY-MM-DD` → `main`

6. **Merge PR via GitHub UI:**
   - Use **"Create a merge commit"** (standard merge)
   - **DO NOT** use "Rebase and merge" (breaks SHA tracking)
   - **DO NOT** use "Squash and merge"

7. **Verify result:**
   ```bash
   git checkout main && git pull origin main
   git rev-list --count main..sync/main  # Should be 0
   ```

### Why Merge (Not Rebase)

Rebase rewrites commit SHAs, causing GitHub to show "X ahead + Y behind" even after sync.
Merge preserves upstream SHAs, resulting in "X ahead + 0 behind".

## PR Workflow

PRs from feature branches target `origin/main` (this fork), not upstream.