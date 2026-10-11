import test from "node:test";import assert from "node:assert/strict";import {planAbilityAP} from "../scripts/ability-ap.js";
test("matching Nature aptitude adds exactly two AP per build",()=>{
 assert.deepEqual(planAbilityAP("Elf","spell",8,10),{baseBudget:8,bonus:2,available:10,spent:10,unused:0});
 assert.equal(planAbilityAP("Elf","boon",8,8).bonus,0);
 assert.equal(planAbilityAP("Human","special-attack",8,9).bonus,2);
 assert.equal(planAbilityAP("Celestine","special-ability",8,10).bonus,2);
 assert.equal(planAbilityAP("Lehenik","utility",8,10).bonus,2);
 assert.equal(planAbilityAP("Leonid","boon",8,10).bonus,2);
 assert.equal(planAbilityAP("Runic","spell",8,10).bonus,2);
});
test("unspent AP never becomes an actor balance and overflow is rejected",()=>{
 assert.equal(planAbilityAP("Elf","spell",8,5).unused,5);
 assert.throws(()=>planAbilityAP("Elf","spell",8,11),/Not enough AP/);
 assert.throws(()=>planAbilityAP("Elf","spell",0,0),/configure/);
 assert.throws(()=>planAbilityAP("Elf","unknown",8,8),/Invalid ability type/);
});
