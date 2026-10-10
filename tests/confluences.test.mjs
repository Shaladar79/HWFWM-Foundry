import test from "node:test";import assert from "node:assert/strict";import {confluenceOptions} from "../scripts/confluences.js";
test("essence ordering does not affect known options",()=>{assert.deepEqual(confluenceOptions(["Swift","Might","Wind"]).map(x=>x.name),["Onslaught"]);assert.deepEqual(confluenceOptions(["Wind","Swift","Might"]).map(x=>x.name),["Onslaught"]);});
test("unknown combinations remain GM-approved",()=>{assert.deepEqual(confluenceOptions(["Banana","Wheel","Cloud"]),[]);});
test("multiple outcomes and GM custom options",()=>{const a=confluenceOptions(["Might","Swift","Wind"],[{name:"Storm Warrior",primary:["Wind","Might","Swift"]}]);assert.deepEqual(a.map(x=>x.name),["Onslaught","Storm Warrior"]);});
test("restricted combination is flagged",()=>{assert.equal(confluenceOptions(["Fungus","Growth","Zeal"])[0].restricted,true);});
