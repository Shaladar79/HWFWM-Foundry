import test from "node:test";import assert from "node:assert/strict";
import {buildComponent,editComponents,checkDraftPricing,saveComponentEdit} from "../scripts/p4-ability-creator.js";
test("creator stores multi-source components and explicit success scaling without invented cost",()=>{
 let b=editComponents({}, {operation:"add",component:{kind:"damage",source:"essence",label:"Flame",scalingMode:"per-success"}});
 b=editComponents(b,{operation:"add",component:{kind:"shield",source:"awakening-stone",label:"Ward",apCost:3}});
 assert.equal(b.components[0].configuration.scalingMode,"per-success");
 assert.deepEqual(checkDraftPricing(b),{components:2,pricedAP:3,unpricedComponents:1,fullyPriced:false});
 b=editComponents(b,{operation:"remove",index:0});
 assert.equal(b.components.length,1);
 assert.throws(()=>editComponents(b,{operation:"remove",index:2}),/out of range/);
 assert.throws(()=>buildComponent({scalingMode:"triple"}),/scaling/);
});
test("ability save preserves actual parent Essence and Awakening Stone name",async()=>{
 const essence={id:"e",type:"essence",name:"Fire"};
 const ability={id:"a",type:"ability",system:{essenceId:"e",awakeningStone:"Ember Stone"},update:async change=>{ability.system.blueprint=change["system.blueprint"]}};
 const actor={isOwner:true,items:{get:id=>id==="e"?essence:id==="a"?ability:null}};
 await saveComponentEdit(actor,"a",{operation:"add",component:{kind:"boon",label:"Warmth"}});
 assert.deepEqual(ability.system.blueprint.essence,{id:"e",name:"Fire"});
 assert.equal(ability.system.blueprint.awakeningStone.name,"Ember Stone");
});

test("summoning components require both prerequisite Talents",async()=>{
 const essence={id:"e",type:"essence",name:"Astral"};
 const ability={id:"a",type:"ability",system:{essenceId:"e"},update:async()=>{throw Error("should not save")}};
 const actor={isOwner:true,items:{get:id=>id==="e"?essence:id==="a"?ability:null,some:()=>false}};
 await assert.rejects(saveComponentEdit(actor,"a",{operation:"add",component:{kind:"summon",label:"Summon ally"}}),/Magic Theory and Ritual Knowledge/);
});
