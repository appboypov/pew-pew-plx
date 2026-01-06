import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ArchiveCommand } from '../../src/core/archive.js';
import { Validator } from '../../src/core/validation/validator.js';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Mock @inquirer/prompts
vi.mock('@inquirer/prompts', () => ({
  select: vi.fn(),
  confirm: vi.fn()
}));

describe('ArchiveCommand', () => {
  let tempDir: string;
  let archiveCommand: ArchiveCommand;
  const originalConsoleLog = console.log;

  beforeEach(async () => {
    // Create temp directory
    tempDir = path.join(os.tmpdir(), `plx-archive-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    // Change to temp directory
    process.chdir(tempDir);
    
    // Create OpenSpec structure
    const workspaceDir = path.join(tempDir, 'workspace');
    await fs.mkdir(path.join(workspaceDir, 'changes'), { recursive: true });
    await fs.mkdir(path.join(workspaceDir, 'specs'), { recursive: true });
    await fs.mkdir(path.join(workspaceDir, 'tasks'), { recursive: true });
    await fs.mkdir(path.join(workspaceDir, 'changes', 'archive'), { recursive: true });

    // Suppress console.log during tests
    console.log = vi.fn();

    archiveCommand = new ArchiveCommand();
  });

  // Helper to create a centralized task
  async function createCentralizedTask(
    parentId: string,
    parentType: 'change' | 'review',
    taskNumber: number = 1,
    status: 'to-do' | 'in-progress' | 'done' = 'to-do'
  ): Promise<void> {
    const workspaceDir = path.join(tempDir, 'workspace');
    const tasksDir = path.join(workspaceDir, 'tasks');
    const filename = `${String(taskNumber).padStart(3, '0')}-${parentId}-task.md`;
    const content = `---
status: ${status}
parent-type: ${parentType}
parent-id: ${parentId}
---

# Task for ${parentId}

This is a test task.`;
    await fs.writeFile(path.join(tasksDir, filename), content);
  }

  afterEach(async () => {
    // Restore console.log
    console.log = originalConsoleLog;
    
    // Clear mocks
    vi.clearAllMocks();
    
    // Clean up temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('archiveChangeById', () => {
    it('should archive a change successfully', async () => {
      // Create a test change
      const changeName = 'test-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create tasks.md with completed tasks
      const tasksContent = '- [x] Task 1\n- [x] Task 2';
      await fs.writeFile(path.join(changeDir, 'tasks.md'), tasksContent);

      // Execute archive with --yes flag
      await archiveCommand.archiveChangeById(changeName, { yes: true });

      // Check that change was moved to archive
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);

      expect(archives.length).toBe(1);
      expect(archives[0]).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${changeName}`));

      // Verify original change directory no longer exists
      await expect(fs.access(changeDir)).rejects.toThrow();
    });

    it('should throw error if change does not exist', async () => {
      await expect(
        archiveCommand.archiveChangeById('non-existent-change', { yes: true })
      ).rejects.toThrow("Change 'non-existent-change' not found.");
    });
  });

  describe('archiveReviewById', () => {
    it('should archive a review successfully', async () => {
      // Create a test review
      const reviewName = 'test-review';
      const reviewDir = path.join(tempDir, 'workspace', 'reviews', reviewName);
      await fs.mkdir(reviewDir, { recursive: true });

      // Create review.md
      const reviewContent = '---\nstatus: open\n---\n# Review';
      await fs.writeFile(path.join(reviewDir, 'review.md'), reviewContent);

      // Execute archive with --yes flag and skip validation
      await archiveCommand.archiveReviewById(reviewName, { yes: true, noValidate: true });

      // Check that review was moved to archive
      const archiveDir = path.join(tempDir, 'workspace', 'reviews', 'archive');
      const archives = await fs.readdir(archiveDir);

      expect(archives.length).toBe(1);
      expect(archives[0]).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${reviewName}`));

      // Verify original review directory no longer exists
      await expect(fs.access(reviewDir)).rejects.toThrow();
    });

    it('should throw error if review does not exist', async () => {
      // Create reviews directory first
      await fs.mkdir(path.join(tempDir, 'workspace', 'reviews'), { recursive: true });

      await expect(
        archiveCommand.archiveReviewById('non-existent-review', { yes: true })
      ).rejects.toThrow("Review 'non-existent-review' not found.");
    });

    it('should archive review tasks and show task count', async () => {
      const reviewName = 'test-review-with-tasks';
      const reviewDir = path.join(tempDir, 'workspace', 'reviews', reviewName);
      await fs.mkdir(reviewDir, { recursive: true });

      // Create review.md
      const reviewContent = '---\nstatus: open\n---\n# Review';
      await fs.writeFile(path.join(reviewDir, 'review.md'), reviewContent);

      // Create review tasks
      await createCentralizedTask(reviewName, 'review', 1, 'done');
      await createCentralizedTask(reviewName, 'review', 2, 'done');

      // Execute archive with --yes flag and skip validation
      await archiveCommand.archiveReviewById(reviewName, { yes: true, noValidate: true });

      // Verify task count was displayed in output
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/archived as '.*' \(2 tasks archived\)/)
      );
    });

    it('should check review task completion using frontmatter status', async () => {
      const reviewName = 'review-incomplete-tasks';
      const reviewDir = path.join(tempDir, 'workspace', 'reviews', reviewName);
      await fs.mkdir(reviewDir, { recursive: true });

      // Create review.md
      const reviewContent = '---\nstatus: open\n---\n# Review';
      await fs.writeFile(path.join(reviewDir, 'review.md'), reviewContent);

      // Create review tasks with different statuses
      await createCentralizedTask(reviewName, 'review', 1, 'done');
      await createCentralizedTask(reviewName, 'review', 2, 'to-do');

      // Execute archive with --yes flag and skip validation
      await archiveCommand.archiveReviewById(reviewName, { yes: true, noValidate: true });

      // Verify status was checked correctly
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Warning: 1 incomplete task(s) found')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Task status: 1/2 tasks complete')
      );
    });
  });

  describe('execute', () => {
    it('should archive a change successfully', async () => {
      // Create a test change
      const changeName = 'test-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create tasks.md with completed tasks
      const tasksContent = '- [x] Task 1\n- [x] Task 2';
      await fs.writeFile(path.join(changeDir, 'tasks.md'), tasksContent);

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Check that change was moved to archive
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);

      expect(archives.length).toBe(1);
      expect(archives[0]).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${changeName}`));

      // Verify original change directory no longer exists
      await expect(fs.access(changeDir)).rejects.toThrow();
    });

    it('should warn about incomplete tasks', async () => {
      const changeName = 'incomplete-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create centralized tasks: 1 done, 2 to-do
      await createCentralizedTask(changeName, 'change', 1, 'done');
      await createCentralizedTask(changeName, 'change', 2, 'to-do');
      await createCentralizedTask(changeName, 'change', 3, 'to-do');

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Verify warning was logged
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Warning: 2 incomplete task(s) found')
      );
    });

    it('should check task completion using frontmatter status', async () => {
      const changeName = 'status-check-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create tasks with different statuses in frontmatter
      await createCentralizedTask(changeName, 'change', 1, 'done');
      await createCentralizedTask(changeName, 'change', 2, 'in-progress');
      await createCentralizedTask(changeName, 'change', 3, 'to-do');

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Verify status was checked correctly (2 incomplete tasks)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Warning: 2 incomplete task(s) found')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Task status: 1/3 tasks complete')
      );
    });

    it('should show task count in archive output', async () => {
      const changeName = 'task-count-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create tasks for this change
      await createCentralizedTask(changeName, 'change', 1, 'done');
      await createCentralizedTask(changeName, 'change', 2, 'done');
      await createCentralizedTask(changeName, 'change', 3, 'done');

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Verify task count was displayed in output
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/archived as '.*' \(3 tasks archived\)/)
      );
    });

    it('should not show task count when no tasks archived', async () => {
      const changeName = 'no-tasks-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Execute archive without any tasks
      await archiveCommand.execute(changeName, { yes: true });

      // Verify output does not mention tasks
      const calls = (console.log as any).mock.calls;
      const archiveMessage = calls.find((call: any[]) =>
        call[0] && call[0].includes('archived as')
      );
      expect(archiveMessage).toBeDefined();
      expect(archiveMessage[0]).not.toContain('tasks archived');
    });

    it('should show singular task in archive output when 1 task', async () => {
      const changeName = 'one-task-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create single task
      await createCentralizedTask(changeName, 'change', 1, 'done');

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Verify singular form is used
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/archived as '.*' \(1 task archived\)/)
      );
    });

    it('should recognize done status as complete', async () => {
      const changeName = 'done-status-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create tasks all with 'done' status
      await createCentralizedTask(changeName, 'change', 1, 'done');
      await createCentralizedTask(changeName, 'change', 2, 'done');

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Verify no incomplete task warning
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('incomplete task(s) found')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Task status: ✓ Complete (2/2 tasks)')
      );
    });

    it('should recognize in-progress status as incomplete', async () => {
      const changeName = 'inprogress-status-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create task with in-progress status
      await createCentralizedTask(changeName, 'change', 1, 'in-progress');

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Verify incomplete warning
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Warning: 1 incomplete task(s) found')
      );
    });

    it('should recognize to-do status as incomplete', async () => {
      const changeName = 'todo-status-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create task with to-do status
      await createCentralizedTask(changeName, 'change', 1, 'to-do');

      // Execute archive with --yes flag
      await archiveCommand.execute(changeName, { yes: true });

      // Verify incomplete warning
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Warning: 1 incomplete task(s) found')
      );
    });

    it('should update specs when archiving (delta-based ADDED) and include change name in skeleton', async () => {
      const changeName = 'spec-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'test-capability');
      await fs.mkdir(changeSpecDir, { recursive: true });
      
      // Create delta-based change spec (ADDED requirement)
      const specContent = `# Test Capability Spec - Changes

## ADDED Requirements

### Requirement: The system SHALL provide test capability

#### Scenario: Basic test
Given a test condition
When an action occurs
Then expected result happens`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), specContent);
      
      // Execute archive with --yes flag and skip validation for speed
      await archiveCommand.execute(changeName, { yes: true, noValidate: true });
      
      // Verify spec was created from skeleton and ADDED requirement applied
      const mainSpecPath = path.join(tempDir, 'workspace', 'specs', 'test-capability', 'spec.md');
      const updatedContent = await fs.readFile(mainSpecPath, 'utf-8');
      expect(updatedContent).toContain('# test-capability Specification');
      expect(updatedContent).toContain('## Purpose');
      expect(updatedContent).toContain(`created by archiving change ${changeName}`);
      expect(updatedContent).toContain('## Requirements');
      expect(updatedContent).toContain('### Requirement: The system SHALL provide test capability');
      expect(updatedContent).toContain('#### Scenario: Basic test');
    });

    it('should allow REMOVED requirements when creating new spec file (issue #403)', async () => {
      const changeName = 'new-spec-with-removed';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'gift-card');
      await fs.mkdir(changeSpecDir, { recursive: true });
      
      // Create delta spec with both ADDED and REMOVED requirements
      // This simulates refactoring where old fields are removed and new ones are added
      const specContent = `# Gift Card - Changes

## ADDED Requirements

### Requirement: Logo and Background Color
The system SHALL support logo and backgroundColor fields for gift cards.

#### Scenario: Display gift card with logo
- **WHEN** a gift card is displayed
- **THEN** it shows the logo and backgroundColor

## REMOVED Requirements

### Requirement: Image Field
### Requirement: Thumbnail Field`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), specContent);
      
      // Execute archive - should succeed with warning about REMOVED requirements
      await archiveCommand.execute(changeName, { yes: true, noValidate: true });
      
      // Verify warning was logged about REMOVED requirements being ignored
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Warning: gift-card - 2 REMOVED requirement(s) ignored for new spec (nothing to remove).')
      );
      
      // Verify spec was created with only ADDED requirements
      const mainSpecPath = path.join(tempDir, 'workspace', 'specs', 'gift-card', 'spec.md');
      const updatedContent = await fs.readFile(mainSpecPath, 'utf-8');
      expect(updatedContent).toContain('# gift-card Specification');
      expect(updatedContent).toContain('### Requirement: Logo and Background Color');
      expect(updatedContent).toContain('#### Scenario: Display gift card with logo');
      // REMOVED requirements should not be in the final spec
      expect(updatedContent).not.toContain('### Requirement: Image Field');
      expect(updatedContent).not.toContain('### Requirement: Thumbnail Field');
      
      // Verify change was archived successfully
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives.length).toBeGreaterThan(0);
      expect(archives.some(a => a.includes(changeName))).toBe(true);
    });

    it('should still error on MODIFIED when creating new spec file', async () => {
      const changeName = 'new-spec-with-modified';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'new-capability');
      await fs.mkdir(changeSpecDir, { recursive: true });
      
      // Create delta spec with MODIFIED requirement (should fail for new spec)
      const specContent = `# New Capability - Changes

## ADDED Requirements

### Requirement: New Feature
New feature description.

## MODIFIED Requirements

### Requirement: Existing Feature
Modified content.`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), specContent);
      
      // Execute archive - should abort with error message (not throw, but log and return)
      await archiveCommand.execute(changeName, { yes: true, noValidate: true });
      
      // Verify error message mentions MODIFIED not allowed for new specs
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('new-capability: target spec does not exist; only ADDED requirements are allowed for new specs. MODIFIED and RENAMED operations require an existing spec.')
      );
      expect(console.log).toHaveBeenCalledWith('Aborted. No files were changed.');
      
      // Verify spec was NOT created
      const mainSpecPath = path.join(tempDir, 'workspace', 'specs', 'new-capability', 'spec.md');
      await expect(fs.access(mainSpecPath)).rejects.toThrow();
      
      // Verify change was NOT archived
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives.some(a => a.includes(changeName))).toBe(false);
    });

    it('should still error on RENAMED when creating new spec file', async () => {
      const changeName = 'new-spec-with-renamed';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'another-capability');
      await fs.mkdir(changeSpecDir, { recursive: true });
      
      // Create delta spec with RENAMED requirement (should fail for new spec)
      const specContent = `# Another Capability - Changes

## ADDED Requirements

### Requirement: New Feature
New feature description.

## RENAMED Requirements
- FROM: \`### Requirement: Old Name\`
- TO: \`### Requirement: New Name\``;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), specContent);
      
      // Execute archive - should abort with error message (not throw, but log and return)
      await archiveCommand.execute(changeName, { yes: true, noValidate: true });
      
      // Verify error message mentions RENAMED not allowed for new specs
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('another-capability: target spec does not exist; only ADDED requirements are allowed for new specs. MODIFIED and RENAMED operations require an existing spec.')
      );
      expect(console.log).toHaveBeenCalledWith('Aborted. No files were changed.');
      
      // Verify spec was NOT created
      const mainSpecPath = path.join(tempDir, 'workspace', 'specs', 'another-capability', 'spec.md');
      await expect(fs.access(mainSpecPath)).rejects.toThrow();
      
      // Verify change was NOT archived
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives.some(a => a.includes(changeName))).toBe(false);
    });

    it('should throw error if change does not exist', async () => {
      await expect(
        archiveCommand.execute('non-existent-change', { yes: true })
      ).rejects.toThrow("Item 'non-existent-change' not found in changes or reviews. Use 'plx get changes' or 'plx get reviews' to see available items.");
    });

    it('should throw error if archive already exists', async () => {
      const changeName = 'duplicate-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });
      
      // Create existing archive with same date
      const date = new Date().toISOString().split('T')[0];
      const archivePath = path.join(tempDir, 'workspace', 'changes', 'archive', `${date}-${changeName}`);
      await fs.mkdir(archivePath, { recursive: true });
      
      // Try to archive
      await expect(
        archiveCommand.execute(changeName, { yes: true })
      ).rejects.toThrow(`Archive '${date}-${changeName}' already exists.`);
    });

    it('should handle changes without tasks.md', async () => {
      const changeName = 'no-tasks-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });
      
      // Execute archive without tasks.md
      await archiveCommand.execute(changeName, { yes: true });
      
      // Should complete without warnings
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('incomplete task(s)')
      );
      
      // Verify change was archived
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives.length).toBe(1);
    });

    it('should handle changes without specs', async () => {
      const changeName = 'no-specs-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });
      
      // Execute archive without specs
      await archiveCommand.execute(changeName, { yes: true });
      
      // Should complete without spec updates
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('Specs to update')
      );
      
      // Verify change was archived
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives.length).toBe(1);
    });

    it('should skip spec updates when --skip-specs flag is used', async () => {
      const changeName = 'skip-specs-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'test-capability');
      await fs.mkdir(changeSpecDir, { recursive: true });
      
      // Create spec in change
      const specContent = '# Test Capability Spec\n\nTest content';
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), specContent);
      
      // Execute archive with --skip-specs flag and noValidate to skip validation
      await archiveCommand.execute(changeName, { yes: true, skipSpecs: true, noValidate: true });
      
      // Verify skip message was logged
      expect(console.log).toHaveBeenCalledWith(
        'Skipping spec updates (--skip-specs flag provided).'
      );
      
      // Verify spec was NOT copied to main specs
      const mainSpecPath = path.join(tempDir, 'workspace', 'specs', 'test-capability', 'spec.md');
      await expect(fs.access(mainSpecPath)).rejects.toThrow();
      
      // Verify change was still archived
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives.length).toBe(1);
      expect(archives[0]).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${changeName}`));
    });

    it('should skip validation when commander sets validate to false (--no-validate)', async () => {
      const changeName = 'skip-validation-flag';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'unstable-capability');
      await fs.mkdir(changeSpecDir, { recursive: true });

      const deltaSpec = `# Unstable Capability

## ADDED Requirements

### Requirement: Logging Feature
**ID**: REQ-LOG-001

The system will log all events.

#### Scenario: Event recorded
- **WHEN** an event occurs
- **THEN** it is captured`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), deltaSpec);
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '- [x] Task 1\n');

      const deltaSpy = vi.spyOn(Validator.prototype, 'validateChangeDeltaSpecs');
      const specContentSpy = vi.spyOn(Validator.prototype, 'validateSpecContent');

      try {
        await archiveCommand.execute(changeName, { yes: true, skipSpecs: true, validate: false });

        expect(deltaSpy).not.toHaveBeenCalled();
        expect(specContentSpy).not.toHaveBeenCalled();

        const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
        const archives = await fs.readdir(archiveDir);
        expect(archives.length).toBe(1);
        expect(archives[0]).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${changeName}`));
      } finally {
        deltaSpy.mockRestore();
        specContentSpy.mockRestore();
      }
    });

    it('should proceed with archive when user declines spec updates', async () => {
      const { confirm } = await import('@inquirer/prompts');
      const mockConfirm = confirm as unknown as ReturnType<typeof vi.fn>;
      
      const changeName = 'decline-specs-feature';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'test-capability');
      await fs.mkdir(changeSpecDir, { recursive: true });
      
      // Create valid spec in change
      const specContent = `# Test Capability Spec

## Purpose
This is a test capability specification.

## Requirements

### The system SHALL provide test capability

#### Scenario: Basic test
Given a test condition
When an action occurs
Then expected result happens`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), specContent);
      
      // Mock confirm to return false (decline spec updates)
      mockConfirm.mockResolvedValueOnce(false);
      
      // Execute archive without --yes flag
      await archiveCommand.execute(changeName);
      
      // Verify user was prompted about specs
      expect(mockConfirm).toHaveBeenCalledWith({
        message: 'Proceed with spec updates?',
        default: true
      });
      
      // Verify skip message was logged
      expect(console.log).toHaveBeenCalledWith(
        'Skipping spec updates. Proceeding with archive.'
      );
      
      // Verify spec was NOT copied to main specs
      const mainSpecPath = path.join(tempDir, 'workspace', 'specs', 'test-capability', 'spec.md');
      await expect(fs.access(mainSpecPath)).rejects.toThrow();
      
      // Verify change was still archived
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives.length).toBe(1);
      expect(archives[0]).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${changeName}`));
    });

    it('should support header trim-only normalization for matching', async () => {
      const changeName = 'normalize-headers';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'alpha');
      await fs.mkdir(changeSpecDir, { recursive: true });

      // Create existing main spec with a requirement (no extra trailing spaces)
      const mainSpecDir = path.join(tempDir, 'workspace', 'specs', 'alpha');
      await fs.mkdir(mainSpecDir, { recursive: true });
      const mainContent = `# alpha Specification

## Purpose
Alpha purpose.

## Requirements

### Requirement: Important Rule
Some details.`;
      await fs.writeFile(path.join(mainSpecDir, 'spec.md'), mainContent);

      // Change attempts to modify the same requirement but with trailing spaces after the name
      const deltaContent = `# Alpha - Changes

## MODIFIED Requirements

### Requirement: Important Rule   
Updated details.`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), deltaContent);

      await archiveCommand.execute(changeName, { yes: true, noValidate: true });

      const updated = await fs.readFile(path.join(mainSpecDir, 'spec.md'), 'utf-8');
      expect(updated).toContain('### Requirement: Important Rule');
      expect(updated).toContain('Updated details.');
    });

    it('should apply operations in order: RENAMED → REMOVED → MODIFIED → ADDED', async () => {
      const changeName = 'apply-order';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'beta');
      await fs.mkdir(changeSpecDir, { recursive: true });

      // Main spec with two requirements A and B
      const mainSpecDir = path.join(tempDir, 'workspace', 'specs', 'beta');
      await fs.mkdir(mainSpecDir, { recursive: true });
      const mainContent = `# beta Specification

## Purpose
Beta purpose.

## Requirements

### Requirement: A
content A

### Requirement: B
content B`;
      await fs.writeFile(path.join(mainSpecDir, 'spec.md'), mainContent);

      // Rename A->C, Remove B, Modify C, Add D
      const deltaContent = `# Beta - Changes

## RENAMED Requirements
- FROM: \`### Requirement: A\`
- TO: \`### Requirement: C\`

## REMOVED Requirements
### Requirement: B

## MODIFIED Requirements
### Requirement: C
updated C

## ADDED Requirements
### Requirement: D
content D`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), deltaContent);

      await archiveCommand.execute(changeName, { yes: true, noValidate: true });

      const updated = await fs.readFile(path.join(mainSpecDir, 'spec.md'), 'utf-8');
      expect(updated).toContain('### Requirement: C');
      expect(updated).toContain('updated C');
      expect(updated).toContain('### Requirement: D');
      expect(updated).not.toContain('### Requirement: A');
      expect(updated).not.toContain('### Requirement: B');
    });

    it('should abort with error when MODIFIED/REMOVED reference non-existent requirements', async () => {
      const changeName = 'validate-missing';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'gamma');
      await fs.mkdir(changeSpecDir, { recursive: true });

      // Main spec with no requirements
      const mainSpecDir = path.join(tempDir, 'workspace', 'specs', 'gamma');
      await fs.mkdir(mainSpecDir, { recursive: true });
      const mainContent = `# gamma Specification

## Purpose
Gamma purpose.

## Requirements`;
      await fs.writeFile(path.join(mainSpecDir, 'spec.md'), mainContent);

      // Delta tries to modify and remove non-existent requirement
      const deltaContent = `# Gamma - Changes

## MODIFIED Requirements
### Requirement: Missing
new text

## REMOVED Requirements
### Requirement: Another Missing`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), deltaContent);

      await archiveCommand.execute(changeName, { yes: true, noValidate: true });

      // Should not change the main spec and should not archive the change dir
      const still = await fs.readFile(path.join(mainSpecDir, 'spec.md'), 'utf-8');
      expect(still).toBe(mainContent);
      // Change dir should still exist since operation aborted
      await expect(fs.access(changeDir)).resolves.not.toThrow();
    });

    it('should require MODIFIED to reference the NEW header when a rename exists (error format)', async () => {
      const changeName = 'rename-modify-new-header';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const changeSpecDir = path.join(changeDir, 'specs', 'delta');
      await fs.mkdir(changeSpecDir, { recursive: true });

      // Main spec with Old
      const mainSpecDir = path.join(tempDir, 'workspace', 'specs', 'delta');
      await fs.mkdir(mainSpecDir, { recursive: true });
      const mainContent = `# delta Specification

## Purpose
Delta purpose.

## Requirements

### Requirement: Old
old body`;
      await fs.writeFile(path.join(mainSpecDir, 'spec.md'), mainContent);

      // Delta: rename Old->New, but MODIFIED references Old (should abort)
      const badDelta = `# Delta - Changes

## RENAMED Requirements
- FROM: \`### Requirement: Old\`
- TO: \`### Requirement: New\`

## MODIFIED Requirements
### Requirement: Old
new body`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), badDelta);

      await archiveCommand.execute(changeName, { yes: true, noValidate: true });
      const unchanged = await fs.readFile(path.join(mainSpecDir, 'spec.md'), 'utf-8');
      expect(unchanged).toBe(mainContent);
      // Assert error message format and abort notice
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('delta validation failed')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Aborted. No files were changed.')
      );

      // Fix MODIFIED to reference New (should succeed)
      const goodDelta = `# Delta - Changes

## RENAMED Requirements
- FROM: \`### Requirement: Old\`
- TO: \`### Requirement: New\`

## MODIFIED Requirements
### Requirement: New
new body`;
      await fs.writeFile(path.join(changeSpecDir, 'spec.md'), goodDelta);

      await archiveCommand.execute(changeName, { yes: true, noValidate: true });
      const updated = await fs.readFile(path.join(mainSpecDir, 'spec.md'), 'utf-8');
      expect(updated).toContain('### Requirement: New');
      expect(updated).toContain('new body');
      expect(updated).not.toContain('### Requirement: Old');
    });

    it('should process multiple specs atomically (any failure aborts all)', async () => {
      const changeName = 'multi-spec-atomic';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const spec1Dir = path.join(changeDir, 'specs', 'epsilon');
      const spec2Dir = path.join(changeDir, 'specs', 'zeta');
      await fs.mkdir(spec1Dir, { recursive: true });
      await fs.mkdir(spec2Dir, { recursive: true });

      // Existing main specs
      const epsilonMain = path.join(tempDir, 'workspace', 'specs', 'epsilon', 'spec.md');
      await fs.mkdir(path.dirname(epsilonMain), { recursive: true });
      await fs.writeFile(epsilonMain, `# epsilon Specification

## Purpose
Epsilon purpose.

## Requirements

### Requirement: E1
e1`);

      const zetaMain = path.join(tempDir, 'workspace', 'specs', 'zeta', 'spec.md');
      await fs.mkdir(path.dirname(zetaMain), { recursive: true });
      await fs.writeFile(zetaMain, `# zeta Specification

## Purpose
Zeta purpose.

## Requirements

### Requirement: Z1
z1`);

      // Delta: epsilon is valid modification; zeta tries to remove non-existent -> should abort both
      await fs.writeFile(path.join(spec1Dir, 'spec.md'), `# Epsilon - Changes

## MODIFIED Requirements
### Requirement: E1
E1 updated`);

      await fs.writeFile(path.join(spec2Dir, 'spec.md'), `# Zeta - Changes

## REMOVED Requirements
### Requirement: Missing`);

      await archiveCommand.execute(changeName, { yes: true, noValidate: true });

      const e1 = await fs.readFile(epsilonMain, 'utf-8');
      const z1 = await fs.readFile(zetaMain, 'utf-8');
      expect(e1).toContain('### Requirement: E1');
      expect(e1).not.toContain('E1 updated');
      expect(z1).toContain('### Requirement: Z1');
      // changeDir should still exist
      await expect(fs.access(changeDir)).resolves.not.toThrow();
    });

    it('should display aggregated totals across multiple specs', async () => {
      const changeName = 'multi-spec-totals';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      const spec1Dir = path.join(changeDir, 'specs', 'omega');
      const spec2Dir = path.join(changeDir, 'specs', 'psi');
      await fs.mkdir(spec1Dir, { recursive: true });
      await fs.mkdir(spec2Dir, { recursive: true });

      // Existing main specs
      const omegaMain = path.join(tempDir, 'workspace', 'specs', 'omega', 'spec.md');
      await fs.mkdir(path.dirname(omegaMain), { recursive: true });
      await fs.writeFile(omegaMain, `# omega Specification\n\n## Purpose\nOmega purpose.\n\n## Requirements\n\n### Requirement: O1\no1`);

      const psiMain = path.join(tempDir, 'workspace', 'specs', 'psi', 'spec.md');
      await fs.mkdir(path.dirname(psiMain), { recursive: true });
      await fs.writeFile(psiMain, `# psi Specification\n\n## Purpose\nPsi purpose.\n\n## Requirements\n\n### Requirement: P1\np1`);

      // Deltas: omega add one, psi rename and modify -> totals: +1, ~1, -0, →1
      await fs.writeFile(path.join(spec1Dir, 'spec.md'), `# Omega - Changes\n\n## ADDED Requirements\n\n### Requirement: O2\nnew`);
      await fs.writeFile(path.join(spec2Dir, 'spec.md'), `# Psi - Changes\n\n## RENAMED Requirements\n- FROM: \`### Requirement: P1\`\n- TO: \`### Requirement: P2\`\n\n## MODIFIED Requirements\n### Requirement: P2\nupdated`);

      await archiveCommand.execute(changeName, { yes: true, noValidate: true });

      // Verify aggregated totals line was printed
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Totals: + 1, ~ 1, - 0, → 1')
      );
    });
  });

  describe('error handling', () => {
    it('should throw error when workspace directory does not exist', async () => {
      // Remove workspace directory
      await fs.rm(path.join(tempDir, 'workspace'), { recursive: true });

      await expect(
        archiveCommand.execute('any-change', { yes: true })
      ).rejects.toThrow("Item 'any-change' not found in changes or reviews. Use 'plx get changes' or 'plx get reviews' to see available items.");
    });
  });

  describe('interactive mode', () => {
    it('should use select prompt for change selection', async () => {
      const { select } = await import('@inquirer/prompts');
      const mockSelect = select as unknown as ReturnType<typeof vi.fn>;
      
      // Create test changes
      const change1 = 'feature-a';
      const change2 = 'feature-b';
      await fs.mkdir(path.join(tempDir, 'workspace', 'changes', change1), { recursive: true });
      await fs.mkdir(path.join(tempDir, 'workspace', 'changes', change2), { recursive: true });
      
      // Mock select to return first change
      mockSelect.mockResolvedValueOnce(change1);
      
      // Execute without change name
      await archiveCommand.execute(undefined, { yes: true });
      
      // Verify select was called with correct options (values matter, names may include progress)
      expect(mockSelect).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Select a change to archive',
        choices: expect.arrayContaining([
          expect.objectContaining({ value: change1 }),
          expect.objectContaining({ value: change2 })
        ])
      }));
      
      // Verify the selected change was archived
      const archiveDir = path.join(tempDir, 'workspace', 'changes', 'archive');
      const archives = await fs.readdir(archiveDir);
      expect(archives[0]).toContain(change1);
    });

    it('should use confirm prompt for task warnings', async () => {
      const { confirm } = await import('@inquirer/prompts');
      const mockConfirm = confirm as unknown as ReturnType<typeof vi.fn>;

      const changeName = 'incomplete-interactive';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create centralized task with to-do status
      await createCentralizedTask(changeName, 'change', 1, 'to-do');

      // Mock confirm to return true (proceed)
      mockConfirm.mockResolvedValueOnce(true);

      // Execute without --yes flag
      await archiveCommand.execute(changeName);

      // Verify confirm was called
      expect(mockConfirm).toHaveBeenCalledWith({
        message: 'Warning: 1 incomplete task(s) found. Continue?',
        default: false
      });
    });

    it('should cancel when user declines task warning', async () => {
      const { confirm } = await import('@inquirer/prompts');
      const mockConfirm = confirm as unknown as ReturnType<typeof vi.fn>;

      const changeName = 'cancel-test';
      const changeDir = path.join(tempDir, 'workspace', 'changes', changeName);
      await fs.mkdir(changeDir, { recursive: true });

      // Create centralized task with to-do status
      await createCentralizedTask(changeName, 'change', 1, 'to-do');

      // Mock confirm to return false (cancel) for validation skip
      mockConfirm.mockResolvedValueOnce(false);
      // Mock another false for task warning
      mockConfirm.mockResolvedValueOnce(false);

      // Execute without --yes flag but skip validation to test task warning
      await archiveCommand.execute(changeName, { noValidate: true });

      // Verify archive was cancelled
      expect(console.log).toHaveBeenCalledWith('Archive cancelled.');

      // Verify change was not archived
      await expect(fs.access(changeDir)).resolves.not.toThrow();
    });
  });
});
