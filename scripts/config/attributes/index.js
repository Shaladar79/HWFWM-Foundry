/**
 * Attribute configuration wrapper.
 *
 * Other system files should import attribute definitions, defaults, and
 * calculation helpers through this wrapper instead of importing individual
 * modules directly.
 */

export {
  HWFWM_ATTRIBUTES,
  HWFWM_ATTRIBUTE_ORDER,
  HWFWM_ATTRIBUTE_LEVEL_RANGE
} from "./attribute-definitions.js";

export {
  HWFWM_ATTRIBUTE_BASE_SCORES,
  getAttributeBaseScore
} from "./attribute-base-scores.js";

export {
  HWFWM_ATTRIBUTE_LEVEL_MULTIPLIER,
  isValidAttributeLevel,
  normalizeAttributeLevel,
  getAttributeLevelModifier
} from "./attribute-level-modifier.js";

export {
  normalizeAttributeModifier,
  calculateAttribute
} from "./attribute-calculator.js";

export {
  createDefaultAttributeData,
  createDefaultAttributes
} from "./attribute-defaults.js";
