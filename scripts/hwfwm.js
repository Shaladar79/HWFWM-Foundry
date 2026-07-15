/**
 * HWFWM
 * Main system entry point.
 *
 * Keep this file small. Dedicated modules handle individual systems,
 * registrations, hooks, sheets, documents, and utilities.
 */

import { registerHWFWMSheets } from "./sheets/register-sheets.js";

/**
 * Foundry initialization hook.
 *
 * Runs once while Foundry is initializing the HWFWM system.
 */
Hooks.once("init", () => {
  console.log("HWFWM | Initializing system");

  /**
   * Public system namespace.
   *
   * Future modules can expose configuration, documents, utilities,
   * roll functions, and system APIs through this object.
   */
  game.hwfwm = {
    version: "0.0.1"
  };

  registerHWFWMSheets();
});

/**
 * Foundry ready hook.
 *
 * Runs once after the world and system have finished loading.
 */
Hooks.once("ready", () => {
  console.log("HWFWM | System ready");
});
