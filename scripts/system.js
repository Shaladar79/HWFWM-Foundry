import {HWFWMActor} from "./system-actor.js";import {HWFWMActorSheet} from "./system-sheet.js";import {resolveRoll,rankDelta} from "./rules.js";
Hooks.once("init",()=>{console.log("HWFWM | Initializing The System");
CONFIG.Actor.documentClass=HWFWMActor;
Actors.unregisterSheet("core",ActorSheet);
Actors.registerSheet("hwfwm",HWFWMActorSheet,{types:["character","npc","monster","familiar"],makeDefault:true,label:"System Interface"});
Handlebars.registerHelper("eq",(a,b)=>a===b);
Handlebars.registerHelper("titlecase",(str)=>String(str??"").replace(/(^|\\s)\\w/g,c=>c.toUpperCase()));
});
Hooks.once("ready",()=>{game.hwfwm={resolveRoll,rankDelta,roll:async({tn=30,actorRank="iron",targetRank="iron",type="neutral",flavor="System Check"}={})=>{const finalTN=Number(tn)+rankDelta(actorRank,targetRank,type);const r=await (new Roll("1d100")).evaluate();const outcome=resolveRoll(r.total,finalTN);await r.toMessage({flavor:`${flavor}: TN ${finalTN}% — ${outcome.successes} successes${outcome.critical?" (CRITICAL)":""}`});return outcome;}};});
