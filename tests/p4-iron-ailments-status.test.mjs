import test from "node:test";
import assert from "node:assert/strict";
import {calculateIronBuild,ailmentRemovalAttempts,statusSaveTN,statusActionCost,statusTNModifier} from "../scripts/p4-iron-rules.js";
const spell={range:"short",speed:"medium",cooldown:"one",activation:"medium",resource:"mana"};
test("Ailment Removal tiers have correct AP and single-target constraint",()=>{
 for(const [removalTier,ap] of [["minor",0],["moderate",2],["greater",4]]){
  const b=calculateIronBuild({...spell,kind:"ailmentRemovalSpell",removalTier});
  assert.equal(b.finalAP,ap);
 }
 assert.throws(()=>calculateIronBuild({...spell,kind:"ailmentRemovalSpell",removalTier:"greater",multiTarget:true}),/single-target/);
});
test("Greater Removal selects three independent stacks with rank penalties",()=>{
 const a=ailmentRemovalAttempts({tier:"greater",ailments:[
  {id:"a",rank:"iron",minorAffliction:true},{id:"b",rank:"bronze"},{id:"c",rank:"silver"}]});
 assert.deepEqual(a.map(x=>x.tnPenalty),[0,-10,-20]);
 assert.throws(()=>ailmentRemovalAttempts({tier:"greater",ailments:Array(4).fill({rank:"iron"})}));
});
test("Permanent upper rank effects cannot be removed at Iron",()=>{
 assert.throws(()=>ailmentRemovalAttempts({tier:"moderate",ailments:[{rank:"bronze",permanent:true}]}));
 assert.equal(ailmentRemovalAttempts({tier:"moderate",ailments:[{rank:"normal",permanent:true}]}).length,1);
 assert.throws(()=>ailmentRemovalAttempts({tier:"minor",ailments:[{rank:"iron"}]}));
});
test("Status Spells cost each effect and duration once",()=>{
 const b=calculateIronBuild({...spell,kind:"statusSpell",statuses:[{effect:"slow",save:"speed"},{effect:"immobilize",save:"power"}],durationRounds:2});
 assert.equal(b.finalAP,6);
 assert.throws(()=>calculateIronBuild({...spell,kind:"statusSpell",statuses:[{effect:"blind",save:"recovery"},{effect:"blind",save:"spirit"}]}),/differ/);
 assert.throws(()=>calculateIronBuild({...spell,kind:"statusSpell",statuses:[{effect:"daze",save:"recovery"}],durationRounds:3}),/timed/);
});
test("Two target status uses 3 AP and respects budget",()=>{
 const b=calculateIronBuild({...spell,kind:"statusSpell",statuses:[{effect:"weaken",save:"power"}],multiTarget:true});
 assert.equal(b.finalAP,5);
});
test("Critical saves, immunity, and cumulative penalties",()=>{
 assert.equal(statusSaveTN(60,{critical:true}),50);
 assert.equal(statusSaveTN(60,{critical:true,immune:true}),null);
 assert.equal(statusActionCost(6,3),9);
 assert.deepEqual(statusTNModifier(["weaken","weaken","blind","impair"]),{physicalAttack:-20,magicalAttack:-10,spellcasting:-5});
});
