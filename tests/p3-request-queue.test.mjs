import test from "node:test";import assert from "node:assert/strict";
import {classifyCombatRequests} from "../scripts/p3-request-queue.js";
const msg=(id,revision,combatId="encounter")=>({id,content:id,flags:{hwfwm:{actionRequest:{combatId,combatantId:"c1",round:2,revision}}}});
test("current queue excludes stale revisions, wrong combat and applied requests",()=>{
 const state={current:"c1",round:2,revision:5,appliedRequests:["applied"]};
 const combat={id:"encounter",started:true};
 const queue=classifyCombatRequests([msg("current",5),msg("old",4),msg("wrong",5,"elsewhere"),msg("applied",5)],combat,state);
 assert.equal(queue.find(r=>r.id==="current").current,true);
 for(const id of ["old","wrong","applied"])assert.equal(queue.find(r=>r.id===id).status,"Stale");
});
test("queue never marks actions current without a live encounter",()=>{
 assert.equal(classifyCombatRequests([msg("a",1)],null,null)[0].current,false);
});
