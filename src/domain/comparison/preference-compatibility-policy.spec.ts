import { DefaultPreferenceCompatibilityPolicy } from './preference-compatibility-policy';

const policy = new DefaultPreferenceCompatibilityPolicy();

describe('DefaultPreferenceCompatibilityPolicy', () => {
  it('keeps strong enthusiasm close to the top of the scale', () => {
    expect(policy.compare('favorite', 'like')).toMatchObject({
      classification: 'strong-match',
      score: 90,
      commonGround: true,
      requiresConversation: false,
    });
  });

  it('treats curiosity as explorable rather than as a full-strength match', () => {
    expect(policy.compare('favorite', 'curious')).toMatchObject({
      classification: 'explorable',
      score: 55,
      commonGround: true,
      requiresConversation: true,
    });
  });

  it('treats Depends as conditioned common ground', () => {
    expect(policy.compare('depends', 'like')).toMatchObject({
      classification: 'conditioned',
      score: 70,
      commonGround: true,
      requiresConversation: true,
    });
  });

  it('distinguishes lack of interest from a hard boundary', () => {
    expect(policy.compare('not-interested', 'favorite').classification).toBe('not-shared');
    expect(policy.compare('boundary', 'favorite').classification).toBe('boundary');
  });
});
