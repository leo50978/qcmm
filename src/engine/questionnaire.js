import { questions } from "../data/questions.js";

const valueOf = (answers, id) => answers?.[id]?.value;

export function evaluateRule(rule, answers = {}, facts = {}) {
  if (!rule || rule.op === "always") return true;
  if (rule.op === "and") return rule.rules.every(r => evaluateRule(r, answers, facts));
  if (rule.op === "or") return rule.rules.some(r => evaluateRule(r, answers, facts));
  if (rule.op === "not") return !evaluateRule(rule.rule, answers, facts);
  if (rule.op === "isKnown") return Object.hasOwn(facts, rule.fact) && facts[rule.fact].value !== null;
  if (rule.fact) {
    const found = facts[rule.fact];
    if (!found) return false;
    if (rule.op === "eq") return found.value === rule.value;
    if (rule.op === "in") return rule.values.includes(found.value);
    return false;
  }
  const actual = valueOf(answers, rule.questionId);
  if (rule.op === "eq") return actual === rule.value;
  if (rule.op === "notEq") return actual !== undefined && actual !== rule.value;
  if (rule.op === "in") return rule.values.includes(actual);
  if (rule.op === "includes") return Array.isArray(actual) && actual.includes(rule.value);
  if (rule.op === "answered") return actual !== undefined && actual !== null && actual !== "";
  return false;
}

function addFact(facts, conflicts, key, value, questionId, origin=value===null?"unresolved":"logically_derived", answeredAt=null) {
  const next = { value, origin, source: questionId, at: answeredAt || null, atTrust: answeredAt ? "client_asserted" : "unknown" };
  if (facts[key] && facts[key].value !== value) {
    conflicts.push({ fact: key, first: facts[key], next });
    return;
  }
  if(facts[key]){
    if(origin==="explicit"&&facts[key].origin!=="explicit")facts[key]=next;
    return;
  }
  facts[key] = next;
}

export function recalculate(answers = {}, bank = questions) {
  const facts = {};
  const conflicts = [];
  const visible = [];
  const resolved = [];
  const activeQuestionIds = new Set();

  // Questions are topologically ordered: a branch may only depend on earlier answers.
  for (const screen of bank) {
    if (!evaluateRule(screen.visibleWhen, answers, facts)) continue;
    if (screen.resolvedWhen && evaluateRule(screen.resolvedWhen, answers, facts)) {
      const resolvingFact=screen.resolvedWhen.fact;
      resolved.push({ screenId: screen.id, reason: screen.reason || "Les faits nécessaires sont déjà établis.", sourceFact:resolvingFact||null, sourceQuestionId:resolvingFact?facts[resolvingFact]?.source||null:null });
      continue;
    }
    const panes = [];
    for (const pane of screen.panes) {
      if (!evaluateRule(pane.visibleWhen, answers, facts)) continue;
      panes.push(pane);
      activeQuestionIds.add(pane.id);
      const answer = answers[pane.id];
      if (!answer || answer.status === "skipped") continue;
      const selected = Array.isArray(answer.value) ? answer.value : [answer.value];
      const optionByValue = new Map((pane.options || []).map(x => [x.value, x]));
      for (const selectedValue of selected) {
        const option = optionByValue.get(selectedValue);
        if (selectedValue === "to_discuss") addFact(facts, conflicts, `${pane.id}.decision`, null, pane.id, "unresolved", answer.answeredAt);
        if (option?.facts) for (const [key, value] of Object.entries(option.facts)) addFact(facts, conflicts, key, value, pane.id, value===null?"unresolved":"explicit", answer.answeredAt);
        if (option?.derivedFacts) for (const [key, value] of Object.entries(option.derivedFacts)) addFact(facts, conflicts, key, value, pane.id, value===null?"unresolved":"logically_derived", answer.answeredAt);
      }
      if (pane.producesFacts) {
        for (const [key, value] of Object.entries(pane.producesFacts)) {
          const selectedOption = optionByValue.get(answer.value);
          const direct=selectedOption?.facts&&Object.hasOwn(selectedOption.facts,key);
          const derived=selectedOption?.derivedFacts&&Object.hasOwn(selectedOption.derivedFacts,key);
          const mapped = direct ? selectedOption.facts[key] : derived ? selectedOption.derivedFacts[key] : value;
          if (mapped !== "unconfirmed") addFact(facts, conflicts, key, mapped, pane.id,direct?(mapped===null?"unresolved":"explicit"):mapped===null?"unresolved":"logically_derived",answer.answeredAt);
        }
      }
    }
    if (panes.length) visible.push({ ...screen, panes });
  }
  const answerCount = [...activeQuestionIds].filter(id => answers[id]).length;
  const resolvedCount = resolved.length;
  return { visible, facts, conflicts, resolved, activeQuestionIds, answerCount, total: visible.length };
}

export function validateQuestion(pane, answer) {
  if (!answer || answer.status === "skipped") return "Choisissez une réponse pour continuer.";
  if(pane.type==="number"){
    const raw=String(answer.value??"").trim(),number=Number(raw);
    if(!raw||!Number.isFinite(number))return "Saisissez un nombre valide.";
    if(pane.min!==undefined&&number<pane.min)return `Saisissez un nombre supérieur ou égal à ${pane.min}.`;
    if(pane.max!==undefined&&number>pane.max)return `Saisissez un nombre inférieur ou égal à ${pane.max}.`;
    return "";
  }
  const values = Array.isArray(answer.value) ? answer.value : [answer.value];
  if (pane.type === "multi" && (!values.length || values.includes(""))) return "Choisissez au moins une réponse.";
  if (pane.type === "multi" && pane.maxChoices && values.length > pane.maxChoices) return `Choisissez au maximum ${pane.maxChoices} réponses.`;
  if (["single", "yes_no"].includes(pane.type) && !values[0]) return "Choisissez une réponse.";
  if(pane.type==="text"&&!String(answer.value??"").trim())return "Saisissez une réponse.";
  if (pane.type !== "text" && values.some(v => !(pane.options || []).some(o => o.value === v))) return "Cette réponse n’est pas reconnue.";
  if (values.includes("other") && !(answer.otherText || "").trim()) return "Précisez votre réponse en quelques mots.";
  if (values.includes("other") && String(answer.otherText||"").length > (pane.otherMax||120)) return `Limitez votre précision à ${pane.otherMax||120} caractères.`;
  if (pane.inlineTextWhen && evaluateRule(pane.inlineTextWhen, { [pane.id]: answer }) && String(answer.inlineText||"").length > (pane.inlineTextMax||120)) return `Limitez votre précision à ${pane.inlineTextMax||120} caractères.`;
  if (pane.type === "text" && pane.maxLength && String(answer.value || "").length > pane.maxLength) return `Limitez votre réponse à ${pane.maxLength} caractères.`;
  return "";
}

function isRequired(screen, pane, answers, facts) {
  const rule=pane.requiredWhen||screen.requiredWhen;
  return rule ? evaluateRule(rule,answers,facts) : !screen.optional;
}

export function screenCanSkip(screen, answers={}, facts={}) {
  return Boolean(screen.optional && !screen.panes.some(pane=>isRequired(screen,pane,answers,facts)));
}

export function paneIsRequired(screen,pane,answers={},facts={}) {
  return isRequired(screen,pane,answers,facts);
}

export function validateVisible(answers, state = recalculate(answers)) {
  for (const screen of state.visible) {
    for (const pane of screen.panes) {
      if (!isRequired(screen,pane,answers,state.facts)) continue;
      const error = validateQuestion(pane, answers[pane.id]);
      if (error) return { valid: false, questionId: pane.id, error };
    }
  }
  return { valid: state.conflicts.length === 0, error: state.conflicts.length ? "Deux réponses expriment des décisions incompatibles. Revenez modifier l’une d’elles ou signalez le point à discuter." : "" };
}

export function getScreenValidation(screen, answers, facts = {}) {
  for (const pane of screen.panes) {
    if (!isRequired(screen,pane,answers,facts)) continue;
    const error = validateQuestion(pane, answers[pane.id]);
    if (error) return { valid: false, questionId: pane.id, error };
  }
  return { valid: true };
}

export function activeAnswers(answers, state = recalculate(answers)) {
  const out = {};
  for (const id of state.activeQuestionIds) if (answers[id] !== undefined) out[id] = answers[id];
  return out;
}

export function auditQuestionBank(bank = questions) {
  const errors = [];
  const ids = new Set();
  if(bank.length>24)errors.push(`Le questionnaire contient ${bank.length} écrans configurés; la limite est de 24.`);
  for (let i = 0; i < bank.length; i++) {
    const screen = bank[i];
    for (const pane of screen.panes) {
      if(typeof pane.id!=="string"||!pane.id.trim())errors.push(`Identifiant de question manquant dans ${screen.id}.`);
      if(!["single","multi","yes_no","text","number"].includes(pane.type))errors.push(`Type de question non pris en charge dans ${pane.id} : ${pane.type}`);
      if(!["text","number"].includes(pane.type)&&(!Array.isArray(pane.options)||pane.options.length===0))errors.push(`Options manquantes dans ${pane.id}.`);
      if (ids.has(pane.id)) errors.push(`Identifiant dupliqué : ${pane.id}`);
      ids.add(pane.id);
      const values = new Set();
      for (const option of pane.options || []) {
        if(typeof option.value!=="string"||!option.value.trim()||typeof option.label!=="string"||!option.label.trim())errors.push(`Valeur ou libellé invalide dans ${pane.id}.`);
        if (values.has(option.value)) errors.push(`Option dupliquée dans ${pane.id} : ${option.value}`);
        values.add(option.value);
      }
    }
    function collect(r, refs=[]) { if (!r) return refs; if (r.questionId) refs.push(r.questionId); for (const child of r.rules || []) collect(child,refs); if (r.rule) collect(r.rule,refs); return refs; }
    function collectFacts(r, refs=[]) { if (!r) return refs; if (r.fact) refs.push(r.fact); for (const child of r.rules || []) collectFacts(child,refs); if (r.rule) collectFacts(r.rule,refs); return refs; }
    const priorScreenIds=new Set(bank.slice(0,i).flatMap(s=>s.panes.map(p=>p.id)));
    for(const ref of [...collect(screen.visibleWhen),...collect(screen.resolvedWhen),...collect(screen.requiredWhen)]) if(!priorScreenIds.has(ref)) errors.push(`La condition de ${screen.id} doit dépendre d’une question précédente : ${ref}`);
    const priorFacts=new Set(bank.slice(0,i).flatMap(s=>s.panes.flatMap(p=>[...Object.keys(p.producesFacts||{}),...(p.options||[]).flatMap(o=>[...Object.keys(o.facts||{}),...Object.keys(o.derivedFacts||{})])])));
    for(const fact of [...collectFacts(screen.visibleWhen),...collectFacts(screen.resolvedWhen),...collectFacts(screen.requiredWhen)]) if(!priorFacts.has(fact)) errors.push(`Le fait de la condition de ${screen.id} doit être produit auparavant : ${fact}`);
    for(let paneIndex=0;paneIndex<screen.panes.length;paneIndex++) for(const ref of [...collect(screen.panes[paneIndex].visibleWhen),...collect(screen.panes[paneIndex].requiredWhen)]) {
      const found=priorScreenIds.has(ref)||screen.panes.slice(0,paneIndex).some(p=>p.id===ref);
      if(!found)errors.push(`La condition de ${screen.panes[paneIndex].id} doit dépendre d’une question précédente : ${ref}`);
    }
    for(let paneIndex=0;paneIndex<screen.panes.length;paneIndex++) for(const fact of [...collectFacts(screen.panes[paneIndex].visibleWhen),...collectFacts(screen.panes[paneIndex].requiredWhen)]) {
      if(!priorFacts.has(fact))errors.push(`Le fait de la condition de ${screen.panes[paneIndex].id} doit être produit auparavant : ${fact}`);
    }
  }
  return errors;
}
