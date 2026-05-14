---
status: done
---

# Task: Rename GitHub Repository

## End Goal

The GitHub repository is renamed from `OpenSplx` to `OpenSplx`, with automatic redirects from the old URL.

## Currently

The repository is at `github.com/appboypov/OpenSplx`. All documentation references the new name `OpenSplx` but the actual repository URL uses the old name.

## Should

- Repository URL is `github.com/appboypov/OpenSplx`
- Old URLs redirect automatically to new location
- Local git remote continues working (via redirect)

## Constraints

- Must be done after code changes are merged
- Requires GitHub repository admin access
- Use Playwright browser automation on github.com

## Acceptance Criteria

- [ ] `https://github.com/appboypov/OpenSplx` resolves to repository
- [ ] `https://github.com/appboypov/OpenSplx` redirects to new URL
- [ ] `git fetch origin` works from local clone

## Implementation Checklist

- [x] Ensure Tasks 001 and 002 are complete
- [x] Launch Playwright browser
- [x] Navigate to https://github.com/appboypov/OpenSplx/settings
- [x] Scroll to "Repository name" section under "General"
- [x] Change name from `OpenSplx` to `OpenSplx`
- [x] Click "Rename" button
- [x] Confirm in modal if prompted
- [x] Verify new URL works
- [x] Verify old URL redirects
- [x] Optionally update local remote: `git remote set-url origin https://github.com/appboypov/OpenSplx.git`

## Notes

GitHub repository rename behavior:
- Redirects are maintained indefinitely
- Existing clones continue to work
- Issues, PRs, and releases transfer automatically
- Some CI/CD may need webhook URL updates
