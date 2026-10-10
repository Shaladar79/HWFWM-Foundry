import {HWFWMActor} from "./system-actor.js";
import {HWFWMActorSheet} from "./system-sheet.js";
import {resolveRoll,rankDelta} from "./rules.js";
import {advanceActorAbility,initializeEssences} from "./advancement.js";
Hooks.once("init",()=>{
 CONFIG.Actor.documentClass=HWFWMActor;
 Actors.unregisterSheet("core",ActorSheet);
 Actors.registerSheet("hwfwm",HWFWMActorSheet,{types:["character","npc","monster","familiar"],makeDefault:true,label:"System Interface"});
 game.settings.register("hwfwm","essenceXpMultiplier",{name:"Essence XP cost multiplier (provisional)",hint:"Adjust the cost of ability advancement pending final progression balancing.",scope:"world",config:true,type:Number,default:10});
 Handlebars.registerHelper("eq",(a,b)=>a===b);
 Handlebars.registerHelper("titlecase",str=>String(str??"").replace(/\b\w/g,c=>c.toUpperCase()));
});
Hooks.once("ready",()=>{
 game.hwfwm={resolveRoll,rankDelta,advanceActorAbility,initializeEssences,roll:async({tn=30,actorRank="iron",targetRank="iron",type="neutral",flavor="System Check"}={})=>{
 const finalTN=Number(tn)+rankDelta(actorRank,targetRank,type);
 const roll=await(new Roll("1d100")).evaluate();
 const outcome=resolveRoll(roll.total,finalTN);
 await roll.toMessage({flavor:`${flavor}: TN ${finalTN}% — ${outcome.successes} successes${outcome.critical?" (CRITICAL)":""}`});
 return outcome;}};
});
