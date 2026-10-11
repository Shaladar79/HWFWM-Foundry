import test from "node:test";import assert from "node:assert/strict";
import {combatAuthority,resourceSnapshot,recoveryIssue} from "../scripts/p3-combat-safety.js";
test("only first active GM is writer; inactive GMs cannot seize authority",()=>{
 const users=[{id:"z",name:"Backup",isGM:true,active:true},{id:"a",name:"Lead",isGM:true,active:true},{id:"m",isGM:true,active:false}];
 assert.equal(combatAuthority(users,users[1]),"a");
 assert.throws(()=>combatAuthority(users,users[0]),/Another active GM/);
 assert.throws(()=>combatAuthority(users,{id:"p",isGM:false}),/Only a GM/);
});
test("recovery marker is read for interrupted transactions",()=>{
 assert.equal(recoveryIssue({getFlag:()=>({actorId:"a"})}).actorId,"a");
 const a={system:{resources:{mana:{value:7},stamina:{value:8}}}};
 assert.deepEqual(resourceSnapshot(a),{mana:7,stamina:8});
});
