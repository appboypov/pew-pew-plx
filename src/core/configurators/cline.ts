import path from 'path';
import { ToolConfigurator } from './base.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { TemplateManager } from '../templates/index.js';
import { PLX_MARKERS } from '../config.js';

export class ClineConfigurator implements ToolConfigurator {
  name = 'Cline';
  configFileName = 'CLINE.md';
  isAvailable = true;

  async configure(projectPath: string, _workspaceDir: string): Promise<void> {
    const filePath = path.join(projectPath, this.configFileName);
    const content = TemplateManager.getClineTemplate();
    
    await FileSystemUtils.updateFileWithMarkers(
      filePath,
      content,
      PLX_MARKERS.start,
      PLX_MARKERS.end
    );
  }
}
