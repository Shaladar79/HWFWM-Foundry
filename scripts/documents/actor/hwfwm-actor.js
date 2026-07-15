import {
  prepareActorSystemData
} from "./prepare-actor-data.js";

/**
 * Custom HWFWM Actor document.
 *
 * This class is responsible for preparing Actor-level derived data.
 * Individual calculation systems remain in their own modules.
 */
export class HWFWMActor extends Actor {
  /**
   * Prepare derived Actor data.
   *
   * Foundry calls this whenever the Actor's prepared data is rebuilt.
   * Rank progression will later be calculated before attribute preparation.
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    prepareActorSystemData(this.system);
  }
}
