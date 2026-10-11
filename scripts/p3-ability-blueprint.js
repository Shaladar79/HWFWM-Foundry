// P3 provisional Essence ability schema. This stores design intent; it does not
// assign prices, generate effects, or resolve awakening outcomes.
export const ABILITY_FIELD_SOURCES=["manual","essence","awakening-stone"];
export const ABILITY_COMPONENT_KINDS=["damage","healing","shield","boon","debuff","movement","summon","familiar","utility","custom"];
export function normalizeAbilityComponent(entry){
 if(!entry||typeof entry!=="object"||Array.isArray(entry))throw Error("Invalid ability component");
 const kind=String(entry.kind??"custom");
 if(!ABILITY_COMPONENT_KINDS.includes(kind))throw Error("Unsupported component kind");
 const source=String(entry.source??"manual");
 if(!ABILITY_FIELD_SOURCES.includes(source))throw Error("Invalid component source");
 const apCost=entry.apCost==null?null:Number(entry.apCost);
 if(apCost!==null&&(!Number.isSafeInteger(apCost)||apCost<0))throw Error("Invalid component AP cost");
 const label=String(entry.label??"").trim();
 if(label.length>120)throw Error("Component label too long");
 return {kind,label,source,apCost,configuration:entry.configuration&&typeof entry.configuration==="object"&&!Array.isArray(entry.configuration)?structuredClone(entry.configuration):{},notes:String(entry.notes??"").slice(0,1000)};
}
export function normalizeAbilityBlueprint(input={}){
 const essence={name:String(input.essence?.name??""),id:String(input.essence?.id??"")};
 const awakeningStone={name:String(input.awakeningStone?.name??""),id:String(input.awakeningStone?.id??"")};
 const components=Array.isArray(input.components)?input.components.map(normalizeAbilityComponent):[];
 if(components.length>50)throw Error("Too many ability components");
 return {schemaVersion:1,essence,awakeningStone,components,notes:String(input.notes??"").slice(0,3000)};
}
export function blueprintSummary(blueprint){
 const b=normalizeAbilityBlueprint(blueprint);
 return {components:b.components.length,pricedAP:b.components.reduce((n,c)=>n+(c.apCost??0),0),unpricedComponents:b.components.filter(c=>c.apCost===null).length};
}
