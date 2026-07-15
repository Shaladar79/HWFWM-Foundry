import { HWFWMActorSheet } from "./actor/hwfwm-actor-sheet.js";

/**
 * Register all HWFWM document sheets.
 *
 * Keep sheet registration centralized here so the main system entry file
 * only needs to call one function.
 */
export function registerHWFWMSheets() {
  console.log("HWFWM | Registering document sheets");

  foundry.documents.collections.Actors.registerSheet(
    "hwfwm",
    HWFWMActorSheet,
    {
      types: ["character", "npc", "monster"],
      makeDefault: true,
      label: "HWFWM Actor Sheet"
    }
  );
}
