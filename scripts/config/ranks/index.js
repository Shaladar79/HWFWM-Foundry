/**
 * Rank configuration wrapper.
 *
 * Other system files should import rank data and helpers through this wrapper
 * instead of importing individual rank modules directly.
 */

export {
  HWFWM_RANKS,
  HWFWM_RANK_ORDER
} from "./rank-definitions.js";

export {
  isValidRank,
  getRankDefinition,
  getRankIndex,
  isValidRankLevel,
  getRankLevelDefinition,
  getRankLevelLabel,
  compareRanks
} from "./rank-helpers.js";

export {
  createRankValue,
  normalizeRankValue,
  getRankProgressionIndex,
  compareRankValues,
  getNextRankValue,
  getPreviousRankValue
} from "./rank-value-helpers.js";
