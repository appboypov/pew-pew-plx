---
status: to-do
skill-level: medior
parent-type: change
parent-id: update-task-completion-storage
type: chore
blocked-by:
  - 053-update-task-completion-storage-update-task-progress
  - 054-update-task-completion-storage-change-task-storage
---

# 🧹 Chore Template

Use this template for maintenance tasks, cleanup, and housekeeping work.

**Title Format**: `🧹 <Verb> <thing>`

**Examples**:
- 🧹 Update dependencies to latest versions
- 🧹 Remove unused feature flags

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] 053-update-task-completion-storage-update-task-progress
- [ ] 054-update-task-completion-storage-change-task-storage

## 🧹 Maintenance Area
> What part of the system needs attention?

Task progress verification, task storage routing validation, and regression testing for CLI flows.

## 📍 Current State
> What needs cleaning, updating, or removing?

Progress and storage rules are updated but need validation coverage and regression checks for key CLI commands.

## 🎯 Target State
> What should exist after this chore is complete?

Specs are validated, tests cover new completion rules and storage routing, and core CLI flows are smoke-tested.

## 💡 Justification
> Why is this maintenance needed now?

The change alters completion semantics and file locations, so validation is required to avoid regressions in task retrieval and progress reporting.

## ✅ Completion Criteria
> How do we verify the chore is done?

- [ ] `splx validate change --id update-task-completion-storage --strict` passes
- [ ] New or updated tests cover file-level completion and storage routing
- [ ] Manual smoke checks verify create/get/list/view workflows

## 🚧 Constraints
> Any limitations or things to avoid?

- [ ] Avoid unrelated refactors outside task progress/storage scope
- [ ] Keep changes limited to the specified CLI/task utilities

## 📝 Notes
> Additional context if needed

Focus on regression checks for list, view, get task, create/paste, and transfer/migrate paths.
