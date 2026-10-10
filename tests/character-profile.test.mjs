import test from "node:test";
import assert from "node:assert/strict";
import {validateIdentity,buildLedgerEntry,appendLedger} from "../scripts/character-profile.js";
test("Nature and Role must be provided",()=>{
 assert.deepEqual(validateIdentity({nature:" Human ",role:"Healer"}),{nature:"Human",role:"Healer"});
 assert.throws(()=>validateIdentity({nature:"",role:"Tank"}));
 assert.throws(()=>validateIdentity({nature:"Elf",role:""}));
});
test("advancement ledger supports spending and rank changes",()=>{
 const spend=buildLedgerEntry({kind:"spend",currency:"essenceXP",amount:-50,reason:"Ability advancement",from:"Iron 10",to:"Bronze 0"});
 assert.equal(spend.amount,-50);
 const rank=buildLedgerEntry({kind:"rank",amount:0,rankFrom:"iron",rankTo:"bronze",reason:"Rank up"});
 assert.equal(rank.rankTo,"bronze");
 assert.equal(appendLedger([spend],rank).length,2);
 assert.throws(()=>buildLedgerEntry({kind:"spend",currency:"gold",amount:12}));
});
