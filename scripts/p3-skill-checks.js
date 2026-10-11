import {natureCheckBonus} from "./nature-catalog.js";
import {rankDelta,resolveRoll,ATTRIBUTES} from "./rules.js";
export function calculateSkillTN(actor,{attribute,trained=false,specialization=false,subtype="",purpose="",targetRank=null,hostile=false,additional=0}={}){
 if(!ATTRIBUTES.includes(attribute))throw Error("Invalid skill attribute");
 if(!Number.isFinite(additional))throw Error("Invalid circumstance modifier");
 const s=actor.system;
 const base=Number(s.attributes?.[attribute]?.tn);
 if(!Number.isFinite(base))throw Error("Missing attribute TN");
 const modifier=natureCheckBonus(s.nature,s.rank,{attribute,subtype,purpose});
 const tyranny=targetRank===null?0:rankDelta(s.rank,targetRank,hostile?"hostile":"beneficial");
 return {tn:base+(trained?5:0)+(specialization?5:0)+modifier+tyranny+additional,base,trainedBonus:trained?5:0,specializationBonus:specialization?5:0,natureBonus:modifier,rankBonus:tyranny,additional};
}
export function resolveSkillCheck(actor,roll,options){const calculation=calculateSkillTN(actor,options);return {...calculation,...resolveRoll(roll,calculation.tn)};}
