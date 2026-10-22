import { questions } from "../data/questions.js";
import { questions as questionsV3 } from "../data/questions-v3.js";
import { activeAnswers, recalculate } from "../engine/questionnaire.js";

export function buildAnalysis(submission) {
  const version=String(submission.questionnaireVersion||"");
  const bank=version.startsWith("3.")?questionsV3:questions;
  const all = submission.answers || {};
  const state = recalculate(all,bank);
  const answers = activeAnswers(all, state);
  const answerRows = [];
  const unresolved = [];
  for (const screen of state.visible) for (const pane of screen.panes) {
    const answer = answers[pane.id];
    if (!answer) { unresolved.push({ id:pane.id, section:screen.section, question: pane.title, status:"unanswered", reason: "Aucune réponse enregistrée" }); continue; }
    if (answer.status === "skipped") { answerRows.push({section:screen.section,id:pane.id,question:pane.title,value:"Question facultative passée",status:"Passée",raw:answer}); continue; }
    const values = Array.isArray(answer.value) ? answer.value : [answer.value];
    if(!values.some(v=>v!==undefined&&v!==null&&v!=="")){unresolved.push({id:pane.id,section:screen.section,question:pane.title,status:"unanswered",reason:"Aucun choix enregistré"});continue;}
    const labels = values.map(v => pane.options?.find(o => o.value === v)?.label || String(v));
    const display = labels.join(", ") + (answer.otherText ? ` — ${answer.otherText}` : "") + (answer.inlineText ? ` — ${answer.inlineText}` : "");
    const otherMissing=values.includes("other")&&!String(answer.otherText||"").trim();
    answerRows.push({ section: screen.section, id:pane.id, question:pane.title, value:display, status:values.includes("to_discuss")||values.includes("meeting") ? "À clarifier" : values.includes("not_applicable") ? "Sans objet" : otherMissing ? "Autre à préciser" : values.includes("other") ? "Autre précisé" : "Réponse explicite", raw:answer });
    if (values.includes("to_discuss") || values.includes("meeting")) unresolved.push({ id:pane.id, section:screen.section, question:pane.title, status:"unresolved", reason:display });
    else if(otherMissing)unresolved.push({id:pane.id,section:screen.section,question:pane.title,status:"unresolved",reason:"La précision associée à « Autre » n’a pas encore été donnée."});
  }
  const screenIds = new Set(state.visible.map(x=>x.id));
  const resolvedIds=new Set(state.resolved.map(x=>x.screenId));
  const notAsked = bank.filter(q=>!screenIds.has(q.id)).map(q=>{const resolution=state.resolved.find(x=>x.screenId===q.id);return {question:q.title,status:resolution?"logically_derived":"not_asked_due_to_branch",reason:resolution?.reason||"Non affichée selon la branche choisie ou point réservé à un échange ultérieur",sourceQuestionId:resolution?.sourceQuestionId||null,sourceFact:resolution?.sourceFact||null};});
  const brief = [
    ["Tableau de bord","Compteurs mensuels, saisonnalité, panier moyen, prestations et heures des salariés exprimés dans la fiche."],
    ["Clients et animaux","Fiches liées, coordonnées, historique et panier moyen par client exprimés dans la fiche."],
    ["Fiche terrain","Consignes mobiles, alertes santé, alimentation, accès au domicile et clés exprimés dans la fiche."],
    ["Commandes","Saisie des commandes, quantités, prix et création de missions exprimées dans la fiche."],
    ["Planning salarié","Feuille de route mobile, adresse cartographique et alertes utiles exprimées dans la fiche."],
    ["Carte et proximité","Carte générale, recherche d’adresse et comparaison de proximité exprimées dans la fiche."],
    ["Back-office","Planning par intervenant, déplacement de missions et import exprimés dans la fiche."]
  ].map(([theme,need])=>({theme,need,status:"Exprimé dans la fiche — modalités à confirmer"}));
  const risks=[];
  if (all["keys.visibility"]?.value==="whole_team") risks.push("Accès aux codes partagé avec toute l’équipe : limiter les accès aux personnes qui en ont besoin mérite une validation.");
  if (all["geo.mode_detail"]?.value==="live") risks.push("La localisation en temps réel demande un cadrage de confidentialité, de consentement et de durée d’activation.");
  if (state.conflicts.length) risks.push("Des réponses déclarent des valeurs contradictoires pour un même fait ; elles doivent être clarifiées.");
  const recommendations=[];
  if (all["orders.entry"]?.value==="clients_and_team") recommendations.push("Cadrer séparément les commandes saisies par les clients ; cela ne confirme pas à lui seul un portail client.");
  if (all["finance.payment_scope"]?.value==="detailed") recommendations.push("Définir précisément les documents et règles comptables avant de choisir une intégration financière.");
  const dependencies=[];
  if(all["orders.entry"]?.value==="clients_and_team")dependencies.push("La saisie par les clients demande de préciser la validation avant confirmation.");
  if(all["geo.enabled"]?.value==="work_gps")dependencies.push("Le choix GPS déclenche une précision obligatoire du moment d’utilisation.");
  if(["auto","suggest"].includes(all["assignment.replacement"]?.value))dependencies.push("Une proposition ou une réaffectation de remplacement demande une règle de confirmation.");
  if(Array.isArray(all["keys.tracking"]?.value)&&all["keys.tracking"].value.includes("transfer_history"))dependencies.push("Le suivi des transferts de clés demande de préciser qui consigne la remise et le retour.");
  if(Array.isArray(all["staff.mission_actions"]?.value)&&all["staff.mission_actions"].value.includes("report"))dependencies.push("Le compte rendu de mission demande de préciser le format des notes et si des photos ou durées réelles sont utiles.");
  if(Array.isArray(all["data.sources"]?.value)&&(all["data.sources"].value.includes("several")||all["data.sources"].value.length>1))dependencies.push("Plusieurs sources de données demandent de choisir un format d’import et une règle de dédoublonnage.");
  if(Array.isArray(all["assignment.criteria"]?.value)&&all["assignment.criteria"].value.includes("availability"))dependencies.push("Une affectation selon les disponibilités demande de définir qui gère les horaires, absences et congés.");
  const priorities=all["priorities.mvp"]?.value || [];
  const selected=Array.isArray(priorities)?priorities:[];
  const labels={planning:"Planning",clients:"Fiches clients et animaux",orders:"Saisie des commandes",map:"Carte",stats:"Statistiques"};
  const ordered=selected.map(x=>labels[x]).filter(Boolean);
  const outOfScope=[
    "Règles détaillées de congés, créneaux et disponibilités des intervenants.",
    "Dédoublonnage et correction de données lors d’un import complexe.",
    "Avoirs, remboursements et politique financière en cas d’annulation.",
    "Règles spécifiques aux gardes longues : créneaux, nuitées et facturation.",
    "Durée de conservation des futures données métier et contact de confidentialité."
  ].map(question=>({question,status:"out_of_scope",reason:"À cadrer lors d’un échange complémentaire."}));
  const coverageSpecs=[
    ["Client avec plusieurs animaux et lieux",["clients.linked_pets"],["clients.multiple_addresses","orders.multiple_pets"]],
    ["18 prestations commandées et missions réalisées",["orders.admin_entry"],["orders.recurring_schedule","orders.package_tracking","dashboard.counting"]],
    ["Missions à affecter, réalisées, annulées ou reportées",["staff.daily_timeline"],["assignment.actor","staff.mission_actions","missions.cancellation"]],
    ["Absences, remplacements, chevauchements et déplacements",["staff.daily_timeline"],["assignment.conflicts","assignment.replacement","assignment.criteria","geo.metric"]],
    ["Durée prévue et temps réellement effectué",["staff.daily_timeline"],["orders.duration_tracking","staff.mission_actions"]],
    ["Alertes santé, soins et accès à la fiche en mission",["animal.mobile_profile"],["animal.care_tracking","animal.instructions_edit","keys.visibility"]],
    ["Statut, détenteur et transferts des clés",["animal.mobile_profile"],["keys.tracking","keys.visibility"]],
    ["Carte clients, recherche, kilomètres et disponibilité",["clients.map","clients.address_search","geo.client_distance_km"],["geo.enabled","assignment.criteria","geo.metric","geo.availability"]],
    ["Compteurs mensuels et panier moyen",["dashboard.monthly_counts","dashboard.staff_summary"],["dashboard.counting","dashboard.average_basket"]],
    ["Données à importer",["backoffice.import"],["data.sources","data.import_scope"]],
    ["Consultation du planning et alertes de changement",["staff.daily_timeline"],["staff.change_info","staff.notifications"]],
    ["Priorités de départ et sujets ouverts",[],["priorities.mvp","priorities.missing"]]
  ];
  const coverage=coverageSpecs.map(([requirement,factIds,questionIds])=>{
    const activeIds=questionIds.filter(id=>state.activeQuestionIds.has(id));
    const values=activeIds.map(id=>answers[id]?.value).flatMap(v=>Array.isArray(v)?v:[v]);
    const discussed=values.includes("to_discuss")||values.includes("meeting");
    const allAnswered=activeIds.length>0&&activeIds.every(id=>answers[id]&&answers[id].status!=="skipped");
    const hasBriefFact=factIds.some(id=>state.facts[id]?.status==="confirmed");
    const status=discussed?"to_discuss":allAnswered?"resolved_by_answer":hasBriefFact?"confirmed":"not_in_scope";
    return {requirement,factIds,questionIds,status};
  });
  return { questionnaireVersion:submission.questionnaireVersion||"unknown", schemaVersion:submission.schemaVersion|| (version.startsWith("3.")?3:4), status:submission.status||"draft", answers:answerRows, unresolved, notAsked, resolved:state.resolved, trace:state.trace||[], outOfScope, coverage, brief, risks, recommendations, hypotheses:[], dependencies, priorities:ordered, phaseLater:[], facts:state.facts, conflicts:state.conflicts, resolvedFacts:submission.resolvedFacts||state.facts, unresolvedDecisions:submission.unresolvedDecisions||unresolved.map(x=>x.id), traceability:[
    {requirement:"Tableau de bord mensuel et historique",factIds:["dashboard.monthly_counts","dashboard.historical_chart","dashboard.staff_summary"],questionIds:["dashboard.counting","dashboard.average_basket"]},
    {requirement:"Fiches clients reliées aux animaux",factIds:["clients.linked_pets"],questionIds:["clients.multiple_addresses","orders.multiple_pets"]},
    {requirement:"Fiche terrain avec soins et accès",factIds:["animal.mobile_profile"],questionIds:["animal.instructions_edit","animal.care_tracking","keys.tracking","keys.visibility"]},
    {requirement:"Saisie des prestations et création des missions",factIds:["orders.admin_entry"],questionIds:["orders.entry","orders.pricing_unit","orders.package_tracking","orders.recurring_schedule"]},
    {requirement:"Planning salarié mobile avec itinéraire",factIds:["staff.daily_timeline","staff.map_link"],questionIds:["staff.horizon","staff.mission_actions"]},
    {requirement:"Carte client, recherche et distance",factIds:["clients.map","clients.address_search","geo.client_distance_km"],questionIds:["geo.enabled","geo.metric","geo.availability"]},
    {requirement:"Carte et présence salarié",factIds:["staff.employee_location"],questionIds:["geo.enabled","geo.mode_detail"]},
    {requirement:"Planning par salarié, réaffectation et import",factIds:["backoffice.staff_columns","backoffice.drag_reassign","backoffice.import"],questionIds:["data.sources","data.import_scope","assignment.actor","assignment.criteria"]}
  ] };
}

export function toMarkdown(report) {
  const lines=["# Analyse des besoins — entretien de préparation","",`- Version du questionnaire : ${report.questionnaireVersion}`,`- État de la réponse : ${report.status}`,"","## Décisions recueillies",""];
  for(const section of [...new Set(report.answers.map(a=>a.section))]) { lines.push(`### ${section}`); for(const a of report.answers.filter(x=>x.section===section)) lines.push(`- **${a.question}** ${a.value} _(${a.status})_`); lines.push(""); }
  lines.push("## Besoins exprimés dans la fiche"); for(const b of report.brief) lines.push(`- **${b.theme}** — ${b.need} _${b.status}_`);
  lines.push("","## À clarifier"); if(report.unresolved.length) for(const u of report.unresolved) lines.push(`- ${u.question} : ${u.reason}`); else lines.push("- Aucun choix « à discuter » explicite dans les réponses actives.");
  lines.push("","## Décisions résolues sans question redondante"); if(report.resolved.length) for(const r of report.resolved) lines.push(`- ${r.screenId} — ${r.reason}${r.sourceQuestionId?` (source : ${r.sourceQuestionId}, fait : ${r.sourceFact})`:""}`); else lines.push("- Aucune question sautée par une décision déjà établie.");
  lines.push("","## Questions non posées selon le parcours","Les éléments ci-dessous ne constituent pas des refus."); for(const item of report.notAsked) lines.push(`- [${item.status}] ${item.question} — ${item.reason}${item.sourceQuestionId?` (source : ${item.sourceQuestionId}, fait : ${item.sourceFact})`:""}`);
  lines.push("","## Provenance des faits métier"); const facts=Object.entries(report.facts||{}); if(facts.length) for(const [id,fact] of facts) lines.push(`- **${id}** = ${JSON.stringify(fact.value)} _(${fact.origin}; source : ${fact.source}; horodatage ${fact.atTrust}${fact.at?`, ${fact.at}`:""})_`); else lines.push("- Aucun fait dérivé d’une réponse active.");
  lines.push("","## Trace des conditions"); if(report.trace?.length)for(const item of report.trace)lines.push(`- **${item.id}** — ${item.decision}; ${item.reason}${item.decision==="shown"?` Obligation : ${item.required?"oui":"non"}.`:""}`);else lines.push("- Aucune trace disponible pour cette version.");
  lines.push("","## Traçabilité des besoins vers les décisions"); if(report.traceability?.length)for(const row of report.traceability)lines.push(`- **${row.requirement}** — faits : ${row.factIds.join(", ")}; questions : ${row.questionIds.join(", ")}.`);else lines.push("- Aucune matrice disponible.");
  lines.push("","## Couverture des cas métier"); if(report.coverage?.length)for(const row of report.coverage)lines.push(`- [${row.status}] **${row.requirement}** — questions : ${row.questionIds.join(", ")}.`);else lines.push("- Aucune couverture détaillée disponible.");
  lines.push("","## Hors périmètre du questionnaire court"); for(const item of report.outOfScope) lines.push(`- [${item.status}] ${item.question} — ${item.reason}`);
  lines.push("","## Dépendances fonctionnelles à cadrer"); if(report.dependencies.length)for(const item of report.dependencies)lines.push(`- ${item}`);else lines.push("- Aucune dépendance conditionnelle déclenchée.");
  lines.push("","## Hypothèses non vérifiées"); if(report.hypotheses.length)for(const item of report.hypotheses)lines.push(`- ${item}`);else lines.push("- Aucune hypothèse métier n’a été ajoutée.");
  lines.push("","## Recommandations non validées"); if(report.recommendations.length) for(const x of report.recommendations) lines.push(`- ${x}`); else lines.push("- Aucune recommandation déduite des réponses.");
  lines.push("","## Risques et contradictions"); if(report.risks.length) for(const x of report.risks) lines.push(`- ${x}`); else lines.push("- Aucun point détecté automatiquement.");
  lines.push("","## Priorités exprimées"); lines.push(report.priorities.length?report.priorities.map(x=>`- ${x}`).join("\n"):"Aucune priorité sélectionnée dans les réponses actives.");
  lines.push("","## Phase ultérieure"); lines.push(report.phaseLater.length?report.phaseLater.map(x=>`- ${x}`).join("\n"):"Aucune fonctionnalité n’est classée en phase ultérieure sans choix explicite.");
  return lines.join("\n");
}

export function toCsv(report) {
  const answeredIds=new Set(report.answers.map(x=>x.id).filter(Boolean));
  const rows=[["Thème","Question","Réponse","État"],...report.answers.map(x=>[x.section,x.question,x.value,x.status]),...(report.unresolved||[]).filter(x=>!answeredIds.has(x.id)).map(x=>[x.section||"",x.question,x.reason,x.status]),...(report.notAsked||[]).map(x=>["",x.question,x.sourceQuestionId?`Résolue par ${x.sourceQuestionId}`:x.reason,x.status]),...(report.outOfScope||[]).map(x=>["",x.question,x.reason,x.status])];
  const cell=v=>{let s=String(v??"");if(/^[\u0000-\u0020]*[=+\-@]/.test(s))s="'"+s;return `"${s.replaceAll('"','""')}"`;};
  return "\uFEFF"+rows.map(r=>r.map(cell).join(",")).join("\r\n");
}

export function downloadExport(kind, submission) {
  const report=buildAnalysis(submission);
  const selectedQuestions=String(submission.questionnaireVersion||"").startsWith("3.")?questionsV3:questions;
  const content=kind==="json"?JSON.stringify({report,answers:activeAnswers(submission.answers||{},recalculate(submission.answers||{},selectedQuestions)),resolvedFacts:report.resolvedFacts,unresolvedDecisions:report.unresolvedDecisions},null,2):kind==="csv"?toCsv(report):toMarkdown(report);
  const type=kind==="json"?"application/json":kind==="csv"?"text/csv;charset=utf-8":"text/markdown;charset=utf-8";
  const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=kind==="markdown"?"ANALYSE_BESOINS.md":`analyse-petsitting-${String(submission.id||"reponse").slice(0,8)}.${kind}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
