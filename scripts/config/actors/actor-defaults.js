import {
  createDefaultRankData
} from "../ranks/rank-defaults.js";

import {
  createDefaultAttributes
} from "../attributes/attribute-defaults.js";

/**
 * Create the shared default system data used by HWFWM Actors.
 *
 * Character, NPC, and monster data models can build on this common
 * structure without duplicating rank and attribute defaults.
 *
 * @returns {{
 *   description: string,
 *   rank: {
 *     id: string,
 *     level: number
 *   },
 *   attributes: Record<string, object>,
 *   lifeForce: {
 *     value: number,
 *     max: number
 *   },
 *   mana: {
 *     value: number,
 *     max: number
 *   },
 *   stamina: {
 *     value: number,
 *     max: number
 *   }
 * }}
 */
export function createDefaultActorData() {
  return {
    description: "",

    rank: createDefaultRankData(),

    attributes: createDefaultAttributes(),

    lifeForce: {
      value: 10,
      max: 10
    },

    mana: {
      value: 10,
      max: 10
    },

    stamina: {
      value: 10,
      max: 10
    }
  };
}
