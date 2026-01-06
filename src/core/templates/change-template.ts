export interface ChangeContext {
  name: string;
}

export const changeTemplate = (context: ChangeContext): string => `# Change: ${context.name}

## Why
TBD - 1-2 sentences on problem/opportunity

## What Changes
- TBD

## Impact
- Affected specs: TBD
- Affected code: TBD
`;
