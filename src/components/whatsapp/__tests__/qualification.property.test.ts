import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

type QualificationLevel = 'frio' | 'morno' | 'quente';

const getLevel = (score: number): QualificationLevel => {
  if (score <= 33) return 'frio';
  if (score <= 66) return 'morno';
  return 'quente';
};

const levelValue = {
  'frio': 1,
  'morno': 2,
  'quente': 3
};

describe('Qualification Property Tests', () => {
  it('qualification level is non-decreasing relative to score', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99 }),
        fc.integer({ min: 1, max: 100 }),
        (score1, score2) => {
          // If score increases or stays same
          const s1 = Math.min(score1, score2);
          const s2 = Math.max(score1, score2);
          
          const level1 = getLevel(s1);
          const level2 = getLevel(s2);
          
          // Qualification level should be non-decreasing
          expect(levelValue[level1]).toBeLessThanOrEqual(levelValue[level2]);
        }
      )
    );
  });
});
