import {ATTRIBUTES,HERO_RANKS,abilityProgress,minimumProgress,attributeTN,calculateResources,MOVE_BONUS,progressionPoints} from "./rules.js";
export class HWFWMActor extends Actor{
prepareDerivedData(){super.prepareDerivedData();const s=this.system;if(!s)return;
if(!["character","npc"].includes(this.type))return;
if(this.type==="npc"&&s.normal){s.rank="normal";return;}
const essenceItems=this.items.filter(i=>i.type==="essence");
const attrProgress={};
for(const attr of ATTRIBUTES){
const essence=essenceItems.find(i=>i.system.bondedAttribute===attr);
const abilities=essence?this.items.filter(i=>i.type==="ability"&&i.system.essenceId===essence.id):[];
const p=abilities.length===5?abilityProgress(abilities):{rank:"iron",level:0};
attrProgress[attr]=p;
s.attributes[attr]={...s.attributes[attr],rank:p.rank,level:p.level,tn:attributeTN(p)};
}
const overall=minimumProgress(Object.values(attrProgress));
s.rank=overall.rank;
s.movement=6+(MOVE_BONUS[s.rank]??0);
const bonuses={lifeForce:0,mana:0,stamina:0};
for(const e of essenceItems){const attr=e.system.bondedAttribute;if(!ATTRIBUTES.includes(attr))continue;const factor=1+progressionPoints(attrProgress[attr])/10;for(const k of Object.keys(bonuses))bonuses[k]+=Number(e.system.resourceBonuses?.[k]??0)*factor;}
const max=calculateResources(attrProgress,bonuses);
for(const k of Object.keys(max)){s.resources[k].max=max[k];}
}
}
