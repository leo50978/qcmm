import { questions } from "./data/questions.js";
import { activeAnswers, auditQuestionBank, getScreenValidation, paneIsRequired, recalculate, screenCanSkip, validateVisible } from "./engine/questionnaire.js";
import { buildVisualSteps } from "./engine/visual-steps.js";
import { connectFirebase, listSubmissions, loadOwnSubmission, saveDraft, signInRespondent, submitDraft } from "./services/firebase.js";
import { buildAnalysis, downloadExport } from "./services/analysis.js";
import { firebaseEnabled, questionnaireVersion, businessName, privacyContact, retentionPeriod } from "./config/app-config.js";

const app=document.querySelector("#app"),authDialog=document.querySelector("#auth-dialog"),authContent=document.querySelector("#auth-content"),privacyDialog=document.querySelector("#privacy-dialog");
const saveLabel=document.querySelector("#save-status"),retryButton=document.querySelector("#retry-save"),adminButton=document.querySelector("#admin-open"),toast=document.querySelector("#toast");
const state={client:null,user:null,uid:null,adminClient:null,adminUser:null,admin:false,connection:"starting",page:"loading",answers:{},activeScreen:0,screenId:null,viewPaneId:null,consent:false,busy:false,transitioning:false,submitted:false,submission:null,saveTimer:null,focusTarget:null};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const showToast=message=>{toast.textContent=message;toast.classList.add("visible");setTimeout(()=>toast.classList.remove("visible"),3600);};
const currentState=()=>recalculate(state.answers);
const isCompact=()=>window.matchMedia("(max-width: 720px), (max-height: 720px)").matches;
const visibleSteps=()=>buildVisualSteps(currentState().visible,isCompact());

function animateOut(selector=".question-card"){
  const card=document.querySelector(selector);
  if(!card||!window.gsap||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return Promise.resolve();
  return new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(timer);card.inert=false;resolve();};card.inert=true;const timer=setTimeout(finish,220);try{window.gsap.to(card,{opacity:0,y:-6,duration:.16,ease:"power1.in",onComplete:finish,onInterrupt:finish});}catch{finish();}});
}

function setSaveStatus(text,kind="",retry=false){saveLabel.textContent=text;saveLabel.dataset.kind=kind;retryButton.hidden=!retry;const chip=document.querySelector(".save-chip");if(chip){chip.dataset.kind=kind==="error"?"error":"saved";const label=chip.querySelector("[data-save-label]");if(label)label.textContent=kind==="error"?"À réessayer":text;}}
function setCurrentStep(index){const steps=visibleSteps();const i=Math.max(0,Math.min(index,steps.length-1));const step=steps[i];state.activeScreen=i;state.screenId=step?.screen.id||null;state.viewPaneId=step?.split?step.panes[0]?.id:null;}
function startOfCurrent(fallbackIndex=0){const steps=visibleSteps();let index=steps.findIndex(x=>x.screen.id===state.screenId&&(!state.viewPaneId||x.panes.some(p=>p.id===state.viewPaneId)));if(index<0)index=steps.findIndex(x=>x.screen.id===state.screenId);if(index<0&&state.screenId===null)index=findResumeStep(steps);if(index<0)index=Math.max(0,Math.min(fallbackIndex,steps.length-1));setCurrentStep(index);}
function currentView(){startOfCurrent(state.activeScreen);return visibleSteps()[state.activeScreen]||null;}
function getViewScreen(view){return view?{...view.screen,panes:view.panes}:null;}
function findResumeStep(steps=visibleSteps()){const facts=currentState().facts;for(let i=0;i<steps.length;i++){const screen=getViewScreen(steps[i]);if(screen.panes.some(p=>paneIsRequired(screen,p,state.answers,facts)&&!state.answers[p.id]))return i;}return Math.max(0,steps.length-1);}

function renderHome(){
  state.page="home";const resumed=Object.keys(activeAnswers(state.answers)).length>0;const title=businessName?`L’aventure de ${esc(businessName)}`:"Les coulisses de votre activité";
  app.innerHTML=`<section class="welcome-screen"><div class="welcome-art" aria-hidden="true"><svg viewBox="0 0 240 180" role="presentation"><path class="art-sun" d="M172 20a26 26 0 1 0 0 52 26 26 0 0 0 0-52Z"/><path class="art-hill" d="M8 146c34-35 63-41 96-14 38-32 80-33 128-4v52H8Z"/><path class="art-cat" d="M102 82 91 53l28 13c12-5 27-4 38 3l26-16-5 34c7 11 9 25 5 38-7 21-32 34-57 29-26-5-43-26-37-47 2-10 7-19 13-25Z"/><path class="art-face" d="M114 104h1m35 0h1m-24 17c5 4 11 4 16 0"/><path class="art-dog" d="M53 112c-9-7-15-18-14-28 1-7 7-11 12-7l14 12c12-8 29-6 38 4 12 13 7 37-7 47-13 10-35 6-43-7-4-6-4-14 0-21Z"/><path class="art-face" d="M66 119h1m22 1h1m-16 10c3 2 7 2 10 0"/><path class="art-spark" d="m37 44 4 10 10 4-10 4-4 10-4-10-10-4 10-4Zm168 59 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/></svg></div><div class="welcome-copy"><span class="eyebrow"><span class="eyebrow-dot"></span> Une étape à la fois</span><p class="quest-label">Votre mission du jour</p><h1>${title}</h1><p class="hero-copy">Quelques questions pour imaginer un outil qui vous ressemble. Choisissez ce qui décrit le mieux votre quotidien.</p><div class="welcome-facts"><span><b>18</b> thèmes</span><span><b>À votre rythme</b> vous pouvez revenir en arrière</span><span><b>Vos réponses</b> enregistrées en privé</span></div><label class="consent-row"><input id="consent-check" type="checkbox" ${state.consent?"checked":""}><span>J’accepte l’enregistrement de mes réponses pour préparer le logiciel.</span></label><button class="button button-primary button-large" data-action="start" ${state.consent?"":"disabled"}>${resumed?"Reprendre mon parcours":"Commencer le parcours"}<span aria-hidden="true">→</span></button><p class="welcome-footnote">Pas de mauvaise réponse. « À discuter » est toujours possible.</p></div></section>`;
  bindConsent();
}

function renderUnavailable(){
  state.page="offline";app.innerHTML=`<section class="offline-card"><div class="mascot-mark" aria-hidden="true">🐾</div><span class="eyebrow">Le parcours attend sa connexion</span><h1>Impossible de joindre le service</h1><p>Vos réponses ne seront pas enregistrées tant que la connexion à Firebase ne fonctionne pas.</p><button class="button button-primary" data-action="retry-connection">Réessayer</button></section>`;
}

function bindConsent(){const check=document.querySelector("#consent-check");check?.addEventListener("change",()=>{state.consent=check.checked;const button=app.querySelector('[data-action="start"]');if(button)button.disabled=!state.consent;});}
function radioOption(pane,opt,selected){const checked=selected===opt.value;return `<label class="option-card ${checked?"selected":""}"><input type="radio" name="${esc(pane.id)}" value="${esc(opt.value)}" ${checked?"checked":""}><span class="option-indicator"></span><span class="option-label">${esc(opt.label)}</span><span class="option-check" aria-hidden="true">✓</span></label>`;}
function multiOption(pane,opt,selected){const checked=selected.includes(opt.value);const disabled=!checked&&pane.maxChoices&&selected.length>=pane.maxChoices;return `<label class="option-card ${checked?"selected":""} ${disabled?"disabled":""}"><input type="checkbox" name="${esc(pane.id)}" value="${esc(opt.value)}" ${checked?"checked":""} ${disabled?"disabled":""}><span class="option-indicator"></span><span class="option-label">${esc(opt.label)}</span><span class="option-check" aria-hidden="true">✓</span></label>`;}
function paneHTML(pane,hideLegend=false){
  const answer=state.answers[pane.id]||{};const selected=answer.value;let control="";
  if(pane.type==="text")control=`<textarea id="answer-${esc(pane.id)}" data-text-answer="${esc(pane.id)}" maxlength="${pane.maxLength||120}" rows="2" placeholder="Votre réponse…">${esc(selected||"")}</textarea><div class="field-foot">${pane.maxLength||120} caractères max.</div>`;
  else if(pane.type==="number")control=`<label class="other-field">${esc(pane.inputLabel||"Votre réponse")}<input id="answer-${esc(pane.id)}" data-text-answer="${esc(pane.id)}" type="number" inputmode="decimal" step="${pane.step||"any"}" ${pane.min!==undefined?`min="${pane.min}"`:""} ${pane.max!==undefined?`max="${pane.max}"`:""} value="${esc(selected??"")}" placeholder="Votre nombre"></label>`;
  else if(pane.type==="multi"){const values=Array.isArray(selected)?selected:[];control=`<div class="options-grid">${pane.options.map(opt=>multiOption(pane,opt,values)).join("")}</div>${pane.maxChoices?`<p class="field-hint">Jusqu’à ${pane.maxChoices} choix.</p>`:""}`;}
  else control=`<div class="options-grid">${pane.options.map(opt=>radioOption(pane,opt,selected)).join("")}</div>`;
  if((pane.options||[]).some(o=>o.value==="other")&&((Array.isArray(selected)&&selected.includes("other"))||selected==="other"))control+=`<label class="other-field">Votre précision<input data-other-answer="${esc(pane.id)}" maxlength="${pane.otherMax||120}" value="${esc(answer.otherText||"")}" placeholder="En quelques mots"></label>`;
  if(pane.inlineTextWhen&&evaluateInline(pane,answer))control+=`<label class="other-field">${esc(pane.inlineTextLabel||"Précisez") }<input data-inline-answer="${esc(pane.id)}" maxlength="${pane.inlineTextMax||120}" value="${esc(answer.inlineText||"")}" placeholder="En quelques mots"></label>`;
  return `<fieldset class="question-pane" data-pane="${esc(pane.id)}" ${hideLegend?`aria-label="${esc(pane.title)}"`:""}>${hideLegend?"":`<legend>${esc(pane.title)}</legend>`}${pane.help?`<p class="pane-help">${esc(pane.help)}</p>`:""}${control}<p class="inline-error" data-error-for="${esc(pane.id)}" role="alert"></p></fieldset>`;
}
function evaluateInline(pane,answer){return pane.inlineTextWhen?.op==="eq"&&answer.value===pane.inlineTextWhen.value;}

function renderQuestion({animate=false}={}){
  const steps=visibleSteps();if(!steps.length){renderHome();return;}startOfCurrent();const view=steps[state.activeScreen];if(!view){renderReview();return;}
  state.page="question";const screen=view.screen;const viewScreen=getViewScreen(view);const compactSplit=view.split;const step=state.activeScreen+1;const progress=Math.round((state.activeScreen/Math.max(1,steps.length))*100);const canSkip=screenCanSkip(viewScreen,state.answers,currentState().facts);const sectionIndex=questions.findIndex(q=>q.id===screen.id)+1;const title=compactSplit?view.panes[0].title:screen.title;
  app.innerHTML=`<section class="question-layout"><div class="quest-heading"><button class="back-link" data-action="home">← Quitter</button><div class="quest-progress"><span class="quest-counter">Étape ${step} <i>/ ${steps.length}</i></span><div class="progress-track" role="progressbar" aria-label="Progression" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div></div><span class="save-chip" data-kind="${state.connection==="online"?"saved":"error"}"><i></i><span data-save-label>${state.connection==="online"?"Sauvegarde active":"À réessayer"}</span></span></div><article class="question-card ${compactSplit?"single-pane":""}" aria-labelledby="question-title"><div class="question-kicker"><span class="section-number">${String(sectionIndex).padStart(2,"0")}</span><span>${esc(screen.section)}</span>${canSkip?`<span class="optional-badge">Facultatif</span>`:""}</div><h1 id="question-title" tabindex="-1">${esc(title)}</h1>${screen.help&&!compactSplit?`<p class="question-help">${esc(screen.help)}</p>`:""}<div class="panes">${view.panes.map(p=>paneHTML(p,compactSplit)).join("")}</div><div class="navigation-row"><button class="button button-secondary" data-action="previous" ${state.activeScreen===0?"disabled":""}>← Retour</button><div class="navigation-right">${canSkip?`<button class="text-button" data-action="skip">Passer</button>`:""}<button class="button button-primary" data-action="next">${state.activeScreen===steps.length-1?"Vérifier":"Continuer"}<span aria-hidden="true">→</span></button></div></div><button class="partial-link" data-action="review-partial">Terminer avec mes réponses</button></article></section>`;
  requestAnimationFrame(()=>{let target=null;if(state.focusTarget){const f=state.focusTarget;target=document.querySelector(`input[name="${CSS.escape(f.id)}"][value="${CSS.escape(f.value)}"]`);state.focusTarget=null;}if(target)target.focus({preventScroll:true});else document.querySelector("#question-title")?.focus({preventScroll:true});if(animate&&window.gsap&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches)window.gsap.from(".question-card",{opacity:0,y:5,duration:.16,ease:"power1.out"});});
}

function renderReview(){
  state.page="review";const route=currentState().visible;const validation=validateVisible(state.answers);const rows=[];
  for(const screen of route)for(const pane of screen.panes){const a=state.answers[pane.id];const vals=Array.isArray(a?.value)?a.value:[a?.value];const labels=vals.filter(Boolean).map(v=>pane.options?.find(o=>o.value===v)?.label||v);const display=a?.status==="skipped"?"Passée":labels.length?labels.join(", ")+(a?.otherText?` — ${a.otherText}`:"")+(a?.inlineText?` — ${a.inlineText}`:""):"Sans réponse";rows.push(`<div class="review-row"><div><span class="review-section">${esc(screen.section)}</span><strong>${esc(pane.title)}</strong><p>${esc(display)}</p></div><button class="text-button" data-action="edit" data-screen="${esc(screen.id)}" data-pane-id="${esc(pane.id)}">Modifier</button></div>`);}
  app.innerHTML=`<section class="review-layout"><div class="quest-heading"><button class="back-link" data-action="previous">← Retour au parcours</button><span class="quest-counter">Vérification</span></div><article class="review-card"><div class="question-kicker"><span class="section-number">✓</span><span>Dernière étape</span></div><h1 tabindex="-1">Vos réponses</h1><p class="question-help">Relisez vos choix. « À discuter » reste un point à clarifier ensemble.</p><div class="review-summary"><span>${rows.length} réponses</span><span>${validation.valid?"Parcours complet":"Des réponses restent à compléter"}</span></div>${validation.valid?"":`<p class="inline-error" role="alert">${esc(validation.error)}</p>`}<div class="review-list">${rows.join("")}</div><div class="navigation-row"><button class="button button-secondary" data-action="previous">← Modifier</button><div class="navigation-right"><button class="button button-secondary" data-action="submit-partial">Envoyer quand même</button><button class="button button-primary" data-action="submit-complete" ${validation.valid?"":"disabled"}>Envoyer mes réponses <span aria-hidden="true">→</span></button></div></div><p class="review-footnote">Après envoi, les réponses ne sont plus modifiables.</p></article></section>`;
  requestAnimationFrame(()=>{document.querySelector(".review-card h1")?.focus({preventScroll:true});if(window.gsap&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches)window.gsap.from(".review-card",{opacity:0,y:9,duration:.24,ease:"power1.out"});});
}

function renderThanks(){state.page="thanks";const report=buildAnalysis(state.submission||{answers:state.answers,status:"submitted",questionnaireVersion});app.innerHTML=`<section class="thanks-card"><div class="thanks-mark" aria-hidden="true">✓</div><span class="eyebrow">Parcours terminé</span><h1>${state.submission?.status==="incomplete"?"Votre réponse est envoyée.":"Merci, c’est envoyé !"}</h1><p>Vos réponses aideront à préparer un outil adapté à votre quotidien.</p><div class="thanks-summary"><strong>À clarifier ensemble</strong><span>${report.unresolved.length?`${report.unresolved.length} point(s)`:"Tout est clair pour le moment"}</span></div></section>`;}

function renderAdmin(submissions){
  state.page="admin";const cards=submissions.map(s=>{const report=buildAnalysis(s);const factRows=Object.entries(report.facts||{}).map(([id,f])=>`<p><strong>${esc(id)}</strong> = ${esc(JSON.stringify(f.value))} <small>(${esc(f.origin)} · source ${esc(f.source)} · ${esc(f.atTrust)})</small></p>`).join("");return `<article class="submission-card"><div class="submission-header"><div><span class="status-pill ${s.status==="submitted"?"status-done":"status-draft"}">${s.status==="submitted"?"Envoyé":s.status==="incomplete"?"Incomplet":"Brouillon"}</span><h2>Réponse ${esc(String(s.id).slice(0,8))}</h2><p>Version ${esc(s.questionnaireVersion||"—")}</p></div><span class="answer-count">${report.answers.length} réponses</span></div><details><summary>Voir la synthèse</summary><div class="admin-report"><h3>Décisions confirmées</h3>${report.answers.map(a=>`<p><small>${esc(a.section)}</small><br><strong>${esc(a.question)}</strong><br>${esc(a.value)}</p>`).join("")}<h3>Besoins de départ</h3>${report.brief.map(b=>`<p><strong>${esc(b.theme)} :</strong> ${esc(b.status)}</p>`).join("")}<h3>À clarifier</h3>${report.unresolved.length?report.unresolved.map(x=>`<p>${esc(x.question)} — ${esc(x.reason)}</p>`).join(""):`<p>Aucun point à clarifier.</p>`}<h3>Recommandations à valider</h3>${report.recommendations.length?report.recommendations.map(x=>`<p>${esc(x)}</p>`).join(""):`<p>Aucune recommandation déduite.</p>`}<h3>Risques</h3>${report.risks.length?report.risks.map(x=>`<p>${esc(x)}</p>`).join(""):`<p>Aucun risque détecté.</p>`}</div></details><details><summary>Autres détails</summary><div class="admin-report"><h3>Dépendances</h3>${report.dependencies.map(x=>`<p>${esc(x)}</p>`).join("")||"<p>Aucune dépendance.</p>"}<h3>Questions non posées</h3>${report.notAsked.map(x=>`<p><small>${esc(x.status)}</small> ${esc(x.question)} — ${esc(x.reason)}</p>`).join("")}<h3>Origine des faits</h3>${factRows||"<p>Aucun fait calculé.</p>"}<h3>Hors périmètre</h3>${report.outOfScope.map(x=>`<p>${esc(x.question)} — ${esc(x.reason)}</p>`).join("")}<h3>Priorités</h3><p>${report.priorities.map(esc).join(", ")||"Aucune priorité choisie."}</p></div></details><div class="export-row"><button class="button button-small button-secondary" data-action="export" data-kind="json" data-id="${esc(s.id)}">JSON</button><button class="button button-small button-secondary" data-action="export" data-kind="csv" data-id="${esc(s.id)}">CSV</button><button class="button button-small button-secondary" data-action="export" data-kind="markdown" data-id="${esc(s.id)}">Markdown</button></div></article>`;}).join("");
  app.innerHTML=`<section class="admin-layout"><div class="quest-heading"><span class="quest-counter">Espace responsable</span><button class="text-button" data-action="admin-signout">Déconnexion</button></div><div class="admin-title"><span class="eyebrow">Données protégées</span><h1>Réponses</h1><p>Les recommandations sont des pistes à valider.</p></div><div class="admin-list">${cards||`<p class="empty-state">Aucune réponse pour le moment.</p>`}</div></section>`;
}

function renderAdminLogin(){
  authContent.innerHTML=`<span class="eyebrow">Espace responsable</span><h2 id="auth-title">Accès administrateur</h2><p>Connexion réservée à la personne autorisée.</p><form id="admin-auth-form" class="auth-form"><label>Adresse e-mail<input name="email" type="email" autocomplete="username" required></label><label>Mot de passe<input name="password" type="password" autocomplete="current-password" required></label><button class="button button-primary button-full" type="submit">Se connecter</button><p class="inline-error" id="auth-error" role="alert"></p></form>`;
  if(!authDialog.open)authDialog.showModal();
}

function scheduleSave(){
  if(!state.user?.isAnonymous||state.admin||state.submitted)return;setSaveStatus("Sauvegarde…");clearTimeout(state.saveTimer);const uid=state.uid;
  state.saveTimer=setTimeout(async()=>{if(!state.user?.isAnonymous||state.uid!==uid||state.submitted)return;try{await saveDraft(state.client,uid,{questionnaireVersion,answers:activeAnswers(state.answers)});state.connection="online";setSaveStatus("Enregistré");}catch(error){state.connection="error";setSaveStatus("Non enregistré", "error",true);console.error("Firestore save failed",error);}},600);
}
async function saveNow(){clearTimeout(state.saveTimer);state.saveTimer=null;if(!state.user?.isAnonymous||state.submitted)return;await saveDraft(state.client,state.uid,{questionnaireVersion,answers:activeAnswers(state.answers)});setSaveStatus("Enregistré");}
function updateAnswer(id,answer,focusTarget=null){
  if(Object.hasOwn(answer,"value")){delete answer.status;answer.answeredAt=new Date().toISOString();}
  const previousAnswer=state.answers[id]||{};const before=currentState();const beforeRoute=JSON.stringify(before.visible.map(s=>[s.id,s.panes.map(p=>p.id)]));const fallback=state.activeScreen;state.answers[id]=answer;const after=recalculate(state.answers);
  for(const oldId of before.activeQuestionIds)if(!after.activeQuestionIds.has(oldId)&&oldId!==id)delete state.answers[oldId];
  startOfCurrent(fallback);scheduleSave();
  const pane=findPane(id);const routeChanged=beforeRoute!==JSON.stringify(after.visible.map(s=>[s.id,s.panes.map(p=>p.id)]));
  const selected=(value,source)=>Array.isArray(source.value)?source.value.includes(value):source.value===value;
  const needsConditionalMarkup=(pane?.options?.some(option=>option.value==="other")&&selected("other",previousAnswer)!==selected("other",answer))||Boolean(pane?.inlineTextWhen&&evaluateInline(pane,previousAnswer)!==evaluateInline(pane,answer));
  if(routeChanged||needsConditionalMarkup){state.focusTarget=focusTarget;renderQuestion();return;}
  document.querySelectorAll(`input[name="${CSS.escape(id)}"]`).forEach(input=>{
    const values=Array.isArray(answer.value)?answer.value:[answer.value];const selected=values.includes(input.value);input.checked=selected;
    const card=input.closest(".option-card");card?.classList.toggle("selected",selected);
    if(input.type==="checkbox"&&pane?.maxChoices)input.disabled=!selected&&values.filter(Boolean).length>=pane.maxChoices;
  });
  document.querySelector(`[data-error-for="${CSS.escape(id)}"]`)?.replaceChildren();
  syncQuestionProgress();
}
function syncQuestionProgress(){
  if(state.page!=="question")return;const steps=visibleSteps();const progress=Math.round(state.activeScreen/Math.max(1,steps.length)*100);
  const counter=document.querySelector(".quest-counter");if(counter)counter.innerHTML=`Étape ${state.activeScreen+1} <i>/ ${steps.length}</i>`;
  const track=document.querySelector(".progress-track");if(track){track.setAttribute("aria-valuenow",String(progress));const fill=track.firstElementChild;if(fill)fill.style.width=`${progress}%`;}
  const next=document.querySelector('[data-action="next"]');if(next)next.firstChild.textContent=state.activeScreen===steps.length-1?"Vérifier":"Continuer";
}
function answerChanged(target){
  const id=target.name||target.dataset.textAnswer||target.dataset.otherAnswer||target.dataset.inlineAnswer;if(!id)return;const pane=findPane(id);if(!pane)return;const prior=state.answers[id]||{};
  if(target.dataset.otherAnswer||target.dataset.inlineAnswer||target.dataset.textAnswer){state.answers[id]={...prior,...(target.dataset.otherAnswer?{otherText:target.value}:target.dataset.inlineAnswer?{inlineText:target.value}:{value:target.value})};delete state.answers[id].status;scheduleSave();return;}
  if(target.type==="checkbox"){
    if(target.checked&&pane.exclusiveValues?.includes(target.value))document.querySelectorAll(`input[name="${CSS.escape(id)}"]`).forEach(input=>{if(input!==target)input.checked=false;});
    else if(target.checked&&pane.exclusiveValues?.length)document.querySelectorAll(`input[name="${CSS.escape(id)}"]`).forEach(input=>{if(pane.exclusiveValues.includes(input.value))input.checked=false;});
    const values=[...document.querySelectorAll(`input[name="${CSS.escape(id)}"]:checked`)].map(x=>x.value);updateAnswer(id,{...prior,value:values},{id,value:target.value});
  }else if(target.type==="radio")updateAnswer(id,{...prior,value:target.value},{id,value:target.value});
}
function findPane(id){for(const screen of questions){const pane=screen.panes.find(x=>x.id===id);if(pane)return pane;}return null;}

async function onAuthenticated(user){
  state.user=user;state.uid=user.uid;
  if(!user.isAnonymous){await state.client.authSdk.signOut(state.client.auth);const anonymous=await signInRespondent(state.client);return onAuthenticated(anonymous);}
  state.admin=false;state.connection="online";authDialog.close();setSaveStatus("Réponses privées");
  const remote=await loadOwnSubmission(state.client,user.uid);state.answers=remote?.answers||{};state.submitted=remote?.status==="submitted"||remote?.status==="incomplete";state.submission=remote?{...remote,id:user.uid}:null;
  if(state.submitted)renderThanks();else renderHome();
}

async function initializeFirebase(){
  state.page="loading";app.innerHTML=`<section class="loading-card" role="status"><span class="loader-paw">✦</span><p>Préparation de votre parcours…</p></section>`;
  try{
    if(!firebaseEnabled)throw new Error("Firebase est désactivé.");state.client=await connectFirebase();if(!state.client)throw new Error("Configuration Firebase manquante.");
    const existing=await new Promise((resolve,reject)=>{let stop=()=>{};stop=state.client.authSdk.onAuthStateChanged(state.client.auth,user=>{stop();resolve(user);},reject);});
    const user=existing||await signInRespondent(state.client);await onAuthenticated(user);
  }catch(error){state.connection="error";setSaveStatus("Connexion indisponible","error",true);renderUnavailable();console.error("Firebase startup failed",error);}
}
async function retryConnection(){
  try{setSaveStatus("Reconnexion…");if(!state.client){if(!firebaseEnabled)throw new Error("Firebase est désactivé.");state.client=await connectFirebase();}
    let user=state.client.auth.currentUser;if(!user){user=await new Promise((resolve,reject)=>{let stop=()=>{};stop=state.client.authSdk.onAuthStateChanged(state.client.auth,current=>{stop();resolve(current);},reject);});}
    if(!user)user=await signInRespondent(state.client);
    if(state.user?.uid===user.uid&&state.page!=="offline"&&state.page!=="loading"){state.connection="online";await saveNow();}
    else await onAuthenticated(user);
    state.connection="online";
  }catch(error){state.connection="error";setSaveStatus("Toujours indisponible","error",true);if(state.page==="offline")renderUnavailable();showToast("Connexion impossible. Réessayez dans un instant.");console.error("Firebase retry failed",error);}
}

async function openAdminLogin(){
  if(state.admin){await showAdmin();return;}
  try{if(!firebaseEnabled)throw new Error("Firebase est désactivé.");if(!state.adminClient)state.adminClient=await connectFirebase("pet-questionnaire-admin");const existing=await new Promise((resolve,reject)=>{let stop=()=>{};stop=state.adminClient.authSdk.onAuthStateChanged(state.adminClient.auth,user=>{stop();resolve(user);},reject);});if(existing&&await onAdminAuthenticated(existing))return;}
  catch(error){showToast("Connexion administrateur indisponible.");console.error("Admin Firebase unavailable",error);}
  renderAdminLogin();
}
async function moveNext(forceSkip=false){
  if(state.transitioning)return;const view=currentView();if(!view)return;const screen=getViewScreen(view);const canSkip=screenCanSkip(screen,state.answers,currentState().facts);
  if(forceSkip&&canSkip){for(const pane of view.panes)state.answers[pane.id]={status:"skipped"};}
  else{const result=getScreenValidation(screen,state.answers,currentState().facts);if(!result.valid){const node=document.querySelector(`[data-error-for="${CSS.escape(result.questionId)}"]`);if(node)node.textContent=result.error;document.querySelector(`[data-pane="${CSS.escape(result.questionId)}"]`)?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});showToast(canSkip?"Répondez ou passez cette étape.":"Complétez les choix requis.");return;}for(const pane of view.panes)if(!state.answers[pane.id]&&!paneIsRequired(screen,pane,state.answers,currentState().facts))state.answers[pane.id]={status:"skipped"};}
  state.transitioning=true;try{await animateOut();}finally{state.transitioning=false;}scheduleSave();const steps=visibleSteps();const index=steps.findIndex(x=>x.screen.id===view.screen.id&&(!view.split||x.panes.some(p=>p.id===view.panes[0].id)));if(index<steps.length-1){setCurrentStep(index+1);renderQuestion();}else renderReview();
}
async function submit(status){
  const validation=validateVisible(state.answers);if(status==="submitted"&&!validation.valid){showToast(validation.error||"Complétez les choix requis ou envoyez en l’état.");const target=validation.questionId&&currentState().visible.find(s=>s.panes.some(p=>p.id===validation.questionId));if(target){state.screenId=target.id;state.viewPaneId=validation.questionId;startOfCurrent();renderQuestion();}return;}
  if(state.busy)return;if(!state.user?.isAnonymous){showToast("La connexion sécurisée est indisponible. Réessayez.");setSaveStatus("Non envoyé","error",true);return;}state.busy=true;
  try{const payload={questionnaireVersion,answers:activeAnswers(state.answers),status};await submitDraft(state.client,state.uid,payload);state.transitioning=true;try{await animateOut(".review-card");}finally{state.transitioning=false;}state.submitted=true;state.submission={...payload,id:state.uid};setSaveStatus("Réponses envoyées");renderThanks();}
  catch(error){showToast(error.message||"Envoi impossible. Vérifiez la connexion et réessayez.");setSaveStatus("Non envoyé","error",true);}
  finally{state.busy=false;}
}
async function showAdmin(){
  if(!state.admin){await openAdminLogin();return;}adminButton.disabled=true;setSaveStatus("Chargement…");try{const rows=await listSubmissions(state.adminClient);state.adminSubmissions=rows;renderAdmin(rows);setSaveStatus("Accès responsable");}catch(error){showToast("Impossible de charger les réponses. Vérifiez les règles Firestore.");setSaveStatus("Erreur Firestore","error",true);}finally{adminButton.disabled=false;}
}
async function leaveAdmin(){
  if(!state.admin)return;try{await state.adminClient.authSdk.signOut(state.adminClient.auth);state.adminUser=null;state.admin=false;renderHome();}catch(error){setSaveStatus("Déconnexion impossible","error",true);}
}

async function onAdminAuthenticated(user){
  const claims=(await user.getIdTokenResult(true)).claims||{};
  if(claims.admin!==true){await state.adminClient.authSdk.signOut(state.adminClient.auth);const error=document.querySelector("#auth-error");if(error)error.textContent="Ce compte n’a pas les droits administrateur.";return false;}
  state.admin=true;state.adminUser=user;authDialog.close();setSaveStatus("Accès responsable");await showAdmin();return true;
}

function bindEvents(){
  app.addEventListener("input",e=>{if(e.target.matches("[data-text-answer],[data-other-answer],[data-inline-answer]"))answerChanged(e.target);});
  app.addEventListener("change",e=>{if(e.target.matches("input[type=radio],input[type=checkbox]"))answerChanged(e.target);});
  app.addEventListener("click",async e=>{
    const button=e.target.closest("[data-action]");if(!button)return;const action=button.dataset.action;
    if(action==="start"){if(!state.consent)return;if(Object.keys(activeAnswers(state.answers)).length){setCurrentStep(findResumeStep());renderQuestion();}else{setCurrentStep(0);renderQuestion();}return;}
    if(action==="retry-connection"||action==="retry-save"){await retryConnection();return;}
    if(action==="home"){if(state.admin){await leaveAdmin();return;}if(state.transitioning)return;state.transitioning=true;try{await animateOut(state.page==="review"?".review-card":".question-card");}finally{state.transitioning=false;}renderHome();return;}
    if(action==="previous"){if(state.transitioning)return;state.transitioning=true;try{await animateOut(state.page==="review"?".review-card":".question-card");}finally{state.transitioning=false;}if(state.page==="review"){const steps=visibleSteps();setCurrentStep(Math.max(0,steps.length-1));renderQuestion();return;}if(state.activeScreen===0){renderHome();return;}setCurrentStep(state.activeScreen-1);renderQuestion();return;}
    if(action==="next"){await moveNext();return;}if(action==="skip"){await moveNext(true);return;}
    if(action==="review-partial"){renderReview();return;}
    if(action==="edit"){state.screenId=button.dataset.screen;state.viewPaneId=button.dataset.paneId;startOfCurrent();renderQuestion();return;}
    if(action==="submit-complete"){await submit("submitted");return;}
    if(action==="submit-partial"){if(confirm("Envoyer les réponses telles quelles ? Vous ne pourrez plus les modifier."))await submit("incomplete");return;}
    if(action==="admin-signout"){await leaveAdmin();return;}
    if(action==="export"){const item=state.adminSubmissions?.find(x=>x.id===button.dataset.id);if(item)downloadExport(button.dataset.kind,item);return;}
    if(action==="privacy"){privacyDialog.showModal();return;}
  });
}

authDialog.addEventListener("submit",async e=>{
  if(e.target.id!=="admin-auth-form")return;e.preventDefault();const form=new FormData(e.target);const email=String(form.get("email")||"").trim();const password=String(form.get("password")||"");const error=document.querySelector("#auth-error");
  try{if(!state.adminClient)state.adminClient=await connectFirebase("pet-questionnaire-admin");await saveNow();const credential=await state.adminClient.authSdk.signInWithEmailAndPassword(state.adminClient.auth,email,password);await onAdminAuthenticated(credential.user);}
  catch(err){if(error)error.textContent=({"auth/invalid-credential":"Adresse ou mot de passe incorrect.","auth/too-many-requests":"Trop d’essais. Réessayez plus tard.","auth/operation-not-allowed":"Activez la connexion e-mail dans Firebase."})[err.code]||err.message||"Connexion impossible.";}
});

bindEvents();
document.querySelector("#privacy-open").addEventListener("click",()=>privacyDialog.showModal());
document.querySelectorAll("[data-close-dialog]").forEach(b=>b.addEventListener("click",()=>privacyDialog.close()));
adminButton.addEventListener("click",()=>openAdminLogin());
retryButton.addEventListener("click",()=>retryConnection());
window.addEventListener("online",()=>{if(state.user?.isAnonymous){state.connection="online";setSaveStatus("Connexion rétablie");scheduleSave();}});
window.addEventListener("offline",()=>{state.connection="error";setSaveStatus("Hors connexion","error",true);});
window.addEventListener("resize",()=>{if(state.page==="question"){startOfCurrent();renderQuestion();}});

async function init(){
  const audit=auditQuestionBank();if(audit.length)console.error("Audit du questionnaire",audit);
  document.querySelector("#retention-label").textContent=retentionPeriod;document.querySelector("#privacy-contact-label").textContent=privacyContact;
  bindConsent();await initializeFirebase();
}
init();
