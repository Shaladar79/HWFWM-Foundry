/**
 * Rank configuration wrapper.
 *
 * Other system files should import rank data from this wrapper instead of
 * importing individual rank files directly. This gives us one stable entry
 * point if the rank system expands later.
 */

export {
  HWFWM_RANKS,
  HWFWM_RANK_ORDER
} from "./rank-definitions.js";
