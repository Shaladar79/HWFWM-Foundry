import test from "node:test";import assert from "node:assert/strict";
import {describeActionRequest,validateActionRequest} from "../scripts/p3-player-action-requests.js";
function setup(){
 const ability={id:"spell",type:"ability",system:{actionCost:4,manaCost:6,staminaCost:1}};
 const owner={id:"player",isGM:false};
 const actor={id:"hero",isOwner:true,items:{get:id=>id==="spell"?ability:null},testUserPermission:(user,role)=>user===owner&&role==="OWNER"};
 const c={id:"c",actor};
 const combat={combatants:{get:id=>id==="c"?c:null},getFlag:()=>({current:"c"})};
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
 const request={user:"player",flags:{hwfwm:{actionRequest:{actorId:"hero",kind:"ability",abilityId:"spell",cost:0}}}};
 assert.deepEqual(validateActionRequest(combat,request).costs,{actionCost:4,manaCost:6,staminaCost:1});
 assert.throws(()=>validateActionRequest(combat,{...request,user:"intruder"}),/does not own/);
 assert.throws(()=>validateActionRequest(combat,{...request,flags:{hwfwm:{actionRequest:{actorId:"other",kind:"pass"}}}}),/does not match/);
});
