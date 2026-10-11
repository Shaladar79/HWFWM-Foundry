import {ATTRIBUTES,resolveRoll} from "./rules.js";
import {natureCheckBonus} from "./nature-catalog.js";
export const SAVING_THROWS={power:"Power Save",speed:"Speed Save",spirit:"Spirit Save",recovery:"Fortitude Save"};
export function savingThrowTN(actor,attribute,{subtype="",purpose="",additional=0}={}){
 if(!ATTRIBUTES.includes(attribute))throw Error("Invalid save attribute");
 if(!Number.isFinite(additional))throw Error("Invalid save modifier");
 const s=actor.system,base=Number(s.attributes?.[attribute]?.tn);
 if(!Number.isFinite(base))throw Error("Missing attribute TN");
 const nature=natureCheckBonus(s.nature,s.rank,{attribute,subtype,purpose});
 return {name:SAVING_THROWS[attribute],attribute,base,nature,additional,tn:base+nature+additional};
}
export function resolveSavingThrow(actor,attribute,roll,options){
 const calc=savingThrowTN(actor,attribute,options);
 return {...calc,...resolveRoll(roll,calc.tn)};
}
