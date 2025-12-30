import { execSync } from 'child_process';
import { platform } from 'os';

export class ClipboardUtils {
  static read(): string {
    const os = platform();

    switch (os) {
      case 'darwin':
        return this.readDarwin();
      case 'win32':
        return this.readWindows();
      case 'linux':
        return this.readLinux();
      default:
        throw new Error(`Unsupported operating system: ${os}`);
    }
  }

  private static readDarwin(): string {
    const result = execSync('pbpaste', { encoding: 'utf-8' });
    if (!result.trim()) {
      throw new Error('Clipboard is empty');
    }
    return result;
  }

  private static readWindows(): string {
    const result = execSync('powershell -command "Get-Clipboard"', { encoding: 'utf-8' });
    if (!result.trim()) {
      throw new Error('Clipboard is empty');
    }
    return result;
  }

  private static readLinux(): string {
    let result: string;

    try {
      result = execSync('xclip -selection clipboard -o', { encoding: 'utf-8' });
    } catch {
      try {
        result = execSync('xsel --clipboard --output', { encoding: 'utf-8' });
      } catch {
        throw new Error('Clipboard utility not found. Install xclip or xsel.');
      }
    }

    if (!result.trim()) {
      throw new Error('Clipboard is empty');
    }

    return result;
  }
}
