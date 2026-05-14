---
status: to-do
skill-level: medior
parent-type: change
parent-id: fix-template-generation
type: bug
---

# 🐞 Task templates fail to generate during init/update

## 🎯 End Goal
Task template files are automatically created in `workspace/templates/` during `splx init` and missing templates are restored during `splx update`.

## 📍 Currently
- The `splx init` command does not create the `workspace/templates/` directory
- No built-in template files are created during initialization
- The `splx update` command does not restore missing templates
- Users must manually create all template files, making the template system non-functional

## 🎯 Should
- `splx init` creates `workspace/templates/` with all 13 built-in template files
- `splx update` restores any missing built-in templates without overwriting user customizations
- Built-in templates contain proper frontmatter (`type:` field) and body with `<!-- REPLACE: ... -->` placeholders
- Template system works out-of-the-box without manual file creation

## ⚠️ Constraints
- [ ] Must not overwrite existing user-customized templates during update
- [ ] Template files must have valid YAML frontmatter with `type:` field
- [ ] Template bodies must include helpful `<!-- REPLACE: ... -->` placeholders

## ✅ Acceptance Criteria
- [ ] Running `splx init` creates `workspace/templates/` with 13 template files
- [ ] Running `splx update` restores missing templates
- [ ] User-modified templates are preserved during update
- [ ] Each template has proper frontmatter and helpful body structure

## 🔧 Implementation Checklist

### 1. Create Built-in Template Constants
- [ ] Create `src/core/templates/task-templates/` directory
- [ ] Add `story-template.ts` with full template content
- [ ] Add `bug-template.ts` with full template content
- [ ] Add `business-logic-template.ts` with full template content
- [ ] Add `components-template.ts` with full template content
- [ ] Add `research-template.ts` with full template content
- [ ] Add `discovery-template.ts` with full template content
- [ ] Add `chore-template.ts` with full template content
- [ ] Add `refactor-template.ts` with full template content
- [ ] Add `infrastructure-template.ts` with full template content
- [ ] Add `documentation-template.ts` with full template content
- [ ] Add `release-template.ts` with full template content
- [ ] Add `implementation-template.ts` with full template content
- [ ] Add `index.ts` exporting all templates as a Map or array

### 2. Update TemplateManager
- [ ] Import task templates from `task-templates/index.ts`
- [ ] Add `getTaskTemplates()` method returning template list
- [ ] Add `getTaskTemplate(type: string)` method for individual templates

### 3. Update InitCommand
- [ ] Create `workspace/templates/` directory during init
- [ ] Loop through all built-in templates from TemplateManager
- [ ] Write each template file to `workspace/templates/<type>.md`
- [ ] Log template creation in init summary

### 4. Update UpdateCommand
- [ ] Check for `workspace/templates/` directory existence
- [ ] Create directory if missing
- [ ] Loop through built-in templates
- [ ] For each template, check if file exists
- [ ] Create missing template files only (preserve existing)
- [ ] Log restored templates in update summary

### 5. Test the Implementation
- [ ] Test `splx init` creates all templates
- [ ] Test `splx update` restores deleted templates
- [ ] Test `splx update` preserves modified templates
- [ ] Verify templates have correct frontmatter and structure

## 📝 Notes
The built-in template content should match what's currently in `workspace/templates/` but be stored as TypeScript constants in the source code. This ensures templates are always available and version-controlled with the CLI.