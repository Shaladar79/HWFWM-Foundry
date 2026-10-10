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
 return update;
}
export async function updateAbility(actor,id,fields){
 if(!actor.isOwner)throw Error("No permission");
 const item=actor.items.get(id);
 if(!item||item.type!=="ability")throw Error("Ability not found");
 return item.update(normalizeAbilityFields(fields));
}
