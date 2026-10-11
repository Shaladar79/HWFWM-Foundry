import test from "node:test";import assert from "node:assert/strict";
import {damageUpdate,applyNatureHit,nextAdaptiveSubtype,resetAdaptiveResistance} from "../scripts/nature-damage-application.js";
test("damage application maps all resource pools back to actor fields",()=>{
 const update=damageUpdate({pools:{shield:0,mana:12,armor:0,extraLifeForce:2,lifeForce:30}});
 assert.equal(update["system.resources.lifeForce.value"],30);
 assert.equal(update["system.resources.lifeForce.extra"],2);
 assert.equal(update["system.resources.mana.value"],12);
});
test("GM gate prevents player-initiated damage updates",async()=>{
 globalThis.game={user:{isGM:false}};
 await assert.rejects(applyNatureHit({}, {amount:10,hitId:"one"}),/Only a GM/);
});
test("duplicate hit IDs cannot drain resources twice",async()=>{
 globalThis.game={user:{isGM:true}};
 const flags={appliedNatureHits:[]};
 const target={id:"actor1",uuid:"Actor.actor1",isOwner:true,system:{nature:"Smoulder",resources:{shield:{value:0},manaShield:{active:false},mana:{value:20},armor:{value:0},lifeForce:{value:100,extra:0}}},getFlag:(scope,key)=>flags[key],update:async u=>{Object.assign(flags,{appliedNatureHits:u["flags.hwfwm.appliedNatureHits"]});target.system.resources.lifeForce.value=u["system.resources.lifeForce.value"];}};
 const first=await applyNatureHit(target,{amount:20,physical:true,hitId:"hit-one"});
 assert.equal(first.reduced,18);assert.equal(target.system.resources.lifeForce.value,82);
 await assert.rejects(applyNatureHit(target,{amount:20,physical:true,hitId:"hit-one"}),/already been applied/);
 assert.equal(target.system.resources.lifeForce.value,82);
});

test("Runic resistance switches after triggering hit and persists for next matching hit",async()=>{
 globalThis.game={user:{isGM:true}};
 const flags={appliedNatureHits:[],adaptiveSubtype:""};
 const target={id:"runic",uuid:"Actor.runic",isOwner:true,system:{nature:"Runic",resources:{shield:{value:0},manaShield:{active:false},mana:{value:0},armor:{value:0},lifeForce:{value:1000,extra:0}}},getFlag:(_scope,key)=>flags[key],update:async u=>{
  if("flags.hwfwm.appliedNatureHits" in u)flags.appliedNatureHits=u["flags.hwfwm.appliedNatureHits"];
  if("flags.hwfwm.adaptiveSubtype" in u)flags.adaptiveSubtype=u["flags.hwfwm.adaptiveSubtype"];
  if("system.resources.lifeForce.value" in u)target.system.resources.lifeForce.value=u["system.resources.lifeForce.value"];
 }};
 const first=await applyNatureHit(target,{amount:100,subtype:"fire",hitId:"r1"});
 assert.equal(first.reduced,100);assert.equal(flags.adaptiveSubtype,"fire");
 const second=await applyNatureHit(target,{amount:100,subtype:"fire",hitId:"r2"});
 assert.equal(second.reduced,95);
 const third=await applyNatureHit(target,{amount:100,subtype:"ice",hitId:"r3"});
 assert.equal(third.reduced,100);assert.equal(flags.adaptiveSubtype,"ice");
 await resetAdaptiveResistance(target);
 assert.equal(flags.adaptiveSubtype,"");
});
test("non-elemental hits do not switch resistance",()=>{
 assert.equal(nextAdaptiveSubtype("Runic","fire","physical",10),"fire");
 assert.equal(nextAdaptiveSubtype("Runic","fire","ice",0),"fire");
 assert.equal(nextAdaptiveSubtype("Elf","fire","ice",10),"fire");
});
