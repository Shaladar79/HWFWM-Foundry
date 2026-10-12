# P4 Iron First Edition — implemented construction checkpoint

The approved Iron-rank design has been integrated into a pure rule module `scripts/p4-iron-rules.js` and a simple character-sheet creation form. The form is under **Abilities → Iron First Edition Build** for each Essence ability. The validated construction is saved to `Item.system.ironBuild`. Existing P3 blueprints and AP transaction history remain unchanged.

## Built and validated
- Six base AP, or eight for Special Attack Aptitude; negative AP credit capped at half the base.
- Damage tiers: 2/3/4/8 per success at 0/1/2/4 AP; second distinct purchased type costs 2 AP more.
- Action speeds (Quick/Fast/Medium/Slow/Extended), cooldown discounts, activation percentage costs and resource restrictions.
- Special Attack weapon compatibility, unarmed-only restriction, effect-only attacks, and Drain requiring purchased damage.
- Spell ranges: Touch 1/−1 AP, Short 4/0, Medium 8/2, Long 12/3, Extreme 20/5.
- Damage Spells: up to two damage components, one special effect, optional two-target for 3 AP.
- Restoration Spells: Life Force/Mana/Stamina, immediate healing, single-pulse regeneration, 3-round regeneration with +1 AP per +1 per-success pulse, two targets.
- Transfer Spells: 1:1 transfer, fixed resource, shared per-success maximum across up to two recipients, no regeneration.
- Shield construction: Normal/Reflection potency 3/5/7/10 per success at 0/1/2/4 AP, Reflection surcharge +2 AP, Deflection 4 AP, self-only Mana Shield 6 AP with zero activation cost.
- Pure helpers for damage/shield/healing scaling, rounding, activation resource calculation, Drain recovery, transfer clamping, and relative Normal/Reflection/Deflection shield replacement.
- Unit tests in `tests/p4-iron-rules.test.mjs`.

## Not yet implemented in the live Foundry engine
- Casting/attack targeting and interactive d100 checks; action score and Mana/Stamina spend transactions for the new saved build.
- Damage routing with typed shield/armor mitigation; status and affliction persistence; timed cooldowns and Regeneration ticks.
- Shield application to tokens, normal and mana shield UI status, reflection chains, and combat notifications.
- Essence/stone damage-type allowlists, status type compatibility matrix, GM overrides.
- An advanced reactive editor restoring every saved control value (saved build is displayed as a summary, and the simple form defaults on re-opening).
- Other Spell categories: Rituals, Summons, Ailment Removal, dedicated Status Effects; Utilities and Boons.
- Forge multiplayer/in-combat verification. Node tests do not establish live Foundry compatibility.

## Important design boundaries
- Iron Spells require verbal casting; other Spell categories pending design.
- Round length is six seconds; Regeneration lasts three rounds and each effect retains its timing across combat boundaries.
- A Normal/Reflection shield with more remaining points replaces weaker shields, equal favors new; Deflection overrides all pool-based shields; Mana Shield is a separate self-only protection resource.
- This coding checkpoint does not retroactively consume or refund P3 AP allocations. The new ability model is a saved draft until the full P4 spending migration and runtime hook is implemented.
