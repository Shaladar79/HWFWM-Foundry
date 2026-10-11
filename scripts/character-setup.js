import {ATTRIBUTES} from "./rules.js";
export function validateEssenceSetup(input){
 const primary=[input.first,input.second,input.third].map(v=>String(v??"").trim());
 const confluence=String(input.confluence??"").trim();
 if(primary.some(v=>!v||v.length>80)||!confluence||confluence.length>80)throw Error("Enter three primary essences and a confluence");
 if(new Set(primary.map(v=>v.toLowerCase())).size!==3)throw Error("Primary essences must be distinct");
 const assignment=[input.firstAttribute,input.secondAttribute,input.thirdAttribute,input.confluenceAttribute];
 if(assignment.length!==4||new Set(assignment).size!==4||assignment.some(a=>!ATTRIBUTES.includes(a)))throw Error("Assign each essence to a different attribute");
 return {names:[...primary,confluence],assignment};
}
export async function createCharacterEssences(actor,input){
 if(!actor.isOwner||!["character","npc"].includes(actor.type)||actor.system.normal)throw Error("Invalid character or permission");
 if(!String(actor.system.nature??"").trim()||!String(actor.system.role??"").trim())throw Error("Save Nature and Role before creating essences");
 if(actor.items.some(i=>i.type==="essence"||i.type==="ability"))throw Error("This character already has essence records");
 const {names,assignment}=validateEssenceSetup(input);
 const created=await actor.createEmbeddedDocuments("Item",names.map((name,i)=>({name,type:"essence",system:{bondedAttribute:assignment[i],confluence:i===3}})));
 try {
  const slots=created.flatMap(e=>Array.from({length:5},(_,i)=>({name:e.name+" Ability "+(i+1),type:"ability",system:{essenceId:e.id,rank:"iron",level:0,blueprint:{schemaVersion:1,essence:{id:e.id,name:e.name},awakeningStone:{id:"",name:""},components:[],notes:""}}})));
  await actor.createEmbeddedDocuments("Item",slots);
 }catch(error){await actor.deleteEmbeddedDocuments("Item",created.map(i=>i.id));throw error;}
 return created;
}
