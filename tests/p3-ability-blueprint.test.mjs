import test from "node:test";import assert from "node:assert/strict";
import {normalizeAbilityBlueprint,blueprintSummary} from "../scripts/p3-ability-blueprint.js";
test("blueprint tracks Essence, Awakening Stone and mixed-source components",()=>{
 const b=normalizeAbilityBlueprint({essence:{id:"e1",name:"Fire"},awakeningStone:{name:"Stone of Flame"},components:[
  {kind:"damage",source:"essence",label:"Flame damage",apCost:null},
  {kind:"boon",source:"awakening-stone",label:"Stone boon",apCost:null},
  {kind:"utility",source:"manual",label:"Range",apCost:2}
 ]});
 assert.equal(b.schemaVersion,1);
 assert.equal(b.components[1].source,"awakening-stone");
 assert.deepEqual(blueprintSummary(b),{components:3,pricedAP:2,unpricedComponents:2});
});
test("undecided AP pricing is preserved as null, not invented zero",()=>{
 assert.equal(normalizeAbilityBlueprint({components:[{kind:"shield"}]}).components[0].apCost,null);
 assert.throws(()=>normalizeAbilityBlueprint({components:[{kind:"damage",apCost:-1}]}),/Invalid component AP/);
 assert.throws(()=>normalizeAbilityBlueprint({components:[{kind:"unknown"}]}),/Unsupported/);
});
