import {calculateIronBuild} from "./p4-iron-rules.js";
import {saveComponentEdit} from "./p4-ability-creator.js";
import {ABILITY_COMPONENT_KINDS,ABILITY_FIELD_SOURCES} from "./p3-ability-blueprint.js";
import {recoveryIssue} from "./p3-combat-safety.js";
import {classifyCombatRequests} from "./p3-request-queue.js";
import {submitActionRequest,validateActionRequest} from "./p3-player-action-requests.js";
import {currentBattle,rollBattleRound,bankBattleAction,spendBattleAction,modifyBattleScore} from "./p3-initiative-foundry.js";
import {combatTurnState,advanceCombatTurn,startCombatRound} from "./p3-combat-sequence.js";
import {startActionScore,spendCombatAction} from "./p3-actions.js";
import {applyResourceRecovery} from "./p3-resource-operations.js";
import {buySkillTalent} from "./p3-talent-purchases.js";
import {buySpecialization} from "./p3-prerequisites.js";
import {SKILLS,grantStartingSkills} from "./p3-skill-catalog.js";
import {SAVING_THROWS,resolveSavingThrow} from "./p3-saving-throws.js";
import {resolveSkillCheck} from "./p3-skill-checks.js";
import {approveNatureEvolution,approveNatureTransformation} from "./nature-evolution.js";
import {ABILITY_TYPES,saveAbilityAP} from "./ability-ap.js";
import {applyNatureHit,resetAdaptiveResistance} from "./nature-damage-application.js";
import {rollPhysicalAttack} from "./nature-combat.js";
import {evasiveFootwork} from "./nature-effects.js";
import {purchaseEvasiveFootwork} from "./nature-talents.js";
import {NATURE_CHOICES,natureSummary,natureCheckBonus} from "./nature-catalog.js";
import {listStones,registerStone} from "./awakening-stones.js";
import {validateIdentity} from "./character-profile.js";
import {confluenceOptions} from "./confluences.js";
import {readCatalog,registerCustomEssence,catalogOptions} from "./essence-catalog.js";
import {createCharacterEssences} from "./character-setup.js";
import {updateAbility} from "./ability-editor.js";
import {bondEssence,awardXP} from "./p2-tools.js";
import {ATTRIBUTES,RANKS,resolveRoll,rankDelta,spendAction} from "./rules.js";
import {advanceActorAbility,initializeEssences,advancementCost} from "./advancement.js";
export class HWFWMActorSheet extends ActorSheet{
 static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{classes:["hwfwm","sheet","actor"],template:"systems/hwfwm/templates/actor.hbs",width:1000,height:750,resizable:true,tabs:[{navSelector:".sheet-tabs",contentSelector:".sheet-body",initial:"overview"}]});}
 async getData(options){
  const data=await super.getData(options),s=this.actor.system;
  data.system=s;data.rank=s.rank??"iron";
  data.skillTalentCost=Number(game.settings.get("hwfwm","skillTalentCost"));
  data.specializationCost=Number(game.settings.get("hwfwm","specializationTalentCost"));
  data.startingSkillsChosen=Boolean(this.actor.getFlag("hwfwm","startingSkillTalentsChosen"));
  data.startingSkillOptions=SKILLS;
  data.savingThrowOptions=Object.entries(SAVING_THROWS).map(([attribute,name])=>({attribute,name}));
  data.baseAPBudget=Number(game.settings.get("hwfwm","abilityAPBudget"));
  data.apEnabled=data.baseAPBudget>0;
  data.isRunic=s.nature==="Runic";
  data.adaptiveSubtype=String(this.actor.getFlag("hwfwm","adaptiveSubtype")??"")||"None";
  data.natureChoices=NATURE_CHOICES.map(name=>({name,selected:name===s.nature}));
  data.natureHistory=(this.actor.getFlag("hwfwm","natureEvents")??[]).slice().reverse();
  const purchased=Number(this.actor.getFlag("hwfwm","evasivePurchased")??0);
  data.evasiveTalent=evasiveFootwork(s.nature,purchased);
  data.evasiveCost=Number(game.settings.get("hwfwm","evasiveFootworkCost"));
  data.canPurchaseEvasive=data.evasiveCost>0&&data.evasiveTalent.ranks<data.evasiveTalent.maximum&&Number(s.talentXP)>=data.evasiveCost;
  data.natureGifts=natureSummary(s.nature,s.rank).gifts;data.isEssenceUser=["character","npc"].includes(this.actor.type)&&!(this.actor.type==="npc"&&s.normal);
  const essences=this.actor.items.filter(i=>i.type==="essence");
  data.attributes=ATTRIBUTES.map(key=>({key,...(s.attributes?.[key]??{}),essence:essences.find(e=>e.system.bondedAttribute===key)?.name??"Not bonded"}));
  const multiplier=game.settings.get("hwfwm","essenceXpMultiplier");
  data.essenceGroups=ATTRIBUTES.map(key=>{const essence=essences.find(e=>e.system.bondedAttribute===key);return {key,essenceName:essence?.name??"Unassigned",essenceId:essence?.id,abilities:essence?this.actor.items.filter(i=>i.type==="ability"&&i.system.essenceId===essence.id).map(a=>({id:a.id,name:a.name,rank:a.system.rank,level:a.system.level,cost:advancementCost(a.system,{multiplier}),actionCost:a.system.actionCost,manaCost:a.system.manaCost,staminaCost:a.system.staminaCost,awakeningStone:a.system.awakeningStone,favorite:a.system.favorite,blueprintNotes:a.system.blueprint?.notes??"",blueprintComponents:a.system.blueprint?.components?.length??0,componentRows:(a.system.blueprint?.components??[]).map((c,index)=>({...c,index})),apHistory:a.system.apHistory??[],ironBuild:a.system.ironBuild??null,apConfigured:a.system.apConfigured,abilityPurpose:a.system.abilityPurpose??"standard",abilityType:a.system.abilityType,apSpent:a.system.apSpent,apTypes:ABILITY_TYPES.map(t=>({value:t,selected:t===(a.system.abilityType??"other")}))})):[]};});
  data.catalogEssences=catalogOptions(readCatalog());
  data.awakeningStones=listStones();
  data.hasEssences=essences.length>0;
  data.isGM=game.user.isGM;
  data.ledger=(this.actor.getFlag("hwfwm","xpHistory")??[]).slice(-30).reverse();
  data.hasIdentity=Boolean(String(s.nature??"").trim()&&String(s.role??"").trim());
  data.recentXP=(this.actor.getFlag("hwfwm","xpHistory")??[]).slice(-10).reverse();
  for(const g of data.essenceGroups)g.bondOptions=ATTRIBUTES.map(a=>({value:a,label:a,selected:a===g.key}));
  data.p4ComponentKinds=ABILITY_COMPONENT_KINDS;
  data.p4ComponentSources=ABILITY_FIELD_SOURCES;
  data.abilityItems=this.actor.items.filter(i=>i.type==="ability");
  data.skillItems=this.actor.items.filter(i=>i.type==="skill");data.talentItems=this.actor.items.filter(i=>i.type==="talent");data.equipmentItems=this.actor.items.filter(i=>i.type==="equipment");return data;
 }
 activateListeners(html){
  super.activateListeners(html);
  html.find("[data-action=buy-evasive]").on("click",async()=>{try{await purchaseEvasiveFootwork(this.actor);this.render(false);}catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=approve-nature-evolution]").on("click",async()=>{try{
    const read=k=>String(html.find('[data-nature-event="'+k+'"]').val()??"");
    await approveNatureEvolution(this.actor,{slot:Number(read("slot")),description:read("description"),reason:read("reason")});
    ui.notifications.info("Story-approved Nature evolution recorded; mechanical changes require separate GM review.");
    this.render(false);
  }catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=approve-nature-transformation]").on("click",async()=>{try{
    const read=k=>String(html.find('[data-nature-event="'+k+'"]').val()??"");
    await approveNatureTransformation(this.actor,{next:read("next"),reason:read("reason")});
    ui.notifications.info("Exceptional Nature transformation approved and recorded.");
    this.render(false);
  }catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=select-nature]").on("change",async event=>{
    const name=event.currentTarget.value;
    if(!NATURE_CHOICES.includes(name)){ui.notifications.warn("Outworlder and custom Natures require a future GM-only workflow");return;}
    try{
      if(this.actor.system.nature&&this.actor.system.nature!==name)throw Error("Existing Natures change only through a documented GM-approved story transformation");
      await this.actor.update({"system.nature":name});this.render(false);
    }catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=save-profile]").on("click",async()=>{
    try{const nature=this.actor.system.nature,role=html.find('[data-profile="role"]').val();const clean=validateIdentity({nature,role});await this.actor.update({"system.nature":clean.nature,"system.role":clean.role});this.render(false);}catch(err){ui.notifications.warn(err.message);}
  });
  html.find("[data-action=add-custom-stone]").on("click",async()=>{const value=k=>String(html.find('[data-stone-field="'+k+'"]').val()??"");try{await registerStone({name:value("name"),rarity:value("rarity"),description:value("description")});ui.notifications.info("Awakening Stone added");this.render(false);}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=add-custom-essence]").on("click",async()=>{
    const val=k=>String(html.find('[data-catalog-field="'+k+'"]').val()??"");
    try{await registerCustomEssence({name:val("name"),rarity:val("rarity"),description:val("description")});ui.notifications.info("Custom essence added");this.render(false);}
    catch(error){ui.notifications.warn(error.message);}
  });
  const readSetup=key=>String(html.find('[data-setup="'+key+'"]').val()??"");
  const choice=html.find('[data-setup="confluenceChoice"]');
  const custom=html.find('[data-setup="confluence"]');
  const feedback=html.find('[data-confluence-feedback]');
  const updateConfluences=()=>{
    const previous=String(choice.val()??"custom");
    const options=confluenceOptions(["first","second","third"].map(readSetup));
    choice.empty().append($("<option>").val("custom").text("Custom / GM-approved"));
    for(const option of options)choice.append($("<option>").val(option.name).text(option.name+(option.restricted?" (restricted — GM approval)":"")));
    choice.val(options.some(o=>o.name===previous)?previous:"custom");
    feedback.text(options.length?options.length+" documented outcome(s) found.":"No documented match in the starter catalog; use GM-approved custom confluence.");
    custom.prop("disabled",choice.val()!=="custom");
  };
  html.find("[data-action=suggest-confluences]").on("click",updateConfluences);
  html.find('[data-setup="first"],[data-setup="second"],[data-setup="third"]').on("change",updateConfluences);
  choice.on("change",()=>custom.prop("disabled",choice.val()!=="custom"));
  updateConfluences();
  html.find("[data-action=create-character-essences]").on("click",async()=>{
    const value=k=>String(html.find('[data-setup="'+k+'"]').val()??"");
    const input={first:value("first"),second:value("second"),third:value("third"),confluence:choice.val()==="custom"?value("confluence"):String(choice.val()),firstAttribute:value("firstAttribute"),secondAttribute:value("secondAttribute"),thirdAttribute:value("thirdAttribute"),confluenceAttribute:value("confluenceAttribute")};
    try{await createCharacterEssences(this.actor,input);ui.notifications.info("Four essences and twenty slots created");this.render(false);}catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=setup-essences]").on("click",async()=>{try{await initializeEssences(this.actor);this.render(false);}catch(e){ui.notifications.error(e.message);}});
  html.find("[data-action=advance-ability]").on("click",async e=>{const id=e.currentTarget.dataset.id;try{const row=html.find('[data-editor-id="'+id+'"]');const apSpend=Number(row.find('[data-ap-field="upgrade"]').val());const plan=await advanceActorAbility(this.actor,id,{apSpend});ui.notifications.info(`Ability advanced for ${plan.cost} Essence XP`);this.render(false);}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=bond-essence]").on("change",async e=>{try{await bondEssence(this.actor,e.currentTarget.dataset.id,e.currentTarget.value);this.render(false);}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=award-xp]").on("click",async e=>{try{const currency=e.currentTarget.dataset.currency;const amount=Number(html.find('[data-award-amount]').val());const reason=String(html.find('[data-award-reason]').val());await awardXP(this.actor,currency,amount,reason);this.render(false);}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=rename-essence]").on("change",async e=>{const item=this.actor.items.get(e.currentTarget.dataset.id);if(item)await item.update({name:e.currentTarget.value});});
  html.find("[data-action=allocate-ability-ap]").on("click",async e=>{try{
   const id=e.currentTarget.dataset.id;
   const row=html.find('[data-editor-id="'+id+'"]');
   const abilityType=String(row.find('[data-ap-field="type"]').val());
   const spend=Number(row.find('[data-ap-field="spent"]').val());
   const abilityPurpose=String(row.find('[data-ap-field="purpose"]').val()??"standard");
   const plan=await saveAbilityAP(this.actor,id,{abilityType,spend,abilityPurpose});
   ui.notifications.info(`Allocated ${plan.spent} of ${plan.available} AP. Unused AP is not banked.`);
   this.render(false);
  }catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=p4-add-component]").on("click",async e=>{
   const id=e.currentTarget.dataset.id,row=html.find('[data-editor-id="'+id+'"]');
   const read=key=>row.find('[data-p4-field="'+key+'"]').val();
   try{
    const raw=String(read("apCost")??"").trim();
    await saveComponentEdit(this.actor,id,{operation:"add",component:{
     kind:read("kind"),source:read("source"),label:read("label"),
     apCost:raw===""?null:Number(raw),notes:read("notes"),scalingMode:read("scaling")
    }});
    this.render(false);
   }catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=p4-remove-component]").on("click",async e=>{
   try{await saveComponentEdit(this.actor,e.currentTarget.dataset.id,{operation:"remove",index:Number(e.currentTarget.dataset.index)});this.render(false);}
   catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=save-iron-build]").on("click",async event=>{
    const id=event.currentTarget.dataset.id;
    const ability=this.actor.items.get(id);
    const row=html.find('[data-editor-id="'+id+'"]');
    const field=key=>String(row.find('[data-iron-field="'+key+'"]').val()??"").trim();
    const parts=[];
    for(const suffix of ["1","2"]){
      const type=field("damageType"+suffix);
      if(type)parts.push({type,tier:field("damageTier"+suffix)||"minor"});
    }
    try{
      if(!ability||ability.type!=="ability")throw Error("Ability not found");
      const kind=field("kind"),effect=field("effect");
      const build={kind,damage:parts,effect,speed:field("speed"),cooldown:field("cooldown"),
        activation:kind==="shieldSpell"&&field("shieldType")==="mana"?"none":field("activation"),
        range:field("range"),weapons:field("weapons").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean),
        removalTier:field("removalTier"),durationRounds:Number(field("durationRounds")||1),
        statuses:[["status1","save1"],["status2","save2"]].filter(([e])=>field(e)!=="none").map(([e,save])=>({effect:field(e),save:field(save)})),
        shieldType:field("shieldType"),potency:field("potency")==="none"?null:field("potency"),
        regeneration:field("regeneration"),regenUpgrade:Number(field("regenUpgrade")||0),
        restoreResource:field("restoreResource"),drainResource:field("drainResource"),
        effectDamageIndex:Number(field("effectDamageIndex")||0),multiTarget:row.find('[data-iron-field="multiTarget"]').prop("checked"),
        lifeForceUnlocked:row.find('[data-iron-field="lifeForceUnlocked"]').prop("checked"),
        specialAttackAptitude:row.find('[data-iron-field="specialAttackAptitude"]').prop("checked"),
        resource:field("resource")};
      const result=calculateIronBuild(build);
      if(!result.valid)throw Error("Build exceeds Iron AP budget by "+(-result.remainingAP)+" AP");
      if(!this.actor.isOwner)throw Error("No permission to save");
      await ability.update({"system.ironBuild":{...build,summary:result}});
      ui.notifications.info(ability.name+" Iron build saved: "+result.finalAP+" / "+result.baseAP+" AP");
      this.render(false);
    }catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=save-ability]").on("click",async event=>{
    const id=event.currentTarget.dataset.id;
    const row=html.find('[data-editor-id="'+id+'"]');
    const read=key=>row.find('[data-edit-field="'+key+'"]').val();
    try{
      await updateAbility(this.actor,id,{name:read("name"),actionCost:read("actionCost"),manaCost:read("manaCost"),staminaCost:read("staminaCost"),awakeningStone:read("awakeningStone"),blueprintNotes:read("blueprintNotes"),favorite:row.find('[data-edit-field="favorite"]').prop("checked")});
      this.render(false);
    }catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=rename-ability]").on("change",async e=>{const item=this.actor.items.get(e.currentTarget.dataset.id);if(item)await item.update({name:e.currentTarget.value});});
  html.find("[data-action=grant-starting-skills]").on("click",async()=>{try{
   const names=[...html.find("[data-starting-skill]")].map(el=>String($(el).val()??""));
   await grantStartingSkills(this.actor,names);
   ui.notifications.info("Five starting Skill Talents granted");
   this.render(false);
  }catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=roll-save]").on("click",async event=>{try{
   const attribute=event.currentTarget.dataset.attribute;
   const roll=await(new Roll("1d100")).evaluate();
   const outcome=resolveSavingThrow(this.actor,attribute,roll.total);
   await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`${outcome.name}: TN ${outcome.tn}% — ${outcome.successes} successes${outcome.critical?" (Critical)":""}`});
  }catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=buy-skill-talent]").on("click",async()=>{try{
    const name=String(html.find("[data-purchase-skill]").val()??"");
    await buySkillTalent(this.actor,name);
    ui.notifications.info("Skill Talent acquired: "+name);
    this.render(false);
  }catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=buy-specialization]").on("click",async e=>{try{
   await buySpecialization(this.actor,e.currentTarget.dataset.id);
   ui.notifications.info("Skill specialization acquired");
   this.render(false);
  }catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=roll-skill]").on("click",async event=>{try{
    const item=this.actor.items.get(event.currentTarget.dataset.id);
    if(!item||item.type!=="skill")throw Error("Skill not found");
    const roll=await(new Roll("1d100")).evaluate();
    const outcome=resolveSkillCheck(this.actor,roll.total,{attribute:item.system.attribute,trained:item.system.trained,specialization:item.system.specialization});
    await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`${item.name}: TN ${outcome.tn}% — ${outcome.successes} successes${outcome.critical?" (Critical)":""}`});
  }catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=roll]").on("click",async e=>{const attr=e.currentTarget.dataset.attribute??"power";const tn=Number(this.actor.system.attributes?.[attr]?.tn??30)+natureCheckBonus(this.actor.system.nature,this.actor.system.rank,{attribute:attr});const roll=await(new Roll("1d100")).evaluate();const outcome=resolveRoll(roll.total,tn);await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`${attr.toUpperCase()} TN ${tn}% — ${outcome.successes} successes${outcome.critical?" (Critical)":""}`});});
  html.find("[data-action=reset-adaptive]").on("click",async()=>{try{await resetAdaptiveResistance(this.actor);this.render(false);}catch(error){ui.notifications.warn(error.message);}});
  html.find("[data-action=gm-recover-resource]").on("click",async()=>{try{
    const resource=String(html.find('[data-recovery-field="resource"]').val()??"");
    const amount=Number(html.find('[data-recovery-field="amount"]').val());
    const result=await applyResourceRecovery(this.actor,resource,amount);
    ui.notifications.info(`Recovered ${result.restored} ${resource}`);
    this.render(false);
   }catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=apply-nature-hit]").on("click",async()=>{try{
    const amount=Number(html.find('[data-hit-field="amount"]').val());
    const hitId=String(html.find('[data-hit-field="id"]').val()??"");
    const subtype=String(html.find('[data-hit-field="subtype"]').val()??"").trim().toLowerCase();
    const physical=Boolean(html.find('[data-hit-field="physical"]').prop("checked"));
    const ancestry=String(this.actor.system.dragonAncestry??"").toLowerCase();
    const adaptiveSubtype=String(this.actor.getFlag("hwfwm","adaptiveSubtype")??"").toLowerCase();
    const plan=await applyNatureHit(this.actor,{amount,hitId,subtype,physical,ancestry,adaptiveSubtype});
    ui.notifications.info(`Applied ${plan.reduced} damage (prevented ${plan.prevented})`);
    this.render(false);
   }catch(error){ui.notifications.warn(error.message);}
  });
  html.find("[data-action=physical-attack]").on("click",async()=>{try{const target=game.user.targets.first()?.actor;await rollPhysicalAttack(this.actor,target,{attribute:"power",attackType:"physical"});}catch(err){ui.notifications.warn(err.message);}});
  html.find("[data-action=combat]").on("click",()=>new HWFWMCombatPanel(this.actor).render(true));
  html.find("[data-action=rank-roll]").on("click",async e=>{const type=e.currentTarget.dataset.type??"hostile",target=game.user.targets.first()?.actor,tn=Number(this.actor.system.attributes?.power?.tn??30)+natureCheckBonus(this.actor.system.nature,this.actor.system.rank,{attribute:"power"});const roll=await(new Roll("1d100")).evaluate(),final=tn+rankDelta(this.actor.system.rank,target?.system.rank??this.actor.system.rank,type),outcome=resolveRoll(roll.total,final);await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`${type} TN ${final}% — ${outcome.successes} successes`});});
 }
}
class HWFWMCombatPanel extends Application{
 constructor(actor,options={}){super(options);this.actor=actor;}
 static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{id:"hwfwm-combat-panel",template:"systems/hwfwm/templates/combat.hbs",title:"System Combat",width:470,height:640,resizable:true});}
 async getData(){
  const combat=game.combats?.active??null,state=currentBattle(combat);
  const participants=state?.entries.map(e=>({...e,active:e.id===state.current}))??[];
  return {actor:this.actor,system:this.actor.system,encounter:combatTurnState(combat,this.actor),
   encounterStarted:Boolean(combat?.started),isGM:game.user.isGM,
   battleStarted:Boolean(state),battleRound:state?.round??0,battleDone:Boolean(state&&!state.current),
   resourceRecoveryIssue:recoveryIssue(combat),
   battleActors:participants,currentActor:participants.find(e=>e.active)?.name??"None",
   abilities:this.actor.items.filter(i=>i.type==="ability"&&i.system.favorite),
   myTurn:participants.some(e=>e.active&&combat.combatants.get(e.id)?.actor?.id===this.actor.id),
   myScore:participants.find(e=>combat.combatants.get(e.id)?.actor?.id===this.actor.id)?.score??null,
   pendingRequests:game.user.isGM?classifyCombatRequests(game.messages,combat,state).slice(0,15):[]};
 }
 activateListeners(html){super.activateListeners(html);
  const run=async fn=>{try{await fn();this.render(false);}catch(error){ui.notifications.warn(error.message);}};
  html.find("[data-action=start-combat]").on("click",()=>run(()=>startCombatRound(game.combats?.active)));
  html.find("[data-action=roll-round]").on("click",()=>run(()=>rollBattleRound(game.combats?.active)));
  html.find("[data-action=bank-score]").on("click",()=>run(()=>bankBattleAction(game.combats?.active)));
  html.find("[data-action=request-pass]").on("click",()=>run(()=>submitActionRequest(this.actor,{kind:"pass"})));
  html.find("[data-action=request-move]").on("click",()=>run(()=>submitActionRequest(this.actor,{kind:"move"})));
  html.find("[data-action=request-ability]").on("click",e=>run(()=>submitActionRequest(this.actor,{kind:"ability",abilityId:e.currentTarget.dataset.abilityId})));
  html.find("[data-action=dismiss-request]").on("click",e=>run(async()=>{
   if(!game.user.isGM)throw Error("GM approval required");
   const message=game.messages.get(e.currentTarget.dataset.messageId);
   if(!message?.flags?.hwfwm?.actionRequest)throw Error("Request not found");
   await message.setFlag("hwfwm","actionResolved",true);
  }));
  html.find("[data-action=approve-request]").on("click",e=>run(async()=>{
   if(!game.user.isGM)throw Error("GM approval required");
   const message=game.messages.get(e.currentTarget.dataset.messageId);
   if(!message||message.flags?.hwfwm?.actionResolved)throw Error("Request already resolved");
   const data=validateActionRequest(game.combats?.active,message);
   if(data.kind==="pass")await bankBattleAction(game.combats.active,message.id,message.flags.hwfwm.actionRequest.revision);
   else await spendBattleAction(game.combats.active,data.costs,message.id,message.flags.hwfwm.actionRequest.revision);
   await message.setFlag("hwfwm","actionResolved",true);
   ui.notifications.info("Player action approved");
  }));
  html.find("[data-action=adjust-score]").on("click",()=>run(()=>modifyBattleScore(game.combats?.active,
   String(html.find('[data-score-field="combatant"]').val()??""),
   Number(html.find('[data-score-field="delta"]').val()))));
  html.find("[data-cost]").on("click",e=>run(async()=>{
   const button=e.currentTarget,id=button.dataset.abilityId;
   const ability=id?this.actor.items.get(id):null;
   if(id&&(!ability||ability.type!=="ability"))throw Error("Ability not found");
   const combat=game.combats?.active,state=currentBattle(combat);
   if(!state?.current||combat.combatants.get(state.current)?.actor?.id!==this.actor.id)throw Error("Not your turn");
   const costs=ability?{actionCost:ability.system.actionCost,manaCost:ability.system.manaCost,staminaCost:ability.system.staminaCost}:{actionCost:Number(button.dataset.cost)};
   await spendBattleAction(combat,costs);
   ui.notifications.info("Action Score and resource costs spent; effects resolved separately");
  }));
 }
}
