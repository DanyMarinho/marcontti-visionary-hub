import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { generateRandomLead } from '../leadGenerator';

describe('Lead Generator Property Tests', () => {
  it('random origins are balanced between Instagram and Google Ads', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50, max: 100 }), // Test with enough samples
        (sampleSize) => {
          const leads = Array.from({ length: sampleSize }, () => generateRandomLead());
          
          const instagramCount = leads.filter(l => l.origin === 'Instagram Ads').length;
          const googleCount = leads.filter(l => l.origin === 'Google Ads').length;
          
          const instagramFreq = instagramCount / sampleSize;
          const googleFreq = googleCount / sampleSize;
          
          // Both should appear with frequency similar to 0.5 (±20% margin for randomness)
          expect(instagramFreq).toBeGreaterThan(0.2);
          expect(googleFreq).toBeGreaterThan(0.2);
          
          // Sum should be total (since these are the only two options in current generator)
          expect(instagramCount + googleCount).toBe(sampleSize);
        }
      )
    );
  });
});
