// One designated active GM acts as the encounter writer.
// This is a fail-closed authority policy, not a distributed transaction lock.
export function combatAuthority(users,current){
 if(!current?.isGM)throw Error("Only a GM may operate the combat engine");
 const active=[...(users??[])].filter(u=>u?.isGM&&u.active!==false).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 const authority=active[0]??current;
 if(authority.id!==current.id)throw Error("Another active GM is the combat authority: "+(authority.name??authority.id));
 return authority.id;
}
export function resourceSnapshot(actor){
 const mana=Number(actor.system?.resources?.mana?.value),stamina=Number(actor.system?.resources?.stamina?.value);
 if(!Number.isSafeInteger(mana)||!Number.isSafeInteger(stamina)||mana<0||stamina<0)throw Error("Invalid resources");
 return {mana,stamina};
}
export function recoveryIssue(combat){
 return combat?.getFlag("hwfwm","resourceRecoveryIssue")??null;
}
