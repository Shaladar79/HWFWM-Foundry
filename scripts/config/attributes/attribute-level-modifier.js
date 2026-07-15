import {
  HWFWM_ATTRIBUTE_LEVEL_RANGE
} from "./attribute-definitions.js";

/**
 * Number of percentage points added per attribute level.
 */
export const HWFWM_ATTRIBUTE_LEVEL_MULTIPLIER = 3;

/**
 * Determine whether a value is a valid attribute level.
 *
 * @param {number} level
 * @returns {boolean}
 */
export function isValidAttributeLevel(level) {
  return Number.isInteger(level)
    && level >= HWFWM_ATTRIBUTE_LEVEL_RANGE.minimum
    && level <= HWFWM_ATTRIBUTE_LEVEL_RANGE.maximum;
}

/**
 * Normalize unknown input into a valid attribute level.
 *
 * Invalid values fall back to level 0.
 *
 * @param {unknown} level
 * @returns {number}
 */
export function normalizeAttributeLevel(level) {
  const numericLevel = Number(level);

  if (!Number.isInteger(numericLevel)) return 0;

  return Math.clamp(
    numericLevel,
    HWFWM_ATTRIBUTE_LEVEL_RANGE.minimum,
    HWFWM_ATTRIBUTE_LEVEL_RANGE.maximum
  );
}

/**
 * Calculate the percentage modifier granted by an attribute level.
 *
 * Formula:
 * level modifier = level × 3
 *
 * @param {number} level
 * @returns {number}
 */
export function getAttributeLevelModifier(level) {
  const normalizedLevel = normalizeAttributeLevel(level);

  return normalizedLevel * HWFWM_ATTRIBUTE_LEVEL_MULTIPLIER;
}
