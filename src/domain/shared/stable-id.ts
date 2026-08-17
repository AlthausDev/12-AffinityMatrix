export const STABLE_ID_MAX_LENGTH = 120;
const STABLE_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,119})$/u;

export function isStableId(value: unknown): value is string {
  return typeof value === 'string' && STABLE_ID_PATTERN.test(value);
}
