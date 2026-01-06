export function emitDeprecationWarning(oldCommand: string, newCommand: string): void {
  const shouldSuppress = process.env.PLX_NO_DEPRECATION_WARNINGS === '1';
  if (!shouldSuppress) {
    console.error(`Deprecation: '${oldCommand}' is deprecated. Use '${newCommand}' instead.`);
  }
}
