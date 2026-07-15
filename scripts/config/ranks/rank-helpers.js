import {
  HWFWM_RANKS,
  HWFWM_RANK_ORDER
} from "./rank-definitions.js";

/**
 * Determine whether a rank ID exists.
 *
 * @param {string} rankId
 * @returns {boolean}
 */
export function isValidRank(rankId) {
  return Object.hasOwn(HWFWM_RANKS, rankId);
}

/**
 * Return the complete definition for a rank.
 *
 * @param {string} rankId
 * @returns {object|null}
 */
export function getRankDefinition(rankId) {
  if (!isValidRank(rankId)) return null;

  return HWFWM_RANKS[rankId];
}

/**
 * Return the ordered position of a rank.
 *
 * Normal is 0, Iron is 1, and so forth.
 *
 * @param {string} rankId
 * @returns {number}
 */
export function getRankIndex(rankId) {
  return HWFWM_RANK_ORDER.indexOf(rankId);
}

/**
 * Determine whether a level is valid for a given rank.
 *
 * Normal only permits level 0.
 * Iron through Diamond permit levels 0 through 9.
 *
 * @param {string} rankId
 * @param {number} level
 * @returns {boolean}
 */
export function isValidRankLevel(rankId, level) {
  const rank = getRankDefinition(rankId);

  if (!rank || !Number.isInteger(level)) return false;

  return rank.levels.some(
    (rankLevel) => rankLevel.value === level
  );
}

/**
 * Return a specific level definition for a rank.
 *
 * @param {string} rankId
 * @param {number} level
 * @returns {object|null}
 */
export function getRankLevelDefinition(rankId, level) {
  const rank = getRankDefinition(rankId);

  if (!rank) return null;

  return rank.levels.find(
    (rankLevel) => rankLevel.value === level
  ) ?? null;
}

/**
 * Return a display label such as "Normal", "Iron 0", or "Gold 7".
 *
 * @param {string} rankId
 * @param {number} level
 * @returns {string}
 */
export function getRankLevelLabel(rankId, level) {
  return getRankLevelDefinition(rankId, level)?.label ?? "Unknown Rank";
}

/**
 * Compare two ranks without considering their internal levels.
 *
 * Returns:
 * - A negative number when rankA is lower
 * - Zero when both ranks are equal
 * - A positive number when rankA is higher
 *
 * @param {string} rankA
 * @param {string} rankB
 * @returns {number}
 */
export function compareRanks(rankA, rankB) {
  return getRankIndex(rankA) - getRankIndex(rankB);
}
