export const RANKS=["normal","iron","bronze","silver","gold","diamond","transcendent"];
export const HERO_RANKS=RANKS.slice(1);
export const ATTRIBUTES=["power","speed","spirit","recovery"];
export const LEVEL_RATE={iron:1,bronze:2,silver:3,gold:4,diamond:5,transcendent:6};
export const BASE_TN={iron:30,bronze:40,silver:60,gold:90,diamond:130,transcendent:180};
export const MOVE_BONUS={iron:0,bronze:2,silver:5,gold:10,diamond:18,transcendent:30};
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number(n)||0));
export function compareProgress(a,b){const ar=HERO_RANKS.indexOf(a?.rank),br=HERO_RANKS.indexOf(b?.rank);return (ar-br)||((a?.level??0)-(b?.level??0));}
export function minimumProgress(values){return values.reduce((min,val)=>compareProgress(val,min)<0?val:min,{rank:"transcendent",level:10});}
export function abilityProgress(items){const a=[...items].filter(i=>i.type==="ability");return minimumProgress(a.map(i=>({rank:i.system.rank,level:i.system.level})));}
export function progressionPoints(p){const idx=HERO_RANKS.indexOf(p?.rank);if(idx<0)return 0;let total=0;for(let i=0;i<idx;i++)total+=10*LEVEL_RATE[HERO_RANKS[i]];return total+clamp(p.level,0,10)*LEVEL_RATE[p.rank];}
export function attributeTN(p){return (BASE_TN[p.rank]??30)+clamp(p.level,0,10)*(LEVEL_RATE[p.rank]??1);}
export function rankDelta(actor,target,type="hostile"){const ai=RANKS.indexOf(actor),ti=RANKS.indexOf(target);if(ai<0||ti<0)throw new Error("Unknown rank");const diff=ai-ti;return 10*(type==="hostile"?diff:type==="beneficial"?Math.max(0,diff):0);}
export function resolveRoll(roll,tn){if(!Number.isInteger(roll)||roll<1||roll>100||!Number.isFinite(tn))throw new RangeError("Invalid percentile roll or target number");const critical=roll<=5;const normal=roll<=tn?1+Math.floor((tn-roll)/10):0;const successes=critical?Math.max(1,normal)+3:normal;return {roll,tn,critical,successes,success:successes>0};}
export function nextAbilityProgress(ability,heroRank){const idx=HERO_RANKS.indexOf(ability.rank);if(idx<0)throw Error("Invalid ability rank");if(!HERO_RANKS.includes(heroRank))throw Error("Invalid hero rank");if(idx>HERO_RANKS.indexOf(heroRank)+1||idx===HERO_RANKS.indexOf(heroRank)+1&&ability.level>0)return null;if(ability.level<10){if(idx>HERO_RANKS.indexOf(heroRank))return null;return {...ability,level:ability.level+1};}if(idx===HERO_RANKS.length-1)return null;const next=HERO_RANKS[idx+1];if(HERO_RANKS.indexOf(next)>HERO_RANKS.indexOf(heroRank)+1)return null;return {...ability,rank:next,level:0};}
export function canAdvanceAbility(ability,heroRank){return nextAbilityProgress(ability,heroRank)!==null;}
export function calculateResources(attributes,essenceBonuses={}){const p=Object.fromEntries(ATTRIBUTES.map(k=>[k,progressionPoints(attributes[k])]));const bonus=k=>Number(essenceBonuses[k]??0);return {lifeForce:Math.floor(40+p.power+.5*p.recovery+bonus("lifeForce")),mana:Math.floor(30+p.spirit+bonus("mana")),stamina:Math.floor(30+p.speed+.5*p.recovery+bonus("stamina"))};}
export function applyDamage(amount,pools){if(!Number.isFinite(amount)||amount<0)throw RangeError("Invalid damage");let remaining=amount;const out=structuredClone(pools);const consume=key=>{const n=Math.min(remaining,Math.max(0,out[key]??0));out[key]=(out[key]??0)-n;remaining-=n;};consume("shield");if(out.manaShieldActive&&remaining>0){const ratio=Math.max(.01,out.manaShieldRatio??1);const spent=Math.min(Math.max(0,out.mana??0),remaining/ratio);out.mana-=spent;remaining-=spent*ratio;}consume("armor");consume("extraLifeForce");consume("lifeForce");return {pools:out,remaining};}
export function actionAllowed(score,cost){return Number.isFinite(score)&&Number.isFinite(cost)&&cost>=0&&score>=cost;}
export function spendAction(score,cost){if(!actionAllowed(score,cost))throw Error("Not enough Action Score");return score-cost;}
