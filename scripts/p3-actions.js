// P3 action economy: one d20 Action Score, no turn-order rules imposed.
const pending=new Set();
function nonnegative(value,label){if(!Number.isSafeInteger(value)||value<0)throw Error("Invalid "+label);return value;}
export function planAction(actor,{actionCost,manaCost=0,staminaCost=0}){
 const score=nonnegative(Number(actor.getFlag("hwfwm","actionScore")??0),"Action Score");
 const cost=nonnegative(Number(actionCost),"Action Cost");
 const mana=nonnegative(Number(manaCost),"Mana Cost");
 const stamina=nonnegative(Number(staminaCost),"Stamina Cost");
 const resources=actor.system.resources??{};
 const availableMana=nonnegative(Number(resources.mana?.value),"available Mana");
 const availableStamina=nonnegative(Number(resources.stamina?.value),"available Stamina");
 if(score<cost)throw Error("Not enough Action Score");
 if(availableMana<mana)throw Error("Not enough Mana");
 if(availableStamina<stamina)throw Error("Not enough Stamina");
 return {score:score-cost,mana:availableMana-mana,stamina:availableStamina-stamina,costs:{action:cost,mana,stamina}};
}
export async function startActionScore(actor,roll){
 if(!actor?.isOwner)throw Error("No actor permission");
 if(!Number.isSafeInteger(roll)||roll<1||roll>20)throw Error("Action Score requires a d20 result");
 const key=actor.uuid??actor.id;
 if(pending.has(key))throw Error("Action operation in progress");
 pending.add(key);
 try{await actor.update({"flags.hwfwm.actionScore":roll});return roll;}finally{pending.delete(key);}
}
export async function spendCombatAction(actor,costs){
 if(!actor?.isOwner)throw Error("No actor permission");
 const key=actor.uuid??actor.id;
 if(pending.has(key))throw Error("Action operation in progress");
 pending.add(key);
 try{
  const p=planAction(actor,costs);
  await actor.update({"flags.hwfwm.actionScore":p.score,"system.resources.mana.value":p.mana,"system.resources.stamina.value":p.stamina});
  return p;
 }finally{pending.delete(key);}
}
