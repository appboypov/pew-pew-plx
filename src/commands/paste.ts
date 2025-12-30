import path from 'path';
import ora from 'ora';
import { ClipboardUtils } from '../utils/clipboard.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';

interface RequestOptions {
  json?: boolean;
}

export class PasteCommand {
  async request(options: RequestOptions = {}): Promise<void> {
    try {
      // Discover workspaces - use root if exists, else first child
      const workspaces = await getFilteredWorkspaces(process.cwd());

      // Determine the drafts path - fallback to cwd/workspace/drafts if no workspaces found
      let draftsPath: string;
      if (workspaces.length === 0) {
        // Fallback to creating workspace/drafts in current directory
        draftsPath = path.join(process.cwd(), 'workspace', 'drafts');
      } else {
        // Prefer root workspace, fall back to first child
        const targetWorkspace = workspaces.find((w) => w.isRoot) || workspaces[0];
        draftsPath = path.join(targetWorkspace.path, 'drafts');
      }
      const requestFilePath = path.join(draftsPath, 'request.md');

      const content = ClipboardUtils.read();
      await FileSystemUtils.writeFile(requestFilePath, content);

      // Compute relative path from cwd for display
      const relativePath = path.relative(process.cwd(), requestFilePath);

      if (options.json) {
        console.log(JSON.stringify({
          path: relativePath,
          characters: content.length,
          success: true
        }, null, 2));
      } else {
        ora().succeed(`Saved request to ${relativePath} (${content.length} characters)`);
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: (error as Error).message }));
        process.exit(1);
      } else {
        throw error;
      }
    }
  }
}
