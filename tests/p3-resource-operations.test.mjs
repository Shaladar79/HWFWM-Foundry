import test from "node:test";import assert from "node:assert/strict";
import {planResourceRecovery,applyResourceRecovery} from "../scripts/p3-resource-operations.js";
const makeActor=()=>{let value=12;return {id:"hero",uuid:"Actor.hero",isOwner:true,system:{resources:{lifeForce:{value:12,max:40},mana:{value:5,max:30},stamina:{value:1,max:30},shield:{value:0,max:12}}},update:async patch=>{value=patch["system.resources.lifeForce.value"]??value;},get current(){return value;}};};
test("restoration cannot exceed maximum",()=>{
 const actor=makeActor();
 const result=planResourceRecovery(actor,"lifeForce",100);
 assert.equal(result.next,40);assert.equal(result.restored,28);
});
test("zero recovery and invalid resources are handled",()=>{
 const actor=makeActor();
 assert.equal(planResourceRecovery(actor,"mana",0).restored,0);
 assert.throws(()=>planResourceRecovery(actor,"shield",2),/Unknown recoverable resource/);
 assert.throws(()=>planResourceRecovery(actor,"lifeForce",-1),/nonnegative/);
 assert.throws(()=>planResourceRecovery(actor,"lifeForce",1.5),/nonnegative/);
});
test("GM permission required to mutate resources",async()=>{
 globalThis.game={user:{isGM:false}};
 await assert.rejects(applyResourceRecovery(makeActor(),"lifeForce",4),/GM permission/);
 globalThis.game={user:{isGM:true}};
 const actor=makeActor();
 const result=await applyResourceRecovery(actor,"lifeForce",4);
 assert.equal(result.next,16);assert.equal(actor.current,16);
});
