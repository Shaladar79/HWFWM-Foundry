export const RANKS=["normal","iron","bronze","silver","gold","diamond","transcendent"];
export const HERO_RANKS=RANKS.slice(1);
export const ATTRIBUTES=["power","speed","spirit","recovery"];
export const LEVEL_RATE={iron:1,bronze:2,silver:3,gold:4,diamond:5,transcendent:6};
export const BASE_TN={iron:30,bronze:40,silver:60,gold:90,diamond:130,transcendent:180};
export const MOVE_BONUS={iron:0,bronze:2,silver:5,gold:10,diamond:18,transcendent:30};
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number(n)||0));
export function compareProgress(a,b){const ar=HERO_RANKS.indexOf(a?.rank),br=HERO_RANKS.indexOf(b?.rank);return (ar-br)||((a?.level??0)-(b?.level??0));}
export function minimumProgress(values){return values.reduce((min,val)=>compareProgress(val,min)<0?val:min,{rank:"transcendent",level:10});}
export function abilityProgress(items){const a=[...items].filter(i=>i.type==="ability");return minimumProgress(a.map(i=>({rank:i.system.rank,level:i.system.level}))); }
export function progressionPoints(p){const idx=HERO_RANKS.indexOf(p?.rank);if(idx<0)return 0;let total=0;for(let i=0;i<idx;i++)total+=10*LEVEL_RATE[HERO_RANKS[i]];return total+clamp(p.level,0,10)*LEVEL_RATE[p.rank];}
export function attributeTN(p){return (BASE_TN[p.rank]??30)+clamp(p.level,0,10)*(LEVEL_RATE[p.rank]??1);}
export function rankDelta(actor,target,type="hostile"){const diff=RANKS.indexOf(actor)-RANKS.indexOf(target);return 10*(type==="hostile"?diff:type==="beneficial"?Math.max(0,diff):0);}
export function resolveRoll(roll,tn){const critical=roll>=1&&roll<=5;const normal=roll<=tn?1+Math.floor((tn-roll)/10):0;const successes=critical?Math.max(1,normal)+3:normal;return {roll,tn,critical,successes,success:successes>0};}
export function nextAbilityProgress(ability,heroRank){const idx=HERO_RANKS.indexOf(ability.rank);if(idx<0)throw Error("Invalid ability rank");if(ability.level<10)return {...ability,level:ability.level+1};if(idx===HERO_RANKS.length-1)return null;const next=HERO_RANKS[idx+1];if(HERO_RANKS.indexOf(next)>HERO_RANKS.indexOf(heroRank)+1)return null;return {...ability,rank:next,level:0};}
export function canAdvanceAbility(ability,heroRank){const next=nextAbilityProgress(ability,heroRank);if(!next)return false;return HERO_RANKS.indexOf(next.rank)<=HERO_RANKS.indexOf(heroRank)||next.level===0&&HERO_RANKS.indexOf(next.rank)===HERO_RANKS.indexOf(heroRank)+1;}
export function calculateResources(attributes,essenceBonuses={}){const p=Object.fromEntries(ATTRIBUTES.map(k=>[k,progressionPoints(attributes[k])]));const bonus=k=>Number(essenceBonuses[k]??0);return {lifeForce:Math.floor(40+p.power+.5*p.recovery+bonus("lifeForce")),mana:Math.floor(30+p.spirit+bonus("mana")),stamina:Math.floor(30+p.speed+.5*p.recovery+bonus("stamina"))};}
export function applyDamage(amount,pools){let remaining=Math.max(0,amount);const out=structuredClone(pools);const consume=(key)=>{const n=Math.min(remaining,Math.max(0,out[key]??0));out[key]-=n;remaining-=n;};
consume("shield");if(out.manaShieldActive&&remaining>0){const ratio=Math.max(0.01,out.manaShieldRatio??1);const spent=Math.min(out.mana??0,remaining/ratio);out.mana-=spent;remaining-=spent*ratio;}consume("armor");consume("extraLifeForce");consume("lifeForce");return {pools:out,remaining};}
export function actionAllowed(score,cost){return cost>=0&&score>=cost;}
export function spendAction(score,cost){if(!actionAllowed(score,cost))throw Error("Not enough Action Score");return score-cost;}
