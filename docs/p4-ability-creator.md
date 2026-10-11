# P4 Essence Ability Creator — implementation notes

P4 follows the P3 blueprint storage and adds player-facing component authoring.

## Delivered
- Add and remove typed components (damage, healing, shield, boon, debuff, movement, summon, familiar, utility, custom).
- Source provenance: manual, Essence or Awakening Stone.
- Optional AP estimates. Blank means pricing is **undecided**, not free.
- Per-success scaling flag records design intent only. No effect magnitude is automatically calculated.
- Preserve parent Essence and Awakening Stone on edits.
- Require both Magic Theory and Ritual Knowledge Talent skills for summon/familiar components.
- Unit coverage for component CRUD, provenance, pricing, scaling, and prerequisites.

## Deliberate limits
- No automatic effect rolls, damage/healing, or AP cost calculation until those First Edition rules are approved.
- Existing ability AP creation/upgrade accounting remains separate from blueprint component estimates. Adding a component does not spend or refund AP.
- Detailed Awakening Stone restrictions, effect-specific scaling magnitudes, upgrade cost schedules, and AP refund policies remain undecided and must not be assumed.
- Foundry v13 UI and multiplayer flows need live verification after P4 development.
