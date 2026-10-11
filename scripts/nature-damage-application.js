import {planNatureHit} from "./nature-combat.js";
const pending=new Set();
export const ELEMENTAL_SUBTYPES=["fire","ice","lightning","acid","earth","air","water"];
export function nextAdaptiveSubtype(nature,previous,subtype,amount){
 const next=String(subtype??"").trim().toLowerCase();
 return nature==="Runic"&&amount>0&&ELEMENTAL_SUBTYPES.includes(next)?next:String(previous??"");
}
export async function resetAdaptiveResistance(target){
 if(!game.user.isGM||!target?.isOwner)throw Error("GM permission required");
 await target.update({"flags.hwfwm.adaptiveSubtype":""});
}

export function damageUpdate(plan){
 const p=plan.pools;
 return {"system.resources.shield.value":p.shield,"system.resources.mana.value":p.mana,"system.resources.armor.value":p.armor,"system.resources.lifeForce.extra":p.extraLifeForce,"system.resources.lifeForce.value":p.lifeForce};
}
export async function applyNatureHit(target,{amount,physical=false,subtype="",ancestry="",adaptiveSubtype="",hitId}){
 if(!game.user.isGM)throw Error("Only a GM may apply damage from this panel");
 if(!target?.id||!target.isOwner)throw Error("No permission for target");
 if(!Number.isSafeInteger(amount)||amount<0)throw Error("Damage must be a nonnegative integer");
 const id=String(hitId??"").trim();
 if(!id||id.length>120)throw Error("A unique hit identifier is required");
 const key=(target.uuid??target.id)+":"+id;
 if(pending.has(key))throw Error("This hit is already being applied");
 pending.add(key);
 try{
  const history=target.getFlag("hwfwm","appliedNatureHits")??[];
  if(history.includes(id))throw Error("This hit has already been applied");
  const activeSubtype=String(target.getFlag("hwfwm","adaptiveSubtype")??"");
  const plan=planNatureHit(target,amount,{physical,subtype,ancestry,adaptiveSubtype:activeSubtype});
  const next=[...history,id]; // Keep all identifiers; pruning would permit old hits to be applied twice.
  const nextSubtype=nextAdaptiveSubtype(target.system.nature,activeSubtype,subtype,plan.reduced);
  await target.update({...damageUpdate(plan),"flags.hwfwm.appliedNatureHits":next,"flags.hwfwm.adaptiveSubtype":nextSubtype});
  return plan;
 }finally{pending.delete(key);}
}
