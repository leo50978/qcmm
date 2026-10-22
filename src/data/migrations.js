import { validateQuestion } from "../engine/questionnaire.js";
import { questions } from "./questions.js";

const v4Panes = new Map(questions.flatMap(screen => screen.panes.map(pane => [pane.id, pane])));
const mapSimple = {
  "orders.entry": {team_only:"team_only",clients_and_team:"clients_and_team",to_discuss:"to_discuss"},
  "animal.instructions_edit": {manager_only:"manager_only",manager_staff:"manager_staff",to_discuss:"to_discuss"},
  "animal.care_tracking": {instructions:"instructions",confirm:"confirm",not_applicable:"not_applicable",to_discuss:"to_discuss"},
  "keys.tracking": {location:"location",holder:"holder",transfer_history:"transfer_history",other:"other",to_discuss:"to_discuss"},
  "keys.visibility": {assigned_staff:"assigned_staff",whole_team:"whole_team",to_discuss:"to_discuss"},
  "orders.pricing_unit": {unit:"unit",package:"package",both:"both",other:"other",to_discuss:"to_discuss"},
  "orders.recurring_schedule": {manual:"manual",repeating_days:"repeating_days",both:"both",to_discuss:"to_discuss"},
  "finance.pricing": {by_service:"by_service",by_duration:"by_duration",custom:"custom",combined:"combined",to_discuss:"to_discuss"},
  "finance.payment_scope": {none:"none",status:"status",detailed:"detailed",to_discuss:"to_discuss"},
  "assignment.conflicts": {block:"block",warn:"warn",to_discuss:"to_discuss"},
  "assignment.replacement": {manual:"manual",suggest:"suggest",auto:"auto",to_discuss:"to_discuss"},
  "assignment.replacement_approval": {manager:"manager",automatic:"automatic",to_discuss:"to_discuss"},
  "staff.horizon": {today:"today",week:"week",both:"both",to_discuss:"to_discuss"},
  "geo.enabled": {reference_address:"reference_address",declared_position:"declared_position",work_gps:"work_gps",no_location:"no_location",to_discuss:"to_discuss"},
  "geo.mode_detail": {on_demand:"on_demand",during_visit:"during_visit",live:"live",to_discuss:"to_discuss"},
  "geo.availability": {hide:"hide",show_busy:"show_busy",warn:"warn",to_discuss:"to_discuss"},
  "dashboard.counting": {ordered:"ordered",completed:"completed",separate:"separate",to_discuss:"to_discuss"},
  "dashboard.average_basket": {per_order:"per_order",per_service:"per_service",both:"both",to_discuss:"to_discuss"},
  "priorities.missing": {no:"no",yes:"yes",meeting:"meeting"}
};
const validAnswer = (id, answer) => !validateQuestion(v4Panes.get(id), answer);

/** Migrate a V3 draft conservatively. Unmappable choices are preserved in archive, never reinterpreted. */
export function migrateV3Answers(input = {}) {
  const answers = {}, archive = {}, notes = [];
  const keep = (id, answer) => { if (v4Panes.has(id) && validAnswer(id, answer)) answers[id] = answer; else archive[id] = answer; };
  for (const [id, answer] of Object.entries(input)) {
    if (!answer || answer.status === "skipped") { if (v4Panes.has(id)) keep(id, answer); else archive[id] = answer; continue; }
    if (id === "clients.multiple_pets" || id === "animal.quick_info" || id === "assignment.final_decider" || id === "orders.multiple_pets") { archive[id] = answer; continue; }
    if (id === "assignment.mode") {
      const mode = answer.value;
      const actor = mode === "manual" ? "manual" : mode === "to_discuss" ? "to_discuss" : null;
      if (actor) keep("assignment.actor", {value:actor, migratedFrom:id});
      else archive[id] = answer;
      const criterion = {availability:"availability",proximity:"proximity",familiarity:"familiarity"}[mode];
      if (criterion) keep("assignment.criteria", {value:[criterion],migratedFrom:id});
      if (mode === "combined") notes.push("L’ancien choix d’affectation combinée a été archivé, car il ne permet pas de séparer acteur et critères.");
      continue;
    }
    if (id === "missions.cancellation") {
      const map={cancel_history:"cancel_history",reschedule:"reschedule",credit:"credit",to_discuss:"to_discuss"};
      if(map[answer.value])keep(id,{...answer,value:[map[answer.value]]}); else archive[id]=answer;
      continue;
    }
    if (id === "staff.mission_actions") {
      const values=(Array.isArray(answer.value)?answer.value:[answer.value]).filter(x=>x!=="view");
      if(values.length)keep(id,{...answer,value:values}); else archive[id]=answer;
      continue;
    }
    if (id === "staff.notifications") {
      const values=(Array.isArray(answer.value)?answer.value:[answer.value]).filter(x=>x!=="check_app");
      if(values.length)keep(id,{...answer,value:values}); else archive[id]=answer;
      continue;
    }
    if (id === "data.sources") {
      const values=(Array.isArray(answer.value)?answer.value:[answer.value]).filter(x=>x!=="several");
      if(values.length)keep(id,{...answer,value:values}); else archive[id]=answer;
      continue;
    }
    if (id === "geo.metric") {
      const value=answer.value==="both"?"travel_time":answer.value;
      keep(id,{...answer,value}); if(answer.value==="both")notes.push("L’ancienne option « les deux » conserve le temps; les kilomètres sont déjà prévus par la fiche.");
      continue;
    }
    if (mapSimple[id]) {
      const mapped=mapSimple[id][answer.value]; if(mapped)keep(id,{...answer,value:mapped}); else archive[id]=answer;
      continue;
    }
    keep(id,answer);
  }
  if (archive["assignment.final_decider"]) notes.push("L’ancienne décision de validation d’affectation est archivée; le choix de l’acteur est maintenant distinct.");
  return {answers,archive,notes,schemaVersion:4};
}

export const migrationV3ToV4 = Object.freeze({
  preserved:"Identifiants et valeurs sémantiquement compatibles conservés, après validation V4.",
  transformed:{
    "assignment.mode":"manual → assignment.actor=manual; disponibilité/proximité/familiarité → critère correspondant; combined archivé sans inférence.",
    "missions.cancellation":"Les choix ponctuels sont convertis en liste multi-choix; several est archivé.",
    "staff.mission_actions":"view retiré (consultation déjà acquise); autres actions conservées.",
    "staff.notifications":"check_app retiré de la liste d’alertes; les canaux choisis sont conservés, et le mode de consultation reste à décider.",
    "data.sources":"several retiré; les sources réellement cochées sont conservées.",
    "geo.metric":"both devient travel_time; les kilomètres sont déjà confirmés par la fiche."
  },
  archived:["clients.multiple_pets","animal.quick_info","assignment.final_decider","assignment.mode=combined","missions.cancellation=several","Réponse devenue invalide selon les options V4"]
});
