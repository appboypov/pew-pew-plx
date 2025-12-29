# Release Preparation

## Purpose
This file guides release preparation for the project. Run `plx prepare` to interactively update changelog, readme, and architecture documentation before publishing a new version.

---

## Activity: Changelog Update

### Source Selection
Choose how to gather changes for the changelog:

1. **Git Commits** - Parse commit messages from repository history
2. **Branch Diff** - Compare current branch against main/master
3. **Manual Entry** - Directly specify changes to document

### Commit Range Options
When using Git Commits source:

- **Recent N Commits** - Last N commits (e.g., last 10, last 50)
- **Since Date** - All commits since a specific date (YYYY-MM-DD)
- **Since Tag** - All commits since a specific git tag
- **Tag Range** - Commits between two tags (e.g., v1.0.0..v1.1.0)

### Version Configuration
Determine the new version based on semantic versioning:

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Breaking changes | Major | 1.0.0 → 2.0.0 |
| New features | Minor | 1.0.0 → 1.1.0 |
| Bug fixes | Patch | 1.0.0 → 1.0.1 |

Analyze commits for keywords:
- **Breaking**: "BREAKING", "breaking change", "incompatible"
- **Features**: "feat", "feature", "add", "new"
- **Fixes**: "fix", "bugfix", "patch", "resolve"

### Format Selection
Choose the changelog format:

1. **keep-a-changelog** - Standard format following keepachangelog.com
2. **simple-list** - Minimal bullet-point list
3. **github-release** - GitHub Releases compatible format

### Audience Selection
Choose the target audience:

1. **Technical** - Developer-focused with implementation details
2. **User-facing** - End-user focused on features and fixes
3. **Marketing** - Highlight key improvements for announcements

### Emoji Level
Choose emoji usage in changelog entries:

1. **None** - No emojis
2. **Little** - Category headers only
3. **Medium** - Headers and major items
4. **High** - Every entry has an emoji

### Format Templates

#### keep-a-changelog Format
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Modified behavior description

### Deprecated
- Soon-to-be removed feature

### Removed
- Removed feature description

### Fixed
- Bug fix description

### Security
- Security fix description
```

#### simple-list Format
```markdown
# Changelog

## vX.Y.Z (YYYY-MM-DD)

- Added: New feature description
- Changed: Modified behavior description
- Fixed: Bug fix description
```

#### github-release Format
```markdown
## What's Changed

### New Features
* Feature description by @contributor in #123

### Bug Fixes
* Fix description by @contributor in #124

### Breaking Changes
* Breaking change description

**Full Changelog**: https://github.com/owner/repo/compare/vX.Y.Z...vA.B.C
```

### Upsert Behavior
- **Existing CHANGELOG.md**: Prepend new version section after header
- **No CHANGELOG.md**: Create new file with header and version section

---

## Activity: Readme Update

### Operation Selection
Choose the readme operation:

1. **Create New** - Generate a new README.md from scratch
2. **Update Sections** - Modify specific sections of existing readme
3. **Add Badges** - Add or update badge section
4. **Change Style** - Convert to a different readme style
5. **Refresh Content** - Update outdated information

### Style Selection
Choose the readme style:

1. **Minimal** - Name, description, install, usage
2. **Standard** - Above plus features, contributing, license
3. **Comprehensive** - Full documentation with all sections
4. **Academic/Research** - Citation, methodology, references
5. **CLI Tool** - Commands, flags, examples focus
6. **Library/Package** - API documentation focus

### Audience Selection
Choose the target audience:

1. **Developers** - Technical integration details
2. **End Users** - Usage and features focus
3. **Contributors** - Development setup and guidelines
4. **Researchers** - Academic context and citations
5. **Mixed** - Balanced for multiple audiences

### Section Configuration
Select sections to include:

#### Essential Sections
- [ ] Title and Description
- [ ] Installation
- [ ] Usage

#### Recommended Sections
- [ ] Features
- [ ] Configuration
- [ ] Examples
- [ ] Contributing
- [ ] License

#### Optional Sections
- [ ] Table of Contents
- [ ] Requirements/Prerequisites
- [ ] API Reference
- [ ] FAQ
- [ ] Troubleshooting
- [ ] Roadmap
- [ ] Acknowledgments
- [ ] Changelog Link
- [ ] Security Policy
- [ ] Code of Conduct

### Badge Configuration
Select badges to display:

- [ ] **Build Status** - CI/CD pipeline status
- [ ] **Coverage** - Test coverage percentage
- [ ] **npm Version** - Package version on npm
- [ ] **Downloads** - npm download count
- [ ] **License** - License type badge
- [ ] **GitHub Stars** - Repository star count
- [ ] **Issues** - Open issues count
- [ ] **PRs Welcome** - Contribution invitation
- [ ] **TypeScript** - TypeScript support indicator
- [ ] **Node Version** - Required Node.js version

### Style Templates

#### Minimal Style
```markdown
# Project Name

Brief description of the project.

## Installation

\`\`\`bash
npm install package-name
\`\`\`

## Usage

\`\`\`javascript
import { feature } from 'package-name';
\`\`\`

## License

MIT
```

#### Standard Style
```markdown
# Project Name

[![License](badge-url)](license-url)

Brief description of the project.

## Features

- Feature 1
- Feature 2

## Installation

\`\`\`bash
npm install package-name
\`\`\`

## Usage

\`\`\`javascript
import { feature } from 'package-name';
\`\`\`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT - see [LICENSE](LICENSE)
```

#### Comprehensive Style
```markdown
# Project Name

[![Build](badge-url)](build-url)
[![Coverage](badge-url)](coverage-url)
[![npm](badge-url)](npm-url)
[![License](badge-url)](license-url)

> Tagline or brief description

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- Feature 1 with description
- Feature 2 with description

## Installation

### Prerequisites

- Node.js >= 18

### Install

\`\`\`bash
npm install package-name
\`\`\`

## Usage

### Basic Usage

\`\`\`javascript
import { feature } from 'package-name';
\`\`\`

### Advanced Usage

\`\`\`javascript
// Advanced example
\`\`\`

## API

### function(options)

Description of the function.

**Parameters:**
- \`option1\` - Description

**Returns:** Description

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'default' | Description |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT - see [LICENSE](LICENSE)
```

#### CLI Tool Style
```markdown
# CLI Tool Name

Brief description.

## Installation

\`\`\`bash
npm install -g cli-tool
\`\`\`

## Commands

### command-name

Description of command.

\`\`\`bash
cli-tool command [options]
\`\`\`

**Options:**

| Flag | Description |
|------|-------------|
| \`-f, --flag\` | Description |

**Examples:**

\`\`\`bash
cli-tool command --flag value
\`\`\`

## License

MIT
```

#### Library/Package Style
```markdown
# Package Name

Brief description.

## Installation

\`\`\`bash
npm install package-name
\`\`\`

## API Reference

### Class: ClassName

#### new ClassName(options)

Creates a new instance.

**Parameters:**
- \`options.prop\` (string) - Description

#### instance.method(arg)

Description.

**Parameters:**
- \`arg\` (type) - Description

**Returns:** type - Description

**Example:**

\`\`\`javascript
const instance = new ClassName({ prop: 'value' });
instance.method('arg');
\`\`\`

## License

MIT
```

### Badge URL Patterns

Use shields.io for consistent badge styling:

```
Build Status:
![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/WORKFLOW.yml?branch=main)

Coverage:
![Coverage](https://img.shields.io/codecov/c/github/OWNER/REPO)

npm Version:
![npm](https://img.shields.io/npm/v/PACKAGE)

Downloads:
![Downloads](https://img.shields.io/npm/dm/PACKAGE)

License:
![License](https://img.shields.io/npm/l/PACKAGE)

GitHub Stars:
![Stars](https://img.shields.io/github/stars/OWNER/REPO)

Issues:
![Issues](https://img.shields.io/github/issues/OWNER/REPO)

PRs Welcome:
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

TypeScript:
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

Node Version:
![Node](https://img.shields.io/node/v/PACKAGE)
```

---

## Activity: Architecture Update

### Workflow
1. Read existing ARCHITECTURE.md (if present)
2. Explore codebase for current patterns and structure
3. Identify new components, modules, or patterns
4. Update documentation while preserving user-written content
5. Add new sections for undocumented patterns

### Preservation Rules
- Keep existing section headers and structure
- Preserve user comments and explanations
- Update only factual content (file paths, component lists)
- Add new sections at appropriate locations

---

## Release Checklist

- [ ] Changelog updated with new version
- [ ] Readme reflects current project state
- [ ] Architecture documentation current
- [ ] Version bumped in package.json
- [ ] All changes reviewed and confirmed
