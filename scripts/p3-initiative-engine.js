// First Edition initiative and Action Score are one shared pool.
// Stable combatant IDs resolve equal scores; a voluntary pass banks points.
export function chooseNext(state){
 const eligible=state.entries.filter(e=>!e.passed&&e.score>0&&e.canAct!==false);
 return eligible.slice().sort((a,b)=>b.score-a.score||a.order-b.order)[0]?.id??null;
}
export function initializeRound(actors,rolls,previous=null){
 if(!Array.isArray(actors)||!actors.length)throw Error("Encounter needs combatants");
 const ids=new Set();
 const entries=actors.map((a,i)=>{
  if(!a.id||ids.has(a.id))throw Error("Duplicate or missing combatant ID");
  ids.add(a.id);
  const roll=rolls[a.id];
  if(!Number.isSafeInteger(roll)||roll<1||roll>20)throw Error("All combatants must roll d20");
  const carry=previous?.entries.find(e=>e.id===a.id)?.score??0;
  if(!Number.isSafeInteger(carry))throw Error("Invalid carryover Action Score");
  return {id:a.id,name:a.name??"",order:i,score:roll+carry,passed:false,canAct:true,roll,carry};
 });
 const state={round:(previous?.round??0)+1,entries,current:null};
 return {...state,current:chooseNext(state)};
}
export function updateScore(state,id,delta){
 if(!Number.isSafeInteger(delta))throw Error("Action Score change must be an integer");
 const entries=state.entries.map(e=>e.id===id?{...e,score:e.score+delta}:e);
 if(!entries.some(e=>e.id===id))throw Error("Combatant not found");
 const next={...state,entries,current:null};
 return {...next,current:chooseNext(next)};
}
export function spendTurn(state,id,cost){
 if(id!==state.current)throw Error("Not this combatant's turn");
 if(!Number.isSafeInteger(cost)||cost<=0)throw Error("Action Cost must be positive");
 const entry=state.entries.find(e=>e.id===id);
 if(!entry||entry.passed||entry.score<cost)throw Error("Insufficient Action Score");
 return updateScore(state,id,-cost);
}
export function passTurn(state,id){
 if(id!==state.current)throw Error("Not this combatant's turn");
 const entries=state.entries.map(e=>e.id===id?{...e,passed:true}:e);
 const next={...state,entries,current:null};
 return {...next,current:chooseNext(next)};
}
export function setActability(state,id,canAct){
 const entries=state.entries.map(e=>e.id===id?{...e,canAct:Boolean(canAct)}:e);
 if(!entries.some(e=>e.id===id))throw Error("Combatant not found");
 const next={...state,entries,current:null};
 return {...next,current:chooseNext(next)};
}
