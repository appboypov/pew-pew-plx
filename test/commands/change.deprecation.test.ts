import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('change command deprecation warnings', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-change-deprecation-tmp');
  const changesDir = path.join(testDir, 'changes');
  const splxBin = path.join(projectRoot, 'bin', 'splx.js');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });

    const testProposal = `# Change: Test Change

## Overview
A test change for deprecation warnings.

## Requirements

## Deltas

### Added

#### Requirement: Feature A
The system SHALL implement feature A

##### Scenario: Feature A works
- **GIVEN** precondition
- **WHEN** action
- **THEN** result
`;

    await fs.mkdir(path.join(changesDir, 'test-change'), { recursive: true });
    await fs.mkdir(path.join(changesDir, 'test-change', 'tasks'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'test-change', 'proposal.md'), testProposal);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('splx change show', () => {
    it('should emit deprecation warning', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} change show test-change 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).toContain("Deprecation: 'splx change show <id>' is deprecated");
        expect(output).toContain("Use 'splx get change --id <id>' instead");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should suppress warning with --no-deprecation-warnings flag', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} --no-deprecation-warnings change show test-change 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).not.toContain("Deprecation:");
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('splx change list', () => {
    it('should emit deprecation warning', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} change list 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).toContain("Deprecation: 'splx change list' is deprecated");
        expect(output).toContain("Use 'splx get changes' instead");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should suppress warning with --no-deprecation-warnings flag', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} --no-deprecation-warnings change list 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).not.toContain("Deprecation:");
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('splx change validate', () => {
    it('should emit deprecation warning', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} change validate test-change 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).toContain("Deprecation: 'splx change validate <id>' is deprecated");
        expect(output).toContain("Use 'splx validate change --id <id>' instead");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should suppress warning with --no-deprecation-warnings flag', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} --no-deprecation-warnings change validate test-change 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).not.toContain("Deprecation:");
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});
