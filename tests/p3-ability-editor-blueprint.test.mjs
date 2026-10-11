import test from "node:test";import assert from "node:assert/strict";
import {updateAbility} from "../scripts/ability-editor.js";
test("saving ability keeps components, notes and linked Essence/stone synchronized",async()=>{
 let patch;
 const essence={id:"essence-1",type:"essence",name:"Fire Essence"};
 const item={id:"a1",type:"ability",system:{essenceId:"essence-1",blueprint:{schemaVersion:1,components:[{kind:"damage",source:"essence",label:"Fire",apCost:null}],notes:"old"}},update:async value=>{patch=value;return value;}};
 const actor={isOwner:true,items:{get:id=>id==="a1"?item:id==="essence-1"?essence:undefined}};
 await updateAbility(actor,"a1",{name:"Fire Blast",actionCost:5,manaCost:4,staminaCost:0,awakeningStone:"Stone of Ember",blueprintNotes:"New description",favorite:false});
 assert.equal(patch["system.blueprint"].notes,"New description");
 assert.equal(patch["system.blueprint"].essence.id,"essence-1");
 assert.equal(patch["system.blueprint"].essence.name,"Fire Essence");
 assert.equal(patch["system.blueprint"].awakeningStone.name,"Stone of Ember");
 assert.equal(patch["system.blueprint"].components.length,1);
 assert.equal(patch["system.blueprint"].components[0].apCost,null);
});
test("a missing parent Essence prevents orphaned ability edits",async()=>{
 const item={type:"ability",system:{essenceId:"missing"}};
 const actor={isOwner:true,items:{get:id=>id==="a"?item:undefined}};
 await assert.rejects(updateAbility(actor,"a",{name:"A",actionCost:0,manaCost:0,staminaCost:0}),/parent Essence/);
});
