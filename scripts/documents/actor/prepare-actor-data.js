import {
  calculateAttributeCollection
} from "../../config/attributes/index.js";

import {
  normalizeRankValue
} from "../../config/ranks/index.js";

/**
 * Prepare the derived rank and attribute data for an HWFWM Actor.
 *
 * This function does not determine rank progression yet. It reads the
 * Actor's current stored rank value, validates it, and uses that rank to
 * recalculate all four attributes.
 *
 * @param {object} systemData
 * @returns {object}
 */
export function prepareActorSystemData(systemData = {}) {
  const rank = normalizeRankValue({
    rank: systemData.rank?.id,
    level: systemData.rank?.level
  });

  systemData.rank ??= {};
  systemData.rank.id = rank.rank;
  systemData.rank.level = rank.level;

  systemData.attributes = calculateAttributeCollection({
    rankId: rank.rank,
    attributes: systemData.attributes
  });

  return systemData;
}
