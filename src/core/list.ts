import path from 'path';
import { formatTaskStatus } from '../utils/task-progress.js';
import { emitDeprecationWarning } from '../utils/deprecation.js';
import {
  EntityListingService,
  ChangeInfo,
  SpecInfo,
  ReviewInfo,
} from '../services/entity-listing.js';

export class ListCommand {
  async execute(targetPath: string = '.', mode: 'changes' | 'specs' | 'reviews' = 'changes'): Promise<void> {
    if (mode === 'changes') {
      emitDeprecationWarning('plx list', 'plx get changes');
    } else if (mode === 'specs') {
      emitDeprecationWarning('plx list --specs', 'plx get specs');
    } else if (mode === 'reviews') {
      emitDeprecationWarning('plx list --reviews', 'plx get reviews');
    }
    const resolvedPath = path.resolve(targetPath);
    const entityListingService = await EntityListingService.create(resolvedPath);
    const isMulti = entityListingService.isMultiWorkspace();

    if (mode === 'changes') {
      const changes = await entityListingService.listChanges();

      if (changes.length === 0) {
        console.log('No active changes found.');
        return;
      }

      console.log('Changes:');
      const padding = '  ';
      const getDisplayName = (c: ChangeInfo) => {
        const name = isMulti && c.displayId ? c.displayId : c.name;
        const issueDisplay = c.trackedIssue ? ` (${c.trackedIssue})` : '';
        return `${name}${issueDisplay}`;
      };
      const nameWidth = Math.max(...changes.map(c => getDisplayName(c).length));
      for (const change of changes) {
        const displayName = getDisplayName(change).padEnd(nameWidth);
        const status = formatTaskStatus({ total: change.totalTasks, completed: change.completedTasks });
        console.log(`${padding}${displayName}     ${status}`);
      }
      return;
    }

    if (mode === 'specs') {
      const specs = await entityListingService.listSpecs();

      if (specs.length === 0) {
        console.log('No specs found.');
        return;
      }

      console.log('Specs:');
      const padding = '  ';
      const getDisplayName = (s: SpecInfo) => isMulti && s.displayId ? s.displayId : s.id;
      const nameWidth = Math.max(...specs.map(s => getDisplayName(s).length));
      for (const spec of specs) {
        const padded = getDisplayName(spec).padEnd(nameWidth);
        console.log(`${padding}${padded}     requirements ${spec.requirementCount}`);
      }
      return;
    }

    // reviews mode
    const reviews = await entityListingService.listReviews();

    if (reviews.length === 0) {
      console.log('No active reviews found.');
      return;
    }

    console.log('Reviews:');
    const padding = '  ';
    const getDisplayName = (r: ReviewInfo) => isMulti && r.displayId ? r.displayId : r.name;
    const nameWidth = Math.max(...reviews.map(r => getDisplayName(r).length));
    const typeWidth = Math.max(...reviews.map(r => r.parentType.length));
    for (const review of reviews) {
      const paddedName = getDisplayName(review).padEnd(nameWidth);
      const paddedType = review.parentType.padEnd(typeWidth);
      const status = formatTaskStatus({ total: review.totalTasks, completed: review.completedTasks });
      console.log(`${padding}${paddedName}     ${paddedType}     ${status}`);
    }
  }
}
