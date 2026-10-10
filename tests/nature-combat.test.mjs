import test from "node:test";import assert from "node:assert/strict";
import {physicalAttackTN,planNatureHit} from "../scripts/nature-combat.js";
const actor=(nature,rank="iron")=>({system:{nature,rank,resources:{shield:{value:0},manaShield:{active:false},mana:{value:0},armor:{value:0},lifeForce:{value:100,extra:0}}}});
test("Evasive Footwork only applies against physical attack types",()=>{
 const a=actor("Leonid"),b=actor("Lehenik");
 assert.equal(physicalAttackTN(a,b,{baseTN:60,attackType:"physical",purchasedEvasive:1}),53);
 assert.equal(physicalAttackTN(a,b,{baseTN:60,attackType:"physical-special",purchasedEvasive:1}),53);
 assert.equal(physicalAttackTN(a,b,{baseTN:60,attackType:"spell",purchasedEvasive:1}),63);
});
test("natural protection prevents damage before shield and armor",()=>{
 const smoulder=planNatureHit(actor("Smoulder"),100,{physical:true});
 assert.equal(smoulder.prevented,10);assert.equal(smoulder.pools.lifeForce,10);
 const draconian=planNatureHit(actor("Draconian"),100,{subtype:"fire",ancestry:"fire"});
 assert.equal(draconian.prevented,10);
 const nonPhysical=planNatureHit(actor("Smoulder"),100,{subtype:"fire"});
 assert.equal(nonPhysical.prevented,0);
});
