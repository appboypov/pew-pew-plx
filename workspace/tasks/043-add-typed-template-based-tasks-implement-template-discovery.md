---
status: done
skill-level: medior
parent-type: change
parent-id: add-typed-template-based-tasks
type: implementation
---

# Task: ⚙️ Implement template discovery service

## End Goal

A template discovery service that scans `workspace/templates/` and provides built-in defaults, returning all available task types with their metadata.

## Currently

- No template discovery mechanism exists
- Task types are not formalized in the system
- No way to dynamically detect available templates

## Should

- `src/core/templates/template-discovery.ts` provides:
  - `discoverTemplates(workspacePath)` - Scans workspace/templates/ for .md files with `type:` frontmatter
  - `getBuiltInTemplates()` - Returns 12 built-in template types
  - `getAvailableTypes(workspacePath)` - Returns merged list (user templates override built-in)
  - `getTemplateByType(type, workspacePath)` - Returns template content for a type
- Built-in templates embedded as string constants or loaded from package resources
- Template metadata extracted: type, title format (from template body)

## Constraints

- [ ] User templates in workspace/templates/ take precedence over built-in
- [ ] Templates must have `type:` in frontmatter to be discovered
- [ ] Discovery is synchronous/async file system scan
- [ ] Return type includes: type name, source (built-in/user), file path (if user)

## Acceptance Criteria

- [ ] `discoverTemplates()` returns all user templates from workspace/templates/
- [ ] `getBuiltInTemplates()` returns all 12 built-in types
- [ ] `getAvailableTypes()` correctly merges user and built-in (user wins on conflict)
- [ ] `getTemplateByType()` returns template content or null if not found

## Implementation Checklist

- [x] Create `src/core/templates/template-discovery.ts`
- [x] Define built-in template types as constants array
- [x] Implement `discoverTemplates()` to scan workspace/templates/
- [x] Implement `getBuiltInTemplates()` returning built-in type list
- [x] Implement `getAvailableTypes()` with merge logic
- [x] Implement `getTemplateByType()` to read template content
- [x] Export from `src/core/templates/index.ts`
- [x] Add unit tests for template discovery

## Notes

The 12 built-in types are: story, bug, business-logic, components, research, discovery, chore, refactor, infrastructure, documentation, release, implementation.
