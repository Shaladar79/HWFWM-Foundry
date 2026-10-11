import test from "node:test";import assert from "node:assert/strict";
import {planNatureEvolution,planNatureTransformation,approveNatureEvolution,approveNatureTransformation} from "../scripts/nature-evolution.js";
const story="A GM-approved transformation after a major campaign event.";
test("only documented significant story events allow approvals",()=>{
 assert.equal(planNatureEvolution("Runic",5,"Resistance becomes visible",story).slot,5);
 assert.throws(()=>planNatureEvolution("Runic",7,"New effect",story),/slot/);
 assert.throws(()=>planNatureEvolution("Runic",5,"New effect","level up"),/significant story/);
 assert.throws(()=>planNatureTransformation("Elf","Outworlder",story),/deferred/);
 assert.throws(()=>planNatureTransformation("Elf","Elf",story));
});
test("non-GM cannot alter Natures through story APIs",async()=>{
 globalThis.game={user:{isGM:false}};
 await assert.rejects(approveNatureEvolution({isOwner:true},{slot:1,description:"Changed",reason:story}),/GM permission/);
});
test("GM transformation records who and why and resets adaptive state",async()=>{
 globalThis.game={user:{isGM:true,id:"gm-id"}};
 let written;
 const actor={isOwner:true,system:{nature:"Runic"},getFlag:()=>[],update:async patch=>{written=patch;}};
 await approveNatureTransformation(actor,{next:"Elf",reason:story});
 assert.equal(written["system.nature"],"Elf");
 assert.equal(written["flags.hwfwm.adaptiveSubtype"],"");
 assert.equal(written["flags.hwfwm.natureEvents"][0].approvedBy,"gm-id");
});
