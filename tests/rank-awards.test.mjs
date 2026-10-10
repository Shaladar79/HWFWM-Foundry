import test from "node:test";
import assert from "node:assert/strict";
import {rankGrant} from "../scripts/rank-awards.js";
test("rank grants default to zero",()=>{assert.equal(rankGrant("iron","bronze"),0);assert.equal(rankGrant("iron","silver",{bronze:5,silver:10}),15);});
