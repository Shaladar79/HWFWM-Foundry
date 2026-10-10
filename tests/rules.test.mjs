import test from "node:test";import assert from "node:assert/strict";import {resolveRoll,rankDelta,minimumProgress,attributeTN,calculateResources,applyDamage,spendAction,canAdvanceAbility} from "../scripts/rules.js";
test("critical stacks successes",()=>{assert.equal(resolveRoll(5,65).successes,10);assert.equal(resolveRoll(5,0).successes,4);assert.equal(resolveRoll(80,65).successes,0);});
test("TN carry-over",()=>{assert.equal(attributeTN({rank:"iron",level:10}),attributeTN({rank:"bronze",level:0}));assert.equal(attributeTN({rank:"bronze",level:10}),attributeTN({rank:"silver",level:0}));});
test("rank minima and advancement gate",()=>{assert.deepEqual(minimumProgress([{rank:"bronze",level:0},{rank:"iron",level:8}]),{rank:"iron",level:8});assert.equal(canAdvanceAbility({rank:"bronze",level:0},"iron"),false);assert.equal(canAdvanceAbility({rank:"iron",level:10},"iron"),true);});
test("tyranny hostile vs beneficial",()=>{assert.equal(rankDelta("iron","silver","hostile"),-20);assert.equal(rankDelta("silver","iron","beneficial"),20);assert.equal(rankDelta("iron","silver","beneficial"),0);});
test("starting resources",()=>{const attrs=Object.fromEntries(["power","speed","spirit","recovery"].map(k=>[k,{rank:"iron",level:0}]));assert.deepEqual(calculateResources(attrs),{lifeForce:40,mana:30,stamina:30});});
test("damage ordering",()=>{const r=applyDamage(50,{shield:20,manaShieldActive:false,armor:15,extraLifeForce:10,lifeForce:100});assert.equal(r.pools.lifeForce,95);});
test("strict action score",()=>{assert.throws(()=>spendAction(3,5));assert.equal(spendAction(5,2),3);});
