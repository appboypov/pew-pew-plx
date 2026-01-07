import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import chalk from 'chalk';

const require = createRequire(import.meta.url);
const { version: currentVersion } = require('../../package.json');

interface UpgradeOptions {
  check?: boolean;
}

export class UpgradeCommand {
  private readonly packageName = '@appboypov/pew-pew-plx';

  async execute(options: UpgradeOptions = {}): Promise<void> {
    const latestVersion = await this.fetchLatestVersion();

    if (options.check) {
      this.displayVersionComparison(currentVersion, latestVersion);
      return;
    }

    if (currentVersion === latestVersion) {
      console.log(chalk.green(`Already up to date (v${currentVersion})`));
      return;
    }

    console.log(chalk.blue(`Upgrading from v${currentVersion} to v${latestVersion}...`));
    await this.performUpgrade();
  }

  private async fetchLatestVersion(): Promise<string> {
    try {
      const response = await fetch(
        `https://registry.npmjs.org/${this.packageName}/latest`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch package info: ${response.statusText}`);
      }

      const data = await response.json() as { version: string };
      return data.version;
    } catch (error) {
      throw new Error(
        `Failed to check for updates: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private displayVersionComparison(current: string, latest: string): void {
    if (current === latest) {
      console.log(chalk.green(`Already up to date (v${current})`));
    } else {
      console.log(`Current: ${chalk.yellow(current)} | Latest: ${chalk.green(latest)}`);
    }
  }

  private detectPackageManager(): string {
    try {
      execSync('pnpm --version', { stdio: 'ignore' });
      return 'pnpm';
    } catch {
      return 'npm';
    }
  }

  private async performUpgrade(): Promise<void> {
    const packageManager = this.detectPackageManager();
    const args = ['install', '-g', `${this.packageName}@latest`];

    return new Promise<void>((resolve, reject) => {
      const child = spawn(packageManager, args, {
        stdio: 'inherit',
        shell: true,
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(
            chalk.green(
              '\nUpgrade completed successfully! The new version will be used the next time you run this CLI.'
            )
          );
          resolve();
        } else {
          reject(new Error(`Upgrade failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Upgrade failed: ${error.message}`));
      });
    });
  }
}
