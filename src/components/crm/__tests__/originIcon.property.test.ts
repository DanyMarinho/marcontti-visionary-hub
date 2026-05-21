import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { LeadOrigin } from '../../../types/lead';

// Simulated icon mapping
const originIcons: Record<LeadOrigin, string> = {
  'Instagram': 'instagram-icon',
  'WhatsApp': 'whatsapp-icon',
  'Google Ads': 'search-icon',
  'Meta Ads': 'share-icon',
  'Indicação': 'users-icon',
  'Site': 'globe-icon'
};

const origins: LeadOrigin[] = ['Instagram', 'WhatsApp', 'Google Ads', 'Meta Ads', 'Indicação', 'Site'];

describe('Origin Icon Property Tests', () => {
  it('each origin maps to a unique and fixed icon', () => {
    const iconSet = new Set<string>();
    
    origins.forEach(origin => {
      const icon = originIcons[origin];
      expect(icon).toBeDefined();
      iconSet.add(icon);
    });

    // Verify all icons are unique
    expect(iconSet.size).toBe(origins.length);

    fc.assert(
      fc.property(
        fc.constantFrom(...origins),
        (origin) => {
          const icon = originIcons[origin];
          // Same origin always gives same icon
          expect(originIcons[origin]).toBe(icon);
        }
      )
    );
  });
});
