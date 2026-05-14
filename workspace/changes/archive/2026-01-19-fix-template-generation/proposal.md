# Change: Fix Template Generation in Init and Update Commands

## Why

The `splx init` and `splx update` commands do not create the task template files in `workspace/templates/` despite the task-templates spec requiring the system to "ship 13 built-in templates that are available without user configuration". This causes the template system to be completely non-functional as users must manually create all template files, defeating the purpose of having a template system.

## What Changes

- **Add built-in task template constants** to the source code for all 13 template types
- **Update InitCommand** to create the `workspace/templates/` directory and populate it with built-in templates
- **Update UpdateCommand** to create missing templates when run (without overwriting user customizations)
- **Create template generation logic** that respects user overrides while ensuring built-ins are available

## Impact

- Affected specs: `task-templates` (implementation fix to match existing spec)
- Affected code:
  - `src/core/init.ts` - Create templates directory and files during init
  - `src/core/update.ts` - Create missing template files during update
  - `src/core/templates/task-templates/` - New directory for built-in template constants
  - `src/core/templates/index.ts` - Update TemplateManager to include task templates