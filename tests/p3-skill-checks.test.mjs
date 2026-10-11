import test from "node:test";import assert from "node:assert/strict";import {calculateSkillTN,resolveSkillCheck} from "../scripts/p3-skill-checks.js";
const actor={system:{nature:"Lehenik",rank:"bronze",attributes:{power:{tn:45},speed:{tn:45},spirit:{tn:45},recovery:{tn:45}}}};
test("P3 training and specialization add independent five-point TN bonuses",()=>{
 const r=calculateSkillTN(actor,{attribute:"power",trained:true,specialization:true});
 assert.equal(r.tn,55);assert.equal(r.trainedBonus,5);assert.equal(r.specializationBonus,5);
});
test("Nature and rank bonuses participate without double counting",()=>{
 const r=calculateSkillTN(actor,{attribute:"speed",trained:true,specialization:true});
 assert.equal(r.tn,61);assert.equal(r.natureBonus,6);
 assert.equal(resolveSkillCheck(actor,1,{attribute:"power"}).critical,true);
});
test("invalid attributes are rejected",()=>assert.throws(()=>calculateSkillTN(actor,{attribute:"luck"})));
