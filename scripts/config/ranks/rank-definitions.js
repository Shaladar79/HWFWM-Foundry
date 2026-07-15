/**
 * HWFWM rank definitions.
 *
 * This file contains only static rank data.
 * Rank calculation and progression logic will live in separate modules.
 */

export const HWFWM_RANKS = Object.freeze({
  normal: Object.freeze({
    id: "normal",
    label: "Normal",
    levels: Object.freeze([
      Object.freeze({
        value: 0,
        label: "Normal"
      })
    ])
  }),

  iron: Object.freeze({
    id: "iron",
    label: "Iron",
    levels: Object.freeze(
      Array.from({ length: 10 }, (_, level) =>
        Object.freeze({
          value: level,
          label: `Iron ${level}`
        })
      )
    )
  }),

  bronze: Object.freeze({
    id: "bronze",
    label: "Bronze",
    levels: Object.freeze(
      Array.from({ length: 10 }, (_, level) =>
        Object.freeze({
          value: level,
          label: `Bronze ${level}`
        })
      )
    )
  }),

  silver: Object.freeze({
    id: "silver",
    label: "Silver",
    levels: Object.freeze(
      Array.from({ length: 10 }, (_, level) =>
        Object.freeze({
          value: level,
          label: `Silver ${level}`
        })
      )
    )
  }),

  gold: Object.freeze({
    id: "gold",
    label: "Gold",
    levels: Object.freeze(
      Array.from({ length: 10 }, (_, level) =>
        Object.freeze({
          value: level,
          label: `Gold ${level}`
        })
      )
    )
  }),

  diamond: Object.freeze({
    id: "diamond",
    label: "Diamond",
    levels: Object.freeze(
      Array.from({ length: 10 }, (_, level) =>
        Object.freeze({
          value: level,
          label: `Diamond ${level}`
        })
      )
    )
  })
});

/**
 * Ordered rank IDs from lowest to highest.
 */
export const HWFWM_RANK_ORDER = Object.freeze([
  "normal",
  "iron",
  "bronze",
  "silver",
  "gold",
  "diamond"
]);
