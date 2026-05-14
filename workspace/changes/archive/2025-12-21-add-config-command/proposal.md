## Why

Users need a way to view and modify their global PLX settings without manually editing JSON files. The `global-config` spec provides the foundation, but there's no user-facing interface to interact with the config. A dedicated `splx config` command provides discoverability and ease of use.

## What Changes

Add `splx config` subcommand with the following operations:

```bash
splx config path                          # Show config file location
splx config list [--json]                 # Show all current settings
splx config get <key>                     # Get a specific value (raw, scriptable)
splx config set <key> <value> [--string]  # Set a value (auto-coerce types)
splx config unset <key>                   # Remove a key (revert to default)
splx config reset --all [-y]              # Reset everything to defaults
splx config edit                          # Open config in $EDITOR
```

**Key design decisions:**
- **Key naming**: Use camelCase to match JSON structure (e.g., `featureFlags.someFlag`)
- **Nested keys**: Support dot notation for nested access
- **Type coercion**: Auto-detect types by default; `--string` flag forces string storage
- **Scriptable output**: `get` prints raw value only (no labels) for easy piping
- **Zod validation**: Use zod for config schema validation and type safety
- **Future-proofing**: Reserve `--scope global|project` flag for potential project-local config

**Example usage:**
```bash
$ splx config path
/Users/me/.config/workspace/config.json

$ splx config list
featureFlags: {}

$ splx config set featureFlags.enableTelemetry false
Set featureFlags.enableTelemetry = false

$ splx config get featureFlags.enableTelemetry
false

$ splx config list --json
{
  "featureFlags": {}
}

$ splx config unset featureFlags.enableTelemetry
Unset featureFlags.enableTelemetry (reverted to default)

$ splx config edit
# Opens $EDITOR with config.json
```

## Impact

- Affected specs: New `cli-config` capability
- Affected code:
  - New `src/commands/config.ts`
  - New `src/core/config-schema.ts` (zod schema)
  - Update CLI entry point to register config command
- Dependencies: Requires `global-config` spec (already implemented)
