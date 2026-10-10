# HWFWM — The System

Independent, unofficial fan-made Foundry VTT tabletop system inspired by *He Who Fights with Monsters*. Not affiliated with the author or publisher.

## Milestone P1 status

**Foundation implemented; unit validation automated; live Foundry verification pending.**

The prior project is preserved at `backup/legacy-before-rebuild`. Current code targets **Foundry VTT v13**; the legacy ActorSheet API is deprecated and will need migration before targeting later versions.

- Actor types: Character, NPC, Monster, Familiar
- Item types: Essence, Ability, Talent, Skill, Equipment, Nature
- Rank calculations and gated ability progression
- 1d100 resolver, Tyranny of Rank, layered damage helpers
- White, rank-colored seven-tab sheet and preliminary combat window
- Starting Life Force 40, Mana 30, Stamina 30 with derived attribute progress
- GitHub Actions validation and Node unit tests

## Manual install and smoke test (required)

1. Copy this repository into the Foundry user-data directory: `Data/systems/hwfwm/`.
2. Restart **Foundry v13** and create a world using **HWFWM — The System**.
3. Create one Actor of each type: Character, NPC, Monster, Familiar.
4. Open each sheet, switch all tabs and edit Nature and resource fields.
5. Add four Essence items assigned to Power/Speed/Spirit/Recovery and five Ability items per Essence with `essenceId` equal to that Essence item's ID (currently requires manual item data setup).
6. Verify calculated attributes show Iron 0, then test rank progression and d100 rolls.
7. Open the separate combat panel. Action Score is manually seeded as the `hwfwm.actionScore` actor flag for this first milestone.
8. Report any console errors and installation problems.

**Not yet implemented:** full character wizard, item editing UI, automated combat countdown, GM XP awards/spending, AP designer, effects application, familiars syncing, and release packaging. A live Foundry UI smoke test is necessary before calling P1 fully validated.

See `docs/rules.md` for the rules contract.
