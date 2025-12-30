import path from 'path';
import ora from 'ora';
import { ClipboardUtils } from '../utils/clipboard.js';
import { FileSystemUtils } from '../utils/file-system.js';

interface RequestOptions {
  json?: boolean;
}

export class PasteCommand {
  private draftsPath: string;
  private requestFilePath: string;

  constructor() {
    this.draftsPath = path.join(process.cwd(), 'workspace', 'drafts');
    this.requestFilePath = path.join(this.draftsPath, 'request.md');
  }

  async request(options: RequestOptions = {}): Promise<void> {
    try {
      const content = ClipboardUtils.read();
      await FileSystemUtils.writeFile(this.requestFilePath, content);

      if (options.json) {
        console.log(JSON.stringify({
          path: 'workspace/drafts/request.md',
          characters: content.length,
          success: true
        }, null, 2));
      } else {
        ora().succeed(`Saved request to workspace/drafts/request.md (${content.length} characters)`);
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
