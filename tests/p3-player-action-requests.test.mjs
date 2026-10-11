import test from "node:test";import assert from "node:assert/strict";
import {describeActionRequest,validateActionRequest} from "../scripts/p3-player-action-requests.js";
function setup(){
 const ability={id:"spell",type:"ability",system:{actionCost:4,manaCost:6,staminaCost:1}};
 const owner={id:"player",isGM:false};
 const actor={id:"hero",isOwner:true,items:{get:id=>id==="spell"?ability:null},testUserPermission:(user,role)=>user===owner&&role==="OWNER"};
 const c={id:"c",actor};
 const combat={id:"combat1",combatants:{get:id=>id==="c"?c:null},getFlag:()=>({current:"c",round:1,revision:3,appliedRequests:[]})};
 globalThis.game={user:{isGM:true},users:{get:id=>id==="player"?owner:null}};
 return {actor,combat};
}
test("request payload contains IDs, never player-controlled costs",()=>{
 const {actor}=setup();
 assert.deepEqual(describeActionRequest(actor,{kind:"ability",abilityId:"spell",cost:0}),{kind:"ability",actorId:"hero",abilityId:"spell"});
 assert.throws(()=>describeActionRequest(actor,{kind:"ability",abilityId:"unknown"}),/not found/);
});
test("GM derives true costs and verifies authenticated chat author",()=>{
 const {combat}=setup();
 const request={user:"player",flags:{hwfwm:{actionRequest:{actorId:"hero",kind:"ability",abilityId:"spell",cost:0,combatId:"combat1",combatantId:"c",round:1,revision:3}}}};
 assert.deepEqual(validateActionRequest(combat,request).costs,{actionCost:4,manaCost:6,staminaCost:1});
 assert.throws(()=>validateActionRequest(combat,{...request,user:"intruder"}),/does not own/);
 assert.throws(()=>validateActionRequest(combat,{...request,flags:{hwfwm:{actionRequest:{actorId:"other",kind:"pass",combatId:"combat1",combatantId:"c",round:1,revision:3}}}}),/does not match/);
});

test("requests from previous turns and already-applied messages are rejected",()=>{
 const {combat}=setup();
 const message={id:"request1",user:"player",flags:{hwfwm:{actionRequest:{actorId:"hero",kind:"pass",combatId:"combat1",combatantId:"c",round:1,revision:2}}}};
 assert.throws(()=>validateActionRequest(combat,message),/Stale/);
 message.flags.hwfwm.actionRequest.revision=3;
 combat.getFlag=()=>({current:"c",round:1,revision:3,appliedRequests:["request1"]});
 assert.throws(()=>validateActionRequest(combat,message),/already applied/);
});
