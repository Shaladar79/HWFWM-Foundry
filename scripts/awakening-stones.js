// Seeded from community-documented Awakening Stones; extend with world settings.
// https://he-who-fights-with-monsters.fandom.com/wiki/Awakening_Stones
export const STONE_RARITIES=["common","uncommon","rare","epic","legendary","unknown"];
export const STARTER_STONES=[{"name":"Earth","rarity":"common"},{"name":"Eyes","rarity":"common"},{"name":"Feast","rarity":"common"},{"name":"Feeble","rarity":"common"},{"name":"Fire","rarity":"common"},{"name":"Fish","rarity":"common"},{"name":"Foot","rarity":"common"},{"name":"Gun","rarity":"common"},{"name":"Hand","rarity":"common"},{"name":"Magus","rarity":"common"},{"name":"Mediocrity","rarity":"common"},{"name":"Plant","rarity":"common"},{"name":"Rain","rarity":"common"},{"name":"Rat","rarity":"common"},{"name":"Shield","rarity":"common"},{"name":"Snake","rarity":"common"},{"name":"Acid","rarity":"uncommon"},{"name":"Anticipation","rarity":"uncommon"},{"name":"Flesh","rarity":"uncommon"},{"name":"Focus","rarity":"uncommon"},{"name":"Preparation","rarity":"uncommon"},{"name":"Reach","rarity":"uncommon"},{"name":"Song","rarity":"uncommon"},{"name":"Surge","rarity":"uncommon"},{"name":"Vision","rarity":"uncommon"},{"name":"Wrath","rarity":"uncommon"},{"name":"Adventure","rarity":"rare"},{"name":"Judgement","rarity":"rare"},{"name":"Persistence","rarity":"rare"},{"name":"Ruin","rarity":"rare"},{"name":"Absolution","rarity":"epic"},{"name":"Calling","rarity":"epic"},{"name":"Champion","rarity":"epic"},{"name":"Inevitability","rarity":"epic"},{"name":"Moment","rarity":"epic"},{"name":"Omens","rarity":"epic"},{"name":"Purgation","rarity":"epic"},{"name":"Sky","rarity":"epic"},{"name":"Stars","rarity":"epic"},{"name":"Apocalypse","rarity":"legendary"},{"name":"Avatar","rarity":"legendary"},{"name":"Celestials","rarity":"legendary"},{"name":"Dimension","rarity":"legendary"},{"name":"Gate","rarity":"legendary"},{"name":"Karma","rarity":"legendary"},{"name":"Reaper","rarity":"legendary"},{"name":"Rebirth","rarity":"legendary"},{"name":"Air","rarity":"unknown"},{"name":"Barrier","rarity":"unknown"},{"name":"Bow","rarity":"unknown"},{"name":"Death","rarity":"unknown"},{"name":"Defiance","rarity":"unknown"},{"name":"Echo","rarity":"unknown"},{"name":"Elastic","rarity":"unknown"},{"name":"Growth","rarity":"unknown"},{"name":"Hunt","rarity":"unknown"},{"name":"Lightning","rarity":"unknown"},{"name":"Might","rarity":"unknown"},{"name":"Myriad","rarity":"unknown"},{"name":"Potency","rarity":"unknown"},{"name":"Puberty","rarity":"unknown"},{"name":"Radiant","rarity":"unknown"},{"name":"Sand","rarity":"unknown"},{"name":"Spider","rarity":"unknown"},{"name":"Swiftness","rarity":"unknown"},{"name":"Sword","rarity":"unknown"},{"name":"Wall","rarity":"unknown"},{"name":"Water","rarity":"unknown"},{"name":"Wheel","rarity":"unknown"},{"name":"Wind","rarity":"unknown"}];
export function normalizeStone(value){
 const name=String(value?.name??"").trim();
 const rarity=String(value?.rarity??"unknown").toLowerCase();
 if(!name||name.length>100)throw Error("Stone name must be 1–100 characters");
 if(!STONE_RARITIES.includes(rarity))throw Error("Invalid stone rarity");
 return {name,rarity,description:String(value?.description??"").trim().slice(0,600),tags:Array.isArray(value?.tags)?value.tags.map(String).slice(0,20):[],source:value?.source??"custom"};
}
export function combineStones(seed=STARTER_STONES,custom=[]){
 const byName=new Map();
 for(const item of seed)byName.set(item.name.toLowerCase(),{...normalizeStone(item),source:"wiki"});
 for(const item of custom)byName.set(String(item.name).trim().toLowerCase(),normalizeStone(item));
 return [...byName.values()].sort((a,b)=>a.name.localeCompare(b.name));
}
export function addStone(current,input){
 const stone=normalizeStone(input);
 if(combineStones(STARTER_STONES,current).some(s=>s.name.toLowerCase()===stone.name.toLowerCase()))throw Error("Awakening Stone already exists");
 return [...current,stone];
}
export function listStones(){return combineStones(STARTER_STONES,game.settings.get("hwfwm","customAwakeningStones"));}
export async function registerStone(value){
 if(!game.user.isGM)throw Error("Only a GM can add Awakening Stones");
 const current=game.settings.get("hwfwm","customAwakeningStones");
 return game.settings.set("hwfwm","customAwakeningStones",addStone(current,value));
}
