import { physicalPreferenceGroupsFor, relevantPartnerSexes } from './physical-preferences.config';

const groupIds = (sex: 'male' | 'female', orientation: 'heterosexual' | 'homosexual' | 'bisexual') =>
  physicalPreferenceGroupsFor(sex, orientation).map((group) => group.id);

describe('physical preference profile configuration', () => {
  it('derives relevant partner sexes from profile metadata', () => {
    expect(relevantPartnerSexes('male', 'heterosexual')).toEqual(['female']);
    expect(relevantPartnerSexes('female', 'heterosexual')).toEqual(['male']);
    expect(relevantPartnerSexes('male', 'homosexual')).toEqual(['male']);
    expect(relevantPartnerSexes('female', 'homosexual')).toEqual(['female']);
    expect(relevantPartnerSexes('male', 'bisexual')).toEqual(['male', 'female']);
    expect(relevantPartnerSexes('', '')).toEqual(['male', 'female']);
  });

  it('shows sex-specific appearance groups only when that partner sex is relevant', () => {
    expect(groupIds('male', 'heterosexual')).toContain('breast-size');
    expect(groupIds('male', 'heterosexual')).not.toContain('penis-size');
    expect(groupIds('male', 'heterosexual')).not.toContain('facial-hair');

    expect(groupIds('female', 'heterosexual')).toContain('penis-size');
    expect(groupIds('female', 'heterosexual')).toContain('facial-hair');
    expect(groupIds('female', 'heterosexual')).not.toContain('breast-size');

    expect(groupIds('female', 'homosexual')).toContain('breast-size');
    expect(groupIds('female', 'homosexual')).not.toContain('penis-size');

    expect(groupIds('male', 'bisexual')).toContain('breast-size');
    expect(groupIds('male', 'bisexual')).toContain('penis-size');
  });
});
