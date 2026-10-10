import {natureGifts,natureCheckBonus} from "./nature-catalog.js";
const has=(nature,effect)=>natureGifts(nature).some(g=>g.effect===effect);
export function natureEffectiveness(nature,subtype,base,{rank="iron",ancestry=""}={}){
 if(!Number.isFinite(base)||base<0)throw Error("Invalid effect amount");
 const affinity=natureCheckBonus(nature,rank,{subtype});
 const ancestryBonus=has(nature,"ancestrySpellPerRank")&&subtype.toLowerCase()===ancestry.toLowerCase()?5*(["iron","bronze","silver","gold","diamond","transcendent"].indexOf(rank)+1):0;
 return Math.floor(base*(1+(affinity+ancestryBonus)/100));
}
export function natureRegen(nature,resource,base,{significantHeat=false}={}){
 if(!Number.isFinite(base)||base<0)throw Error("Invalid regeneration");
 const bonus=natureGifts(nature).reduce((n,g)=>n+(resource==="mana"&&g.effect==="manaRegen"?g.value:0)+(significantHeat&&["lifeForce","stamina"].includes(resource)&&g.effect==="heatRegen"?g.value:0),0);
 return Math.floor(base*(1+bonus/100));
}
export function natureMaintenance(nature,resource,cost){
 if(!Number.isSafeInteger(cost)||cost<0)throw Error("Invalid upkeep");
 const reduction=natureGifts(nature).reduce((n,g)=>n+(resource==="mana"&&g.effect==="manaIntegrity"?10:0)+(resource==="stamina"&&g.effect==="tireless"?10:0),0);
 return cost===0?0:Math.max(1,Math.ceil(cost*(1-reduction/100)));
}
export function natureDamage(nature,damage,{physical=false,subtype="",ancestry="",adaptiveSubtype=""}={}){
 if(!Number.isFinite(damage)||damage<0)throw Error("Invalid damage");
 let reduction=0;
 if(physical&&has(nature,"physicalReduction"))reduction+=10;
 if(has(nature,"dragonScales")&&(physical||Boolean(ancestry)&&subtype.toLowerCase()===ancestry.toLowerCase()))reduction+=10;
 if(has(nature,"adaptiveResistance")&&subtype&&subtype.toLowerCase()===adaptiveSubtype.toLowerCase())reduction+=5;
 return Math.max(0,damage-Math.floor(damage*Math.min(100,reduction)/100));
}
export function natureAptitude(nature,abilityType){return natureGifts(nature).reduce((n,g)=>n+(g.effect==="ap:"+abilityType?g.value:0),0);}
export function evasiveFootwork(nature,purchasedRanks=0){
 if(!Number.isSafeInteger(purchasedRanks)||purchasedRanks<0)throw Error("Invalid Talent ranks");
 const free=nature==="Lehenik"?1:0;
 const maximum=free?2:1;
 if(free+purchasedRanks>maximum)throw Error("Evasive Footwork maximum rank exceeded");
 return {ranks:free+purchasedRanks,purchasedRanks,maximum,physicalAttackTNModifier:-5*(free+purchasedRanks)};
}
export function immuneToPortalSickness(nature){return has(nature,"affinity:astral");}
