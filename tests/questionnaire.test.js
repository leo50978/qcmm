import test from "node:test";
import assert from "node:assert/strict";
import { questions } from "../src/data/questions.js";
import { activeAnswers, auditQuestionBank, isRequired, recalculate, shouldShow, validateQuestion, validateVisible } from "../src/engine/questionnaire.js";
import { migrateV3Answers, migrationV3ToV4 } from "../src/data/migrations.js";
import { buildAnalysis, toCsv, toMarkdown } from "../src/services/analysis.js";
import { buildVisualSteps } from "../src/engine/visual-steps.js";

const a=(value,extra={})=>({value,...extra});
const pane=id=>questions.flatMap(s=>s.panes).find(p=>p.id===id);
const complete=(answers={})=>{
  const result={...answers};
  for(let pass=0;pass<25;pass++){
    let changed=false;const state=recalculate(result);
    for(const screen of state.visible)for(const q of screen.panes)if(!result[q.id]){
      const first=q.options?.find(o=>o.value==="to_discuss")?.value||q.options?.[0]?.value;
      result[q.id]=q.type==="multi"?a([first]):q.type==="text"?a("Précision"):a(first);changed=true;
    }
    if(!changed)break;
  }
  return result;
};

test("banque V4 sans doublon ni branche vers une question future",()=>assert.deepEqual(auditQuestionBank(),[]));
test("le parcours standard compte 18 étapes et les branches essentielles restent sous 24",()=>{
  const standard=recalculate({"orders.entry":a("team_only"),"orders.pricing_unit":a("unit"),"assignment.criteria":a(["availability"]),"assignment.replacement":a("manual"),"geo.enabled":a("no_location")});
  assert.equal(standard.visible.length,18);
  const max=recalculate({"orders.entry":a("clients_and_team"),"orders.pricing_unit":a("both"),"orders.cancellation":a(["reschedule"]),"missions.cancellation":a(["credit"]),"assignment.criteria":a(["proximity"]),"assignment.replacement":a("auto"),"geo.enabled":a("work_gps")});
  assert.ok(max.visible.length<=24);
});
test("A-B : saisie équipe seule masque portail; saisie client affiche validation requise ou à clarifier",()=>{
  assert.equal(recalculate({"orders.entry":a("team_only")}).visible.some(s=>s.id==="portal"),false);
  const state=recalculate({"orders.entry":a("clients_and_team")});const screen=state.visible.find(s=>s.id==="portal");
  assert.ok(screen);assert.equal(isRequired(screen,{},{}).required,true);
  assert.equal(validateVisible({"orders.entry":a("clients_and_team"),"orders.portal_validation":a("to_discuss")}).valid,false); // other required decisions remain unanswered
  const full=complete({"orders.entry":a("clients_and_team"),"orders.portal_validation":a("to_discuss")});assert.equal(validateVisible(full).valid,true);
});
test("C : l’acteur et les critères d’affectation sont deux faits distincts",()=>{
  const state=recalculate({"assignment.actor":a("manual"),"assignment.criteria":a(["proximity","availability"])});
  assert.equal(state.facts["assignment.actor"].value,"manager");assert.deepEqual(state.facts["assignment.criteria"].value,["proximity","availability"]);
  assert.equal(state.visible.some(s=>s.id==="assignment_role"),false);
});
test("D : validation du remplacement apparaît seulement pour une suggestion ou attribution automatique",()=>{
  assert.equal(recalculate({"assignment.replacement":a("manual")}).visible.some(s=>s.id==="replacement_detail"),false);
  assert.equal(recalculate({"assignment.replacement":a("suggest")}).visible.some(s=>s.id==="replacement_detail"),true);
});
test("E-F : pas de position salarié conserve la carte client; GPS ouvre sa précision",()=>{
  const noGps=recalculate({"geo.enabled":a("no_location")});
  assert.equal(noGps.facts["clients.map"].status,"confirmed");assert.equal(noGps.facts["geo.client_distance_km"].value,true);
  assert.equal(noGps.visible.some(s=>s.id==="gps_mode"),false);
  const gps=recalculate({"geo.enabled":a("work_gps")});assert.equal(gps.visible.some(s=>s.id==="gps_mode"),true);
  assert.equal(validateVisible(complete({"geo.enabled":a("work_gps")})).valid,true);
});
test("G : « à clarifier » et « aucun » sont exclusifs en multi-choix",()=>{
  assert.match(validateQuestion(pane("data.sources"),a(["software","to_discuss"])),/se choisit seule/);
  assert.match(validateQuestion(pane("data.sources"),a(["none","paper_messages"])),/se choisit seule/);
  assert.equal(validateQuestion(pane("data.sources"),a(["software","spreadsheets"])),"");
});
test("H-I : une branche inactive ne sort pas dans le rapport; retour restaure seulement une réponse valide",()=>{
  const first=recalculate({"geo.enabled":a("work_gps"),"geo.mode_detail":a("live")});
  assert.ok(first.activeQuestionIds.has("geo.mode_detail"));
  const changed=recalculate({"geo.enabled":a("no_location"),"geo.mode_detail":a("live")});
  assert.equal(activeAnswers({"geo.enabled":a("no_location"),"geo.mode_detail":a("live")},changed)["geo.mode_detail"],undefined);
  const report=buildAnalysis({questionnaireVersion:"4.0.0",answers:{"geo.enabled":a("no_location"),"geo.mode_detail":a("live")}});
  assert.equal(report.answers.some(row=>row.id==="geo.mode_detail"),false);
  assert.equal(validateQuestion(pane("geo.mode_detail"),a("live")),"");
});
test("J : le détail du forfait n’existe que pour unité forfaitaire",()=>{
  assert.equal(recalculate({"orders.pricing_unit":a("unit")}).visible.some(s=>s.panes.some(p=>p.id==="orders.package_tracking")),false);
  assert.equal(recalculate({"orders.pricing_unit":a("package")}).visible.find(s=>s.id==="orders").panes.some(p=>p.id==="orders.package_tracking"),true);
});
test("K : les commandes et prestations réalisées restent deux méthodes de comptage",()=>{
  const orders=recalculate({"dashboard.counting":a("ordered")}),done=recalculate({"dashboard.counting":a("completed")});
  assert.notEqual(orders.facts["dashboard.counting"].value,done.facts["dashboard.counting"].value);
});
test("L : Autre conserve sa précision et la validation la demande",()=>{
  assert.match(validateQuestion(pane("intake.channels"),a(["other"])),/Précisez/);
  assert.equal(validateQuestion(pane("intake.channels"),a(["other"],{otherText:"Réservation par téléphone"})),"");
});
test("M : une réponse complète reste validable après une reprise sérialisée",()=>{
  const draft=JSON.parse(JSON.stringify(complete({"orders.entry":a("team_only")})));
  assert.equal(validateVisible(draft).valid,true);
});
test("N : la trace motive les questions affichées et sautées; le nombre mobile respecte le plafond",()=>{
  const state=recalculate({"orders.entry":a("team_only"),"geo.enabled":a("no_location")});
  assert.ok(state.trace.some(x=>x.id==="portal"&&x.decision==="skipped"&&x.reason));
  const route=buildVisualSteps(state.visible,true);assert.equal(route.length,state.visible.length);assert.ok(route.length<=24);
});
test("migration V3 conserve les valeurs compatibles et archive les ambiguïtés",()=>{
  const migrated=migrateV3Answers({
    "orders.entry":a("clients_and_team"),
    "assignment.mode":a("combined"),
    "clients.multiple_pets":a("yes"),
    "animal.quick_info":a(["health"]),
    "staff.mission_actions":a(["view","report"]),
    "staff.notifications":a(["check_app","email"]),
    "data.sources":a(["several","software"]),
    "geo.metric":a("both")
  });
  assert.equal(migrated.answers["orders.entry"].value,"clients_and_team");
  assert.deepEqual(migrated.answers["staff.mission_actions"].value,["report"]);
  assert.deepEqual(migrated.answers["staff.notifications"].value,["email"]);
  assert.deepEqual(migrated.answers["data.sources"].value,["software"]);
  assert.equal(migrated.answers["geo.metric"].value,"travel_time");
  assert.equal(migrated.answers["assignment.actor"],undefined);
  assert.ok(migrated.archive["assignment.mode"]);assert.ok(migrated.archive["clients.multiple_pets"]);assert.equal(migrationV3ToV4.archived.includes("animal.quick_info"),true);
});
test("faits du brief ont une provenance explicite et le rapport liste les exigences",()=>{
  const report=buildAnalysis({questionnaireVersion:"4.0.0",status:"draft",answers:{}});
  assert.equal(report.facts["clients.map"].source,"client_brief");assert.equal(report.facts["clients.map"].status,"confirmed");
  assert.equal(report.facts["staff.employee_location"].status,"unknown");assert.ok(report.traceability.length>=7);
  assert.ok(report.coverage.every(x=>["confirmed","resolved_by_answer","to_discuss","not_in_scope"].includes(x.status)));
  assert.match(toMarkdown(report),/Besoins exprimés dans la fiche/);
  assert.match(toCsv({answers:[{section:"",question:"",value:"=HYPERLINK()",status:""}]}),/"'=HYPERLINK\(\)"/);
});
test("une ancienne soumission V3 est toujours interprétée avec les anciens libellés",()=>{
  const report=buildAnalysis({questionnaireVersion:"3.0.0",status:"submitted",answers:{"clients.multiple_pets":a("yes")}});
  assert.ok(report.answers.some(x=>x.id==="clients.multiple_pets"&&x.value==="Oui"));
  assert.equal(report.schemaVersion,3);
});
