import {
  HWFWM_RANKS,
  HWFWM_RANK_ORDER
} from "./rank-definitions.js";

import {
  getRankDefinition,
  isValidRankLevel
} from "./rank-helpers.js";

/**
 * Create a validated rank value.
 *
 * Rank values are plain objects so they can be stored safely in Foundry
 * document data and passed between system modules.
 *
 * @param {string} rankId
 * @param {number} level
 * @returns {{rank: string, level: number}}
 */
export function createRankValue(rankId = "normal", level = 0) {
  if (!isValidRankLevel(rankId, level)) {
    return {
      rank: "normal",
      level: 0
    };
  }

  return {
    rank: rankId,
    level
  };
}

/**
 * Normalize unknown rank data into a valid rank value.
 *
 * This is useful when reading Actor data that may be incomplete,
 * outdated, or imported from an earlier system version.
 *
 * @param {object|null|undefined} value
 * @returns {{rank: string, level: number}}
 */
export function normalizeRankValue(value) {
  if (!value || typeof value !== "object") {
    return createRankValue();
  }

  return createRankValue(
    value.rank,
    Number(value.level)
  );
}

/**
 * Convert a rank and level into one sortable progression index.
 *
 * Normal occupies index 0.
 * Iron 0 begins at index 1.
 * Diamond 9 occupies the highest current index.
 *
 * This index is for comparison and sorting only. It does not determine
 * advancement or calculate an Actor's derived rank.
 *
 * @param {string} rankId
 * @param {number} level
 * @returns {number}
 */
export function getRankProgressionIndex(rankId, level) {
  if (!isValidRankLevel(rankId, level)) return -1;

  if (rankId === "normal") return 0;

  const rankIndex = HWFWM_RANK_ORDER.indexOf(rankId);

  if (rankIndex < 1) return -1;

  return 1 + ((rankIndex - 1) * 10) + level;
}

/**
 * Compare two complete rank values, including internal rank levels.
 *
 * Returns:
 * - A negative number when valueA is lower
 * - Zero when both values are equal
 * - A positive number when valueA is higher
 *
 * @param {{rank: string, level: number}} valueA
 * @param {{rank: string, level: number}} valueB
 * @returns {number}
 */
export function compareRankValues(valueA, valueB) {
  const normalizedA = normalizeRankValue(valueA);
  const normalizedB = normalizeRankValue(valueB);

  return getRankProgressionIndex(
    normalizedA.rank,
    normalizedA.level
  ) - getRankProgressionIndex(
    normalizedB.rank,
    normalizedB.level
  );
}

/**
 * Return the next valid rank value.
 *
 * This helper describes the fixed rank sequence only. It does not determine
 * whether an Actor qualifies to advance.
 *
 * Diamond 9 returns itself because it is currently the maximum rank value.
 *
 * @param {{rank: string, level: number}} value
 * @returns {{rank: string, level: number}}
 */
export function getNextRankValue(value) {
  const current = normalizeRankValue(value);
  const rank = getRankDefinition(current.rank);

  if (!rank) return createRankValue();

  const currentLevelIndex = rank.levels.findIndex(
    (rankLevel) => rankLevel.value === current.level
  );

  const nextLevel = rank.levels[currentLevelIndex + 1];

  if (nextLevel) {
    return createRankValue(current.rank, nextLevel.value);
  }

  const nextRankIndex = HWFWM_RANK_ORDER.indexOf(current.rank) + 1;
  const nextRankId = HWFWM_RANK_ORDER[nextRankIndex];

  if (!nextRankId) {
    return createRankValue(current.rank, current.level);
  }

  return createRankValue(nextRankId, 0);
}

/**
 * Return the previous valid rank value.
 *
 * Normal returns itself because it is the minimum rank value.
 *
 * @param {{rank: string, level: number}} value
 * @returns {{rank: string, level: number}}
 */
export function getPreviousRankValue(value) {
  const current = normalizeRankValue(value);
  const rank = getRankDefinition(current.rank);

  if (!rank) return createRankValue();

  const currentLevelIndex = rank.levels.findIndex(
    (rankLevel) => rankLevel.value === current.level
  );

  const previousLevel = rank.levels[currentLevelIndex - 1];

  if (previousLevel) {
    return createRankValue(current.rank, previousLevel.value);
  }

  const previousRankIndex = HWFWM_RANK_ORDER.indexOf(current.rank) - 1;
  const previousRankId = HWFWM_RANK_ORDER[previousRankIndex];

  if (!previousRankId) {
    return createRankValue();
  }

  const previousRank = getRankDefinition(previousRankId);
  const lastLevel = previousRank.levels.at(-1);

  return createRankValue(previousRankId, lastLevel.value);
}

/**
 * Return the highest valid rank value currently supported.
 *
 * @returns {{rank: string, level: number}}
 */
export function getMaximumRankValue() {
  const highestRankId = HWFWM_RANK_ORDER.at(-1);
  const highestRank = HWFWM_RANKS[highestRankId];
  const highestLevel = highestRank.levels.at(-1);

  return createRankValue(highestRankId, highestLevel.value);
}
