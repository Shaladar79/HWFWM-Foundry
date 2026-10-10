import {ATTRIBUTES,HERO_RANKS,minimumProgress} from "./rules.js";
export function derivedRankFromItems(items){
 const essences=items.filter(i=>i.type==="essence");
 const stages=ATTRIBUTES.map(attribute=>{
  const essence=essences.find(i=>i.system.bondedAttribute===attribute);
  const abilities=essence?items.filter(i=>i.type==="ability"&&i.system.essenceId===essence.id):[];
  return abilities.length===5?minimumProgress(abilities.map(i=>({rank:i.system.rank,level:i.system.level}))):{rank:"iron",level:0};
 });
 return minimumProgress(stages).rank;
}
export function projectedRank(items,abilityId,next){
 return derivedRankFromItems(items.map(item=>item.id===abilityId?{...item,system:{...item.system,rank:next.rank,level:next.level}}:item));
}
export function rankGrant(from,to,amounts={}){
 const a=HERO_RANKS.indexOf(from),b=HERO_RANKS.indexOf(to);
 if(a<0||b<0||b<a)throw Error("Invalid rank transition");
 return HERO_RANKS.slice(a+1,b+1).reduce((total,rank)=>{
  const amount=Number(amounts[rank]??0);
  if(!Number.isSafeInteger(amount)||amount<0)throw Error("Invalid Talent XP grant");
  return total+amount;
 },0);
}
