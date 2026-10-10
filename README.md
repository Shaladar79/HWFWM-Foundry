# HWFWM — The System

Independent fan-made Foundry VTT tabletop system inspired by *He Who Fights with Monsters*. Unofficial, not endorsed by the author or publisher.

## Status

**0.1.0 foundation (not yet play-tested).** Rebuilt from scratch in October 2026. The previous implementation is preserved on branch `backup/legacy-before-rebuild`.

## Installing locally

Place this repository as `Data/systems/hwfwm` in the Foundry user data folder, restart Foundry, then select **HWFWM — The System** when creating a world. This is an initial implementation targeting Foundry v13; v14 compatibility and actual application installation remain to be validated.

## Implemented foundations

- Four Actor types: character, NPC, monster, familiar
- Essence, ability, talent, skill, equipment and nature Item types
- Individual ability → attribute → character rank calculation
- Rule helpers for 1d100, critical 01–05 (+3 successes), 10-point success margins, hostile and beneficial Tyranny of Rank
- Derived Life Force (40), Mana (30), Stamina (30) with progression and configurable essence resource bonuses
- Combat movement base 6 with cumulative rank bonuses, Movement action cost 2
- Rank-themed white character sheet with tabs and first-pass combat panel
- Separate shields, Mana shielding, armor, extra Life Force and Life Force damage helper

## Planned / not yet functional

The foundation is **not a completed game**. XP spending and award automation, full ability point-buy editor, NPC Normal rules refinement, character creation wizard, shield depletion triggers, item slot enforcement, familiar linking, turn-order combat engine, and guided targeting/effect application require subsequent milestones. Combat panel currently only deducts Action Score manually initialized via an actor flag; it does not run the initiative tracker. No Foundry UI smoke test has been run.

## Rules

See [docs/rules.md](docs/rules.md) for established mechanics and outstanding balance decisions. Never infer an attribute from fewer than five linked abilities.
