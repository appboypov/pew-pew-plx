import path from 'path';
import { FileSystemUtils } from '../utils/file-system.js';
import { ItemRetrievalService } from './item-retrieval.js';
import { parsePrefixedId } from '../utils/task-utils.js';
import { DiscoveredWorkspace } from '../utils/workspace-discovery.js';

export interface ResolvedParent {
  type: 'change' | 'review' | 'spec';
  path: string;
  workspacePath: string;
  projectName: string;
}

/**
 * Service for resolving parent IDs to their entity type and path.
 * Searches changes, reviews, and specs across all workspaces.
 */
export class ParentResolverService {
  /**
   * Resolves a parent ID to its entity type and path.
   * Searches changes, reviews, and specs across all workspaces.
   * Detects ambiguity when the same ID matches multiple entity types.
   * Supports multi-workspace prefixed IDs like "project-a/change-name".
   *
   * @param parentId The parent ID to resolve
   * @param parentType Optional type hint to narrow search
   * @param workspaces Array of discovered workspaces to search
   * @param commandName Command name for error messages
   * @param cwd Current working directory (defaults to process.cwd())
   * @throws Error if the ID matches multiple types (ambiguous)
   */
  static async resolve(
    parentId: string,
    parentType: 'change' | 'review' | 'spec' | undefined,
    workspaces: DiscoveredWorkspace[],
    commandName: string = 'splx',
    cwd: string = process.cwd()
  ): Promise<ResolvedParent | null> {
    const itemRetrieval = await ItemRetrievalService.create(cwd, workspaces);

    const parsed = parsePrefixedId(parentId, workspaces);
    const matches: ResolvedParent[] = [];

    // Determine which types to search
    const typesToSearch: Array<'change' | 'review' | 'spec'> = parentType
      ? [parentType]
      : ['change', 'review', 'spec'];

    // Search each type
    for (const type of typesToSearch) {
      if (type === 'change') {
        const changeResult = await itemRetrieval.getChangeById(parentId);
        if (changeResult) {
          matches.push({
            type: 'change',
            path: path.join(changeResult.workspacePath, 'changes', parsed.itemId),
            workspacePath: changeResult.workspacePath,
            projectName: changeResult.projectName,
          });
        }
      } else if (type === 'review') {
        // Check all workspaces for review (or specific workspace if prefixed)
        const searchWorkspaces = parsed.projectName
          ? workspaces.filter(w => w.projectName.toLowerCase() === parsed.projectName!.toLowerCase())
          : workspaces;

        for (const workspace of searchWorkspaces) {
          const reviewPath = path.join(workspace.path, 'reviews', parsed.itemId, 'review.md');
          if (await FileSystemUtils.fileExists(reviewPath)) {
            matches.push({
              type: 'review',
              path: path.join(workspace.path, 'reviews', parsed.itemId),
              workspacePath: workspace.path,
              projectName: workspace.projectName,
            });
          }
        }
      } else if (type === 'spec') {
        const specResult = await itemRetrieval.getSpecById(parentId);
        if (specResult) {
          matches.push({
            type: 'spec',
            path: path.join(specResult.workspacePath, 'specs', parsed.itemId),
            workspacePath: specResult.workspacePath,
            projectName: specResult.projectName,
          });
        }
      }
    }

    // Handle results
    if (matches.length === 0) {
      return null;
    }

    if (matches.length === 1) {
      return matches[0];
    }

    // Multiple matches - ambiguous
    const matchDescriptions = matches
      .map(m => `  - ${m.type}: workspace/${m.type === 'change' ? 'changes' : m.type === 'review' ? 'reviews' : 'specs'}/${parsed.itemId}/`)
      .join('\n');

    throw new Error(
      `Parent ID '${parentId}' matches multiple types:\n${matchDescriptions}\nUse --parent-type to specify: ${commandName} --parent-id ${parentId} --parent-type change`
    );
  }
}
