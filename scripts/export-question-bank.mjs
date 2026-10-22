import { writeFile } from "node:fs/promises";
import { questions } from "../src/data/questions.js";
const typeLabel={single:"Choix unique",multi:"Choix multiples",text:"Texte libre",number:"Nombre",yes_no:"Oui / non"};
const lines=["# Questionnaire V4 — questions et choix affichés","","Liste générée depuis `src/data/questions.js`. Les options ci-dessous sont les réponses proposées dans le site; elles ne sont pas des réponses déjà fournies par la responsable.",""];
for(const [index,screen] of questions.entries()){
  lines.push(`## ${String(index+1).padStart(2,"0")}. ${screen.section} — ${screen.title}`);
  if(screen.help)lines.push(`_${screen.help}_`);
  if(screen.optional)lines.push("**Facultatif.**");
  if(screen.visibleWhen)lines.push(`**Affichage conditionnel :** \`${JSON.stringify(screen.visibleWhen)}\``);
  if(screen.reason)lines.push(`**Pourquoi :** ${screen.reason}`);
  lines.push("");
  for(const pane of screen.panes){
    lines.push(`### ${pane.title}`,`- Type : ${typeLabel[pane.type]||pane.type}.`,`- Identifiant : \`${pane.id}\`.`);
    if(pane.visibleWhen)lines.push(`- Affichage conditionnel : \`${JSON.stringify(pane.visibleWhen)}\`.`);
    if(pane.maxChoices)lines.push(`- Maximum : ${pane.maxChoices} choix.`);
    if(pane.options)for(const option of pane.options)lines.push(`- ${option.label} (\`${option.value}\`)`);
    if(pane.options?.some(o=>o.value==="other"))lines.push(`- Précision demandée si « Autre » : ${pane.otherMax||120} caractères maximum.`);
    if(pane.inlineTextWhen)lines.push(`- Texte affiché si la condition est satisfaite : « ${pane.inlineTextLabel} » (${pane.inlineTextMax||120} caractères maximum).`);
    lines.push("");
  }
}
await writeFile(new URL("../QUESTIONNAIRE_COMPLET.md",import.meta.url),lines.join("\n"),"utf8");
