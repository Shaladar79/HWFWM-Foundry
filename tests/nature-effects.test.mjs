import test from "node:test";import assert from "node:assert/strict";
import {natureEffectiveness,natureRegen,natureMaintenance,natureDamage,natureAptitude,evasiveFootwork,immuneToPortalSickness} from "../scripts/nature-effects.js";
test("affinity, draconic matching spells and elemental gating",()=>{
 assert.equal(natureEffectiveness("Elf","life",100),105);
 assert.equal(natureEffectiveness("Draconian","fire",100,{rank:"gold",ancestry:"fire"}),120);
 assert.equal(natureEffectiveness("Draconian","ice",100,{rank:"gold",ancestry:"fire"}),100);
});
test("regeneration and maintenance follow approved Nature passives",()=>{
 assert.equal(natureRegen("Runic","mana",100),110);
 assert.equal(natureRegen("Smoulder","stamina",100,{significantHeat:true}),110);
 assert.equal(natureRegen("Smoulder","stamina",100),100);
 assert.equal(natureMaintenance("Celestine","mana",20),18);
 assert.equal(natureMaintenance("Leonid","stamina",20),18);
});
test("natural defenses, astral immunity, AP and Lehenik talent cap",()=>{
 assert.equal(natureDamage("Smoulder",100,{physical:true}),90);
 assert.equal(natureDamage("Draconian",100,{subtype:"fire",ancestry:"fire"}),90);
 assert.equal(natureAptitude("Lehenik","utility"),2);
 assert.equal(immuneToPortalSickness("Lehenik"),true);
 assert.deepEqual(evasiveFootwork("Lehenik",1),{ranks:2,purchasedRanks:1,maximum:2,physicalAttackTNModifier:-10});
 assert.throws(()=>evasiveFootwork("Lehenik",2));
 assert.throws(()=>evasiveFootwork("Elf",2));
});
