import test from "node:test";
import assert from "node:assert/strict";
import {normalizeAbilityFields} from "../scripts/ability-editor.js";
test("ability cost validation",()=>{
 const x=normalizeAbilityFields({name:"Stone Bolt",actionCost:"5",manaCost:2,staminaCost:0,favorite:true,awakeningStone:"Earth"});
 assert.equal(x["system.actionCost"],5);
 assert.equal(x["system.favorite"],true);
 assert.throws(()=>normalizeAbilityFields({name:"",actionCost:1,manaCost:0,staminaCost:0}));
 assert.throws(()=>normalizeAbilityFields({name:"Test",actionCost:-1,manaCost:0,staminaCost:0}));
});
