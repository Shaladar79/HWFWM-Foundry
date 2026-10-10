# HWFWM — The System

Unofficial fan-made Foundry VTT ruleset. Development target: Foundry v13, legacy sheet API (v14 migration later).

## Development status
**P1 automated checks passed; Foundry smoke test deferred. P2 begun.**

P2 first increment provides:
- One-click initialization of four essence slots and twenty associated essence ability item records
- Direct renaming of essence and ability items on the Abilities tab
- Essence XP advancement button with configurable provisional advancement costs
- Rank-gate enforcement: abilities may reach next-rank level 0 but not advance further until the overall character reaches that rank
- Derived attribute and overall rank calculations

XP cost formula is **provisional**: `world multiplier × rank tier × (current ability level + 1)`. It is configurable in World Settings and is not a finalized game rule. Talent XP rank awards and the complete character creation wizard are not implemented yet.

## Validation
GitHub Actions runs `npm test` and JavaScript syntax/manifest checks on commits. This does not replace a live Foundry v13 installation test. To install manually, place the source directory in `Data/systems/hwfwm` and restart Foundry.

Old project available under branch `backup/legacy-before-rebuild`.
See `docs/rules.md` for established and provisional mechanics.

## Confluence selection (P2)
The character creator now dynamically lists matching documented confluences for the three chosen primary essences (order-independent). Restricted outcomes are labeled for GM review. Players can select **Custom / GM-approved** to supply an alternative. The catalog is curated and incomplete; lookup does not automatically validate custom outcomes. The live Foundry smoke test remains deferred.

## P2 code audit — October 10, 2026
Additional guards prevent malformed essence builds (missing/duplicate bonds or fewer than five abilities per essence) from advancing. A rank cannot increase unless all 20 properly linked abilities meet its threshold. GM rank-up Talent XP awards remain configurable and default to zero; they are not finalized balance values. XP grants and purchases are logged, but true database transactions and live UI testing are not yet verified. Next design area: Natures and Nature abilities, potentially modifying character setup and derived statistics.
