import { questions } from "../data/questions.js";
import { clientBriefFacts } from "../data/client-brief.js";

const valueOf = (answers, id) => answers?.[id]?.value;

export function evaluateRule(rule, answers = {}, facts = {}) {
  if (!rule || rule.op === "always") return true;
  if (rule.op === "and") return rule.rules.every(r => evaluateRule(r, answers, facts));
  if (rule.op === "or") return rule.rules.some(r => evaluateRule(r, answers, facts));
  if (rule.op === "not") return !evaluateRule(rule.rule, answers, facts);
  if (rule.op === "isKnown") return Boolean(facts[rule.fact] && facts[rule.fact].status !== "unknown" && facts[rule.fact].status !== "invalidated");
  if (rule.fact) {
    const found = facts[rule.fact]; if (!found) return false;
    if (rule.op === "eq") return found.value === rule.value;
    if (rule.op === "in") return rule.values.includes(found.value);
    return false;
  }
  const actual = valueOf(answers, rule.questionId);
  if (rule.op === "eq") return actual === rule.value;
  if (rule.op === "notEq") return actual !== undefined && actual !== rule.value;
  if (rule.op === "in") return rule.values.includes(actual);
  if (rule.op === "includes") return Array.isArray(actual) && actual.includes(rule.value);
  if (rule.op === "answered") return actual !== undefined && actual !== null && actual !== "" && answers?.[rule.questionId]?.status !== "skipped";
  return false;
}

export function shouldShow(question, facts = {}, answers = {}) {
  if (!evaluateRule(question.visibleWhen, answers, facts)) return { show:false, reason:"La condition de cette branche n’est pas satisfaite." };
  if (question.resolvedWhen && evaluateRule(question.resolvedWhen, answers, facts)) return { show:false, reason:question.reason || "Une réponse précédente a déjà établi ce point." };
  return { show:true, reason:question.visibleWhen ? "La réponse précédente active cette question." : "Question prévue pour chaque parcours." };
}

export function isRequired(question, facts = {}, answers = {}) {
  const rule = question.requiredWhen;
  if (rule) return { required:evaluateRule(rule, answers, facts), reason:evaluateRule(rule, answers, facts) ? "Une décision précédente rend cette précision nécessaire." : "Cette précision n’est pas requise dans le parcours actuel." };
  if (question.optional) return { required:false, reason:"Question facultative." };
  return { required:true, reason:"Décision nécessaire au cadrage." };
}

function putFact(facts, conflicts, key, value, questionId, status, answeredAt = null, source = "questionnaire", evidence = null, dependsOn = []) {
  const next = { value, source, status, evidence:evidence || questionId, dependsOn, origin:status === "to_discuss" ? "unresolved" : "explicit", sourceQuestionId:questionId, source:source, at:answeredAt || null, atTrust:answeredAt ? "client_asserted" : "unknown" };
  const first = facts[key];
  if (first && first.source !== "client_brief" && first.value !== value) { conflicts.push({fact:key,first,next}); return; }
  if (first?.source === "client_brief" && first.status === "confirmed" && first.value !== value) { conflicts.push({fact:key,first,next}); return; }
  facts[key] = next;
}

export function recalculate(answers = {}, bank = questions) {
  const facts = {};
  if (bank === questions) for (const [id, fact] of Object.entries(clientBriefFacts)) facts[id] = {...fact, origin:fact.status === "unknown" ? "unresolved" : "client_brief", sourceQuestionId:null, at:null, atTrust:"brief"};
  const conflicts = [], visible = [], resolved = [], trace = [], activeQuestionIds = new Set();
  for (const screen of bank) {
    const decision = shouldShow(screen, facts, answers);
    if (!decision.show) { trace.push({id:screen.id,decision:"skipped",reason:decision.reason,required:false}); if(screen.resolvedWhen&&evaluateRule(screen.resolvedWhen,answers,facts))resolved.push({screenId:screen.id,reason:decision.reason,sourceFact:screen.resolvedWhen.fact||null,sourceQuestionId:screen.resolvedWhen.fact?facts[screen.resolvedWhen.fact]?.sourceQuestionId||null:null}); continue; }
    const panes=[];
    for (const pane of screen.panes) {
      const paneDecision = shouldShow(pane, facts, answers); if (!paneDecision.show) { trace.push({id:pane.id,decision:"skipped",reason:paneDecision.reason,required:false}); continue; }
      panes.push(pane); activeQuestionIds.add(pane.id);
      const answer=answers[pane.id]; if(!answer||answer.status==="skipped") { trace.push({id:pane.id,decision:"shown",reason:paneDecision.reason,required:isRequired({...screen,...pane},facts,answers).required}); continue; }
      const selected=Array.isArray(answer.value)?answer.value:[answer.value], options=new Map((pane.options||[]).map(x=>[x.value,x]));
      for(const selectedValue of selected){
        const option=options.get(selectedValue);
        if(selectedValue==="to_discuss")putFact(facts,conflicts,`${pane.id}.decision`,null,pane.id,"to_discuss",answer.answeredAt);
        for(const [key,value] of Object.entries(option?.facts||{}))putFact(facts,conflicts,key,value,pane.id,value===null?"unknown":"confirmed",answer.answeredAt);
        for(const [key,value] of Object.entries(option?.derivedFacts||{}))putFact(facts,conflicts,key,value,pane.id,value===null?"unknown":"confirmed",answer.answeredAt,"derived",pane.id,[pane.id]);
      }
      if(pane.producesFacts){
        const option=options.get(answer.value);
        for(const [key,value] of Object.entries(pane.producesFacts)){
          const direct=option?.facts&&Object.hasOwn(option.facts,key), derived=option?.derivedFacts&&Object.hasOwn(option.derivedFacts,key);
          const fallbackValue=pane.type==="multi"?(Array.isArray(answer.value)&&answer.value.includes("to_discuss")?null:answer.value):(answer.value==="to_discuss"?null:answer.value);
          const mapped=direct?option.facts[key]:derived?option.derivedFacts[key]:(value==="unconfirmed"?value:fallbackValue);
          if(mapped!=="unconfirmed")putFact(facts,conflicts,key,mapped,pane.id,mapped===null?"to_discuss":"confirmed",answer.answeredAt,derived?"derived":"questionnaire",pane.id,derived?[pane.id]:[]);
        }
      }
      trace.push({id:pane.id,decision:"shown",reason:paneDecision.reason,required:isRequired({...screen,...pane},facts,answers).required});
    }
    if(panes.length)visible.push({...screen,panes});
    trace.push({id:screen.id,decision:panes.length?"shown":"skipped",reason:panes.length?decision.reason:"No applicable questions in this screen.",required:panes.some(p=>isRequired({...screen,...p},facts,answers).required)});
  }
  return {visible,facts,conflicts,resolved,trace,activeQuestionIds,answerCount:[...activeQuestionIds].filter(id=>answers[id]).length,total:visible.length};
}

export function validateQuestion(pane, answer) {
  if (!answer || answer.status === "skipped") return "Choisissez une réponse pour continuer.";
  if(pane.type==="number") { const raw=String(answer.value??"").trim(),number=Number(raw); if(!raw||!Number.isFinite(number))return "Saisissez un nombre valide."; if(pane.min!==undefined&&number<pane.min)return `Saisissez un nombre supérieur ou égal à ${pane.min}.`; if(pane.max!==undefined&&number>pane.max)return `Saisissez un nombre inférieur ou égal à ${pane.max}.`; return ""; }
  const values=Array.isArray(answer.value)?answer.value:[answer.value];
  if(pane.type==="multi"&&(!values.length||values.includes("")))return "Choisissez au moins une réponse.";
  if(pane.type==="multi"&&pane.maxChoices&&values.length>pane.maxChoices)return `Choisissez au maximum ${pane.maxChoices} réponses.`;
  if(pane.type==="multi"&&pane.exclusiveValues?.some(v=>values.includes(v))&&values.length>1)return "Cette option se choisit seule.";
  if(["single","yes_no"].includes(pane.type)&&!values[0])return "Choisissez une réponse.";
  if(pane.type==="text"&&!String(answer.value??"").trim())return "Saisissez une réponse.";
  if(pane.type!=="text"&&values.some(v=>!(pane.options||[]).some(o=>o.value===v)))return "Cette réponse n’est pas reconnue.";
  if(values.includes("other")&&!(answer.otherText||"").trim())return "Précisez votre réponse en quelques mots.";
  if(values.includes("other")&&String(answer.otherText||"").length>(pane.otherMax||120))return `Limitez votre précision à ${pane.otherMax||120} caractères.`;
  if(pane.inlineTextWhen&&evaluateRule(pane.inlineTextWhen,{[pane.id]:answer})&&!String(answer.inlineText||"").trim())return "Ajoutez une courte précision.";
  if(pane.inlineTextWhen&&evaluateRule(pane.inlineTextWhen,{[pane.id]:answer})&&String(answer.inlineText||"").length>(pane.inlineTextMax||120))return `Limitez votre précision à ${pane.inlineTextMax||120} caractères.`;
  if(pane.type==="text"&&pane.maxLength&&String(answer.value||"").length>pane.maxLength)return `Limitez votre réponse à ${pane.maxLength} caractères.`;
  return "";
}

function required(screen,pane,answers,facts) { const rule=pane.requiredWhen||screen.requiredWhen; return rule?evaluateRule(rule,answers,facts):!screen.optional; }
export function screenCanSkip(screen,answers={},facts={}) { return Boolean(screen.optional&&!screen.panes.some(p=>required(screen,p,answers,facts))); }
export function paneIsRequired(screen,pane,answers={},facts={}) { return required(screen,pane,answers,facts); }
export function validateVisible(answers,state=recalculate(answers)) {
  for(const screen of state.visible)for(const pane of screen.panes)if(required(screen,pane,answers,state.facts)){const error=validateQuestion(pane,answers[pane.id]);if(error)return {valid:false,questionId:pane.id,error};}
  return {valid:state.conflicts.length===0,error:state.conflicts.length?"Deux réponses expriment des choix incompatibles. Revenez les modifier ou signalez le point à discuter.":""};
}
export function getScreenValidation(screen,answers,facts={}) { for(const pane of screen.panes)if(required(screen,pane,answers,facts)){const error=validateQuestion(pane,answers[pane.id]);if(error)return {valid:false,questionId:pane.id,error};}return {valid:true}; }
export function activeAnswers(answers,state=recalculate(answers)) { const out={}; for(const id of state.activeQuestionIds)if(answers[id]!==undefined)out[id]=answers[id];return out; }
export function auditQuestionBank(bank=questions) {
  const errors=[],ids=new Set(); if(bank.length>24)errors.push(`Le questionnaire contient ${bank.length} écrans configurés; la limite est de 24.`);
  const prior=new Set();
  for(let i=0;i<bank.length;i++){const screen=bank[i];for(let j=0;j<screen.panes.length;j++){const pane=screen.panes[j];if(!pane.id)errors.push(`Identifiant manquant dans ${screen.id}.`);if(!["single","multi","yes_no","text","number"].includes(pane.type))errors.push(`Type non pris en charge dans ${pane.id}.`);if(!["text","number"].includes(pane.type)&&!pane.options?.length)errors.push(`Options manquantes dans ${pane.id}.`);if(ids.has(pane.id))errors.push(`Identifiant dupliqué : ${pane.id}`);ids.add(pane.id);const vals=new Set();for(const option of pane.options||[]){if(vals.has(option.value))errors.push(`Option dupliquée dans ${pane.id} : ${option.value}`);vals.add(option.value);}}
    const refs=[];const collect=r=>{if(!r)return;if(r.questionId)refs.push(r.questionId);(r.rules||[]).forEach(collect);if(r.rule)collect(r.rule);};collect(screen.visibleWhen);collect(screen.resolvedWhen);for(const ref of refs)if(!prior.has(ref)&&!screen.panes.some(p=>p.id===ref))errors.push(`La condition de ${screen.id} référence une question inconnue ou future : ${ref}`);
    for(const p of screen.panes){const paneRefs=[];const collectPane=r=>{if(!r)return;if(r.questionId)paneRefs.push(r.questionId);(r.rules||[]).forEach(collectPane);if(r.rule)collectPane(r.rule);};collectPane(p.visibleWhen);for(const ref of paneRefs)if(!prior.has(ref)&&!screen.panes.slice(0,screen.panes.indexOf(p)).some(x=>x.id===ref))errors.push(`La condition de ${p.id} référence une question inconnue ou future : ${ref}`);prior.add(p.id);}
  }
  return errors;
}
