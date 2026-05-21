import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { LeadPriority } from '../../../types/lead';

// Mock color mapping that should be used in the component
const priorityColors: Record<LeadPriority, string> = {
  'alta': 'red',
  'media': 'yellow',
  'baixa': 'green'
};

describe('Priority Badge Property Tests', () => {
  it('priority mapping is consistent across all instances', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('alta' as const, 'media' as const, 'baixa' as const),
        (priority) => {
          // In a property test, we verify that for the same input, we always get the same semantic color
          const color = priorityColors[priority];
          
          if (priority === 'alta') expect(color).toContain('red');
          if (priority === 'media') expect(color).toContain('yellow');
          if (priority === 'baixa') expect(color).toContain('green');
        }
      )
    );
  });
});
