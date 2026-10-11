import {SKILLS} from "./p3-skill-catalog.js";
import {hasSkillTalent} from "./p3-prerequisites.js";
import {buildLedgerEntry,appendLedger} from "./character-profile.js";
const pending=new Set();
export function planSkillTalentPurchase(actor,name,cost){
 const skill=SKILLS.find(s=>s.name===name);
 if(!skill)throw Error("Unknown First Edition Skill Talent");
 if(!actor.getFlag("hwfwm","startingSkillTalentsChosen"))throw Error("Complete the five starting Skill Talents first");
 if(actor.items.some(i=>(i.type==="skill"||i.type==="talent")&&(i.name===name||i.system.grantedSkill===name)))throw Error("Skill Talent already owned");
 for(const requirement of skill.prerequisites)if(!hasSkillTalent(actor,requirement))throw Error(name+" requires "+requirement);
 if(!Number.isSafeInteger(cost)||cost<=0)throw Error("GM must configure a positive Skill Talent XP cost");
 const balance=Number(actor.system.talentXP);
 if(!Number.isSafeInteger(balance)||balance<cost)throw Error("Not enough Talent XP");
 return {skill,cost,remaining:balance-cost};
}
export async function buySkillTalent(actor,name){
 if(!actor?.isOwner||!["character","npc"].includes(actor.type)||actor.system.normal)throw Error("No permission");
 const key=actor.uuid??actor.id;
 if(pending.has(key))throw Error("Skill Talent purchase already in progress");
 pending.add(key);
 try{
  const plan=planSkillTalentPurchase(actor,name,Number(game.settings.get("hwfwm","skillTalentCost")));
  const history=actor.getFlag("hwfwm","xpHistory")??[];
  const entry=buildLedgerEntry({kind:"spend",currency:"talentXP",amount:-plan.cost,reason:"Skill Talent: "+name});
  const docs=[{name,type:"talent",system:{grantedSkill:name,startingTalent:false,rank:1,cost:plan.cost}},
   {name,type:"skill",system:{attribute:plan.skill.attribute,trained:true,specialization:false,grantedByTalent:name,startingTalent:false}}];
  const created=await actor.createEmbeddedDocuments("Item",docs);
  try{await actor.update({"system.talentXP":plan.remaining,"flags.hwfwm.xpHistory":appendLedger(history,entry)});}
  catch(error){try{await actor.deleteEmbeddedDocuments("Item",created.map(i=>i.id));}catch(rollback){console.error("Skill Talent rollback failed",rollback);}throw error;}
  return plan;
 }finally{pending.delete(key);}
}
