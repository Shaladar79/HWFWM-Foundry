import test from "node:test";import assert from "node:assert/strict";
import {damageUpdate,applyNatureHit} from "../scripts/nature-damage-application.js";
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
