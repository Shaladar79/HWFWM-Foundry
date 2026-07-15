/**
 * HWFWM attribute definitions.
 *
 * This file contains only static attribute identities and display labels.
 * Attribute calculations and Actor data handling belong in separate modules.
 */

export const HWFWM_ATTRIBUTES = Object.freeze({
  power: Object.freeze({
    id: "power",
    label: "Power"
  }),

  speed: Object.freeze({
    id: "speed",
    label: "Speed"
  }),

  spirit: Object.freeze({
    id: "spirit",
    label: "Spirit"
  }),

  recovery: Object.freeze({
    id: "recovery",
    label: "Recovery"
  })
});

/**
 * Ordered attribute IDs used for sheet display and iteration.
 */
export const HWFWM_ATTRIBUTE_ORDER = Object.freeze([
  "power",
  "speed",
  "spirit",
  "recovery"
]);

/**
 * Minimum and maximum valid attribute levels.
 */
export const HWFWM_ATTRIBUTE_LEVEL_RANGE = Object.freeze({
  minimum: 0,
  maximum: 9
});
