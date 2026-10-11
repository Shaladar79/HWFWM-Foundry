import test from "node:test";import assert from "node:assert/strict";
import {planAbilityAP} from "../scripts/ability-ap.js";
test("each upgrade refreshes only its own Nature-specific allowance",()=>{
 const creation=planAbilityAP("Elf","spell",8,7);
 const first=planAbilityAP("Elf","spell",8,10);
 const second=planAbilityAP("Elf","spell",8,9);
 assert.equal(creation.unused,3);
 assert.equal(first.available,10);
 assert.equal(second.available,10);
 assert.equal(second.unused,1);
 assert.throws(()=>planAbilityAP("Elf","spell",8,11));
});
test("unmatched ability categories do not receive AP aptitude",()=>{
 assert.equal(planAbilityAP("Human","spell",8,8).bonus,0);
 assert.equal(planAbilityAP("Runic","spell",8,10).bonus,2);
 assert.equal(planAbilityAP("Leonid","boon",8,10).bonus,2);
});
