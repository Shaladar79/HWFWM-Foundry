/**
 * Base attribute scores by rank.
 *
 * All four attributes use the same base score for a given rank.
 * Attribute-specific exceptions, if added later, should live in a separate
 * override module rather than modifying this table.
 */

export const HWFWM_ATTRIBUTE_BASE_SCORES = Object.freeze({
  normal: 40,
  iron: 45,
  bronze: 50,
  silver: 60,
  gold: 75,
  diamond: 90
});

/**
 * Return the base attribute score for a rank.
 *
 * Invalid rank IDs fall back to the Normal-rank base score.
 *
 * @param {string} rankId
 * @returns {number}
 */
export function getAttributeBaseScore(rankId) {
  return HWFWM_ATTRIBUTE_BASE_SCORES[rankId]
    ?? HWFWM_ATTRIBUTE_BASE_SCORES.normal;
}
