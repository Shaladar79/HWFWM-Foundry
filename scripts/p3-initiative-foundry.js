import {initializeRound,spendTurn,passTurn,updateScore} from "./p3-initiative-engine.js";
import {planAction} from "./p3-actions.js";
const pending=new Set();
export function currentBattle(combat){return combat?.getFlag("hwfwm","initiativeEngine")??null;}
async function editBattle(combat,fn){
 if(!game.user.isGM)throw Error("GM controls initiative sequencing");
 if(!combat?.started)throw Error("Start the Foundry encounter first");
 const key=combat.uuid??combat.id;
 if(pending.has(key))throw Error("Encounter operation already in progress");
 pending.add(key);
 try{return await fn();}finally{pending.delete(key);}
}
async function rollFor(combat){
 const combatants=[...(combat.combatants??[])].filter(c=>c.actor);
 if(!combatants.length)throw Error("Add at least one actor combatant");
 const rolls={};
 for(const c of combatants)rolls[c.id]=(await(new Roll("1d20")).evaluate()).total;
 return {combatants,rolls};
}
export async function rollBattleRound(combat){
 return editBattle(combat,async()=>{
  const previous=currentBattle(combat),{combatants,rolls}=await rollFor(combat);
  if(previous?.current)throw Error("Finish or pass all eligible combatants before a new round");
  const state=initializeRound(combatants,rolls,previous);
  state.revision=(previous?.revision??0)+1;
  state.appliedRequests=previous?.appliedRequests??[];
  await combat.setFlag("hwfwm","initiativeEngine",state);
  return state;
 });
}
export async function bankBattleAction(combat,requestId=null,expectedRevision=null){
 return editBattle(combat,async()=>{
  const state=currentBattle(combat);
  if(!state?.current)throw Error("No active combatant");
  if(expectedRevision!==null&&state.revision!==expectedRevision)throw Error("Stale request: combat state changed before approval");
  if(requestId&&(state.appliedRequests??[]).includes(requestId))throw Error("Request already applied");
  const next=passTurn(state,state.current);
  if(requestId)next.appliedRequests=[...(state.appliedRequests??[]),requestId];
  next.revision=(state.revision??0)+1;
  await combat.setFlag("hwfwm","initiativeEngine",next);
  return next;
 });
}
export async function spendBattleAction(combat,costs,requestId=null,expectedRevision=null){
 return editBattle(combat,async()=>{
  const state=currentBattle(combat);
  if(!state?.current)throw Error("No active combatant");
  if(expectedRevision!==null&&state.revision!==expectedRevision)throw Error("Stale request: combat state changed before approval");
  if(requestId&&(state.appliedRequests??[]).includes(requestId))throw Error("Request already applied");
  const combatant=combat.combatants.get(state.current);
  const actor=combatant?.actor;
  if(!actor?.isOwner)throw Error("No permission for active combatant");
  const entry=state.entries.find(e=>e.id===state.current);
  const shim={system:actor.system,getFlag:()=>entry.score};
  const plan=planAction(shim,costs);
  const next=spendTurn(state,state.current,plan.costs.action);
  if(requestId)next.appliedRequests=[...(state.appliedRequests??[]),requestId];
  next.revision=(state.revision??0)+1;
  // Apply resources first; the engine is updated only after the actor is saved.
  await actor.update({"system.resources.mana.value":plan.mana,"system.resources.stamina.value":plan.stamina});
  try{await combat.setFlag("hwfwm","initiativeEngine",next);}
  catch(error){
   try{await actor.update({"system.resources.mana.value":Number(actor.system.resources.mana.value)+plan.costs.mana,"system.resources.stamina.value":Number(actor.system.resources.stamina.value)+plan.costs.stamina});}
   catch(rollback){throw new Error("Combat update failed and resource rollback failed; GM must reconcile manually",{cause:rollback});}
   throw error;
  }
  return next;
 });
}
export async function modifyBattleScore(combat,id,delta){
 return editBattle(combat,async()=>{
  const state=currentBattle(combat);
  if(!state)throw Error("Roll the first round before modifying scores");
  const next=updateScore(state,id,delta);
  next.revision=(state.revision??0)+1;
  await combat.setFlag("hwfwm","initiativeEngine",next);
  return next;
 });
}
