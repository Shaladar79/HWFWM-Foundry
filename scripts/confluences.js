// Curated examples from the community wiki. Not an exhaustive or mandatory confluence registry.
// Source: https://he-who-fights-with-monsters.fandom.com/wiki/Essences#Confluence_essences
export const CONFLUENCES=[
 {name:"Alchemy",primary:["Adept","Venom","Water"]},
 {name:"Action",primary:["Gun","Hand","Vehicle"]},
 {name:"Ambush",primary:["Earth","Spike","Trap"]},
 {name:"Ambush",primary:["Fire","Spider","Trap"]},
 {name:"Ambush",primary:["Iron","Thread","Trap"]},
 {name:"Ambush",primary:["Rune","Spider","Trap"]},
 {name:"Animate",primary:["Fungus","Growth","Zeal"],restricted:true},
 {name:"Animate",primary:["Bone","Death","Magic"]},
 {name:"Animate",primary:["Cloth","Dance","Magic"]},
 {name:"Anzu",primary:["Bird","Cat","Vast"]},
 {name:"Onslaught",primary:["Might","Wind","Swift"]},
 {name:"Onslaught",primary:["Might","Potent","Swift"]},
 {name:"Onslaught",primary:["Gathering","Myriad","Bow"]},
 {name:"Onslaught",primary:["Might","Potent","Vast"]},
 {name:"Mystic",primary:["Staff","Might","Magic"]},
 {name:"Mystic",primary:["Wind","Water","Adept"]},
 {name:"Mystic",primary:["Sword","Swift","Balance"]},
 {name:"Eclipse",primary:["Balance","Dark","Light"]},
 {name:"Eclipse",primary:["Balance","Moon","Sun"]},
 {name:"Eclipse",primary:["Balance","Omen","Zeal"]},
 {name:"Eclipse",primary:["Balance","Death","Life"]},
 {name:"Eclipse",primary:["Dimension","Moon","Sun"]},
 {name:"Transfiguration",primary:["Iron","Blood","Fire"]},
 {name:"Transfiguration",primary:["Growth","Hand","Bear"]},
 {name:"Transfiguration",primary:["Hunt","Moon","Wolf"]},
 {name:"Transfiguration",primary:["Balance","Ice","Fire"]},
 {name:"Transfiguration",primary:["Deer","Earth","Hammer"]}
];
export function keyOf(names){return names.map(n=>String(n).trim().toLowerCase()).sort().join("|");}
export function confluenceOptions(primaries,extra=[]){
 if(!Array.isArray(primaries)||primaries.length!==3)return [];
 const key=keyOf(primaries);
 const found=[...CONFLUENCES,...extra].filter(c=>Array.isArray(c.primary)&&keyOf(c.primary)===key);
 const byName=new Map();
 for(const c of found){const n=c.name.trim().toLowerCase();if(!byName.has(n))byName.set(n,{name:c.name,restricted:!!c.restricted});else if(c.restricted)byName.get(n).restricted=true;}
 return [...byName.values()].sort((a,b)=>a.name.localeCompare(b.name));
}
