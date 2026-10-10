import test from "node:test";import assert from "node:assert/strict";
import {RARITIES,STARTER_ESSENCES,mergeCatalog,addCustomEssence,normalizedEssence,findEssence} from "../scripts/essence-catalog.js";
test("rarity categories",()=>{assert.deepEqual(RARITIES,["common","uncommon","rare","epic","legendary","unknown"]);assert.ok(STARTER_ESSENCES.length>0);});
test("custom essence persists as catalog entry without mutating starter list",()=>{const custom=addCustomEssence([],{name:"Dreamglass",rarity:"rare",description:"test"});const combined=mergeCatalog(STARTER_ESSENCES,custom);assert.equal(findEssence(combined,"dreamglass").rarity,"rare");assert.equal(STARTER_ESSENCES.some(e=>e.name==="Dreamglass"),false);assert.throws(()=>addCustomEssence(custom,{name:"dreamglass",rarity:"common"}));});
test("rarity and name validation",()=>{assert.throws(()=>normalizedEssence("", "common"));assert.throws(()=>normalizedEssence("Star","ultra"));});
