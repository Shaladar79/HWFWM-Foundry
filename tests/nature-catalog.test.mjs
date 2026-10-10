import test from "node:test";
import assert from "node:assert/strict";
import {NATURE_CHOICES,natureGifts,natureSummary} from "../scripts/nature-catalog.js";
test("eight standard Natures have six gifts and Outworlder is excluded",()=>{
 assert.equal(NATURE_CHOICES.length,8);
 assert.ok(!NATURE_CHOICES.includes("Outworlder"));
 for(const name of NATURE_CHOICES)assert.equal(natureGifts(name).length,6);
});
test("passive resource bonuses scale only where approved",()=>{
 assert.equal(natureSummary("Elf","iron").manaBonus,5);
 assert.equal(natureSummary("Elf","diamond").manaBonus,25);
 assert.equal(natureSummary("Leonid","bronze").staminaBonus,10);
 assert.equal(natureSummary("Celestine","gold").manaBonus,0);
});
test("WIP gifts remain placeholders and speed bonus advances with rank",()=>{
 const gifts=natureSummary("Human","silver").gifts;
 assert.equal(gifts.filter(g=>g.workInProgress).length,4);
 assert.equal(natureSummary("Elf","silver").gifts.find(g=>g.name==="Grace").bonus,9);
 assert.equal(natureSummary("Draconian","bronze").gifts.find(g=>g.name==="Dragon Breath").workInProgress,true);
});
