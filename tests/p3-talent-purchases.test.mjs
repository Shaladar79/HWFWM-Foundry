import test from "node:test";import assert from "node:assert/strict";
import {planSkillTalentPurchase,buySkillTalent} from "../scripts/p3-talent-purchases.js";
function actor(owned=["Athletics","Magic Theory"],xp=25){
 const items=owned.flatMap(name=>[{id:"t"+name,type:"talent",name,system:{grantedSkill:name}},{id:"s"+name,type:"skill",name,system:{trained:true}}]);
 const flags={startingSkillTalentsChosen:owned.slice(),xpHistory:[]};
 const a={uuid:"Actor.a",id:"a",isOwner:true,type:"character",system:{nature:"Elf",talentXP:xp},items:{some:f=>items.some(f)},getFlag:(_scope,k)=>flags[k],createEmbeddedDocuments:async(_kind,docs)=>{const added=docs.map((d,i)=>({...d,id:"new"+i}));items.push(...added);return added;},deleteEmbeddedDocuments:async(_kind,ids)=>{for(const id of ids){const i=items.findIndex(d=>d.id===id);if(i>=0)items.splice(i,1);}},update:async u=>{a.system.talentXP=u["system.talentXP"];flags.xpHistory=u["flags.hwfwm.xpHistory"];}};
 return a;
}
test("additional talents require five initial choices, XP and prerequisites",()=>{
 const a=actor();
 assert.equal(planSkillTalentPurchase(a,"Ritual Knowledge",10).remaining,15);
 assert.throws(()=>planSkillTalentPurchase(a,"Magic Theory",10),/already owned/);
 assert.throws(()=>planSkillTalentPurchase(a,"Ritual Knowledge",0),/positive/);
 assert.throws(()=>planSkillTalentPurchase(actor(["Athletics"]), "Ritual Knowledge",10),/requires Magic Theory/);
 assert.throws(()=>planSkillTalentPurchase(actor(["Athletics"],5),"Medicine",10),/Not enough Talent XP/);
 const b=actor();b.getFlag=()=>null;
 assert.throws(()=>planSkillTalentPurchase(b,"Medicine",10),/Complete the five starting/);
});
test("purchase creates paired Talent and trained Skill and deducts XP",async()=>{
 globalThis.game={settings:{get:()=>10}};
 const a=actor();
 await buySkillTalent(a,"Ritual Knowledge");
 assert.equal(a.system.talentXP,15);
 assert.ok(a.items.some(i=>i.type==="talent"&&i.name==="Ritual Knowledge"));
 assert.ok(a.items.some(i=>i.type==="skill"&&i.name==="Ritual Knowledge"&&!i.system.specialization));
 await assert.rejects(buySkillTalent(a,"Ritual Knowledge"),/already owned/);
});
