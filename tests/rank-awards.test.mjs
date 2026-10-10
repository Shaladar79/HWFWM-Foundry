import test from "node:test";
import assert from "node:assert/strict";
import {rankGrant,derivedRankFromItems,projectedRank} from "../scripts/rank-awards.js";
test("rank grants default to zero",()=>{assert.equal(rankGrant("iron","bronze"),0);assert.equal(rankGrant("iron","silver",{bronze:5,silver:10}),15);});

test("unbonded or incomplete builds cannot rank up",()=>{
 const actors=[{id:"e",type:"essence",system:{bondedAttribute:"power"}},{id:"a",type:"ability",system:{essenceId:"e",rank:"bronze",level:0}}];
 assert.equal(derivedRankFromItems(actors),"iron");
 assert.equal(projectedRank(actors,"a",{rank:"silver",level:0}),"iron");
});
test("the twentieth ability is the rank gate",()=>{
 const items=[];
 for(const attribute of ["power","speed","spirit","recovery"]){
  const essenceId="ess-"+attribute;
  items.push({id:essenceId,type:"essence",system:{bondedAttribute:attribute}});
  for(let i=0;i<5;i++)items.push({id:attribute+i,type:"ability",system:{essenceId,rank:"bronze",level:0}});
 }
 items.find(i=>i.id==="power0").system={essenceId:"ess-power",rank:"iron",level:10};
 assert.equal(derivedRankFromItems(items),"iron");
 assert.equal(projectedRank(items,"power0",{rank:"bronze",level:0}),"bronze");
});
