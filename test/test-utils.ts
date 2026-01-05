import { promises as fs } from 'fs';
import path from 'path';
import { PLX_DIR_NAME, PLX_MARKERS } from '../src/core/config.js';

/**
 * Creates a valid PLX workspace with the required AGENTS.md file containing the PLX marker.
 * This is required for findProjectRoot() to recognize a directory as a PLX workspace.
 */
export async function createValidPlxWorkspace(tempDir: string): Promise<string> {
  const workspaceDir = path.join(tempDir, PLX_DIR_NAME);
  await fs.mkdir(workspaceDir, { recursive: true });

  const agentsMdPath = path.join(workspaceDir, 'AGENTS.md');
  const agentsMdContent = `${PLX_MARKERS.start}
# Agents Instructions
${PLX_MARKERS.end}
`;
  await fs.writeFile(agentsMdPath, agentsMdContent);

  return workspaceDir;
}
