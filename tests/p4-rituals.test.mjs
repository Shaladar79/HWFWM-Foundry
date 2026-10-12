import test from "node:test";
import assert from "node:assert/strict";
import {ritualCost,canPerformRitual,startRitual,investRitual,interruptionTN,breakRitual,finishRitual,ritualEffect} from "../scripts/p4-rituals.js";
import {calculateIronBuild} from "../scripts/p4-iron-rules.js";
import {validateStartingSkills} from "../scripts/p3-skill-catalog.js";
test("Combat Rituals is Spirit talent with both skill prerequisites",()=>{
 const skills=validateStartingSkills(["Magic Theory","Ritual Knowledge","Combat Rituals","Spellcasting","Perception"]);
 assert.equal(skills.find(s=>s.name==="Combat Rituals").attribute,"spirit");
 assert.throws(()=>validateStartingSkills(["Magic Theory","Combat Rituals","Spellcasting","Perception","Insight"]),/requires/);
});
test("GM approved ritual compatibility is not an AP surcharge",()=>{
 const base={kind:"damageSpell",damage:[{type:"fire",tier:"medium"}],range:"short",resource:"mana"};
 const standard=calculateIronBuild(base);
 const ritual=calculateIronBuild({...base,ritualCompatible:true,ritualApproved:true,ritualEnhancement:"Fire damage ×1.5"});
 assert.equal(standard.finalAP,ritual.finalAP);
 assert.equal(ritual.ritualActionScore,18);
 assert.throws(()=>calculateIronBuild({...base,ritualCompatible:true,ritualEnhancement:"Damage"}),/GM approval/);
});
test("Ritual eligibility separates combat talent",()=>{
 assert.equal(canPerformRitual({compatible:true,hasRitualKnowledge:true}),true);
 assert.equal(canPerformRitual({compatible:true,inCombat:true,hasRitualKnowledge:true}),false);
 assert.equal(canPerformRitual({compatible:true,inCombat:true,hasRitualKnowledge:true,hasCombatRituals:true}),true);
});
test("Ritual progress charges only remaining Action Score",()=>{
 let state=startRitual({actionScore:6,resourcePaid:true,compatible:true,allowed:true});
 state=investRitual(state,15,15).state;
 const end=investRitual(state,5,5);
 assert.equal(end.spent,3);assert.equal(end.state.status,"ready");
 assert.equal(finishRitual(end.state,{successful:true}).cooldownStarted,true);
});
test("Extra LF and LF trigger check, armor does not",()=>{
 assert.equal(interruptionTN(65,{}),null);
 assert.equal(interruptionTN(65,{extraLifeForceDamage:8,lifeForceDamage:4}),53);
 const state=startRitual({actionScore:12,resourcePaid:true,compatible:true,allowed:true});
 assert.equal(breakRitual(state,{tn:53,roll:22}).status,"preparing");
 assert.equal(breakRitual(state,{tn:53,roll:82}).status,"interrupted");
 assert.equal(breakRitual(state,{incapacitated:true}).cooldownStarted,true);
 assert.equal(ritualEffect(5),7);
 assert.equal(ritualCost(2),6);
});
