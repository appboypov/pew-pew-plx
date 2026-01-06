import chalk from 'chalk';
import ora from 'ora';
import { promises as fs } from 'fs';
import path from 'path';
import { FeedbackScannerService } from '../services/feedback-scanner.js';
import { getActiveReviewIds, getActiveChangeIds, getSpecIds } from '../utils/item-discovery.js';
import { isInteractive } from '../utils/interactive.js';
import { ReviewParent } from '../core/schemas/index.js';
import { emitDeprecationWarning } from '../utils/deprecation.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';

interface ParseFeedbackOptions {
  json?: boolean;
  noInteractive?: boolean;
  interactive?: boolean;
  parentId?: string;
  parentType?: string;
  changeId?: string;
  specId?: string;
  taskId?: string;
}

interface ReviewResult {
  reviewId: string;
  parentType: ReviewParent;
  parentId: string;
  markersFound: number;
  tasksCreated: number;
  files: string[];
}

interface ParseFeedbackJsonOutput {
  reviews: ReviewResult[];
  totalMarkers: number;
  totalTasks: number;
}

export class ParseFeedbackCommand {
  private async checkChangeExists(id: string): Promise<boolean> {
    const workspaces = await getFilteredWorkspaces(process.cwd());
    for (const workspace of workspaces) {
      const changesPath = path.join(workspace.path, 'changes', id);
      const proposalPath = path.join(changesPath, 'proposal.md');
      try {
        await fs.access(proposalPath);
        return true;
      } catch {
        // Continue to next workspace
      }
    }
    return false;
  }

  private async checkSpecExists(id: string): Promise<boolean> {
    const workspaces = await getFilteredWorkspaces(process.cwd());
    for (const workspace of workspaces) {
      const specsPath = path.join(workspace.path, 'specs', id);
      const specPath = path.join(specsPath, 'spec.md');
      try {
        await fs.access(specPath);
        return true;
      } catch {
        // Continue to next workspace
      }
    }
    return false;
  }

  async execute(
    reviewName?: string,
    options: ParseFeedbackOptions = {}
  ): Promise<void> {
    const interactive = isInteractive(options);

    // Emit deprecation warnings for legacy flags
    if (options.changeId) {
      emitDeprecationWarning(
        'plx parse feedback --change-id <id>',
        'plx parse feedback --parent-id <id> --parent-type change'
      );
    }
    if (options.specId) {
      emitDeprecationWarning(
        'plx parse feedback --spec-id <id>',
        'plx parse feedback --parent-id <id> --parent-type spec'
      );
    }
    if (options.taskId) {
      emitDeprecationWarning(
        'plx parse feedback --task-id <id>',
        'plx parse feedback --parent-id <id> --parent-type task'
      );
    }

    // Determine CLI-provided parent type and id (used as fallback for unassigned markers)
    let cliParentType: ReviewParent | undefined;
    let cliParentId: string | undefined;

    if (options.parentId) {
      if (options.parentType) {
        // Use explicitly provided type
        cliParentType = options.parentType as ReviewParent;
        cliParentId = options.parentId;
      } else {
        // Auto-detect type by searching for matching ID
        const [changeExists, specExists] = await Promise.all([
          this.checkChangeExists(options.parentId),
          this.checkSpecExists(options.parentId),
        ]);
        const matchCount = [changeExists, specExists].filter(Boolean).length;

        if (matchCount > 1) {
          // Error: ambiguous ID
          if (options.json) {
            console.log(
              JSON.stringify({
                error: `Ambiguous ID '${options.parentId}' matches multiple types. Use --parent-type to disambiguate.`,
              })
            );
          } else {
            ora().fail(`Ambiguous ID '${options.parentId}' matches multiple types`);
            console.log(chalk.dim('  Use --parent-type to specify: change, spec, or task'));
          }
          process.exitCode = 1;
          return;
        }

        if (changeExists) {
          cliParentType = 'change';
          cliParentId = options.parentId;
        } else if (specExists) {
          cliParentType = 'spec';
          cliParentId = options.parentId;
        } else {
          // Default to task (tasks are harder to check existence)
          cliParentType = 'task';
          cliParentId = options.parentId;
        }
      }
    } else if (options.changeId) {
      cliParentType = 'change';
      cliParentId = options.changeId;
    } else if (options.specId) {
      cliParentType = 'spec';
      cliParentId = options.specId;
    } else if (options.taskId) {
      cliParentType = 'task';
      cliParentId = options.taskId;
    }

    // Prompt for review name if not provided
    if (!reviewName) {
      if (interactive) {
        const { input } = await import('@inquirer/prompts');
        reviewName = await input({
          message: 'Enter a name for this review:',
          validate: (value) => {
            if (!value.trim()) {
              return 'Review name is required';
            }
            if (!/^[a-z0-9-]+$/.test(value)) {
              return 'Review name must contain only lowercase letters, numbers, and hyphens';
            }
            return true;
          },
        });
      } else {
        if (options.json) {
          console.log(
            JSON.stringify({ error: 'Review name is required in non-interactive mode' })
          );
        } else {
          ora().fail('Review name is required');
          console.log(chalk.dim('  Usage: plx parse feedback <review-name> --change-id <id>'));
        }
        process.exitCode = 1;
        return;
      }
    }

    // Validate review name format
    if (!/^[a-z0-9-]+$/.test(reviewName)) {
      if (options.json) {
        console.log(
          JSON.stringify({
            error: 'Review name must contain only lowercase letters, numbers, and hyphens',
          })
        );
      } else {
        ora().fail(
          'Review name must contain only lowercase letters, numbers, and hyphens'
        );
      }
      process.exitCode = 1;
      return;
    }

    // Scan for feedback markers
    const scanner = new FeedbackScannerService(process.cwd());
    const markers = await scanner.scanDirectory('.');

    // Handle no markers found
    if (markers.length === 0) {
      if (options.json) {
        console.log(
          JSON.stringify({
            reviews: [],
            totalMarkers: 0,
            totalTasks: 0,
            message: 'No feedback markers found',
          })
        );
      } else {
        ora().info('No feedback markers found');
        console.log(chalk.dim('  Markers follow the pattern: #FEEDBACK #TODO | {feedback}'));
      }
      return;
    }

    // Group markers by parent
    const groups = scanner.groupMarkersByParent(markers);

    // Handle unassigned markers
    if (groups.unassigned.length > 0) {
      if (cliParentType && cliParentId) {
        // Use CLI-provided parent as fallback for unassigned markers
        const existingGroup = groups.assigned.find(
          (g) => g.parentType === cliParentType && g.parentId === cliParentId
        );
        if (existingGroup) {
          existingGroup.markers.push(...groups.unassigned);
        } else {
          groups.assigned.push({
            parentType: cliParentType,
            parentId: cliParentId,
            markers: groups.unassigned,
          });
        }
        groups.unassigned = [];
      } else if (interactive) {
        // Prompt user to select parent for unassigned markers
        const { select } = await import('@inquirer/prompts');
        const parentTypeChoice = await select<ReviewParent>({
          message: `${groups.unassigned.length} marker(s) have no parent. What are they reviewing?`,
          choices: [
            { name: 'Change', value: 'change' },
            { name: 'Spec', value: 'spec' },
            { name: 'Task', value: 'task' },
          ],
        });

        let selectedParentId: string;
        if (parentTypeChoice === 'change') {
          const changes = await getActiveChangeIds();
          if (changes.length === 0) {
            ora().fail('No active changes found');
            process.exitCode = 1;
            return;
          }
          selectedParentId = await select({
            message: 'Select the change for unassigned markers:',
            choices: changes.map((id) => ({ name: id, value: id })),
          });
        } else if (parentTypeChoice === 'spec') {
          const specs = await getSpecIds();
          if (specs.length === 0) {
            ora().fail('No specs found');
            process.exitCode = 1;
            return;
          }
          selectedParentId = await select({
            message: 'Select the spec for unassigned markers:',
            choices: specs.map((id) => ({ name: id, value: id })),
          });
        } else {
          const { input } = await import('@inquirer/prompts');
          selectedParentId = await input({
            message: 'Enter the task ID for unassigned markers:',
            validate: (value) => value.trim() ? true : 'Task ID is required',
          });
        }

        // Add unassigned markers to appropriate group
        const existingGroup = groups.assigned.find(
          (g) => g.parentType === parentTypeChoice && g.parentId === selectedParentId
        );
        if (existingGroup) {
          existingGroup.markers.push(...groups.unassigned);
        } else {
          groups.assigned.push({
            parentType: parentTypeChoice,
            parentId: selectedParentId,
            markers: groups.unassigned,
          });
        }
        groups.unassigned = [];
      } else {
        // Non-interactive mode with unassigned markers - fail with error
        const unassignedFiles = [...new Set(groups.unassigned.map((m) => `${m.file}:${m.line}`))];
        if (options.json) {
          console.log(
            JSON.stringify({
              error: 'Unassigned markers found. Use --parent-id and optionally --parent-type to assign them.',
              unassignedMarkers: unassignedFiles,
            })
          );
        } else {
          ora().fail(`${groups.unassigned.length} marker(s) have no parent linkage`);
          console.log(chalk.dim('  Unassigned markers:'));
          for (const loc of unassignedFiles.slice(0, 10)) {
            console.log(chalk.dim(`    - ${loc}`));
          }
          if (unassignedFiles.length > 10) {
            console.log(chalk.dim(`    ... and ${unassignedFiles.length - 10} more`));
          }
          console.log();
          console.log(chalk.dim('  To assign these markers, use:'));
          console.log(chalk.dim('    plx parse feedback <review-name> --parent-id <id> --parent-type <type>'));
          console.log(chalk.dim('  Or with auto-detection:'));
          console.log(chalk.dim('    plx parse feedback <review-name> --parent-id <id>'));
        }
        process.exitCode = 1;
        return;
      }
    }

    // Check if no assigned groups after handling (shouldn't happen but safety check)
    if (groups.assigned.length === 0) {
      if (options.json) {
        console.log(
          JSON.stringify({
            reviews: [],
            totalMarkers: 0,
            totalTasks: 0,
            message: 'No markers to process',
          })
        );
      } else {
        ora().info('No markers to process');
      }
      return;
    }

    // Check for existing reviews
    const existingReviews = await getActiveReviewIds();

    // Generate review names based on number of parent groups
    const reviewNames: string[] = [];
    if (groups.assigned.length === 1) {
      // Single parent group - use original review name
      if (existingReviews.includes(reviewName)) {
        if (options.json) {
          console.log(
            JSON.stringify({ error: `Review already exists: ${reviewName}` })
          );
        } else {
          ora().fail(`Review already exists: ${reviewName}`);
        }
        process.exitCode = 1;
        return;
      }
      reviewNames.push(reviewName);
    } else {
      // Multiple parent groups - use suffixed names with parent type and ID
      for (const group of groups.assigned) {
        const suffixedName = `${reviewName}-${group.parentType}-${group.parentId}`;
        if (existingReviews.includes(suffixedName)) {
          if (options.json) {
            console.log(
              JSON.stringify({ error: `Review already exists: ${suffixedName}` })
            );
          } else {
            ora().fail(`Review already exists: ${suffixedName}`);
          }
          process.exitCode = 1;
          return;
        }
        reviewNames.push(suffixedName);
      }
    }

    // Generate reviews
    const results: ReviewResult[] = [];
    for (let i = 0; i < groups.assigned.length; i++) {
      const group = groups.assigned[i];
      const name = reviewNames[i];
      await scanner.generateReview(name, group.markers, group.parentType, group.parentId);

      const uniqueFiles = [...new Set(group.markers.map((m) => m.file))];
      results.push({
        reviewId: name,
        parentType: group.parentType,
        parentId: group.parentId,
        markersFound: group.markers.length,
        tasksCreated: group.markers.length,
        files: uniqueFiles,
      });
    }

    // Calculate totals
    const totalMarkers = results.reduce((sum, r) => sum + r.markersFound, 0);
    const totalTasks = results.reduce((sum, r) => sum + r.tasksCreated, 0);

    // Output results
    if (options.json) {
      const output: ParseFeedbackJsonOutput = {
        reviews: results,
        totalMarkers,
        totalTasks,
      };
      console.log(JSON.stringify(output, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Created ${results.length} review${results.length === 1 ? '' : 's'}`));

      for (const result of results) {
        console.log();
        console.log(chalk.cyan(`  Review: ${result.reviewId}`));
        console.log(chalk.dim(`    Parent: ${result.parentType}/${result.parentId}`));
        console.log(chalk.dim(`    Markers: ${result.markersFound}`));
        console.log(chalk.dim(`    Tasks: ${result.tasksCreated}`));
        if (result.files.length <= 3) {
          for (const file of result.files) {
            console.log(chalk.dim(`      - ${file}`));
          }
        } else {
          console.log(chalk.dim(`    Files: ${result.files.length}`));
        }
      }

      console.log();
      console.log(chalk.dim(`Total markers: ${totalMarkers}`));
      console.log(chalk.dim(`Total tasks: ${totalTasks}`));
      console.log();
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.dim('  1. Work on tasks: plx get task'));
      console.log(chalk.dim('  2. Address feedback and remove markers'));
      if (results.length === 1) {
        console.log(chalk.dim(`  3. Archive when complete: plx archive ${results[0].reviewId}`));
      } else {
        console.log(chalk.dim('  3. Archive when complete: plx archive <review-id>'));
      }
    }
  }
}
