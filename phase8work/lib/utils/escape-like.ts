/**
 * Escapes `%` and `_` so a user-supplied string is matched literally in a
 * Postgres ILIKE pattern, instead of being interpreted as SQL wildcards.
 */
export function escapeLikePattern(value: string) {
  return value.replace(/[%_]/g, (match) => `\\${match}`);
}
