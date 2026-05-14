---
type: bug
---

# 🐞 Bug Template

Use this template for bug fixes that restore intended behavior.

**Title Format**: `🐞 <Thing> fails when <condition>`

**Examples**:
- 🐞 Login fails when password contains special characters
- 🐞 Invoice total is calculated incorrectly

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 💥 Event
> When did the problem occur?

```text
<!-- REPLACE: Date/time and context of bug occurrence -->
```

## 🦋 Expected Result
> What did you expect to happen?

```text
<!-- REPLACE: Expected behavior -->
```

## 🐛 Actual Result
> What actually happened?

```text
<!-- REPLACE: Actual behavior observed -->
```

## 👣 Steps to Reproduce
> Which steps can we take to reproduce the problem?

1. [ ] <!-- REPLACE: Step 1 -->
2. [ ] <!-- REPLACE: Step 2 -->
3. [ ] <!-- REPLACE: Step 3 -->

## 🌍 Environment
> Where did the bug occur? (OS, browser, app version, device, auth state, etc.)

- <!-- REPLACE: Environment details -->

## ✅ Acceptance Criteria
> How do we measure the successful fix of the bug?

- [ ] <!-- REPLACE: Criterion 1 -->
- [ ] <!-- REPLACE: Criterion 2 -->

## 🧪 TDD Gherkin Regression Tests
> What test(s) MUST be written to verify this bug exists and prevent recurrence?

- [ ] `Given <!-- REPLACE --> When <!-- REPLACE --> Then <!-- REPLACE -->`

## 📝 Suggested Approach
> Which high level steps should we consider?

1. [ ] First, create failing regression tests that confirm the bug exists
2. [ ] <!-- REPLACE: Fix steps -->
3. [ ] Verify end goal is reached, all tests succeed
