---
name: commit
description: Create a git commit using both a conventional commit message (`type(scope): subject`) and, underneath, a summary template with What Changed, How It Works, Manual Testing Plan, and Technical Details sections. Use after finishing work to commit all staged and unstaged changes.
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
        Create a git commit that includes a conventional commit message at the top, followed by a structured summary with "What Changed", "How It Works", "Manual Testing Plan", and "Technical Details" sections. All staged and unstaged changes are committed. If the proposal tracks issues, include references in the footer.
        <AcceptanceCriteria>
            - Commit message starts with: `type(scope): subject`
                - Type is one of: feat, fix, chore, docs, refactor, test
                - Scope is present (if applicable)
                - Subject describes "what", is under 72 characters, and starts with lowercase verb
            - After a blank line, the following sections appear in order:
                - A short paragraph (1-2 sentences) summarizing what changed. No heading, no brackets, no prefix.
                - ### How It Works: Non-technical explanation for stakeholders, no fluff
                - ### Manual Testing Plan: Step-by-step, actionable, specific, no fluff
                - ### Technical Details: Developer-focused implementation explanation, no fluff
            - If tracked issues, references are included in the footer—one per line, after a blank line following all sections
            - All staged and unstaged changes are included in the commit
        </AcceptanceCriteria>
        <Constraints>
            - Do not amend commits already pushed to remote
            - Do not combine unrelated changes in one commit
        </Constraints>
    </EndGoal>
    <BehavioralInstructions>
        <EffectiveWording>
            - Delete every word that isn't essential / Use only necessary words
            - If it can be cut without losing meaning, cut it / Remove any word that does not add meaning
            - Zero "very", "really", "quite", "rather", "somewhat", "actually"
            - Write like a technical manual, not a blog post / Use precise, technical language
            - Every word must earn its place
        </EffectiveWording>
        <NoAmbiguity>
            - Always be decisive, specific and unambiguous in your outputs.
            - Avoid words like "consider", "optionally", "probably", etc.
            - Leave no room for interpretation of intent and/or direction.
            - Outputs must be decisive, specific, and unambiguous
            - Avoid vague language or suggestions
            - Do not leave intent or direction open to interpretation
        </NoAmbiguity>
    </BehavioralInstructions>
    <Workflow>
        <Steps>
            <Research>
                1. Run `git status` to see all changes
                2. Run `git diff` to view unstaged changes
                3. Run `git diff --cached` for staged changes
                4. Run `git log --oneline -5` to view recent commit style
                5. Check for active PLX changes: `ls workspace/changes/` (exclude archive/)
                6. If proposal exists, read frontmatter for `tracked-issues` in `workspace/changes/*/proposal.md`
            </Research>
            <Plan>
                7. Determine appropriate type based on changes
                8. Identify scope from affected area (if any)
                9. Draft conventional commit subject line describing the "what"
                10. Write concise What Changed summary
                11. Draft How It Works section for stakeholders
                12. Draft Manual Testing Plan section
                13. Draft Technical Details section for developers
                14. If tracked issues found, prepare smart commit footer references
            </Plan>
            <Act>
                15. Stage all changes: `git add -A`
                16. Create commit with both the conventional subject, then the summary sections, then the footer if present
            </Act>
            <Review>
                17. Run `git log --oneline -1` to confirm commit
            </Review>
        </Steps>
        <CommitMessageTemplate>
type(scope): subject

Short paragraph summarizing what changed. Plain text, no heading, no brackets, no prefix. 1-2 sentences max.

### How It Works

Non-technical explanation for stakeholders.

### Manual Testing Plan

Step-by-step testing instructions.

### Technical Details

Developer-focused implementation details.

Issue references (one per line)
        </CommitMessageTemplate>
        <TemplateNotes>
            - The summary paragraph after the subject line is PLAIN TEXT, not a heading
            - Do NOT use brackets, colons, or "What changed:" prefix
            - Write the summary as a natural sentence describing what was done
        </TemplateNotes>
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

Act as a senior `{{ Role }}` with worldclass `{{ Expertise }}` in fulfilling the `{{ InitialRequest }}` and achieving `{{ EndGoal }}` with meticulous adherence to all `{{ AcceptanceCriteria }}`, `{{ Constraints }}`, and `{{ BehavioralInstructions }}` during the entire execution of the `{{ Activity }}`.

Analyze the `{{ InitialRequest }}` and ensure all input requirements are met. Strictly follow all `{{ Steps }}` in the `{{ Workflow }}` and deliver the output using the specified combined commit message format: conventional summary on top, then the new template sections, then tracked issues if applicable.
