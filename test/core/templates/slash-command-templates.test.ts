import { describe, it, expect } from 'vitest';
import { TemplateManager } from '../../../src/core/templates/index.js';

describe('slash-command-templates', () => {
  describe('getSlashCommandBody', () => {
    it('returns non-empty content for sync-workspace', () => {
      const result = TemplateManager.getSlashCommandBody('sync-workspace');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for sync-tasks', () => {
      const result = TemplateManager.getSlashCommandBody('sync-tasks');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for complete-task', () => {
      const result = TemplateManager.getSlashCommandBody('complete-task');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for undo-task', () => {
      const result = TemplateManager.getSlashCommandBody('undo-task');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for refine-testing', () => {
      const result = TemplateManager.getSlashCommandBody('refine-testing');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for test', () => {
      const result = TemplateManager.getSlashCommandBody('test');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for refine-release', () => {
      const result = TemplateManager.getSlashCommandBody('refine-release');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for refine-review', () => {
      const result = TemplateManager.getSlashCommandBody('refine-review');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for archive', () => {
      const result = TemplateManager.getSlashCommandBody('archive');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for copy-next-task', () => {
      const result = TemplateManager.getSlashCommandBody('copy-next-task');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for copy-review-request', () => {
      const result = TemplateManager.getSlashCommandBody('copy-review-request');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for copy-test-request', () => {
      const result = TemplateManager.getSlashCommandBody('copy-test-request');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for get-task', () => {
      const result = TemplateManager.getSlashCommandBody('get-task');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for implement', () => {
      const result = TemplateManager.getSlashCommandBody('implement');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for orchestrate', () => {
      const result = TemplateManager.getSlashCommandBody('orchestrate');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for parse-feedback', () => {
      const result = TemplateManager.getSlashCommandBody('parse-feedback');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for plan-implementation', () => {
      const result = TemplateManager.getSlashCommandBody('plan-implementation');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for plan-proposal', () => {
      const result = TemplateManager.getSlashCommandBody('plan-proposal');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for plan-request', () => {
      const result = TemplateManager.getSlashCommandBody('plan-request');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for prepare-compact', () => {
      const result = TemplateManager.getSlashCommandBody('prepare-compact');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for prepare-release', () => {
      const result = TemplateManager.getSlashCommandBody('prepare-release');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for refine-architecture', () => {
      const result = TemplateManager.getSlashCommandBody('refine-architecture');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns non-empty content for review', () => {
      const result = TemplateManager.getSlashCommandBody('review');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('plan-proposal includes template reading step', () => {
      const result = TemplateManager.getSlashCommandBody('plan-proposal');
      expect(result).toContain('Read all task templates in `workspace/templates/`');
      expect(result).toContain('workspace/AGENTS.md');
      expect(result).toContain('type, blocked-by fields');
      expect(result).toContain('blocked-by:');
    });
  });
});
