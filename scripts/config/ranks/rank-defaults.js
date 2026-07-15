/**
 * Create the default stored rank data for an Actor.
 *
 * The rank and level fields will eventually be overwritten by derived
 * progression calculations. They are included here so every Actor has a
 * predictable rank-data structure from creation.
 *
 * @returns {{
 *   id: string,
 *   level: number
 * }}
 */
export function createDefaultRankData() {
  return {
    id: "normal",
    level: 0
  };
}
