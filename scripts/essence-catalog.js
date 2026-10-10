export const RARITIES=["common","uncommon","rare","epic","legendary","unknown"];
export const STARTER_ESSENCES=[
 {name:"Earth",rarity:"common"},{name:"Fire",rarity:"common"},{name:"Might",rarity:"common"},
 {name:"Wood",rarity:"common"},{name:"Brush",rarity:"common"},
 {name:"Magic",rarity:"common"},{name:"Sword",rarity:"common"},{name:"Wind",rarity:"common"},
 {name:"Lurker",rarity:"uncommon"},{name:"Blood",rarity:"uncommon"},{name:"Dark",rarity:"uncommon"},
 {name:"Death",rarity:"uncommon"},{name:"Life",rarity:"uncommon"},
 {name:"Lightning",rarity:"uncommon"},{name:"Crystal",rarity:"rare"},
 {name:"Moon",rarity:"rare"},{name:"Sun",rarity:"rare"},{name:"Star",rarity:"rare"},
 {name:"Dimension",rarity:"legendary"},{name:"Void",rarity:"legendary"}
];
export function normalizedEssence(name,rarity="unknown",description=""){
 const clean=String(name??"").trim();
 if(!clean||clean.length>80)throw Error("Essence name must be 1-80 characters");
 if(!RARITIES.includes(rarity))throw Error("Unknown rarity");
 return {name:clean,rarity,description:String(description??"").trim().slice(0,600)};
}
export function mergeCatalog(builtins,custom){
 const entries=new Map();
 for(const raw of [...builtins,...custom]){
  const item=normalizedEssence(raw.name,raw.rarity,raw.description);
  entries.set(item.name.toLowerCase(),item);
 }
 return [...entries.values()].sort((a,b)=>a.name.localeCompare(b.name));
}
export function addCustomEssence(existing,input){
 const item=normalizedEssence(input.name,input.rarity,input.description);
 if(existing.some(e=>e.name.toLowerCase()===item.name.toLowerCase()))throw Error("Custom essence already exists");
 return [...existing,item];
}
export function findEssence(catalog,name){return catalog.find(e=>e.name.toLowerCase()===String(name).trim().toLowerCase());}
export function catalogOptions(catalog){return catalog.map(e=>({name:e.name,label:e.name+" ("+e.rarity+")",rarity:e.rarity}));}
export function readCatalog(){
 const custom=game.settings.get("hwfwm","customEssences");
 return mergeCatalog(STARTER_ESSENCES,custom);
}
export async function registerCustomEssence(input){
 if(!game.user.isGM)throw Error("Only the GM may add custom essences");
 const custom=game.settings.get("hwfwm","customEssences");
 await game.settings.set("hwfwm","customEssences",addCustomEssence(custom,input));
}
