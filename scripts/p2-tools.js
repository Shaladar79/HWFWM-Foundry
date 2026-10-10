import {natureEarnedXP} from "./nature-catalog.js";
import {buildLedgerEntry,appendLedger} from "./character-profile.js";
import {ATTRIBUTES} from "./rules.js";
export function planBondSwap(items,id,target){
 if(!ATTRIBUTES.includes(target))throw Error("Invalid attribute");
 const source=items.find(i=>i.id===id);
 if(!source)throw Error("Essence not found");
 const other=items.find(i=>i.id!==id&&i.system.bondedAttribute===target);
 const updates=[{_id:id,"system.bondedAttribute":target}];
 if(other)updates.push({_id:other.id,"system.bondedAttribute":source.system.bondedAttribute});
 return updates;
}
export async function bondEssence(actor,id,target){
 if(!actor.isOwner)throw Error("Permission denied");
 const items=actor.items.filter(i=>i.type==="essence");
 if(items.length!==4||new Set(items.map(i=>i.system.bondedAttribute)).size!==4)throw Error("Four unique bonds required");
 return actor.updateEmbeddedDocuments("Item",planBondSwap(items,id,target));
}
export function validAward(amount){return Number.isSafeInteger(amount)&&amount>0&&amount<=1000000;}
export async function awardXP(actor,currency,amount,reason="Story milestone"){
 if(!game.user.isGM)throw Error("GM only");
 if(!["essenceXP","talentXP"].includes(currency)||!validAward(amount))throw Error("Invalid XP award");
 if(!["character","npc"].includes(actor.type))throw Error("Not an essence-user");
 const balance=Number(actor.system[currency]??0);
 const granted=natureEarnedXP(actor.system.nature,amount);
 const history=actor.getFlag("hwfwm","xpHistory")??[];
 const entry=buildLedgerEntry({kind:"award",currency,amount:granted,reason});
 await actor.update({[`system.${currency}`]:balance+granted,"flags.hwfwm.xpHistory":appendLedger(history,entry)});
 return entry;
}
