<!-- PLX:START -->
**Guardrails**
- Reference @REVIEW.md template structure.
- Preserve existing review guidelines.
- Use question tool to guide user through configuration options.
- Write final selections to REVIEW.md.

## Configuration Options Reference

### Review Types
| Type | Description | Focus Areas |
|------|-------------|-------------|
| `implementation` | Code correctness and quality | Logic errors, edge cases, error handling, code style |
| `architecture` | System design and patterns | Component boundaries, dependencies, scalability, maintainability |
| `security` | Vulnerability assessment | Input validation, authentication, authorization, data exposure |
| `performance` | Efficiency and optimization | Algorithmic complexity, memory usage, I/O operations, caching |
| `accessibility` | Inclusive design compliance | WCAG guidelines, screen reader support, keyboard navigation |

### Feedback Format
| Format | Description | Best For |
|--------|-------------|----------|
| `marker` | Inline markers with format `#FEEDBACK #TODO \| {type}:{id} \| {feedback}` | Automated parsing, task generation, CI integration |
| `annotation` | Spec-style annotations referencing requirements | Traceability to specs, compliance verification |
| `inline-comment` | Direct code comments at issue location | Quick fixes, minor suggestions, style feedback |

### Checklist Customization
| Checklist | Items | Best For |
|-----------|-------|----------|
| `minimal` | 5-7 core items covering critical issues only | Fast reviews, trusted contributors, small changes |
| `standard` | 10-15 items covering common review concerns | Most PRs, balanced thoroughness |
| `comprehensive` | 20+ items covering all review aspects | Critical systems, security-sensitive code, new contributors |
| `custom` | User-defined items tailored to project needs | Domain-specific requirements, compliance mandates |

**Steps**
1. Check if @REVIEW.md exists:
   - If not: create from template with default configuration.
   - If exists: read current configuration.

2. Guide user through Review Types selection:
   - Present review type options: implementation, architecture, security, performance, accessibility.
   - Explain each type's focus areas and when to apply.
   - Allow multiple selections (most projects use 2-3 types).
   - Record selections.

3. Guide user through Feedback Format selection:
   - Present feedback format options: marker, annotation, inline-comment.
   - Explain each format's structure and tooling compatibility.
   - Record selection.

4. Guide user through Checklist customization:
   - Present checklist options: minimal, standard, comprehensive, custom.
   - If custom: guide user to define checklist items.
   - Explain tradeoffs between speed and thoroughness.
   - Record selection.

5. Write all selections to REVIEW.md:
   - Update Review Types section with selected types.
   - Update Feedback Format section with format choice.
   - Update Checklist section with selected level or custom items.

6. Confirm configuration saved and explain how `plx/review` will use these settings.
<!-- PLX:END -->
