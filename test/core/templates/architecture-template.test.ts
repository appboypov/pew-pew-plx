import { describe, it, expect } from 'vitest';
import { architectureTemplate, ArchitectureContext } from '../../../src/core/templates/architecture-template.js';

describe('architecture-template', () => {
  describe('architectureTemplate', () => {
    it('generates template with all required sections', () => {
      const template = architectureTemplate();

      expect(template).toContain('# Architecture');
      expect(template).toContain('## Overview');
      expect(template).toContain('## Project Setup');
      expect(template).toContain('### Prerequisites');
      expect(template).toContain('### Installation');
      expect(template).toContain('### Development');
      expect(template).toContain('## Technology Stack');
      expect(template).toContain('### Core Technologies');
      expect(template).toContain('### Key Dependencies');
      expect(template).toContain('## Project Structure');
      expect(template).toContain('## Service Types and Patterns');
      expect(template).toContain('### Service Architecture');
      expect(template).toContain('### Common Patterns');
      expect(template).toContain('## State Management');
      expect(template).toContain('### Approach');
      expect(template).toContain('### State Flow');
      expect(template).toContain('## Conventions');
      expect(template).toContain('### Naming Conventions');
      expect(template).toContain('### Code Organization');
      expect(template).toContain('### Error Handling');
      expect(template).toContain('## API Patterns');
      expect(template).toContain('### External APIs');
      expect(template).toContain('### Internal APIs');
    });

    it('uses TBD placeholders for empty context', () => {
      const template = architectureTemplate();

      expect(template).toContain('TBD');
    });

    it('uses provided description in overview', () => {
      const context: ArchitectureContext = {
        description: 'A CLI tool for managing specifications'
      };

      const template = architectureTemplate(context);

      expect(template).toContain('A CLI tool for managing specifications');
      expect(template).not.toContain('TBD - Describe the project purpose');
    });

    it('handles empty context object', () => {
      const template = architectureTemplate({});

      expect(template).toContain('## Overview');
      expect(template).toContain('TBD');
    });
  });
});
