/**
 * Base Actor sheet for the HWFWM system.
 *
 * Character, NPC, and monster sheets will initially share this class.
 * Specialized sheet classes can extend it later without duplicating
 * the common Actor-sheet behavior.
 */
export class HWFWMActorSheet extends ActorSheet {
  /**
   * Configure the sheet's default appearance and behavior.
   *
   * @returns {ActorSheetOptions}
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hwfwm", "sheet", "actor"],
      width: 720,
      height: 680,
      resizable: true,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description"
        }
      ],
      submitOnChange: true,
      closeOnSubmit: false
    });
  }

  /**
   * Select the Handlebars template used by this Actor sheet.
   *
   * All Actor types use the same template initially. We can route
   * character, NPC, and monster Actors to separate templates later.
   *
   * @returns {string}
   */
  get template() {
    return "systems/hwfwm/templates/actor/actor-sheet.hbs";
  }

  /**
   * Prepare data for the Handlebars sheet template.
   *
   * @param {ActorSheetOptions} options
   * @returns {Promise<object>}
   */
  async getData(options = {}) {
    const context = await super.getData(options);

    context.actor = this.actor;
    context.system = this.actor.system;
    context.items = this.actor.items;
    context.actorType = this.actor.type;
    context.isEditable = this.isEditable;

    context.abilities = this.actor.items.filter(
      (item) => item.type === "ability"
    );

    context.essences = this.actor.items.filter(
      (item) => item.type === "essence"
    );

    context.equipment = this.actor.items.filter(
      (item) => item.type === "equipment"
    );

    context.consumables = this.actor.items.filter(
      (item) => item.type === "consumable"
    );

    return context;
  }

  /**
   * Attach interactive sheet listeners.
   *
   * Listener modules will be added here as interactive features
   * such as ability rolls and item controls are implemented.
   *
   * @param {JQuery} html
   */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;
  }
}
