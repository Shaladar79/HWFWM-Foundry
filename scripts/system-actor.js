import {ATTRIBUTES,minimumProgress,attributeTN,calculateResources,MOVE_BONUS,progressionPoints} from "./rules.js";
export class HWFWMActor extends Actor{
 prepareDerivedData(){
  super.prepareDerivedData();
  const s=this.system;
  if(!s||!["character","npc"].includes(this.type))return;
  if(this.type==="npc"&&s.normal){s.rank="normal";return;}
  const essences=this.items.filter(i=>i.type==="essence");
  const attrProgress={};
  for(const key of ATTRIBUTES){
   const e=essences.find(i=>i.system.bondedAttribute===key);
   const abilities=e?this.items.filter(i=>i.type==="ability"&&i.system.essenceId===e.id):[];
   const p=abilities.length===5?minimumProgress(abilities.map(a=>({rank:a.system.rank,level:a.system.level}))):{rank:"iron",level:0};
   attrProgress[key]=p;
   s.attributes[key]={...s.attributes[key],rank:p.rank,level:p.level,tn:attributeTN(p)};
  }
  s.rank=minimumProgress(Object.values(attrProgress)).rank;
  s.movement=6+(MOVE_BONUS[s.rank]??0);
  const bonuses={lifeForce:0,mana:0,stamina:0};
  for(const e of essences){
   const attr=e.system.bondedAttribute;
   if(!ATTRIBUTES.includes(attr))continue;
   const factor=1+progressionPoints(attrProgress[attr])/10;
   for(const k of Object.keys(bonuses))bonuses[k]+=Number(e.system.resourceBonuses?.[k]??0)*factor;
  }
  const max=calculateResources(attrProgress,bonuses);
  for(const k of Object.keys(max))s.resources[k].max=max[k];
 }
}
