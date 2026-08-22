import { Practice, RoleId } from './practice';

export abstract class RoleCompatibilityPolicy {
  abstract areCompatible(practice: Practice, leftRoleId: RoleId, rightRoleId: RoleId): boolean;
}

export class ExplicitRoleCompatibilityPolicy extends RoleCompatibilityPolicy {
  override areCompatible(practice: Practice, leftRoleId: RoleId, rightRoleId: RoleId): boolean {
    if (!this.hasRole(practice, leftRoleId) || !this.hasRole(practice, rightRoleId)) {
      return false;
    }

    return practice.compatibleRolePairs.some(
      (pair) =>
        (pair.leftRoleId === leftRoleId && pair.rightRoleId === rightRoleId) ||
        (pair.leftRoleId === rightRoleId && pair.rightRoleId === leftRoleId),
    );
  }

  private hasRole(practice: Practice, roleId: RoleId): boolean {
    return practice.roles.some((role) => role.id === roleId);
  }
}

export const defaultRoleCompatibilityPolicy = new ExplicitRoleCompatibilityPolicy();
