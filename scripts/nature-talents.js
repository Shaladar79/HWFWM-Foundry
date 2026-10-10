import {evasiveFootwork} from "./nature-effects.js";
import {buildLedgerEntry,appendLedger} from "./character-profile.js";
export function planEvasivePurchase(nature,purchased,balance,cost){
 const current=evasiveFootwork(nature,purchased);
 if(!Number.isSafeInteger(cost)||cost<=0)throw Error("GM must configure a positive Talent XP cost");
 if(!Number.isSafeInteger(balance)||balance<cost)throw Error("Not enough Talent XP");
 const next=evasiveFootwork(nature,purchased+1);
 return {cost,balanceAfter:balance-cost,current,next};
}
export async function purchaseEvasiveFootwork(actor){
 if(!actor.isOwner||!["character","npc"].includes(actor.type)||actor.system.normal)throw Error("Permission denied");
 const cost=Number(game.settings.get("hwfwm","evasiveFootworkCost"));
 const purchased=Number(actor.getFlag("hwfwm","evasivePurchased")??0);
 const plan=planEvasivePurchase(actor.system.nature,purchased,Number(actor.system.talentXP),cost);
 const history=actor.getFlag("hwfwm","xpHistory")??[];
 const entry=buildLedgerEntry({kind:"spend",currency:"talentXP",amount:-cost,reason:"Evasive Footwork rank "+plan.next.ranks});
 await actor.update({"system.talentXP":plan.balanceAfter,"flags.hwfwm.evasivePurchased":purchased+1,"flags.hwfwm.xpHistory":appendLedger(history,entry)});
 return plan;
}
