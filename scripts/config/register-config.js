import * as HWFWMConfig from "./index.js";

/**
 * Register the shared HWFWM configuration namespace.
 *
 * This wrapper keeps configuration registration separate from the main
 * system entry point. The returned object can also be exposed through
 * game.hwfwm for macros and other system modules.
 *
 * @returns {object} The registered configuration namespace.
 */
export function registerHWFWMConfig() {
  console.log("HWFWM | Registering system configuration");

  CONFIG.HWFWM = HWFWMConfig;

  return HWFWMConfig;
}
