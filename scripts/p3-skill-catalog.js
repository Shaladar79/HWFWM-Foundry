// First Edition approved skill talents. Skills are only granted by talents.
export const SKILL_CATALOG={
 power:["Athletics","Intimidation","Grappling","Endurance","Feats of Strength","Martial Combat","Unarmed Combat"],
 speed:["Acrobatics","Stealth","Sleight of Hand","Precision","Ranged Combat"],
 spirit:["Magic Theory","Ritual Knowledge","Aura Control","Spellcasting","Perception","Investigation","Insight","Persuasion","Deception","Lore","Concentration","Combat Rituals"],
 recovery:["Survival","Medicine","Meditation"]
};
export const SKILLS=Object.entries(SKILL_CATALOG).flatMap(([attribute,names])=>names.map(name=>({name,attribute,prerequisites:name==="Ritual Knowledge"?["Magic Theory"]:name==="Combat Rituals"?["Magic Theory","Ritual Knowledge"]:[]})));
export const STARTING_SKILL_TALENTS=5;
export function validateStartingSkills(names){
 if(!Array.isArray(names)||names.length!==STARTING_SKILL_TALENTS)throw Error("Choose exactly five starting Skill Talents");
 const unique=new Set(names);
 if(unique.size!==STARTING_SKILL_TALENTS)throw Error("Starting Skill Talents must be different");
 for(const name of names){
  const skill=SKILLS.find(s=>s.name===name);
  if(!skill)throw Error("Unknown Skill Talent: "+name);
  if(skill.prerequisites.some(required=>!unique.has(required)))throw Error(name+" requires "+skill.prerequisites.join(", "));
 }
 return SKILLS.filter(s=>unique.has(s.name));
}
export async function grantStartingSkills(actor,names){
 if(!actor?.isOwner||!["character","npc"].includes(actor.type)||actor.system.normal)throw Error("Cannot assign starting talents");
 if(actor.getFlag("hwfwm","startingSkillTalentsChosen")||actor.items.some(i=>i.type==="skill"&&i.system.startingTalent))throw Error("Starting Skill Talents have already been assigned");
 const selected=validateStartingSkills(names);
 const existing=new Set(actor.items.filter(i=>i.type==="skill"||i.type==="talent").map(i=>i.name));
 if(selected.some(s=>existing.has(s.name)))throw Error("One or more selected skills or talents already exist");
 const documents=selected.flatMap(s=>[
  {name:s.name,type:"talent",system:{grantedSkill:s.name,startingTalent:true,rank:1,cost:0}},
  {name:s.name,type:"skill",system:{attribute:s.attribute,trained:true,specialization:false,grantedByTalent:s.name,startingTalent:true}}
 ]);
 const created=await actor.createEmbeddedDocuments("Item",documents);
 try{await actor.setFlag("hwfwm","startingSkillTalentsChosen",selected.map(s=>s.name));}
 catch(error){await actor.deleteEmbeddedDocuments("Item",created.map(i=>i.id));throw error;}
 return selected;
}
