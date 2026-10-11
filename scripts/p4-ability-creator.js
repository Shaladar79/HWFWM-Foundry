import {validateAbilityPrerequisite} from "./p3-prerequisites.js";
import {normalizeAbilityBlueprint,normalizeAbilityComponent,blueprintSummary} from "./p3-ability-blueprint.js";
export const SCALING_MODES=["none","per-success"];
export function buildComponent(input={}){
 const configuration={...(input.configuration??{}),scalingMode:String(input.scalingMode??"none")};
 if(!SCALING_MODES.includes(configuration.scalingMode))throw Error("Invalid success scaling mode");
 return normalizeAbilityComponent({...input,configuration});
}
export function editComponents(blueprint,{operation,index,component}){
 const current=normalizeAbilityBlueprint(blueprint);
 const components=[...current.components];
 if(operation==="add")components.push(buildComponent(component));
 else if(operation==="replace"){
  if(!Number.isSafeInteger(index)||index<0||index>=components.length)throw Error("Component index out of range");
  components[index]=buildComponent(component);
 }else if(operation==="remove"){
  if(!Number.isSafeInteger(index)||index<0||index>=components.length)throw Error("Component index out of range");
  components.splice(index,1);
 }else throw Error("Unknown component operation");
 return normalizeAbilityBlueprint({...current,components});
}
export function checkDraftPricing(blueprint){
 const result=blueprintSummary(blueprint);
 return {...result,fullyPriced:result.unpricedComponents===0};
}
export async function saveComponentEdit(actor,abilityId,edit){
 if(!actor?.isOwner)throw Error("No permission to edit ability");
 const ability=actor.items.get(abilityId);
 if(!ability||ability.type!=="ability")throw Error("Ability not found");
 const essence=actor.items.get(ability.system.essenceId);
 if(!essence||essence.type!=="essence")throw Error("Ability has no parent Essence");
 const blueprint=editComponents(ability.system.blueprint,{...edit});
 if(blueprint.components.some(c=>c.kind==="summon"||c.kind==="familiar"))validateAbilityPrerequisite(actor,"summon");
 blueprint.essence={id:essence.id,name:essence.name};
 blueprint.awakeningStone={id:ability.system.blueprint?.awakeningStone?.id??"",name:String(ability.system.awakeningStone??"")};
 await ability.update({"system.blueprint":blueprint});
 return checkDraftPricing(blueprint);
}
