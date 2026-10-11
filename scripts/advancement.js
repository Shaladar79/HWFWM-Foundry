import {planAbilityAP} from "./ability-ap.js";
import {projectedRank,rankGrant} from "./rank-awards.js";
import {buildLedgerEntry,appendLedger} from "./character-profile.js";
import {ATTRIBUTES,HERO_RANKS,minimumProgress,nextAbilityProgress} from "./rules.js";
export function rankForAbilities(abilityGroups){
  const progresses=ATTRIBUTES.map(k=>{
    const group=abilityGroups[k]??[];
    return group.length===5?minimumProgress(group.map(a=>({rank:a.rank,level:a.level}))):{rank:"iron",level:0};
  });
  return minimumProgress(progresses).rank;
}
export function validateBonding(essences){
  const used=new Set();
  for(const e of essences){
    const a=e.bondedAttribute;
    if(!ATTRIBUTES.includes(a)||used.has(a))return false;
    used.add(a);
  }
  return essences.length===4&&used.size===4;
}
// Provisional cost curve: GM-configurable multiplier via world setting.
export function advancementCost(ability,{multiplier=10}={}){
  if(!HERO_RANKS.includes(ability.rank)||!Number.isInteger(ability.level)||ability.level<0||ability.level>10)throw Error("Invalid ability progression");
  const tier=HERO_RANKS.indexOf(ability.rank)+1;
  return multiplier*tier*(ability.level+1);
}
export function planAdvancement(ability,heroRank,availableXP,options={}){
  const next=nextAbilityProgress(ability,heroRank);
  if(!next)return {ok:false,reason:"Rank gate or maximum rank reached"};
  const cost=advancementCost(ability,options);
  if(availableXP<cost)return {ok:false,reason:"Not enough Essence XP",cost};
  return {ok:true,cost,next,remaining:availableXP-cost};
}
export async function advanceActorAbility(actor,abilityId,{apSpend}={}){
  if(!actor.isOwner)throw Error("You do not control this character");
  if(!["character","npc"].includes(actor.type)||actor.system.normal)throw Error("This actor cannot advance essence abilities");
  const ability=actor.items.get(abilityId);
  if(!ability||ability.type!=="ability")throw Error("Ability not found");
  const essence=actor.items.get(ability.system.essenceId);
  if(!essence||essence.type!=="essence")throw Error("Ability must belong to a valid bonded essence");
  const essences=actor.items.filter(i=>i.type==="essence");
  if(!validateBonding(essences.map(e=>e.system)))throw Error("Character needs four uniquely bonded essences");
  for(const e of essences)if(actor.items.filter(i=>i.type==="ability"&&i.system.essenceId===e.id).length!==5)throw Error("Each essence must have exactly five abilities");
  const multiplier=game.settings.get("hwfwm","essenceXpMultiplier");
  if(!Number.isSafeInteger(actor.system.essenceXP)||actor.system.essenceXP<0)throw Error("Invalid Essence XP balance");
  const plan=planAdvancement(ability.system,actor.system.rank,actor.system.essenceXP,{multiplier});
  if(!plan.ok)throw Error(plan.reason);
  const apBudget=Number(game.settings.get("hwfwm","abilityAPBudget"));
  const type=String(ability.system.abilityType??"other");
  // Creation AP must be allocated before enabling paid upgrade AP transactions.
  let apPlan=null;
  if(apBudget>0){
    if(!ability.system.apConfigured)throw Error("Allocate creation AP before advancing");
    apPlan=planAbilityAP(actor.system.nature,type,apBudget,apSpend);
  }
  const oldRank=actor.system.rank;
  const newRank=projectedRank([...actor.items],ability.id,plan.next);
  const beforeTalent=Number(actor.system.talentXP);
  let grants;
  try{grants=JSON.parse(game.settings.get("hwfwm","rankTalentGrants")||"{}");}
  catch{throw Error("Invalid Talent XP grant configuration JSON");}
  const talentAward=rankGrant(oldRank,newRank,grants);
  if(!Number.isSafeInteger(beforeTalent)||beforeTalent<0)throw Error("Invalid Talent XP balance");
  const history=actor.getFlag("hwfwm","xpHistory")??[];
  const purchase=buildLedgerEntry({kind:"spend",currency:"essenceXP",amount:-plan.cost,reason:ability.name,abilityId:ability.id,from:ability.system.rank+" "+ability.system.level,to:plan.next.rank+" "+plan.next.level});
  const events=[purchase];
  if(oldRank!==newRank){
    events.push(buildLedgerEntry({kind:"rank",amount:0,reason:"Overall character rank advanced",rankFrom:oldRank,rankTo:newRank}));
    if(talentAward>0)events.push(buildLedgerEntry({kind:"award",currency:"talentXP",amount:talentAward,reason:"Rank advancement to "+newRank}));
  }
  const previous={rank:ability.system.rank,level:ability.system.level,apSpent:ability.system.apSpent,apHistory:[...(ability.system.apHistory??[])]};
  const upgrade={ "system.rank":plan.next.rank,"system.level":plan.next.level };
  if(apPlan){
    upgrade["system.apSpent"]=Number(ability.system.apSpent??0)+apPlan.spent;
    upgrade["system.apHistory"]=[...previous.apHistory,{from:previous.rank+" "+previous.level,to:plan.next.rank+" "+plan.next.level,type,base:apPlan.baseBudget,bonus:apPlan.bonus,spent:apPlan.spent}];
  }
  await ability.update(upgrade);
  try{
    await actor.update({"system.essenceXP":plan.remaining,"system.talentXP":beforeTalent+talentAward,"flags.hwfwm.xpHistory":events.reduce(appendLedger,history)});
  }catch(error){
    try{await ability.update({"system.rank":previous.rank,"system.level":previous.level,"system.apSpent":previous.apSpent,"system.apHistory":previous.apHistory});}catch(rollback){console.error("HWFWM rollback failed",rollback);}
    throw error;
  }
  return {...plan,oldRank,newRank,talentAward,apPlan};
}
export async function initializeEssences(actor){
  if(!actor.isOwner||!["character","npc"].includes(actor.type)||actor.system.normal)throw Error("Not an essence-user you can edit");
  if(actor.items.some(i=>i.type==="essence"||i.type==="ability"))throw Error("Essence setup is only available before creating essences or abilities");
  const essences=ATTRIBUTES.map(a=>({name:`${a[0].toUpperCase()+a.slice(1)} Essence`,type:"essence",system:{bondedAttribute:a,confluence:a==="recovery"}}));
  const created=await actor.createEmbeddedDocuments("Item",essences);
  const abilities=created.flatMap(e=>Array.from({length:5},(_,i)=>({name:`${e.name} Ability ${i+1}`,type:"ability",system:{essenceId:e.id,rank:"iron",level:0}})));
  await actor.createEmbeddedDocuments("Item",abilities);
  return created;
}
