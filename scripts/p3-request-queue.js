// Queue classification only; authoritative approval always revalidates separately.
export function classifyCombatRequests(messages,combat,state){
 const items=[...(messages??[])].filter(m=>m.flags?.hwfwm?.actionRequest&&!m.flags?.hwfwm?.actionResolved);
 return items.map(m=>{
  const r=m.flags.hwfwm.actionRequest;
  const applied=(state?.appliedRequests??[]).includes(m.id);
  const current=Boolean(combat?.started&&state?.current&&r.combatId===combat.id&&r.combatantId===state.current&&r.round===state.round&&r.revision===state.revision&&!applied);
  return {id:m.id,label:m.content,status:current?"Current":"Stale",current};
 }).reverse();
}
