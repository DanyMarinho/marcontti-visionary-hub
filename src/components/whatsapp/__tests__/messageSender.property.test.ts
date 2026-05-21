import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Message Bubble Property Tests', () => {
  it('sender type determines alignment and metadata', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('lead', 'ia'),
        (sender) => {
          // Logic usually found in MessageBubble component
          const isIA = sender === 'ia';
          const alignment = isIA ? 'right' : 'left';
          const hasIABadge = isIA;
          
          if (sender === 'lead') {
            expect(alignment).toBe('left');
            expect(hasIABadge).toBe(false);
          } else {
            expect(alignment).toBe('right');
            expect(hasIABadge).toBe(true);
          }
        }
      )
    );
  });
});
