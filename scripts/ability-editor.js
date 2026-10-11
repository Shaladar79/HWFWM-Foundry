import {normalizeAbilityBlueprint} from "./p3-ability-blueprint.js";
export function normalizeAbilityFields(input){
 const name=String(input.name??"").trim();
 if(!name||name.length>120)throw Error("Invalid ability name");
 const update={name};
 for(const field of ["actionCost","manaCost","staminaCost"]){
  const n=Number(input[field]);
  if(!Number.isSafeInteger(n)||n<0||n>1000)throw Error("Invalid "+field);
  update["system."+field]=n;
 }
 update["system.awakeningStone"]=String(input.awakeningStone??"").trim().slice(0,120);
 update["system.favorite"]=Boolean(input.favorite);
 if(input.blueprintNotes!==undefined)update["system.blueprint"]=normalizeAbilityBlueprint({...input.blueprint,notes:input.blueprintNotes});
 return update;
}
export async function updateAbility(actor,id,fields){
 if(!actor.isOwner)throw Error("No permission");
 const item=actor.items.get(id);
 if(!item||item.type!=="ability")throw Error("Ability not found");
 const essence=actor.items.get(item.system.essenceId);
 if(!essence||essence.type!=="essence")throw Error("Ability has no valid parent Essence");
 const updated=normalizeAbilityFields({...fields,blueprint:item.system.blueprint});
 const blueprint=normalizeAbilityBlueprint({
   ...(updated["system.blueprint"]??item.system.blueprint??{}),
   essence:{id:essence.id,name:essence.name},
   awakeningStone:{...(item.system.blueprint?.awakeningStone??{}),name:updated["system.awakeningStone"]}
 });
 updated["system.blueprint"]=blueprint;
 return item.update(updated);
}
