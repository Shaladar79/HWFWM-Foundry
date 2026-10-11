// P3 generic resource operations. Regeneration rates are deliberately not defined here.
export const RECOVERABLE_RESOURCES=["lifeForce","mana","stamina"];
export function planResourceRecovery(actor,resource,amount){
 if(!RECOVERABLE_RESOURCES.includes(resource))throw Error("Unknown recoverable resource");
 if(!Number.isSafeInteger(amount)||amount<0)throw Error("Recovery amount must be a nonnegative integer");
 const state=actor.system?.resources?.[resource];
 if(!state)throw Error("Resource missing");
 const max=Number(state.max),current=Number(state.value);
 if(!Number.isFinite(max)||!Number.isFinite(current)||max<0||current<0)throw Error("Invalid resource state");
 const next=Math.min(max,current+amount);
 return {resource,previous:current,max,requested:amount,restored:next-current,next};
}
const pending=new Set();
export async function applyResourceRecovery(actor,resource,amount){
 if(!game.user.isGM||!actor?.isOwner)throw Error("GM permission required");
 const key=actor.uuid??actor.id;
 if(pending.has(key))throw Error("A resource operation is in progress");
 pending.add(key);
 try{
  const plan=planResourceRecovery(actor,resource,amount);
  await actor.update({[`system.resources.${resource}.value`]:plan.next});
  return plan;
 }finally{pending.delete(key);}
}
