import test from "node:test";import assert from "node:assert/strict";
import {spendBattleAction,bankBattleAction} from "../scripts/p3-initiative-foundry.js";
function fixture(fail=false){
 const actor={id:"hero",isOwner:true,system:{resources:{mana:{value:10},stamina:{value:8}}},update:async patch=>{
  actor.system.resources.mana.value=patch["system.resources.mana.value"];
  actor.system.resources.stamina.value=patch["system.resources.stamina.value"];
 }};
 let state={round:1,revision:1,current:"c",entries:[{id:"c",score:12,passed:false,order:0,canAct:true}],appliedRequests:[]};
 const combat={id:"battle",started:true,getFlag:()=>state,combatants:{get:()=>({actor})},setFlag:async(_scope,_key,next)=>{if(fail)throw Error("flag save failed");state=next;}};
 globalThis.game={user:{isGM:true}};
 return {actor,combat,get state(){return state;}};
}
test("approved spending records ID and refuses replay",async()=>{
 const f=fixture();
 await spendBattleAction(f.combat,{actionCost:4,manaCost:3,staminaCost:2},"req-1");
 assert.equal(f.actor.system.resources.mana.value,7);
 assert.equal(f.state.entries[0].score,8);
 assert.deepEqual(f.state.appliedRequests,["req-1"]);
 await assert.rejects(spendBattleAction(f.combat,{actionCost:4},"req-1"),/already applied/);
});
test("failed combat flag save restores resource balances",async()=>{
 const f=fixture(true);
 await assert.rejects(spendBattleAction(f.combat,{actionCost:4,manaCost:3,staminaCost:2},"req-1"),/flag save failed/);
 assert.equal(f.actor.system.resources.mana.value,10);
 assert.equal(f.actor.system.resources.stamina.value,8);
 assert.equal(f.state.entries[0].score,12);
});

test("rejects request if combat revision changed between review and mutation",async()=>{
 const f=fixture();
 await assert.rejects(spendBattleAction(f.combat,{actionCost:4,manaCost:3},"stale",0),/Stale request/);
 assert.equal(f.actor.system.resources.mana.value,10);
 assert.equal(f.state.entries[0].score,12);
 await assert.rejects(bankBattleAction(f.combat,"old-pass",0),/Stale request/);
 assert.equal(f.state.current,"c");
});
