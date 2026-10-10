import test from "node:test";
import assert from "node:assert/strict";
import {STARTER_STONES,combineStones,addStone,normalizeStone} from "../scripts/awakening-stones.js";
test("wiki seed contains known rarities",()=>{
 assert.equal(STARTER_STONES.find(s=>s.name==="Feast").rarity,"common");
 assert.equal(STARTER_STONES.find(s=>s.name==="Avatar").rarity,"legendary");
 assert.equal(STARTER_STONES.find(s=>s.name==="Wind").rarity,"common");
 assert.equal(STARTER_STONES.find(s=>s.name==="Radiant").rarity,"rare");
 assert.equal(STARTER_STONES.filter(s=>s.rarity==="unknown").length,0);
});
test("GM-defined stones can expand catalog",()=>{
 const custom=addStone([],{name:"Falling Star",rarity:"epic",description:"Campaign-created"});
 assert.equal(combineStones(STARTER_STONES,custom).find(s=>s.name==="Falling Star").source,"custom");
 assert.throws(()=>addStone(custom,{name:"Falling Star",rarity:"rare"}));
 assert.throws(()=>normalizeStone({name:"Bad",rarity:"mythic"}));
});
