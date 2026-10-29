const PROHIBITED_TERMS = [
  'child porn',
  'cp',
  'kill yourself',
  'kys',
  'nigger',
  'faggot',
];

/**
 * A small first-line filter for user-supplied text. Image safety must be
 * enforced by the moderation service defined in the production backend.
 */
export function containsProhibitedContent(value: string): boolean {
  const normalized = ` ${value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')} `;
  return PROHIBITED_TERMS.some((term) => normalized.includes(` ${term} `));
}
