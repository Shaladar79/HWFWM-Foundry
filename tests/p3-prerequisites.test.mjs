import test from "node:test";import assert from "node:assert/strict";
import {validateAbilityPrerequisite,planSpecialization} from "../scripts/p3-prerequisites.js";
function actor(talents=[]){
 const docs=talents.flatMap(name=>[{type:"talent",name,system:{grantedSkill:name}},{type:"skill",name,system:{trained:true,specialization:false}}]);
 return {system:{talentXP:20},items:{some:fn=>docs.some(fn),get:id=>docs.find(d=>d.name===id&&d.type==="skill")}};
}
test("summons and familiar abilities both require theory and ritual talents",()=>{
 assert.throws(()=>validateAbilityPrerequisite(actor(),"summon"),/require/);
 assert.throws(()=>validateAbilityPrerequisite(actor(["Magic Theory"]),"familiar"),/require/);
 assert.equal(validateAbilityPrerequisite(actor(["Magic Theory","Ritual Knowledge"]),"summon"),true);
 assert.equal(validateAbilityPrerequisite(actor(),"standard"),true);
});
test("specialization purchases cost Talent XP and require unlocked trained skill",()=>{
 const a=actor(["Medicine"]);
 assert.equal(planSpecialization(a,"Medicine",10).remaining,10);
 assert.throws(()=>planSpecialization(a,"Medicine",0),/positive/);
 assert.throws(()=>planSpecialization(a,"Unknown",10),/trained/);
 a.items.get("Medicine").system.specialization=true;
 assert.throws(()=>planSpecialization(a,"Medicine",10),/already/);
});
