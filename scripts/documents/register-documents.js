import { HWFWMActor } from "./actor/hwfwm-actor.js";

/**
 * Register custom HWFWM document classes.
 *
 * Document registration is kept separate from the main system entry point
 * so Actor and Item document classes can expand independently.
 */
export function registerHWFWMDocuments() {
  console.log("HWFWM | Registering document classes");

  CONFIG.Actor.documentClass = HWFWMActor;
}
