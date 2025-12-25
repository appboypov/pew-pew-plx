---
name: commit
description: Create a git commit following project conventions. Use after completing work to commit changes with a properly formatted message.
---

```xml
<Activity>
    <InitialRequest>
        - `{{ Arguments }}` provided by the user.
        <Arguments>
            $ARGUMENTS
        </Arguments>
    </InitialRequest>
    <Role>
        Git Practitioner
    </Role>
    <Expertise>
        Conventional commits, atomic commits, meaningful commit messages
    </Expertise>
    <EndGoal>
        A git commit created with a conventional commit message that accurately describes the changes.
        <AcceptanceCriteria>
            - Commit message follows format: `type(scope): subject`
            - Type is one of: feat, fix, chore, docs, refactor, test
            - Subject is under 72 characters
            - Subject starts with lowercase verb
            - Changes are staged and committed
            - If OpenSpec proposal has tracked issues, include smart commit references in footer
        </AcceptanceCriteria>
        <Constraints>
            - Do not amend commits already pushed to remote
            - Do not combine unrelated changes in one commit
        </Constraints>
    </EndGoal>
    <BehavioralInstructions>
        <EffectiveWording>
            - Delete every word that isn't essential
            - If it can be cut without losing meaning, cut it
            - Zero "very", "really", "quite", "rather", "somewhat", "actually"
            - Write like a technical manual, not a blog post
            - Every word must earn its place
        </EffectiveWording>
        <NoAmbiguity>
            - Always be decisive, specific and unambiguous in your outputs.
            - Avoid words like "consider", "optionally", "probably", etc.
            - Leave no room for interpretation of intent and/or direction.
        </NoAmbiguity>
    </BehavioralInstructions>
    <Workflow>
        <Steps>
            <Research>
                1. Run `git status` to see all changes
                2. Run `git diff` to understand unstaged changes
                3. Run `git diff --cached` to understand staged changes
                4. Run `git log --oneline -5` to see recent commit style
                5. Check for active OpenSpec changes: `ls openspec/changes/` (exclude archive/)
                6. If proposal exists, read frontmatter for `tracked-issues` in `openspec/changes/*/proposal.md`
            </Research>
            <Plan>
                7. Determine appropriate type based on changes
                8. Identify scope from affected area
                9. Draft subject line describing the "what"
                10. If tracked issues found, prepare smart commit footer references
            </Plan>
            <Act>
                11. Stage relevant files if needed
                12. Create commit with conventional format and issue references in footer
            </Act>
            <Review>
                13. Run `git log --oneline -1` to confirm commit
            </Review>
        </Steps>
        <SmartCommitFormat>
            When proposals have tracked issues in frontmatter, add footer references:
            - GitHub: `Fixes #NUMBER` (e.g., `Fixes #18`)
            - Linear: `Fixes TEAM-NUMBER` (e.g., `Fixes PLX-12`)
            - Use `Fixes` to auto-close on merge, or `Ref` for reference only
            - One issue per line in commit message footer (after blank line)
        </SmartCommitFormat>
    </Workflow>
</Activity>
```

Act as a senior `{{ Role }}` with worldclass `{{ Expertise }}` in fulfulling the `{{ InitialRequest }}` and achieving `{{ EndGoal }}` with meticulous adherence to all `{{ AcceptanceCriteria }}`, `{{ Constraints }}`, and `{{ BehavioralInstructions }}` during the entire execution of the `{{ Activity }}`.

Analyze the `{{ InitialRequest }}` and ensure all `{{ InitialInputRequirements }}` are met. Then, strictly follow all `{{ Steps }}` in the `{{ Workflow }}` and deliver the `{{ OutputRequirements }}` exactly as specified.
