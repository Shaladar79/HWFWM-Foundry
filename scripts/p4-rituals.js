// Pure Iron ritual casting state machine; host integration persists state on an actor.
export function ritualCost(normalActionScore){
 if(!Number.isSafeInteger(normalActionScore)||normalActionScore<=0)throw Error("Invalid spell Action Score");
 return normalActionScore*3;
}
export function canPerformRitual({compatible=false,inCombat=false,hasCombatRituals=false,hasRitualKnowledge=false}={}){
 return Boolean(compatible&&hasRitualKnowledge&&(!inCombat||hasCombatRituals));
}
export function startRitual({actionScore,resourcePaid=false,compatible=false,allowed=false}={}){
 if(!compatible||!allowed)throw Error("Ritual not permitted");
 if(!resourcePaid)throw Error("Pay activation resource before beginning ritual");
 return {required:ritualCost(actionScore),invested:0,status:"preparing",cooldownStarted:false};
}
export function investRitual(state,available,requested){
 if(state?.status!=="preparing")throw Error("No ritual underway");
 if(!Number.isSafeInteger(available)||available<0||!Number.isSafeInteger(requested)||requested<0||requested>available)throw Error("Invalid Action Score investment");
 const spent=Math.min(requested,state.required-state.invested);
 const invested=state.invested+spent;
 return {spent,state:{...state,invested,status:invested===state.required?"ready":"preparing"}};
}
export function interruptionTN(baseTN,{extraLifeForceDamage=0,lifeForceDamage=0}={}){
 const values=[baseTN,extraLifeForceDamage,lifeForceDamage];
 if(!values.every(Number.isFinite)||extraLifeForceDamage<0||lifeForceDamage<0)throw Error("Invalid interruption inputs");
 const damage=extraLifeForceDamage+lifeForceDamage;
 return damage>0?baseTN-damage:null;
}
export function breakRitual(state,{incapacitated=false,tn=null,roll=null,voluntary=false}={}){
 if(!state||!["preparing","ready"].includes(state.status))throw Error("No active ritual");
 if(voluntary||incapacitated)return {...state,status:"interrupted",cooldownStarted:true};
 if(tn===null)return state;
 if(!Number.isInteger(roll)||roll<1||roll>100)throw Error("Invalid ritual interruption roll");
 return roll<=tn?state:{...state,status:"interrupted",cooldownStarted:true};
}
export function finishRitual(state,{successful=false}={}){
 if(state?.status!=="ready")throw Error("Ritual not fully prepared");
 return {...state,status:successful?"completed":"failed",cooldownStarted:true};
}
export function ritualEffect(value){
 if(!Number.isFinite(value)||value<0)throw Error("Invalid ritual effect value");
 return Math.floor(value*1.5);
}
