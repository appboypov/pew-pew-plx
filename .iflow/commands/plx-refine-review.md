---
name: /plx-refine-review
id: plx-refine-review
category: Pew Pew Plx
description: Create or update REVIEW.md.
---
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

## Part 1: Review Config
1. Check if @REVIEW.md exists:
   - If not: create from template.
   - If exists: read current configuration.

2. Guide user through Review Types selection:
   - Present options: implementation, architecture, security, performance, accessibility.
   - Allow multiple selections.
   - Record selections.

3. Guide user through Feedback Format selection:
   - Present options: marker, annotation, inline-comment.
   - Record selection.

4. Guide user through Checklist customization:
   - Present options: minimal, standard, comprehensive, custom.
   - Record selection.

5. Write selections to REVIEW.md Review Config section.

## Part 2: Review Scope Research
6. Research and populate each Review Scope section in @REVIEW.md:

   **Architecture Patterns**
   - Identify core architectural patterns (MVC, MVVM, Clean Architecture, etc.)
   - Find pattern documentation or examples
   - Note where patterns are enforced vs flexible

   **Project Conventions**
   - Find style guides, linting configs, formatting rules
   - Identify naming conventions (files, classes, functions)
   - Note file organization rules and folder structure patterns

   **Critical Paths**
   - Find files imported by many others
   - Identify core business logic files
   - Locate entry points and main orchestration files

   **Security-Sensitive**
   - Find authentication/authorization code
   - Locate input validation and sanitization
   - Identify data encryption and secrets handling

   **Performance-Critical**
   - Find hot paths and frequently called code
   - Locate database queries and I/O operations
   - Identify caching and optimization logic

   **Public API Surface**
   - Find exported interfaces and types
   - Locate public methods and endpoints
   - Identify SDK/library entry points

   **State Management**
   - Find global state, stores, contexts
   - Locate caching and session handling
   - Identify data persistence logic

   **Configuration**
   - Find environment configs and feature flags
   - Locate secrets handling
   - Identify build and deployment configs

   **Package Adherence**
   - List installed packages that solve common problems
   - Note which packages must be used (no custom alternatives)
   - Identify wrapper patterns around third-party libraries

   **External Dependencies**
   - Find third-party API integrations
   - Locate SDK and library usage
   - Identify external service clients

7. Write findings to each section with file paths.

## Part 3: Confirm
8. Present summary of configuration and populated scope.
9. Explain how `/plx:review` will use these settings.
<!-- PLX:END -->
