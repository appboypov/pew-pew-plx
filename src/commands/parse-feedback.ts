import chalk from 'chalk';
import ora from 'ora';
import { FeedbackScannerService } from '../services/feedback-scanner.js';
import { getActiveReviewIds, getActiveChangeIds, getSpecIds } from '../utils/item-discovery.js';
import { isInteractive } from '../utils/interactive.js';
import { ReviewParent } from '../core/schemas/index.js';

interface ParseFeedbackOptions {
  json?: boolean;
  noInteractive?: boolean;
  interactive?: boolean;
  changeId?: string;
  specId?: string;
  taskId?: string;
}

interface ParseFeedbackJsonOutput {
  reviewId: string;
  parentType: ReviewParent;
  parentId: string;
  markersFound: number;
  tasksCreated: number;
  files: string[];
  specImpacts: string[];
}

export class ParseFeedbackCommand {
  async execute(
    reviewName?: string,
    options: ParseFeedbackOptions = {}
  ): Promise<void> {
    const interactive = isInteractive(options);

    // Determine parent type and id
    let parentType: ReviewParent | undefined;
    let parentId: string | undefined;

    if (options.changeId) {
      parentType = 'change';
      parentId = options.changeId;
    } else if (options.specId) {
      parentType = 'spec';
      parentId = options.specId;
    } else if (options.taskId) {
      parentType = 'task';
      parentId = options.taskId;
    }

    // If no parent specified, prompt interactively or fail
    if (!parentType || !parentId) {
      if (interactive) {
        const { select } = await import('@inquirer/prompts');
        const parentTypeChoice = await select<ReviewParent>({
          message: 'What are you reviewing?',
          choices: [
            { name: 'Change', value: 'change' },
            { name: 'Spec', value: 'spec' },
            { name: 'Task', value: 'task' },
          ],
        });
        parentType = parentTypeChoice;

        if (parentType === 'change') {
          const changes = await getActiveChangeIds();
          if (changes.length === 0) {
            ora().fail('No active changes found');
            process.exitCode = 1;
            return;
          }
          parentId = await select({
            message: 'Select the change:',
            choices: changes.map((id) => ({ name: id, value: id })),
          });
        } else if (parentType === 'spec') {
          const specs = await getSpecIds();
          if (specs.length === 0) {
            ora().fail('No specs found');
            process.exitCode = 1;
            return;
          }
          parentId = await select({
            message: 'Select the spec:',
            choices: specs.map((id) => ({ name: id, value: id })),
          });
        } else {
          const { input } = await import('@inquirer/prompts');
          parentId = await input({
            message: 'Enter the task ID:',
            validate: (value) => value.trim() ? true : 'Task ID is required',
          });
        }
      } else {
        if (options.json) {
          console.log(
            JSON.stringify({ error: 'Parent is required: use --change-id, --spec-id, or --task-id' })
          );
        } else {
          ora().fail('Parent is required');
          console.log(chalk.dim('  Usage: plx parse feedback <review-name> --change-id <id>'));
          console.log(chalk.dim('         plx parse feedback <review-name> --spec-id <id>'));
          console.log(chalk.dim('         plx parse feedback <review-name> --task-id <id>'));
        }
        process.exitCode = 1;
        return;
      }
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

    // Check if review already exists
    const existingReviews = await getActiveReviewIds();
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

    // Scan for feedback markers
    const scanner = new FeedbackScannerService(process.cwd());
    const markers = await scanner.scanDirectory('.');

    // Handle no markers found
    if (markers.length === 0) {
      if (options.json) {
        console.log(
          JSON.stringify({
            reviewId: null,
            parentType,
            parentId,
            markersFound: 0,
            tasksCreated: 0,
            files: [],
            specImpacts: [],
            message: 'No feedback markers found',
          })
        );
      } else {
        ora().info('No feedback markers found');
        console.log(chalk.dim('  Markers follow the pattern: #FEEDBACK #TODO | {feedback}'));
      }
      return;
    }

    // Generate review entity
    await scanner.generateReview(reviewName, markers, parentType, parentId);

    // Collect unique files and spec impacts
    const uniqueFiles = [...new Set(markers.map((m) => m.file))];
    const specImpacts = [
      ...new Set(markers.filter((m) => m.specImpact).map((m) => m.specImpact!)),
    ];

    // Output results
    if (options.json) {
      const output: ParseFeedbackJsonOutput = {
        reviewId: reviewName,
        parentType,
        parentId,
        markersFound: markers.length,
        tasksCreated: markers.length,
        files: uniqueFiles,
        specImpacts,
      };
      console.log(JSON.stringify(output, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Created review: ${reviewName}`));
      console.log(chalk.dim(`  Parent: ${parentType}/${parentId}`));
      console.log(chalk.dim(`  Markers found: ${markers.length}`));
      console.log(chalk.dim(`  Tasks created: ${markers.length}`));
      console.log(chalk.dim(`  Files scanned: ${uniqueFiles.length}`));

      if (uniqueFiles.length <= 5) {
        for (const file of uniqueFiles) {
          console.log(chalk.dim(`    - ${file}`));
        }
      }

      if (specImpacts.length > 0) {
        console.log(chalk.dim(`  Spec impacts: ${specImpacts.join(', ')}`));
      }

      console.log();
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.dim(`  1. Work on tasks: plx get task`));
      console.log(chalk.dim('  2. Address feedback and remove markers'));
      console.log(chalk.dim(`  3. Archive when complete: plx archive ${reviewName}`));
    }
  }
}
