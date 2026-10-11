import test from "node:test";import assert from "node:assert/strict";
import {combatTurnState,advanceCombatTurn,startCombatRound} from "../scripts/p3-combat-sequence.js";
const a={id:"a"};
const c={combatants:[{id:"c1",actor:a,name:"Hero"},{id:"c2",actor:{id:"b"},name:"Enemy"}],combatant:{id:"c2",name:"Enemy"},round:2,turn:1,started:true,nextTurn:async()=>42};
test("tracks Foundry encounter without inventing initiative or resetting resources",()=>{
 assert.deepEqual(combatTurnState(null,a).active,false);
 const state=combatTurnState(c,a);
 assert.equal(state.round,2);assert.equal(state.current,false);assert.equal(state.participant,true);
 assert.equal(combatTurnState({...c,combatant:c.combatants[0]},a).current,true);
});
test("only GM can start or advance encounter",async()=>{
 globalThis.game={user:{isGM:false}};
 await assert.rejects(advanceCombatTurn(c),/GM/);
 globalThis.game.user.isGM=true;
 assert.equal(await advanceCombatTurn(c),42);
 await assert.rejects(startCombatRound(c),/already started/);
 let started=0;
 await startCombatRound({started:false,startCombat:async()=>++started});
 assert.equal(started,1);
});
