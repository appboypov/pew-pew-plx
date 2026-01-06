import { describe, it, expect } from 'vitest';
import { TemplateManager } from '../../../src/core/templates/index.js';

describe('entity templates', () => {
  describe('taskTemplate', () => {
    it('generates task with title', () => {
      const content = TemplateManager.getTaskTemplate({ title: 'My Task' });
      expect(content).toContain('status: to-do');
      expect(content).toContain('# Task: My Task');
      expect(content).toContain('## End Goal');
      expect(content).toContain('## Implementation Checklist');
    });

    it('includes skill-level when provided', () => {
      const content = TemplateManager.getTaskTemplate({ title: 'My Task', skillLevel: 'senior' });
      expect(content).toContain('skill-level: senior');
    });

    it('omits skill-level when not provided', () => {
      const content = TemplateManager.getTaskTemplate({ title: 'My Task' });
      expect(content).not.toContain('skill-level:');
    });

    it('supports all skill levels', () => {
      const juniorContent = TemplateManager.getTaskTemplate({ title: 'Task', skillLevel: 'junior' });
      expect(juniorContent).toContain('skill-level: junior');

      const mediorContent = TemplateManager.getTaskTemplate({ title: 'Task', skillLevel: 'medior' });
      expect(mediorContent).toContain('skill-level: medior');

      const seniorContent = TemplateManager.getTaskTemplate({ title: 'Task', skillLevel: 'senior' });
      expect(seniorContent).toContain('skill-level: senior');
    });

    it('includes all required sections', () => {
      const content = TemplateManager.getTaskTemplate({ title: 'Complete Task' });
      expect(content).toContain('## End Goal');
      expect(content).toContain('## Currently');
      expect(content).toContain('## Should');
      expect(content).toContain('## Constraints');
      expect(content).toContain('## Acceptance Criteria');
      expect(content).toContain('## Implementation Checklist');
      expect(content).toContain('## Notes');
    });
  });

  describe('changeTemplate', () => {
    it('generates change proposal with name', () => {
      const content = TemplateManager.getChangeTemplate({ name: 'Add Feature' });
      expect(content).toContain('# Change: Add Feature');
      expect(content).toContain('## Why');
      expect(content).toContain('## What Changes');
      expect(content).toContain('## Impact');
    });

    it('includes all required sections', () => {
      const content = TemplateManager.getChangeTemplate({ name: 'Update System' });
      expect(content).toContain('## Why');
      expect(content).toContain('TBD - 1-2 sentences on problem/opportunity');
      expect(content).toContain('## What Changes');
      expect(content).toContain('## Impact');
      expect(content).toContain('- Affected specs: TBD');
      expect(content).toContain('- Affected code: TBD');
    });
  });

  describe('specTemplate', () => {
    it('generates spec with name', () => {
      const content = TemplateManager.getSpecTemplate({ name: 'auth-flow' });
      expect(content).toContain('# auth-flow Specification');
      expect(content).toContain('## Purpose');
      expect(content).toContain('## Requirements');
      expect(content).toContain('#### Scenario:');
    });

    it('includes requirement structure', () => {
      const content = TemplateManager.getSpecTemplate({ name: 'user-management' });
      expect(content).toContain('### Requirement: Example Requirement');
      expect(content).toContain('#### Scenario: Example scenario');
      expect(content).toContain('- **WHEN** TBD');
      expect(content).toContain('- **THEN** TBD');
    });
  });

  describe('requestTemplate', () => {
    it('generates request with description', () => {
      const content = TemplateManager.getRequestTemplate({ description: 'Add user login' });
      expect(content).toContain('# Request: Add user login');
      expect(content).toContain('## Source Input');
      expect(content).toContain('## Current Understanding');
      expect(content).toContain('## Identified Ambiguities');
      expect(content).toContain('## Decisions');
      expect(content).toContain('## Final Intent');
    });

    it('includes all required sections', () => {
      const content = TemplateManager.getRequestTemplate({ description: 'Implement dark mode' });
      expect(content).toContain('## Source Input');
      expect(content).toContain('TBD - Where the request came from.');
      expect(content).toContain('## Current Understanding');
      expect(content).toContain('1. TBD');
      expect(content).toContain('## Identified Ambiguities');
      expect(content).toContain('## Decisions');
      expect(content).toContain('## Final Intent');
      expect(content).toContain('TBD - Clear statement of what should happen.');
    });
  });
});
