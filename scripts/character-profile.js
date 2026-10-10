export function validateIdentity({nature,role}){
 const clean=v=>String(v??"").trim();
 const values={nature:clean(nature),role:clean(role)};
 if(!values.nature||values.nature.length>100)throw Error("Nature required (max 100 characters)");
 if(!values.role||values.role.length>100)throw Error("Role required (max 100 characters)");
 return values;
}
export function buildLedgerEntry({kind,currency,amount,reason,abilityId="",from="",to="",rankFrom="",rankTo=""}){
 if(!["award","spend","rank"].includes(kind))throw Error("Invalid ledger event");
 if(kind!=="rank"&&!["essenceXP","talentXP"].includes(currency))throw Error("Invalid currency");
 if(!Number.isSafeInteger(amount))throw Error("Invalid ledger amount");
 return {kind,currency,amount,reason:String(reason??"").slice(0,180),abilityId,from,to,rankFrom,rankTo,time:Date.now()};
}
export function appendLedger(ledger,entry){return [...ledger,entry].slice(-500);}
