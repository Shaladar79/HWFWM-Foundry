import {NATURE_CHOICES,natureGifts} from "./nature-catalog.js";
export function validateStoryEvent(reason){const text=String(reason??"").trim();if(text.length<15||text.length>1000)throw Error("Describe the significant story event (15–1000 characters)");return text;}
export function planNatureEvolution(nature,slot,description,reason){
 if(!NATURE_CHOICES.includes(nature))throw Error("Only standard Natures are supported");
 const gift=natureGifts(nature).find(g=>g.slot===Number(slot));if(!gift)throw Error("Invalid Nature gift slot");
 const detail=String(description??"").trim();
 if(detail.length<5||detail.length>1000)throw Error("Describe the GM-approved evolution");
 return {nature,slot:gift.slot,gift:gift.name,description:detail,reason:validateStoryEvent(reason)};
}
export function planNatureTransformation(current,next,reason){
 if(!NATURE_CHOICES.includes(current)||!NATURE_CHOICES.includes(next)||current===next)throw Error("Choose two different standard Natures; Outworlder and custom Natures are deferred");
 return {from:current,to:next,reason:validateStoryEvent(reason)};
}
export async function approveNatureEvolution(actor,{slot,description,reason}){
 if(!game.user.isGM||!actor?.isOwner)throw Error("GM permission required");
 const event=planNatureEvolution(actor.system.nature,slot,description,reason);
 const history=actor.getFlag("hwfwm","natureEvents")??[];
 await actor.update({"flags.hwfwm.natureEvents":[...history,{kind:"evolution",...event,approvedBy:game.user.id,at:new Date().toISOString()}]});
 return event;
}
export async function approveNatureTransformation(actor,{next,reason}){
 if(!game.user.isGM||!actor?.isOwner)throw Error("GM permission required");
 const event=planNatureTransformation(actor.system.nature,next,reason);
 const history=actor.getFlag("hwfwm","natureEvents")??[];
 await actor.update({"system.nature":next,"flags.hwfwm.adaptiveSubtype":"","flags.hwfwm.natureEvents":[...history,{kind:"transformation",...event,approvedBy:game.user.id,at:new Date().toISOString()}]});
 return event;
}
