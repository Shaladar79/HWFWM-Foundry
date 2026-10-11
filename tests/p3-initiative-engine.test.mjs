import test from "node:test";import assert from "node:assert/strict";
import {initializeRound,spendTurn,passTurn,updateScore,chooseNext} from "../scripts/p3-initiative-engine.js";
const players=[{id:"warrior",name:"Warrior"},{id:"mage",name:"Mage"},{id:"monster",name:"Monster"}];
test("highest remaining score acts after each action",()=>{
 let s=initializeRound(players,{warrior:18,mage:15,monster:12});
 assert.equal(s.current,"warrior");
 s=spendTurn(s,"warrior",5);
 assert.equal(s.current,"mage");
 s=spendTurn(s,"mage",6);
 assert.equal(s.current,"warrior");
});
test("passing banks score and round ends after all pass",()=>{
 let s=initializeRound(players,{warrior:18,mage:15,monster:12});
 s=passTurn(s,"warrior");assert.equal(s.entries[0].score,18);
 s=passTurn(s,"mage");s=passTurn(s,"monster");
 assert.equal(s.current,null);
 const next=initializeRound(players,{warrior:3,mage:4,monster:5},s);
 assert.equal(next.entries[0].score,21);
 assert.equal(next.current,"warrior");
});
test("negative stun persists into next d20 roll",()=>{
 let s=initializeRound(players,{warrior:8,mage:7,monster:6});
 s=updateScore(s,"warrior",-15);
 assert.equal(s.entries[0].score,-7);
 s=passTurn(s,"mage");s=passTurn(s,"monster");
 const next=initializeRound(players,{warrior:2,mage:8,monster:8},s);
 assert.equal(next.entries[0].score,-5);
 assert.equal(next.current,"mage");
});
test("ties deterministic and no unapproved carryover ceiling",()=>{
 const s=initializeRound(players,{warrior:20,mage:20,monster:1});
 assert.equal(chooseNext(s),"warrior");
 const boosted=updateScore(s,"monster",100);
 assert.equal(boosted.current,"monster");
 assert.throws(()=>spendTurn(s,"mage",1),/Not this/);
});
