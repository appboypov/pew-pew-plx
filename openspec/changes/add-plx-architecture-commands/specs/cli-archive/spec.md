## ADDED Requirements

### Requirement: Architecture Update Suggestion

The archive command SHALL suggest refreshing architecture documentation after applying spec updates.

#### Scenario: Displaying architecture update suggestion

- **GIVEN** an active change with spec updates
- **WHEN** the user runs `plx archive <change-name>` and specs are updated
- **THEN** display a tip message: "Tip: Run /plx/update-architecture to refresh your architecture documentation."
- **AND** display the suggestion in gray/muted color to indicate it is informational, not required
- **AND** continue with archive workflow without requiring any action on the suggestion
