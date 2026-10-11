import test from "node:test";import assert from "node:assert/strict";
import {SKILLS,SKILL_CATALOG,validateStartingSkills,grantStartingSkills} from "../scripts/p3-skill-catalog.js";
import {SAVING_THROWS,resolveSavingThrow} from "../scripts/p3-saving-throws.js";
test("first-edition list has exactly 26 skills with approved groups",()=>{
 assert.deepEqual(Object.values(SKILL_CATALOG).map(a=>a.length),[7,5,11,3]);
 assert.equal(SKILLS.length,26);
 for(const removed of ["Reflexes","Evasion","Constitution","Fortitude","Arcana"])assert.ok(!SKILLS.some(s=>s.name===removed));
});
test("five distinct initial skills, prerequisite, and no specialization",()=>{
 assert.equal(validateStartingSkills(["Magic Theory","Ritual Knowledge","Aura Control","Athletics","Medicine"]).length,5);
 assert.throws(()=>validateStartingSkills(["Ritual Knowledge","Aura Control","Athletics","Medicine","Stealth"]),/requires Magic Theory/);
 assert.throws(()=>validateStartingSkills(["Athletics","Athletics","Stealth","Medicine","Aura Control"]),/different/);
 assert.throws(()=>validateStartingSkills(["Athletics"]),/exactly five/);
});
test("four saves exist automatically based on each attribute",()=>{
 assert.equal(Object.keys(SAVING_THROWS).length,4);
 const actor={system:{nature:"Elf",rank:"iron",attributes:{power:{tn:30},speed:{tn:30},spirit:{tn:30},recovery:{tn:30}}}};
 assert.equal(resolveSavingThrow(actor,"recovery",20).tn,30);
 assert.equal(resolveSavingThrow(actor,"speed",1).critical,true);
});
test("starting skills create free talents and trained skills just once",async()=>{
 const flags={};
 const items=[];
 const actor={id:"a",isOwner:true,type:"character",system:{nature:"Elf"},items:{some:f=>items.some(f),filter:f=>items.filter(f)},getFlag:(_scope,k)=>flags[k],createEmbeddedDocuments:async(_kind,docs)=>{items.push(...docs);return docs.map((d,i)=>({...d,id:"i"+i}));},setFlag:async(_scope,k,val)=>{flags[k]=val;}};
 await grantStartingSkills(actor,["Athletics","Stealth","Magic Theory","Ritual Knowledge","Medicine"]);
 assert.equal(items.length,10);
 assert.equal(items.filter(i=>i.type==="skill"&&i.system.trained&&!i.system.specialization).length,5);
 await assert.rejects(grantStartingSkills(actor,["Athletics","Stealth","Magic Theory","Ritual Knowledge","Medicine"]),/already/);
});
