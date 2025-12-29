import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChangeCommand } from '../../../src/commands/change.js';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

describe('ChangeCommand.list', () => {
  let cmd: ChangeCommand;
  let tempRoot: string;
  let originalCwd: string;

  beforeAll(async () => {
    cmd = new ChangeCommand();
    originalCwd = process.cwd();
    tempRoot = path.join(os.tmpdir(), `plx-change-command-list-${Date.now()}`);
    const changeDir = path.join(tempRoot, 'workspace', 'changes', 'demo');
    await fs.mkdir(changeDir, { recursive: true });
    const proposal = `# Change: Demo\n\n## Why\nTest list.\n\n## What Changes\n- **auth:** Add requirement`;
    await fs.writeFile(path.join(changeDir, 'proposal.md'), proposal, 'utf-8');
    await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [x] Task 1\n- [ ] Task 2\n', 'utf-8');
    process.chdir(tempRoot);
  });

  afterAll(async () => {
    process.chdir(originalCwd);
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it('returns JSON with expected shape', async () => {
    // Capture console output
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.list({ json: true });

      const output = logs.join('\n');
      const parsed = JSON.parse(output);
      expect(Array.isArray(parsed)).toBe(true);
      if (parsed.length > 0) {
        const item = parsed[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('deltaCount');
        expect(item).toHaveProperty('taskStatus');
        expect(item.taskStatus).toHaveProperty('total');
        expect(item.taskStatus).toHaveProperty('completed');
      }
    } finally {
      console.log = origLog;
    }
  });

  it('prints IDs by default and details with --long', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };
      await cmd.list({});
      const idsOnly = logs.join('\n');
      expect(idsOnly).toMatch(/\w+/);
      logs.length = 0;
      await cmd.list({ long: true });
      const longOut = logs.join('\n');
      expect(longOut).toMatch(/:\s/);
      expect(longOut).toMatch(/\[deltas\s\d+\]/);
    } finally {
      console.log = origLog;
    }
  });
});

describe('ChangeCommand.list issue display format', () => {
  let cmd: ChangeCommand;
  let tempRoot: string;
  let originalCwd: string;

  beforeAll(async () => {
    cmd = new ChangeCommand();
    originalCwd = process.cwd();
    tempRoot = path.join(os.tmpdir(), `plx-change-command-issue-${Date.now()}`);
    const changeDir = path.join(tempRoot, 'workspace', 'changes', 'with-issue');
    await fs.mkdir(changeDir, { recursive: true });

    // Create proposal with tracked issue
    const proposal = `---
tracked-issues:
  - tracker: linear
    id: PROJ-456
    url: https://linear.app/proj/issue/PROJ-456
---

# Change: Feature With Issue

## Why
Testing issue display format.

## What Changes
- **spec:** Add requirement`;
    await fs.writeFile(path.join(changeDir, 'proposal.md'), proposal, 'utf-8');
    await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [x] Task 1\n', 'utf-8');
    process.chdir(tempRoot);
  });

  afterAll(async () => {
    process.chdir(originalCwd);
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it('displays issue after title in long format: changeName: title (issue) [deltas] [tasks]', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.list({ long: true });

      const output = logs.join('\n');

      // Verify format: changeName: title (issue) [deltas] [tasks]
      // The issue should appear AFTER the title, not before the colon
      expect(output).toMatch(/with-issue:\s+.+\(PROJ-456\)/);

      // More specific: verify the order is title then issue then deltas
      const line = logs.find(l => l.includes('with-issue'));
      expect(line).toBeDefined();

      if (line) {
        const colonIndex = line.indexOf(':');
        const issueIndex = line.indexOf('(PROJ-456)');
        const deltasIndex = line.indexOf('[deltas');

        // Issue should appear after colon (which comes after changeName)
        expect(issueIndex).toBeGreaterThan(colonIndex);
        // Deltas should appear after issue
        expect(deltasIndex).toBeGreaterThan(issueIndex);
      }
    } finally {
      console.log = origLog;
    }
  });

  it('includes tracked issue in JSON output', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.list({ json: true });

      const output = logs.join('\n');
      const parsed = JSON.parse(output);

      expect(Array.isArray(parsed)).toBe(true);
      const item = parsed.find((i: any) => i.id === 'with-issue');
      expect(item).toBeDefined();
      expect(item.trackedIssues).toBeDefined();
      expect(item.trackedIssues.length).toBeGreaterThan(0);
      expect(item.trackedIssues[0].id).toBe('PROJ-456');
    } finally {
      console.log = origLog;
    }
  });
});
