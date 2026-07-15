/**
 * Base Actor sheet for HWFWM.
 *
 * Characters, NPCs, and monsters initially share this sheet class.
 * Specialized sheets can extend this class later.
 */

const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class HWFWMActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /**
   * Configure the ApplicationV2 window and form behavior.
   */
  static DEFAULT_OPTIONS = {
    classes: ["hwfwm", "actor-sheet"],
    position: {
      width: 720,
      height: 680
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    },
    window: {
      resizable: true
    }
  };

  /**
   * Handlebars templates rendered by this application.
   *
   * Additional partial templates can be added as separate parts later.
   */
  static PARTS = {
    form: {
      template: "systems/hwfwm/templates/actor/actor-sheet.hbs"
    }
  };

  /**
   * Prepare data supplied to the Handlebars template.
   *
   * @param {object} options Rendering options.
   * @returns {Promise<object>} Template context.
   */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const actor = this.actor;

    return foundry.utils.mergeObject(context, {
      actor,
      system: actor.system,
      actorType: actor.type,
      editable: this.isEditable,

      abilities: actor.items.filter(
        (item) => item.type === "ability"
      ),

      essences: actor.items.filter(
        (item) => item.type === "essence"
      ),

      equipment: actor.items.filter(
        (item) => item.type === "equipment"
      ),

      consumables: actor.items.filter(
        (item) => item.type === "consumable"
      )
    });
  }
}
