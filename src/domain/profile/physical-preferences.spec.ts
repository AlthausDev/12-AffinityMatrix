import { createProfile } from './profile';
import {
  clonePhysicalPreferences,
  normalizePhysicalPreferences,
  validatePhysicalPreferences,
} from './physical-preferences';

describe('physical preferences', () => {
  it('keeps independent 0 to 10 scores without inventing a parent rating', () => {
    const preferences = {
      'hair-length': {
        'hair-length-long': 10,
        'shaved-bald-head': 7,
        'hair-length-short': 3,
      },
    } as const;

    expect(validatePhysicalPreferences(preferences)).toEqual([]);
    expect(clonePhysicalPreferences(preferences)).toEqual(preferences);
  });

  it('rejects scores outside the attraction scale', () => {
    expect(validatePhysicalPreferences({ stature: { 'stature-tall': 11 } })).toContainEqual({
      path: 'physicalPreferences.stature.stature-tall',
      message: 'Physical attraction score must be an integer from 0 to 10.',
    });
    expect(validatePhysicalPreferences({ stature: { 'stature-short': 4.5 } })).toContainEqual({
      path: 'physicalPreferences.stature.stature-short',
      message: 'Physical attraction score must be an integer from 0 to 10.',
    });
  });

  it('removes empty groups and keeps the optional field absent when nothing is rated', () => {
    expect(normalizePhysicalPreferences({ stature: {} })).toEqual({});
    const profile = createProfile({ id: 'profile', now: '2026-08-29T00:00:00.000Z' });
    expect(profile.physicalPreferences).toBeUndefined();
  });
});
