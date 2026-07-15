/**
 * HWFWM
 * Main system entry point.
 *
 * This file should remain small. As the system grows, it will import
 * dedicated registration and initialization modules.
 */

Hooks.once("init", () => {
  console.log("HWFWM | Initializing system");

  /**
   * Public system namespace.
   *
   * Future modules can expose utilities, configuration, documents,
   * sheets, and API functions through this object.
   */
  game.hwfwm = {
    version: "0.0.1"
  };
});

Hooks.once("ready", () => {
  console.log("HWFWM | System ready");
});
