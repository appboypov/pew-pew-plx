export interface RequestContext {
  description: string;
}

export const requestTemplate = (context: RequestContext): string => `# Request: ${context.description}

## Source Input
TBD - Where the request came from.

## Current Understanding
1. TBD

## Identified Ambiguities
1. TBD

## Decisions
1. TBD

## Final Intent
TBD - Clear statement of what should happen.
`;
