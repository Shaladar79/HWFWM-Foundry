/**
 * HWFWM
 * Main system entry point.
 *
 * Keep this file small. Dedicated modules handle individual systems,
 * registrations, hooks, sheets, documents, and utilities.
 */

import { registerHWFWMConfig } from "./config/register-config.js";
import { registerHWFWMSheets } from "./sheets/register-sheets.js";

/**
 * Foundry initialization hook.
 *
 * Runs once while Foundry is initializing the HWFWM system.
 */
Hooks.once("init", () => {
  console.log("HWFWM | Initializing system");

  const config = registerHWFWMConfig();

  /**
   * Public system namespace.
   *
   * This namespace exposes stable system APIs for internal modules,
   * macros, and future integrations.
   */
  game.hwfwm = {
    version: game.system.version,
    config
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
