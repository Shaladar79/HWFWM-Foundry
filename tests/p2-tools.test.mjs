import test from "node:test";
import assert from "node:assert/strict";
import {planBondSwap,validAward} from "../scripts/p2-tools.js";
test("bond swap keeps slots distinct",()=>{const e=[{id:"a",system:{bondedAttribute:"power"}},{id:"b",system:{bondedAttribute:"spirit"}}];assert.equal(planBondSwap(e,"a","spirit")[1]["system.bondedAttribute"],"power");});
test("award validation",()=>{assert.equal(validAward(50),true);assert.equal(validAward(-1),false);assert.equal(validAward(1.5),false);});
