import {bondEssence,awardXP} from "./p2-tools.js";
import {ATTRIBUTES,RANKS,resolveRoll,rankDelta,spendAction} from "./rules.js";
import {advanceActorAbility,initializeEssences,advancementCost} from "./advancement.js";
export class HWFWMActorSheet extends ActorSheet{
 static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{classes:["hwfwm","sheet","actor"],template:"systems/hwfwm/templates/actor.hbs",width:1000,height:750,resizable:true,tabs:[{navSelector:".sheet-tabs",contentSelector:".sheet-body",initial:"overview"}]});}
 async getData(options){
  const data=await super.getData(options),s=this.actor.system;
  data.system=s;data.rank=s.rank??"iron";data.isEssenceUser=["character","npc"].includes(this.actor.type)&&!(this.actor.type==="npc"&&s.normal);
  const essences=this.actor.items.filter(i=>i.type==="essence");
  data.attributes=ATTRIBUTES.map(key=>({key,...(s.attributes?.[key]??{}),essence:essences.find(e=>e.system.bondedAttribute===key)?.name??"Not bonded"}));
  const multiplier=game.settings.get("hwfwm","essenceXpMultiplier");
  data.essenceGroups=ATTRIBUTES.map(key=>{const essence=essences.find(e=>e.system.bondedAttribute===key);return {key,essenceName:essence?.name??"Unassigned",essenceId:essence?.id,abilities:essence?this.actor.items.filter(i=>i.type==="ability"&&i.system.essenceId===essence.id).map(a=>({id:a.id,name:a.name,rank:a.system.rank,level:a.system.level,cost:advancementCost(a.system,{multiplier})})):[]};});
  data.hasEssences=essences.length>0;
  data.isGM=game.user.isGM;
  data.recentXP=(this.actor.getFlag("hwfwm","xpHistory")??[]).slice(-10).reverse();
  for(const g of data.essenceGroups)g.bondOptions=ATTRIBUTES.map(a=>({value:a,label:a,selected:a===g.key}));
  data.abilityItems=this.actor.items.filter(i=>i.type==="ability");
  data.skillItems=this.actor.items.filter(i=>i.type==="skill");data.talentItems=this.actor.items.filter(i=>i.type==="talent");data.equipmentItems=this.actor.items.filter(i=>i.type==="equipment");return data;
 }
 activateListeners(html){
  super.activateListeners(html);
  html.find("[data-action=setup-essences]").on("click",async()=>{try{await initializeEssences(this.actor);this.render(false);}catch(e){ui.notifications.error(e.message);}});
  html.find("[data-action=advance-ability]").on("click",async e=>{const id=e.currentTarget.dataset.id;try{const plan=await advanceActorAbility(this.actor,id);ui.notifications.info(`Ability advanced for ${plan.cost} Essence XP`);this.render(false);}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=bond-essence]").on("change",async e=>{try{await bondEssence(this.actor,e.currentTarget.dataset.id,e.currentTarget.value);this.render(false);}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=award-xp]").on("click",async e=>{try{const currency=e.currentTarget.dataset.currency;const amount=Number(html.find('[data-award-amount]').val());const reason=String(html.find('[data-award-reason]').val());await awardXP(this.actor,currency,amount,reason);this.render(false);}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=rename-essence]").on("change",async e=>{const item=this.actor.items.get(e.currentTarget.dataset.id);if(item)await item.update({name:e.currentTarget.value});});
  html.find("[data-action=rename-ability]").on("change",async e=>{const item=this.actor.items.get(e.currentTarget.dataset.id);if(item)await item.update({name:e.currentTarget.value});});
  html.find("[data-action=roll]").on("click",async e=>{const attr=e.currentTarget.dataset.attribute??"power";const tn=Number(this.actor.system.attributes?.[attr]?.tn??30);const roll=await(new Roll("1d100")).evaluate();const outcome=resolveRoll(roll.total,tn);await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`${attr.toUpperCase()} TN ${tn}% — ${outcome.successes} successes${outcome.critical?" (Critical)":""}`});});
  html.find("[data-action=combat]").on("click",()=>new HWFWMCombatPanel(this.actor).render(true));
  html.find("[data-action=rank-roll]").on("click",async e=>{const type=e.currentTarget.dataset.type??"hostile",target=game.user.targets.first()?.actor,tn=Number(this.actor.system.attributes?.power?.tn??30);const roll=await(new Roll("1d100")).evaluate(),final=tn+rankDelta(this.actor.system.rank,target?.system.rank??this.actor.system.rank,type),outcome=resolveRoll(roll.total,final);await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`${type} TN ${final}% — ${outcome.successes} successes`});});
 }
}
class HWFWMCombatPanel extends Application{
 constructor(actor,options={}){super(options);this.actor=actor;}
 static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{id:"hwfwm-combat-panel",template:"systems/hwfwm/templates/combat.hbs",title:"System Combat",width:400,height:550,resizable:true});}
 async getData(){return {actor:this.actor,system:this.actor.system,score:this.actor.getFlag("hwfwm","actionScore")??0,abilities:this.actor.items.filter(i=>i.type==="ability"&&i.system.favorite)};}
 activateListeners(html){super.activateListeners(html);html.find("[data-cost]").on("click",async e=>{const cost=Number(e.currentTarget.dataset.cost);try{const n=spendAction(Number(this.actor.getFlag("hwfwm","actionScore")??0),cost);await this.actor.setFlag("hwfwm","actionScore",n);this.render(false);}catch(err){ui.notifications.warn(err.message);}});}
}
