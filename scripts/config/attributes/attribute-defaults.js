import {
  HWFWM_ATTRIBUTE_ORDER
} from "./attribute-definitions.js";

/**
 * Create the default stored data for one attribute.
 *
 * Derived fields such as baseScore, levelModifier, and total are included
 * for sheet display, but will later be recalculated by the Actor data model.
 *
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
export function createDefaultAttributeData() {
  return {
    level: 0,
    baseScore: 40,
    levelModifier: 0,
    racialModifier: 0,
    equipmentModifier: 0,
    auraModifier: 0,
    abilityModifier: 0,
    total: 40
  };
}

/**
 * Create the complete default attribute collection.
 *
 * Each attribute receives its own independent object so changes to one
 * attribute cannot accidentally affect the others.
 *
 * @returns {Record<string, object>}
 */
export function createDefaultAttributes() {
  return Object.fromEntries(
    HWFWM_ATTRIBUTE_ORDER.map((attributeId) => [
      attributeId,
      createDefaultAttributeData()
    ])
  );
}
