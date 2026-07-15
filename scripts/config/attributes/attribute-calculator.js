import {
  getAttributeBaseScore
} from "./attribute-base-scores.js";

import {
  getAttributeLevelModifier,
  normalizeAttributeLevel
} from "./attribute-level-modifier.js";

/**
 * Normalize an attribute modifier into a usable number.
 *
 * Invalid, missing, or non-numeric values become 0.
 *
 * @param {unknown} modifier
 * @returns {number}
 */
export function normalizeAttributeModifier(modifier) {
  const numericModifier = Number(modifier);

  return Number.isFinite(numericModifier)
    ? numericModifier
    : 0;
}

/**
 * Create a normalized attribute calculation object.
 *
 * The rank determines the base score.
 * The attribute level determines the level modifier.
 * All other modifier sources are supplied separately.
 *
 * @param {object} data
 * @param {string} data.rankId
 * @param {number} data.level
 * @param {number} [data.racialModifier=0]
 * @param {number} [data.equipmentModifier=0]
 * @param {number} [data.auraModifier=0]
 * @param {number} [data.abilityModifier=0]
 * @returns {{
 *   level: number,
 *   baseScore: number,
 *   levelModifier: number,
 *   racialModifier: number,
 *   equipmentModifier: number,
 *   auraModifier: number,
 *   abilityModifier: number,
 *   total: number
 * }}
 */
export function calculateAttribute({
  rankId = "normal",
  level = 0,
  racialModifier = 0,
  equipmentModifier = 0,
  auraModifier = 0,
  abilityModifier = 0
} = {}) {
  const normalizedLevel = normalizeAttributeLevel(level);

  const calculation = {
    level: normalizedLevel,
    baseScore: getAttributeBaseScore(rankId),
    levelModifier: getAttributeLevelModifier(normalizedLevel),
    racialModifier: normalizeAttributeModifier(racialModifier),
    equipmentModifier: normalizeAttributeModifier(equipmentModifier),
    auraModifier: normalizeAttributeModifier(auraModifier),
    abilityModifier: normalizeAttributeModifier(abilityModifier)
  };

  calculation.total =
    calculation.baseScore
    + calculation.levelModifier
    + calculation.racialModifier
    + calculation.equipmentModifier
    + calculation.auraModifier
    + calculation.abilityModifier;

  return calculation;
}
