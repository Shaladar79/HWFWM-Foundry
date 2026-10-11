// First Edition: both summoning and familiar abilities require the Ritual Knowledge skill,
// itself granted by a Talent that requires Magic Theory.
export const RITUAL_ABILITY_KINDS=["summon","familiar"];
export function hasSkillTalent(actor,name){
 return actor.items.some(i=>i.type==="talent"&&i.system.grantedSkill===name)&&actor.items.some(i=>i.type==="skill"&&i.name===name&&i.system.trained);
}
export function validateAbilityPrerequisite(actor,kind){
 if(!["standard",...RITUAL_ABILITY_KINDS].includes(kind))throw Error("Invalid ability purpose");
 if(RITUAL_ABILITY_KINDS.includes(kind)&&(!hasSkillTalent(actor,"Magic Theory")||!hasSkillTalent(actor,"Ritual Knowledge")))
  throw Error("Summon and familiar abilities require Magic Theory and Ritual Knowledge Talents");
 return true;
}
export function planSpecialization(actor,skillId,cost){
 const skill=actor.items.get(skillId);
 if(!skill||skill.type!=="skill"||!skill.system.trained)throw Error("A trained skill is required");
 if(!hasSkillTalent(actor,skill.name))throw Error("Skill must be granted by its Talent");
 if(skill.system.specialization)throw Error("Skill is already specialized");
 if(!Number.isSafeInteger(cost)||cost<=0)throw Error("GM must set a positive specialization Talent XP cost");
 const balance=Number(actor.system.talentXP);
 if(!Number.isSafeInteger(balance)||balance<cost)throw Error("Insufficient Talent XP");
 return {cost,remaining:balance-cost,skill};
}
const purchasing=new Set();
export async function buySpecialization(actor,skillId){
 if(!actor?.isOwner)throw Error("No permission");
 const key=actor.uuid??actor.id;
 if(purchasing.has(key))throw Error("Specialization purchase already processing");
 purchasing.add(key);
 try{
  const cost=Number(game.settings.get("hwfwm","specializationTalentCost"));
  const plan=planSpecialization(actor,skillId,cost);
  await plan.skill.update({"system.specialization":true});
  try{await actor.update({"system.talentXP":plan.remaining});}
  catch(e){try{await plan.skill.update({"system.specialization":false});}catch{}throw e;}
  return plan;
 }finally{purchasing.delete(key);}
}
