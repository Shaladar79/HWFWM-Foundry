// Player intents are carried by authenticated Foundry ChatMessage authors.
// The GM re-reads the active actor's ability costs and combat state at approval.
export function describeActionRequest(actor,{kind,abilityId="",cost=0}={}){
 if(!actor?.isOwner)throw Error("You do not own this actor");
 if(!["pass","move","ability"].includes(kind))throw Error("Unsupported requested action");
 if(kind==="ability"){
  const ability=actor.items.get(abilityId);
  if(!ability||ability.type!=="ability")throw Error("Ability not found");
  return {kind,actorId:actor.id,abilityId};
 }
 if(kind==="move")return {kind,actorId:actor.id};
 return {kind,actorId:actor.id};
}
export function validateActionRequest(combat,message){
 if(!game.user.isGM)throw Error("GM approval required");
 const request=message?.flags?.hwfwm?.actionRequest;
 if(!request||!["pass","move","ability"].includes(request.kind))throw Error("Not a combat action request");
 const state=combat?.getFlag("hwfwm","initiativeEngine");
 if(!state?.current)throw Error("There is no active turn");
 if(message.flags?.hwfwm?.actionResolved||(state.appliedRequests??[]).includes(message.id))throw Error("Request already applied");
 if(request.combatId!==combat.id||request.combatantId!==state.current||request.round!==state.round||request.revision!==state.revision)throw Error("Stale action request; submit a new request for the current turn");
 const combatant=combat.combatants.get(state.current);
 if(!combatant?.actor||combatant.actor.id!==request.actorId)throw Error("Request does not match the active combatant");
 const author=game.users.get(message.user?.id??message.user);
 if(!author?.isGM&&!combatant.actor.testUserPermission(author,"OWNER"))throw Error("Requester does not own the active actor");
 if(request.kind==="ability"){
  const ability=combatant.actor.items.get(request.abilityId);
  if(!ability||ability.type!=="ability")throw Error("Requested ability not found");
  return {kind:"ability",actor:combatant.actor,costs:{actionCost:ability.system.actionCost,manaCost:ability.system.manaCost,staminaCost:ability.system.staminaCost}};
 }
 if(request.kind==="move")return {kind:"move",actor:combatant.actor,costs:{actionCost:2}};
 return {kind:"pass",actor:combatant.actor};
}
export async function submitActionRequest(actor,request){
 const combat=game.combats?.active,state=combat?.getFlag("hwfwm","initiativeEngine");
 if(!state?.current)throw Error("No active combat turn");
 if(combat.combatants.get(state.current)?.actor?.id!==actor.id)throw Error("Not your turn");
 const data={...describeActionRequest(actor,request),combatId:combat.id,combatantId:state.current,round:state.round,revision:state.revision};
 return ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}),content:`Combat action request: ${data.kind}`,flags:{hwfwm:{actionRequest:data}}});
}
