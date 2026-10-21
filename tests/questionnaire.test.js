import test from "node:test";
import assert from "node:assert/strict";
import { questions } from "../src/data/questions.js";
import { activeAnswers, auditQuestionBank, getScreenValidation, recalculate, screenCanSkip, validateQuestion, validateVisible } from "../src/engine/questionnaire.js";
import { buildAnalysis, toCsv, toMarkdown } from "../src/services/analysis.js";

const a=(value,extra={})=>({value,...extra});
const pane=id=>questions.flatMap(s=>s.panes).find(p=>p.id===id);

test("banque sans identifiants/options dupliqués ni références de branche invalides",()=>assert.deepEqual(auditQuestionBank(),[]));
test("GPS désactivé masque le détail et l'exclut du rapport actif",()=>{
  const answers={"geo.enabled":a("no_location"),"geo.mode_detail":a("live")};const state=recalculate(answers);
  assert.equal(state.visible.some(s=>s.id==="gps_mode"),false);assert.equal(activeAnswers(answers,state)["geo.mode_detail"],undefined);
  const report=buildAnalysis({questionnaireVersion:"3.0.0",status:"incomplete",answers});assert.equal(report.answers.some(x=>x.id==="geo.mode_detail"),false);
});
test("GPS demandé affiche une précision obligatoire",()=>{
  const answers={"geo.enabled":a("work_gps")};const state=recalculate(answers);const screen=state.visible.find(s=>s.id==="gps_mode");
  assert.ok(screen);assert.equal(screen.optional,undefined);assert.match(validateQuestion(pane("geo.mode_detail"),undefined),/Choisissez/);assert.equal(validateVisible(answers,state).valid,false);
});
test("GPS à discuter ne force pas une précision GPS",()=>{
  const state=recalculate({"geo.enabled":a("to_discuss")});assert.equal(state.visible.some(s=>s.id==="gps_mode"),false);
  assert.ok(state.visible.some(s=>s.panes.some(p=>p.id==="geo.enabled")));assert.equal(state.facts["geo.enabled"].origin,"unresolved");
});
test("un changement de GPS retire le choix enfant du rapport sans effacer le brouillon source",()=>{
  const answers={"geo.enabled":a("no_location"),"geo.mode_detail":a("live")};const state=recalculate(answers);
  assert.equal(answers["geo.mode_detail"].value,"live");assert.equal("geo.mode_detail" in activeAnswers(answers,state),false);
});
test("attribution manuelle résout la confirmation redondante avec sa provenance",()=>{
  const state=recalculate({"assignment.mode":a("manual")});
  assert.equal(state.visible.some(s=>s.id==="assignment_role"),false);
  assert.ok(state.resolved.some(x=>x.screenId==="assignment_role"));
  assert.equal(state.facts["assignment.mode"].source,"assignment.mode");
  assert.equal(state.resolved.find(x=>x.screenId==="assignment_role").sourceQuestionId,"assignment.mode");
});
test("les faits et leurs horodatages de réponse sont stables au recalcul",()=>{
  const answers={"assignment.mode":a("manual",{answeredAt:"2026-10-21T12:00:00.000Z"})};
  const first=recalculate(answers),second=recalculate(answers);
  assert.deepEqual(first.facts,second.facts);
  assert.equal(first.facts["assignment.mode"].at,"2026-10-21T12:00:00.000Z");
  assert.equal(first.facts["assignment.mode"].atTrust,"client_asserted");
});
test("le second volet GPS reste séparé et n'apparaît qu'après une réponse pertinente",()=>{
  const hidden=recalculate({"geo.enabled":a("no_location")});assert.equal(hidden.visible.find(s=>s.id==="geo").panes.some(p=>p.id==="geo.metric"),false);
  const shown=recalculate({"geo.enabled":a("reference_address")});assert.equal(shown.visible.find(s=>s.id==="geo").panes.some(p=>p.id==="geo.metric"),true);
  assert.equal(getScreenValidation(shown.visible.find(s=>s.id==="geo"),{"geo.enabled":a("reference_address")},shown.facts).valid,false);
  assert.equal(getScreenValidation(shown.visible.find(s=>s.id==="geo"),{"geo.enabled":a("reference_address"),"geo.metric":a("to_discuss")},shown.facts).valid,true);
});
test("un conflit de faits est remonté sans écrasement silencieux",()=>{
  const bank=[{id:"one",panes:[{id:"one.answer",type:"single",options:[{value:"a",facts:{"shared.fact":"a"}}],producesFacts:{}}]},{id:"two",panes:[{id:"two.answer",type:"single",options:[{value:"b",facts:{"shared.fact":"b"}}],producesFacts:{}}]}];
  const state=recalculate({"one.answer":a("a"),"two.answer":a("b")},bank);
  assert.equal(state.conflicts.length,1);assert.equal(state.facts["shared.fact"].value,"a");
});
test("les réponses requises sont bloquées tandis que « à discuter » est une réponse valide",()=>{
  assert.match(validateQuestion(pane("geo.enabled"),null),/Choisissez/);
  assert.equal(validateQuestion(pane("geo.enabled"),a("to_discuss")),"");
});
test("une précision conditionnelle requise ne peut pas être passée",()=>{
  const screen={optional:true,panes:[{id:"detail.answer",type:"single",options:[{value:"yes",label:"Oui"} ],requiredWhen:{op:"eq",questionId:"parent.answer",value:"yes"}}]};
  const answers={"parent.answer":a("yes")};
  assert.equal(screenCanSkip(screen,answers),false);
  assert.equal(getScreenValidation(screen,answers).valid,false);
  assert.equal(screenCanSkip(screen,{"parent.answer":a("no")}),true);
});
test("les parcours minimal, courant et maximal restent sous 24 écrans",()=>{
  const minimal=recalculate({});assert.ok(minimal.visible.length<=24);
  const typical=recalculate({"animal.quick_info":a(["food"]),"geo.enabled":a("no_location"),"finance.payment_scope":a("none"),"orders.entry":a("clients_and_team"),"assignment.mode":a("manual")});assert.ok(typical.visible.length>=12&&typical.visible.length<=18);
  const maximal=recalculate({"orders.entry":a("clients_and_team"),"animal.quick_info":a(["health"]),"geo.enabled":a("work_gps"),"geo.metric":a("both"),"finance.payment_scope":a("detailed"),"assignment.replacement":a("auto"),"assignment.mode":a("combined")});assert.ok(maximal.visible.length<=24);assert.equal(maximal.visible.length,22);
});
test("une soumission complète exige les étapes requises visibles",()=>{
  const state=recalculate({"geo.enabled":a("no_location")});const result=validateVisible({"geo.enabled":a("no_location")},state);assert.equal(result.valid,false);
  const complete={"geo.enabled":a("no_location")};for(let pass=0;pass<25;pass++){let changed=false;for(const screen of recalculate(complete).visible)for(const q of screen.panes)if(!complete[q.id]){if(q.type==="multi")complete[q.id]=a([q.options.find(o=>o.value==="to_discuss")?.value||q.options[0].value]);else if(q.type==="text")complete[q.id]=a("Exemple");else complete[q.id]=a(q.options.find(o=>o.value==="to_discuss")?.value||q.options[0].value);changed=true;}if(!changed)break;}
  assert.equal(validateVisible(complete).valid,true);
});
test("une option Autre requiert sa précision courte",()=>{assert.match(validateQuestion(pane("orders.pricing_unit"),a("other")),/Précisez/);assert.equal(validateQuestion(pane("orders.pricing_unit"),a("other",{otherText:"Sur devis"})),"");});
test("les questions texte et numériques contrôlent le contenu et les bornes",()=>{
  const q={id:"count",type:"number",min:1,max:10};
  assert.equal(validateQuestion(q,a("3")),"");
  assert.match(validateQuestion(q,a("0")),/supérieur ou égal/);
  assert.match(validateQuestion(q,a("abc")),/nombre valide/);
  assert.match(validateQuestion({id:"note",type:"text",maxLength:5},a(" ")),/Saisissez/);
  assert.match(validateQuestion({id:"note",type:"text",maxLength:5},a("123456")),/caractères/);
});
test("les versions de données sont compatibles avec la reprise d'une session",()=>{
  const answers={"orders.entry":a("clients_and_team")};const restored=JSON.parse(JSON.stringify(answers));
  assert.deepEqual(recalculate(restored).visible.map(s=>s.id),recalculate(answers).visible.map(s=>s.id));
});
test("réponses passées, sans objet et à discuter restent distinctes dans le rapport",()=>{
  const report=buildAnalysis({questionnaireVersion:"3.0.0",status:"incomplete",answers:{"animal.quick_info":a(["health"]),"animal.care_tracking":a("not_applicable"),"orders.entry":a("clients_and_team"),"orders.portal_validation":{status:"skipped"},"orders.multiple_pets":a([]),"orders.pricing_unit":a("other"),"geo.enabled":a("to_discuss")}});
  assert.ok(report.answers.some(x=>x.status==="Sans objet"));
  assert.ok(report.answers.some(x=>x.status==="Passée"));
  assert.ok(report.answers.some(x=>x.status==="À clarifier"));
  assert.ok(report.answers.some(x=>x.status==="Autre à préciser"));
  assert.ok(report.unresolved.some(x=>x.id==="orders.multiple_pets"&&x.status==="unanswered"));
  assert.ok(report.unresolved.some(x=>x.status==="unanswered"));
});
test("les exports d’analyse gardent les accents et neutralisent les formules CSV",()=>{
  const report=buildAnalysis({questionnaireVersion:"3.0.0",status:"submitted",answers:{"intake.channels":a(["other"],{otherText:"=HYPERLINK(\"bad\")"})}});
  assert.match(toMarkdown(report),/Fiche terrain/);assert.match(toCsv({answers:[{section:"",question:"",value:"=HYPERLINK()",status:""}]}),/"'=HYPERLINK\(\)"/);assert.match(toCsv({answers:[{section:"",question:"",value:" =1+1",status:""}]}),/"' =1\+1"/);
});
