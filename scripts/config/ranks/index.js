/**
 * Rank configuration wrapper.
 *
 * Other system files should import rank data and helpers from this wrapper
 * instead of importing individual rank files directly. This gives the rest
 * of the system one stable entry point for rank-related functionality.
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
