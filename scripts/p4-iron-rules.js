// First Edition Iron-rank construction rules. Pure functions; no Foundry globals.
// This module validates build choices, not live attack resolution.
export const DAMAGE_TIERS={minor:[2,0],medium:[3,1],heavy:[4,2],extreme:[8,4]};
export const SHIELD_TIERS={minor:[3,0],medium:[5,1],heavy:[7,2],extreme:[10,4]};
export const CAST_SPEED={quick:[2,4],fast:[4,2],medium:[6,0],slow:[8,-2],extended:[12,-4]};
export const COOLDOWNS={none:2,one:0,three:-1,five:-2,encounter:-3,day:-5};
export const ACTIVATION={minor:[0.02,2],medium:[0.05,0],major:[0.10,-2],extreme:[0.20,-4]};
export const SPELL_RANGE={touch:[1,-1],short:[4,0],medium:[8,2],long:[12,3],extreme:[20,5]};
export const ATTACK_RANGE={touch:[1,0],weapon:[null,1],minor:[2,2],medium:[6,4],long:[10,6],extreme:[16,8]};
export const EFFECTS={none:0,daze:2,slow:2,affliction:2,quarterDrain:2,halfDrain:3,fullDrain:5};
const RESTORE_TYPES=["lifeForce","mana","stamina"];
const kinds=["specialAttack","damageSpell","restorationSpell","transferSpell","shieldSpell"];
const reject=(test,message)=>{if(!test)throw Error(message)};
const num=(v)=>Number(v);
function tier(table,key,label){reject(Object.hasOwn(table,key),`Invalid ${label}`);return table[key]}
function damageParts(parts,{required=false}={}){
 reject(Array.isArray(parts)&&parts.length<=2,"At most two damage components");
 if(required)reject(parts.length>0,"A damage component is required");
 const used=new Set();
 return parts.reduce((sum,p,i)=>{
  reject(p&&typeof p.type==="string"&&p.type.trim(),"Damage type required");
  const type=p.type.trim().toLowerCase();
  reject(!used.has(type),"Purchased damage types must differ");
  used.add(type);
  return sum+tier(DAMAGE_TIERS,p.tier,"damage tier")[1]+(i===1?2:0);
 },0);
}
export function calculateIronBuild(b={}){
 reject(kinds.includes(b.kind),"Invalid Iron ability kind");
 const errors=[],parts=b.damage??[],kind=b.kind;
 const effect=b.effect??"none";
 const budget=b.specialAttackAptitude&&kind==="specialAttack"?8:6;
 const creditCap=budget/2;
 let positive=0,refund=0;
 const add=(cost)=>{if(cost<0)refund+=-cost;else positive+=cost};
 if(kind==="specialAttack"){
  const weapons=b.weapons??[];
  reject(Array.isArray(weapons)&&weapons.length>=1&&weapons.length<=3,"Choose one to three weapon types");
  reject(!(weapons.includes("unarmed")&&weapons.length!==1),"Unarmed cannot mix with weapons");
  add(weapons.length-1);
  add(tier(ATTACK_RANGE,b.range??"weapon","attack range")[1]);
  reject(["stamina","lifeForce"].includes(b.resource??"stamina"),"Special Attacks use Stamina or unlocked Life Force");
  if((b.resource??"stamina")==="lifeForce")reject(b.lifeForceUnlocked===true,"Life Force requires an ability-specific unlocking stone");
 }else{
  const range=b.range??"short";
  add(tier(SPELL_RANGE,range,"spell range")[1]);
  reject(["mana","lifeForce"].includes(b.resource??"mana"),"Spells cannot use Stamina");
  if((b.resource??"mana")==="lifeForce")reject(b.lifeForceUnlocked===true,"Life Force requires an ability-specific unlocking stone");
 }
 add(tier(CAST_SPEED,b.speed??"medium","speed")[1]);
 add(tier(COOLDOWNS,b.cooldown??"one","cooldown"));
 if(kind==="shieldSpell"&&b.shieldType==="mana"){
  reject((b.resource??"mana")==="mana","Mana Shield is Mana-based");
  reject(b.activation==null||b.activation==="none","Mana Shield has no activation modifier");
 }else add(tier(ACTIVATION,b.activation??"medium","activation")[1]);
 if(kind==="specialAttack"||kind==="damageSpell"){
  const isSpell=kind==="damageSpell";
  add(damageParts(parts,{required:isSpell}));
  reject(Object.hasOwn(EFFECTS,effect),"Unknown effect");
  add(EFFECTS[effect]);
  if(!isSpell)reject(parts.length>0||effect!=="none","Special Attack needs damage or an effect");
  if(effect.endsWith("Drain")){
   reject(parts.length>0,"Drain must attach to purchased damage");
   reject(RESTORE_TYPES.includes(b.drainResource),"Drain requires a resource type");
  }
  if(effect!=="none"){
   const attached=b.effectDamageIndex??0;
   reject(Number.isInteger(attached)&&attached>=0&&attached<parts.length+(isSpell?0:1),"Invalid effect attachment");
   if(effect.endsWith("Drain"))reject(attached>=1||isSpell,"Drain cannot attach to base weapon damage");
  }
  if(!isSpell)reject(!b.multiTarget,"Special Attacks target one creature");
  if(isSpell&&b.multiTarget)add(3);
 }else if(kind==="restorationSpell"||kind==="transferSpell"){
  reject(RESTORE_TYPES.includes(b.restoreResource),"Choose a restoration resource");
  const isTransfer=kind==="transferSpell";
  const regen=b.regeneration??"none";
  if(isTransfer){
   reject(regen==="none","Iron Transfer cannot regenerate resources");
   add(tier(DAMAGE_TIERS,b.potency??"minor","transfer potency")[1]);
  }else{
   reject(["none","minor","sustained"].includes(regen),"Invalid regeneration");
   reject(b.potency!==null||regen!=="none","Choose healing potency or regeneration");
   if(b.potency!==null)add(tier(DAMAGE_TIERS,b.potency??"minor","healing potency")[1]);
   if(regen!=="none"){
    add(regen==="minor"?2:4);
    const upgrade=num(b.regenUpgrade??0);
    reject(Number.isSafeInteger(upgrade)&&upgrade>=0,"Invalid regeneration upgrade");
    add(upgrade);
   }
  }
  if(b.multiTarget)add(3);
 }else{
  reject(["normal","reflection","deflection","mana"].includes(b.shieldType),"Invalid shield type");
  if(b.shieldType==="mana"){add(6);reject(!b.multiTarget,"Mana shield is self-only");}
  else if(b.shieldType==="deflection")add(4);
  else {add(tier(SHIELD_TIERS,b.potency??"minor","shield potency")[1]);if(b.shieldType==="reflection")add(2);}
  reject(!b.multiTarget,"Shield spells cannot multi-target");
 }
 const credit=Math.min(refund,creditCap);
 const finalAP=Math.max(0,positive-credit);
 return {kind,baseAP:budget,drawbackCap:creditCap,positiveAP:positive,requestedDrawbacks:refund,apCredit:credit,finalAP,remainingAP:budget-finalAP,valid:finalAP<=budget,actionScore:CAST_SPEED[b.speed??"medium"][0],resource:b.resource??(kind==="specialAttack"?"stamina":"mana"),activationPercent:kind==="shieldSpell"&&b.shieldType==="mana"?0:ACTIVATION[b.activation??"medium"][0]};
}
export function activationAmount(max,percentage){reject(Number.isFinite(num(max))&&num(max)>=0,"Invalid maximum resource");return percentage===0?0:Math.max(1,Math.ceil(num(max)*percentage));}
export function damageOnSuccess(tierName,successes){reject(Number.isSafeInteger(successes)&&successes>=0,"Invalid successes");return tier(DAMAGE_TIERS,tierName,"damage tier")[0]*successes;}
export function shieldOnSuccess(tierName,successes){reject(Number.isSafeInteger(successes)&&successes>=0,"Invalid successes");return tier(SHIELD_TIERS,tierName,"shield tier")[0]*successes;}
export function restorationOnSuccess(tierName,successes){return damageOnSuccess(tierName,successes);}
export function regenOnSuccess(successes,upgrade=0){reject(Number.isSafeInteger(successes)&&successes>=0&&Number.isSafeInteger(upgrade)&&upgrade>=0,"Invalid regeneration");return successes*(1+upgrade);}
export function transferResources({available,needed,maximum,requested}){const values=[available,needed,maximum,requested];reject(values.every(v=>Number.isSafeInteger(v)&&v>=0),"Invalid transfer values");return Math.min(...values);}
export function replacementDecision(existing,incoming){
 reject(existing&&incoming,"Two shield states required");
 if(existing.kind==="mana"||incoming.kind==="mana")return "separate-slot";
 if(incoming.kind==="deflection")return "replace";
 if(existing.kind==="deflection")return "keep";
 reject(["normal","reflection"].includes(existing.kind)&&["normal","reflection"].includes(incoming.kind),"Invalid shield");
 return incoming.points>=existing.points?"replace":"keep";
}
export function drainRecovery(resourceRemoved,fraction){reject(Number.isSafeInteger(resourceRemoved)&&resourceRemoved>=0&&[0.25,0.5,1].includes(fraction),"Invalid Drain");return Math.floor(resourceRemoved*fraction);}
export function reduceDamage(amount,multiplier){reject(Number.isFinite(amount)&&amount>=0&&Number.isFinite(multiplier)&&multiplier>=0,"Invalid damage");return Math.floor(amount*multiplier);}
