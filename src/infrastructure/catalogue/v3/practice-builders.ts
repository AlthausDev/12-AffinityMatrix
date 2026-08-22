import { Practice, PracticeRole, RoleApplicability } from '../../../domain/catalogue/practice';
import { TargetSite } from '../../../domain/profile/profile-answer';
import { Sex } from '../../../domain/profile/profile-metadata';
import { describeCataloguePractice } from './content/practice-description';
import { CataloguePracticeSeed } from './content/types';

export function buildPractice(seed: CataloguePracticeSeed, categoryId: string): Practice {
  switch (seed.kind) {
    case 'mutual': return mutual(seed, categoryId);
    case 'directed': return directed(seed, categoryId);
    case 'self': return self(seed, categoryId);
    case 'state': return state(seed, categoryId);
    case 'wear': return wear(seed, categoryId);
    case 'watch': return watch(seed, categoryId);
    case 'power': return power(seed, categoryId);
    case 'group': return group(seed, categoryId);
    case 'focus': return focus(seed, categoryId);
    case 'toy': return toy(seed, categoryId);
  }
}

function mutual(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const role: PracticeRole = {
    id: 'participate', label: 'Participate', perspective: 'neutral',
    ...(seed.counterpartScoped ? { contextAxes: ['counterpartSex'] as const } : {}),
  };
  return practice(seed, categoryId, [role], [{ leftRoleId: 'participate', rightRoleId: 'participate' }]);
}

function directed(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const axes = seed.counterpartScoped ? (['counterpartSex'] as const) : undefined;
  const giveApplicability = roleApplicability(seed.actorSex, seed.anatomySex);
  const receiveApplicability = roleApplicability(seed.anatomySex, seed.actorSex);
  const give: PracticeRole = {
    id: 'give', label: 'Give / do', perspective: 'active',
    ...(giveApplicability ? { applicability: giveApplicability } : {}),
    ...(axes ? { contextAxes: axes } : {}),
  };
  const receive: PracticeRole = {
    id: 'receive', label: 'Receive', perspective: 'receptive',
    ...(receiveApplicability ? { applicability: receiveApplicability } : {}),
    ...(axes ? { contextAxes: axes } : {}),
  };
  return practice(seed, categoryId, [give, receive], [{ leftRoleId: 'give', rightRoleId: 'receive' }]);
}

function self(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const role: PracticeRole = {
    id: 'self', label: 'Do / experience it myself', perspective: 'neutral',
    ...(seed.anatomySex ? { applicability: { selfSex: [seed.anatomySex] as readonly Sex[] } } : {}),
  };
  return practice(seed, categoryId, [role], [{ leftRoleId: 'self', rightRoleId: 'self' }]);
}

function state(seed: CataloguePracticeSeed, categoryId: string): Practice {
  return practice(seed, categoryId, [
    {
      id: 'self-state', label: 'For me / myself', perspective: 'neutral',
      ...(seed.anatomySex ? { applicability: { selfSex: [seed.anatomySex] as readonly Sex[] } } : {}),
    },
    {
      id: 'partner-state', label: 'For my partner', perspective: 'neutral', contextAxes: ['counterpartSex'],
      ...(seed.anatomySex ? { applicability: { partnerSex: [seed.anatomySex] as readonly Sex[] } } : {}),
    },
  ], [{ leftRoleId: 'self-state', rightRoleId: 'partner-state' }]);
}

function wear(seed: CataloguePracticeSeed, categoryId: string): Practice {
  return practice(seed, categoryId, [
    { id: 'wear', label: 'Wear it myself', perspective: 'neutral' },
    { id: 'partner-wears', label: 'Have my partner wear it', perspective: 'neutral', contextAxes: ['counterpartSex'] },
  ], [{ leftRoleId: 'wear', rightRoleId: 'partner-wears' }]);
}

function watch(seed: CataloguePracticeSeed, categoryId: string): Practice {
  return practice(seed, categoryId, [
    { id: 'watch', label: 'Watch', perspective: 'active', contextAxes: ['counterpartSex'] },
    { id: 'be-watched', label: 'Be watched', perspective: 'receptive', contextAxes: ['counterpartSex'] },
  ], [{ leftRoleId: 'watch', rightRoleId: 'be-watched' }]);
}

function power(seed: CataloguePracticeSeed, categoryId: string): Practice {
  return practice(seed, categoryId, [
    { id: 'lead', label: 'Lead / control', perspective: 'active' },
    { id: 'follow', label: 'Follow / receive', perspective: 'receptive' },
  ], [{ leftRoleId: 'lead', rightRoleId: 'follow' }]);
}

function group(seed: CataloguePracticeSeed, categoryId: string): Practice {
  return practice(seed, categoryId, [
    { id: 'center', label: 'Be the center', perspective: 'receptive' },
    { id: 'participate', label: 'Participate around the center', perspective: 'active' },
  ], [{ leftRoleId: 'center', rightRoleId: 'participate' }]);
}

function focus(seed: CataloguePracticeSeed, categoryId: string): Practice {
  return practice(seed, categoryId, [
    {
      id: 'interest', label: 'Interested / attracted', perspective: 'neutral', contextAxes: ['counterpartSex'],
      ...(seed.anatomySex ? { applicability: { partnerSex: [seed.anatomySex] as readonly Sex[] } } : {}),
    },
  ], [{ leftRoleId: 'interest', rightRoleId: 'interest' }]);
}

function toy(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const sites = seed.targetSites ?? ([] as readonly TargetSite[]);
  return practice(seed, categoryId, [
    {
      id: 'use-on-self', label: 'Use it on myself', perspective: 'neutral',
      contextAxes: ['targetSite'], contextValues: { targetSite: sites }, targetOwner: 'self',
      ...(seed.anatomySex ? { applicability: { selfSex: [seed.anatomySex] as readonly Sex[] } } : {}),
    },
    {
      id: 'use-on-partner', label: 'Use it on my partner', perspective: 'active',
      contextAxes: ['counterpartSex', 'targetSite'], contextValues: { targetSite: sites }, targetOwner: 'partner',
      ...(seed.anatomySex ? { applicability: { partnerSex: [seed.anatomySex] as readonly Sex[] } } : {}),
    },
    {
      id: 'partner-uses-on-me', label: 'Have my partner use it on me', perspective: 'receptive',
      contextAxes: ['counterpartSex', 'targetSite'], contextValues: { targetSite: sites }, targetOwner: 'self',
      ...(seed.anatomySex ? { applicability: { selfSex: [seed.anatomySex] as readonly Sex[] } } : {}),
    },
  ], [
    { leftRoleId: 'use-on-self', rightRoleId: 'use-on-self' },
    { leftRoleId: 'use-on-partner', rightRoleId: 'partner-uses-on-me' },
  ]);
}

function roleApplicability(selfSex?: Sex, partnerSex?: Sex): RoleApplicability | undefined {
  if (!selfSex && !partnerSex) return undefined;
  return {
    ...(selfSex ? { selfSex: [selfSex] as readonly Sex[] } : {}),
    ...(partnerSex ? { partnerSex: [partnerSex] as readonly Sex[] } : {}),
  };
}

function practice(
  seed: CataloguePracticeSeed,
  categoryId: string,
  roles: readonly PracticeRole[],
  compatibleRolePairs: Practice['compatibleRolePairs'],
): Practice {
  return {
    id: seed.id,
    categoryId,
    label: seed.en,
    description: describeCataloguePractice(seed, 'en'),
    roles,
    compatibleRolePairs,
  };
}
