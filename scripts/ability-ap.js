import {validateAbilityPrerequisite} from "./p3-prerequisites.js";
import {natureAptitude} from "./nature-effects.js";
export const ABILITY_TYPES=["special-attack","spell","special-ability","utility","boon","other"];
export function planAbilityAP(nature,abilityType,baseBudget,spend){
 if(!ABILITY_TYPES.includes(abilityType))throw Error("Invalid ability type");
 if(!Number.isSafeInteger(baseBudget)||baseBudget<=0)throw Error("GM must configure a positive transaction AP budget");
 if(!Number.isSafeInteger(spend)||spend<0)throw Error("Invalid transaction AP expenditure");
 const bonus=natureAptitude(nature,abilityType),available=baseBudget+bonus;
 if(spend>available)throw Error("Not enough AP for this transaction");
 return {baseBudget,bonus,available,spent:spend,unused:available-spend};
}
export async function saveAbilityAP(actor,abilityId,{abilityType,spend,abilityPurpose="standard"}){
 if(!actor?.isOwner)throw Error("You do not control this character");
 const ability=actor.items.get(abilityId);
 if(!ability||ability.type!=="ability")throw Error("Ability not found");
 if(ability.system.apConfigured)throw Error("Ability AP already allocated; upgrades require a new transaction");
 validateAbilityPrerequisite(actor,abilityPurpose);
 const budget=Number(game.settings.get("hwfwm","abilityAPBudget"));
 const plan=planAbilityAP(actor.system.nature,abilityType,budget,spend);
 await ability.update({"system.abilityType":abilityType,"system.abilityPurpose":abilityPurpose,"system.apSpent":spend,"system.apConfigured":true});
 return plan;
}
