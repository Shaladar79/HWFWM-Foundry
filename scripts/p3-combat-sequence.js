// P3 bridge to Foundry's native Combat tracker. It deliberately imposes no
// initiative formula, automated turn order, or Action Score refresh rule.
export function combatTurnState(combat,actor){
 if(!combat)return {active:false,round:null,turn:null,current:false,participant:false,combatantName:"",count:0};
 const list=[...(combat.combatants??[])];
 const selected=list.find(c=>c.actor?.id===actor?.id);
 const active=combat.combatant;
 return {active:true,round:combat.round??0,turn:combat.turn??null,current:Boolean(selected&&active?.id===selected.id),
  participant:Boolean(selected),combatantName:active?.name??"",count:list.length};
}
export async function advanceCombatTurn(combat){
 if(!game.user.isGM)throw Error("Only the GM can advance the combat turn");
 if(!combat)throw Error("No active Foundry combat encounter");
 if(!combat.started)throw Error("Start the Foundry encounter before advancing turns");
 return combat.nextTurn(); // Native Foundry handles rounds and turn sequence.
}
export async function startCombatRound(combat){
 if(!game.user.isGM)throw Error("Only the GM can start combat");
 if(!combat)throw Error("No active Foundry combat encounter");
 if(combat.started)throw Error("Combat already started");
 return combat.startCombat();
}
