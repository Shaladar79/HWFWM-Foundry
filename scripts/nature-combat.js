import {natureCheckBonus} from "./nature-catalog.js";
import {natureDamage,evasiveFootwork} from "./nature-effects.js";
import {rankDelta,resolveRoll,applyDamage} from "./rules.js";
export function physicalAttackTN(attacker,target,{attribute="power",baseTN,attackType="physical",purchasedEvasive=0}={}){
 if(!Number.isFinite(baseTN))throw Error("A numeric base TN is required");
 const a=attacker.system,t=target.system;
 const physical=["physical","physical-special"].includes(attackType);
 const natureBonus=natureCheckBonus(a.nature,a.rank,{attribute});
 const defense=physical?evasiveFootwork(t.nature,purchasedEvasive).physicalAttackTNModifier:0;
 return baseTN+natureBonus+rankDelta(a.rank,t.rank,"hostile")+defense;
}
export function planNatureHit(target,amount,{physical=false,subtype="",ancestry="",adaptiveSubtype=""}={}){
 const reduced=natureDamage(target.system.nature,amount,{physical,subtype,ancestry,adaptiveSubtype});
 const s=target.system.resources;
 const pools={shield:s.shield?.value??0,manaShieldActive:Boolean(s.manaShield?.active),manaShieldRatio:s.manaShield?.ratio??1,mana:s.mana?.value??0,armor:s.armor?.value??0,extraLifeForce:s.lifeForce?.extra??0,lifeForce:s.lifeForce?.value??0};
 return {raw:amount,reduced,prevented:amount-reduced,...applyDamage(reduced,pools)};
}
export async function rollPhysicalAttack(attacker,target,{attribute="power",attackType="physical"}={}){
 if(!attacker?.isOwner)throw Error("You do not control the attacker");
 if(!target)throw Error("Select a target token");
 const purchased=Number(target.getFlag("hwfwm","evasivePurchased")??0);
 const baseTN=Number(attacker.system.attributes?.[attribute]?.tn??30);
 const tn=physicalAttackTN(attacker,target,{attribute,baseTN,attackType,purchasedEvasive:purchased});
 const roll=await(new Roll("1d100")).evaluate();
 const result=resolveRoll(roll.total,tn);
 await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:attacker}),flavor:`${attackType} vs ${target.name}: TN ${tn}% — ${result.successes} successes`});
 return result;
}
