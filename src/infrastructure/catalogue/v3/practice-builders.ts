import { Practice, PracticeRole, RoleApplicability } from '../../../domain/catalogue/practice';
import { TargetSite } from '../../../domain/profile/profile-answer';
import { Sex } from '../../../domain/profile/profile-metadata';
import { describeCataloguePractice } from './content/practice-description';
import { CataloguePracticeSeed, CatalogueToyRoleId } from './content/types';

const DEFAULT_TOY_ROLES: readonly CatalogueToyRoleId[] = [
  'use-on-self',
  'use-on-partner',
  'partner-uses-on-me',
];

export function buildPractice(seed: CataloguePracticeSeed, categoryId: string): Practice {
  switch (seed.kind) {
    case 'mutual': return mutual(seed, categoryId);
    case 'directed': return directed(seed, categoryId);
    case 'self': return self(seed, categoryId);
    case 'state': return state(seed, categoryId);
    case 'wear': return wear(seed, categoryId);
    case 'watch': return watch(seed, categoryId);
    case 'power': return power(seed, categoryId);
    case 'paired': return paired(seed, categoryId);
    case 'group': return group(seed, categoryId);
    case 'focus': return focus(seed, categoryId);
    case 'toy': return toy(seed, categoryId);
    case 'dual-use-toy': return dualUseToy(seed, categoryId);
  }
}

function mutual(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const applicability = mergeRoleApplicability(seed, 'participate');
  const role: PracticeRole = {
    id: 'participate', label: roleLabel(seed, 'participate', 'Participate'), perspective: 'neutral',
    ...(applicability ? { applicability } : {}),
    ...(seed.counterpartScoped ? { contextAxes: ['counterpartSex'] as const } : {}),
  };
  return practice(seed, categoryId, [role], [{ leftRoleId: 'participate', rightRoleId: 'participate' }]);
}

function directed(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const axes = seed.counterpartScoped ? (['counterpartSex'] as const) : undefined;
  const giveApplicability = mergeRoleApplicability(seed, 'give', anatomyApplicability(seed.actorSex, seed.anatomySex));
  const receiveApplicability = mergeRoleApplicability(seed, 'receive', anatomyApplicability(seed.anatomySex, seed.actorSex));
  const give: PracticeRole = {
    id: 'give', label: roleLabel(seed, 'give', 'Give / do'), perspective: 'active',
    ...(giveApplicability ? { applicability: giveApplicability } : {}),
    ...(axes ? { contextAxes: axes } : {}),
  };
  const receive: PracticeRole = {
    id: 'receive', label: roleLabel(seed, 'receive', 'Receive'), perspective: 'receptive',
    ...(receiveApplicability ? { applicability: receiveApplicability } : {}),
    ...(axes ? { contextAxes: axes } : {}),
  };
  return practice(seed, categoryId, [give, receive], [{ leftRoleId: 'give', rightRoleId: 'receive' }]);
}

function self(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const applicability = mergeRoleApplicability(
    seed,
    'self',
    seed.anatomySex ? { selfSex: [seed.anatomySex] as readonly Sex[] } : undefined,
  );
  const role: PracticeRole = {
    id: 'self', label: roleLabel(seed, 'self', 'Do / experience it myself'), perspective: 'neutral',
    ...(applicability ? { applicability } : {}),
  };
  return practice(seed, categoryId, [role], [{ leftRoleId: 'self', rightRoleId: 'self' }]);
}

function state(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const selfApplicability = mergeRoleApplicability(
    seed,
    'self-state',
    seed.anatomySex ? { selfSex: [seed.anatomySex] as readonly Sex[] } : undefined,
  );
  const partnerApplicability = mergeRoleApplicability(
    seed,
    'partner-state',
    seed.anatomySex ? { partnerSex: [seed.anatomySex] as readonly Sex[] } : undefined,
  );
  return practice(seed, categoryId, [
    {
      id: 'self-state', label: roleLabel(seed, 'self-state', 'For me / myself'), perspective: 'neutral',
      ...(selfApplicability ? { applicability: selfApplicability } : {}),
    },
    {
      id: 'partner-state', label: roleLabel(seed, 'partner-state', 'For my partner'), perspective: 'neutral', contextAxes: ['counterpartSex'],
      ...(partnerApplicability ? { applicability: partnerApplicability } : {}),
    },
  ], [{ leftRoleId: 'self-state', rightRoleId: 'partner-state' }]);
}

function wear(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const wearApplicability = mergeRoleApplicability(seed, 'wear');
  const partnerApplicability = mergeRoleApplicability(seed, 'partner-wears');
  return practice(seed, categoryId, [
    {
      id: 'wear', label: roleLabel(seed, 'wear', 'Wear it myself'), perspective: 'neutral',
      ...(wearApplicability ? { applicability: wearApplicability } : {}),
    },
    {
      id: 'partner-wears', label: roleLabel(seed, 'partner-wears', 'Have my partner wear it'), perspective: 'neutral', contextAxes: ['counterpartSex'],
      ...(partnerApplicability ? { applicability: partnerApplicability } : {}),
    },
  ], [{ leftRoleId: 'wear', rightRoleId: 'partner-wears' }]);
}

function watch(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const watchApplicability = mergeRoleApplicability(seed, 'watch');
  const watchedApplicability = mergeRoleApplicability(seed, 'be-watched');
  return practice(seed, categoryId, [
    {
      id: 'watch', label: roleLabel(seed, 'watch', 'Watch'), perspective: 'active', contextAxes: ['counterpartSex'],
      ...(watchApplicability ? { applicability: watchApplicability } : {}),
    },
    {
      id: 'be-watched', label: roleLabel(seed, 'be-watched', 'Be watched'), perspective: 'receptive', contextAxes: ['counterpartSex'],
      ...(watchedApplicability ? { applicability: watchedApplicability } : {}),
    },
  ], [{ leftRoleId: 'watch', rightRoleId: 'be-watched' }]);
}

function power(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const leadApplicability = mergeRoleApplicability(seed, 'lead');
  const followApplicability = mergeRoleApplicability(seed, 'follow');
  return practice(seed, categoryId, [
    {
      id: 'lead', label: roleLabel(seed, 'lead', 'Lead / control'), perspective: 'active',
      ...(leadApplicability ? { applicability: leadApplicability } : {}),
    },
    {
      id: 'follow', label: roleLabel(seed, 'follow', 'Follow / receive'), perspective: 'receptive',
      ...(followApplicability ? { applicability: followApplicability } : {}),
    },
  ], [{ leftRoleId: 'lead', rightRoleId: 'follow' }]);
}

function paired(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const roles = seed.pairedRoles;
  if (!roles) throw new Error(`Paired practice ${seed.id} requires pairedRoles`);
  const axes = seed.counterpartScoped ? (['counterpartSex'] as const) : undefined;
  const [left, right] = roles;
  const leftApplicability = mergeRoleApplicability(seed, left.id);
  const rightApplicability = mergeRoleApplicability(seed, right.id);
  const leftRole: PracticeRole = {
    id: left.id,
    label: left.en,
    perspective: left.perspective,
    ...(leftApplicability ? { applicability: leftApplicability } : {}),
    ...(axes ? { contextAxes: axes } : {}),
  };
  const rightRole: PracticeRole = {
    id: right.id,
    label: right.en,
    perspective: right.perspective,
    ...(rightApplicability ? { applicability: rightApplicability } : {}),
    ...(axes ? { contextAxes: axes } : {}),
  };
  return practice(seed, categoryId, [leftRole, rightRole], [{ leftRoleId: left.id, rightRoleId: right.id }]);
}

function group(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const centerApplicability = mergeRoleApplicability(seed, 'center');
  const participateApplicability = mergeRoleApplicability(seed, 'participate');
  return practice(seed, categoryId, [
    {
      id: 'center', label: roleLabel(seed, 'center', 'Be the center'), perspective: 'receptive',
      ...(centerApplicability ? { applicability: centerApplicability } : {}),
    },
    {
      id: 'participate', label: roleLabel(seed, 'participate', 'Participate around the center'), perspective: 'active',
      ...(participateApplicability ? { applicability: participateApplicability } : {}),
    },
  ], [{ leftRoleId: 'center', rightRoleId: 'participate' }]);
}

function focus(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const applicability = mergeRoleApplicability(
    seed,
    'interest',
    seed.anatomySex ? { partnerSex: [seed.anatomySex] as readonly Sex[] } : undefined,
  );
  return practice(seed, categoryId, [
    {
      id: 'interest', label: roleLabel(seed, 'interest', 'Interested / attracted'), perspective: 'neutral', contextAxes: ['counterpartSex'],
      ...(applicability ? { applicability } : {}),
    },
  ], [{ leftRoleId: 'interest', rightRoleId: 'interest' }]);
}

function toy(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const sites = seed.targetSites ?? ([] as readonly TargetSite[]);
  const enabledRoles = new Set<CatalogueToyRoleId>(seed.toyRoles ?? DEFAULT_TOY_ROLES);
  const roles: PracticeRole[] = [];

  if (enabledRoles.has('use-on-self')) {
    const applicability = mergeRoleApplicability(
      seed,
      'use-on-self',
      seed.anatomySex ? { selfSex: [seed.anatomySex] as readonly Sex[] } : undefined,
    );
    roles.push({
      id: 'use-on-self', label: roleLabel(seed, 'use-on-self', 'Use it on myself'), perspective: 'neutral',
      contextAxes: ['targetSite'], contextValues: { targetSite: sites }, targetOwner: 'self',
      ...(applicability ? { applicability } : {}),
    });
  }

  if (enabledRoles.has('use-on-partner')) {
    const applicability = mergeRoleApplicability(
      seed,
      'use-on-partner',
      seed.anatomySex ? { partnerSex: [seed.anatomySex] as readonly Sex[] } : undefined,
    );
    roles.push({
      id: 'use-on-partner', label: roleLabel(seed, 'use-on-partner', 'Use it on my partner'), perspective: 'active',
      contextAxes: ['counterpartSex', 'targetSite'], contextValues: { targetSite: sites }, targetOwner: 'partner',
      ...(applicability ? { applicability } : {}),
    });
  }

  if (enabledRoles.has('partner-uses-on-me')) {
    const applicability = mergeRoleApplicability(
      seed,
      'partner-uses-on-me',
      seed.anatomySex ? { selfSex: [seed.anatomySex] as readonly Sex[] } : undefined,
    );
    roles.push({
      id: 'partner-uses-on-me', label: roleLabel(seed, 'partner-uses-on-me', 'Have my partner use it on me'), perspective: 'receptive',
      contextAxes: ['counterpartSex', 'targetSite'], contextValues: { targetSite: sites }, targetOwner: 'self',
      ...(applicability ? { applicability } : {}),
    });
  }

  const compatibleRolePairs: Practice['compatibleRolePairs'] = [
    ...(enabledRoles.has('use-on-self')
      ? [{ leftRoleId: 'use-on-self', rightRoleId: 'use-on-self' }]
      : []),
    ...(enabledRoles.has('use-on-partner') && enabledRoles.has('partner-uses-on-me')
      ? [{ leftRoleId: 'use-on-partner', rightRoleId: 'partner-uses-on-me' }]
      : []),
  ];

  return practice(seed, categoryId, roles, compatibleRolePairs);
}

function dualUseToy(seed: CataloguePracticeSeed, categoryId: string): Practice {
  const sharedApplicability = mergeRoleApplicability(seed, 'use-together');
  const selfApplicability = mergeRoleApplicability(seed, 'use-on-self');
  const roles: PracticeRole[] = [
    {
      id: 'use-together',
      label: roleLabel(seed, 'use-together', 'Use it together with my partner'),
      perspective: 'neutral',
      contextAxes: ['counterpartSex'],
      ...(sharedApplicability ? { applicability: sharedApplicability } : {}),
    },
    {
      id: 'use-on-self',
      label: roleLabel(seed, 'use-on-self', 'Use both ends on myself'),
      perspective: 'neutral',
      ...(selfApplicability ? { applicability: selfApplicability } : {}),
    },
  ];
  return practice(seed, categoryId, roles, [
    { leftRoleId: 'use-together', rightRoleId: 'use-together' },
    { leftRoleId: 'use-on-self', rightRoleId: 'use-on-self' },
  ]);
}

function roleLabel(seed: CataloguePracticeSeed, roleId: string, fallback: string): string {
  return seed.roleLabels?.[roleId]?.en ?? fallback;
}

function anatomyApplicability(selfSex?: Sex, partnerSex?: Sex): RoleApplicability | undefined {
  if (!selfSex && !partnerSex) return undefined;
  return {
    ...(selfSex ? { selfSex: [selfSex] as readonly Sex[] } : {}),
    ...(partnerSex ? { partnerSex: [partnerSex] as readonly Sex[] } : {}),
  };
}

function mergeRoleApplicability(
  seed: CataloguePracticeSeed,
  roleId: string,
  base?: RoleApplicability,
): RoleApplicability | undefined {
  const explicit = seed.roleApplicability?.[roleId];
  if (!base && !explicit && !seed.groupComposition && !seed.requiresAnyParticipantSex) return undefined;
  return {
    ...(base ?? {}),
    ...(seed.groupComposition ? { groupComposition: seed.groupComposition } : {}),
    ...(seed.requiresAnyParticipantSex ? { requiresAnyParticipantSex: seed.requiresAnyParticipantSex } : {}),
    ...(explicit ?? {}),
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
