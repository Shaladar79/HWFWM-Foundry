# Rules contract (work in progress)

- Nature replaces race. Post-Cosmic Throne setting; players choose an eligible confluence from available outcomes.
- Four freely bonded essences, one per Power, Speed, Spirit, Recovery; five abilities each.
- Attribute progression = lowest of the five ability rank/levels. Character overall rank = lowest attribute rank. Next rank level 0 allowed; level 1 locked until overall rank catches up.
- Iron/Bronze/Silver/Gold/Diamond/Transcendent (Normal also for NPCs). Base TN at rank 0 = 30/40/60/90/130/180%, with +1/+2/+3/+4/+5/+6 per level. Numbers above 100 are allowed.
- Skill +5%, specialization +5%, plus Nature, essence, equipment and circumstance modifiers.
- d100 roll under TN, one success at/below TN, +1 each full 10 points below. Natural 01–05 always succeeds and grants +3 successes (minimum four).
- Tyranny of Rank affects hostile rolls ±10 per rank; beneficial rolls only gain +10 per rank the actor exceeds the recipient. No direct effect multipliers.
- Ability effect = per-success magnitude × successes; configurable components may separately scale strength and duration.
- XP pools: one Essence XP for the twenty abilities, one Talent XP awarded at creation/overall rank-ups/GM story milestones; Ability Points at individual ability rank-ups. AP drawback refunds capped provisionally at 50%.
- Life Force starts at 40, Mana/Stamina 30. Power contributes Life Force, Spirit Mana, Speed Stamina; Recovery contributes half progression to Life Force and Stamina and regeneration (rates TBD). Small essence-based contributions scale with bonded progression.
- Damage layer order: Normal Shield → Mana Shield → Armor durability → Extra Life Force → Life Force. One normal and one mana shield slot; shields persist until replaced/depleted. Depletion can trigger explosions; replacement does not.
- Armor single whole-set slot; fixed accessory slots. Durability = base by armor type × rank multiplier 1 through 6; repair depends on individual item.
- Silver Wounds, Gold Will, Diamond Reconstitution, Transcendent Authority.
- Countdown Action Score: 1d20 + initiative bonuses per round; spend action costs and re-enter order on new score. No overspending. Movement cost 2; base 6 + rank gains Bronze +2, Silver +3, Gold +5, Diamond +8, Transcendent +12; Nature/essence/talents can alter it.
- Simple actions: speaking, drawing weapon, readying belt potion free. Storage retrieval costs AP; other costs TBD.
- Bonded familiar naturally occurring, permanently dead if killed. Astral summoned familiar may return after manifestation loss but can refuse. All familiar power derives from linked essence ability, not directly from owner's rank.
- Characters/NPCs share essence system; Normal rank NPC option. Monsters use non-essence abilities. Full details and progression are open design work.

## Provisional mechanics
Resource regeneration rates, exact Essence XP costs, Talent XP awards/costs, equipment effect catalogs, AP component costs, damage tuning, and some sheet workflows remain undecided. Do not treat proposed values as final beyond stated baselines.

## First Edition Skill Talents — Locked
All skills come from Skill Talents. Five distinct starting Skill Talents are selected free during character creation; each creates a trained skill (+5% TN). No starting specializations. Nature-granted talents are separate. Specializations may be obtained later.
- Power (7): Athletics, Intimidation, Grappling, Endurance, Feats of Strength, Martial Combat, Unarmed Combat.
- Speed (5): Acrobatics, Stealth, Sleight of Hand, Precision, Ranged Combat.
- Spirit (11): Magic Theory, Ritual Knowledge, Aura Control, Spellcasting, Perception, Investigation, Insight, Persuasion, Deception, Lore, Concentration.
- Recovery (3): Survival, Medicine, Meditation.
- Ritual Knowledge requires Magic Theory. Summon and familiar Essence abilities require Ritual Knowledge; ability-builder prerequisite enforcement is pending.
- Four universal attribute saves without Skill Talents: Power, Speed, Spirit, Fortitude (Recovery). Provisional implementation uses current attribute TN and applicable modifiers; independent save progression is not approved.
- Reflexes, Evasion, Constitution and Fortitude are not skills; Arcana was renamed Magic Theory. Spec bonuses (+5%) only apply when purchased later.

## P3 Essence Ability blueprint framework (provisional)
Each ability retains its existing Essence ID, Awakening Stone name, category, AP allocation, and effects. A versioned `system.blueprint` provides optional Essence/stone provenance, multiple typed components, source attribution (manual/Essence/Awakening Stone), configuration, notes, and nullable per-component AP costs. Null means cost is undecided. No costs, automatic awakening outcomes, Essence-specific restrictions, or executable component calculations have been introduced. The sheet supports design notes; detailed component editing is deferred until rules are approved.
