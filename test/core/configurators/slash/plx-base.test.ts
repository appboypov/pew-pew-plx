import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { PlxClaudeSlashCommandConfigurator } from '../../../../src/core/configurators/slash/plx-claude.js';
import { PLX_MARKERS } from '../../../../src/core/config.js';

describe('PlxSlashCommandConfigurator base class', () => {
  let testDir: string;
  let configurator: PlxClaudeSlashCommandConfigurator;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `plx-base-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
    configurator = new PlxClaudeSlashCommandConfigurator();

    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  describe('updateExisting', () => {
    it('only updates files that exist and returns updated paths', async () => {
      const plxDir = path.join(testDir, '.claude', 'commands', 'plx');
      await fs.mkdir(plxDir, { recursive: true });

      const initArchPath = path.join(plxDir, 'init-architecture.md');
      const originalContent = `---
name: PLX: Init Architecture
---
${PLX_MARKERS.start}
Old body content
${PLX_MARKERS.end}
`;
      await fs.writeFile(initArchPath, originalContent);

      const updated = await configurator.updateExisting(testDir);

      expect(updated).toHaveLength(1);
      expect(updated[0]).toBe('.claude/commands/plx/init-architecture.md');

      const newContent = await fs.readFile(initArchPath, 'utf-8');
      expect(newContent).toContain(PLX_MARKERS.start);
      expect(newContent).toContain(PLX_MARKERS.end);
      expect(newContent).not.toContain('Old body content');
    });

    it('returns empty array when no PLX files exist', async () => {
      const updated = await configurator.updateExisting(testDir);

      expect(updated).toHaveLength(0);
    });

    it('preserves content outside markers', async () => {
      const plxDir = path.join(testDir, '.claude', 'commands', 'plx');
      await fs.mkdir(plxDir, { recursive: true });

      const initArchPath = path.join(plxDir, 'init-architecture.md');
      const originalContent = `---
name: PLX: Init Architecture
description: Custom description
---
${PLX_MARKERS.start}
Old body
${PLX_MARKERS.end}
`;
      await fs.writeFile(initArchPath, originalContent);

      await configurator.updateExisting(testDir);

      const newContent = await fs.readFile(initArchPath, 'utf-8');
      expect(newContent).toContain('Custom description');
    });
  });
});
