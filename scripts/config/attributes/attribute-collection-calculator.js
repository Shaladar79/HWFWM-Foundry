import {
  HWFWM_ATTRIBUTE_ORDER
} from "./attribute-definitions.js";

import {
  calculateAttribute
} from "./attribute-calculator.js";

import {
  createDefaultAttributeData
} from "./attribute-defaults.js";

/**
 * Normalize one stored attribute object.
 *
 * Missing modifier fields default to 0. Derived values are recalculated
 * rather than trusted from stored document data.
 *
 * @param {object|null|undefined} attribute
 * @returns {object}
 */
export function normalizeStoredAttribute(attribute) {
  const defaults = createDefaultAttributeData();

  if (!attribute || typeof attribute !== "object") {
    return defaults;
  }

  return {
    ...defaults,
    ...attribute
  };
}

/**
 * Calculate all four HWFWM attributes for one Actor.
 *
 * Each attribute can have its own level and modifier values, while all four
 * currently use the Actor's shared rank to determine their base scores.
 *
 * @param {object} data
 * @param {string} [data.rankId="normal"]
 * @param {Record<string, object>} [data.attributes={}]
 * @returns {Record<string, object>}
 */
export function calculateAttributeCollection({
  rankId = "normal",
  attributes = {}
} = {}) {
  return Object.fromEntries(
    HWFWM_ATTRIBUTE_ORDER.map((attributeId) => {
      const storedAttribute = normalizeStoredAttribute(
        attributes[attributeId]
      );

      const calculatedAttribute = calculateAttribute({
        rankId,
        level: storedAttribute.level,
        racialModifier: storedAttribute.racialModifier,
        equipmentModifier: storedAttribute.equipmentModifier,
        auraModifier: storedAttribute.auraModifier,
        abilityModifier: storedAttribute.abilityModifier
      });

      return [
        attributeId,
        calculatedAttribute
      ];
    })
  );
}
