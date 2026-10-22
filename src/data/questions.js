const o = (value, label, facts = {}, derivedFacts = {}) => ({ value, label, facts, derivedFacts });
const discuss = o("to_discuss", "À clarifier ensemble");
const other = o("other", "Autre");
const q = (id, title, type, options, facts = {}, extra = {}) => ({ id, title, type, options, producesFacts: facts, ...extra });
const exclusive = ["to_discuss", "none", "not_applicable", "all"];

// Version 4: the brief supplies the product modules; questions clarify their rules.
export const questions = [
  { id:"process", section:"Votre fonctionnement", title:"Demandes et commandes", help:"Nous avons étudié votre fiche. Précisons comment les demandes deviennent des prestations.", panes:[
    q("intake.channels","Comment recevez-vous les demandes ?","multi",[o("phone","Téléphone"),o("email","E-mail"),o("messaging","SMS ou messagerie"),o("website","Site internet"),other,discuss],{}, {otherMax:120,exclusiveValues:exclusive}),
    q("orders.entry","Qui saisira les prestations ?","single",[o("team_only","L’équipe uniquement",{"orders.client_entry":false}),o("clients_and_team","Les clients aussi",{"orders.client_entry":true}),discuss],{"orders.client_entry":null})
  ]},
  { id:"portal", section:"Commandes par les clients", title:"Validation des commandes", panes:[q("orders.portal_validation","Quand un client saisit une commande, que se passe-t-il ?","single",[o("admin_approval","La responsable la valide avant confirmation"),o("direct","Elle est confirmée automatiquement"),discuss],{"orders.portal_validation":null})], visibleWhen:{op:"eq",questionId:"orders.entry",value:"clients_and_team"}, reason:"La saisie directe par un client nécessite une règle de confirmation." },
  { id:"team", section:"Votre équipe", title:"Équipe et accès", help:"Les accès aux missions et aux informations sensibles peuvent être différents.", panes:[
    q("team.users","Qui utilisera le logiciel ?","multi",[o("manager","Responsable ou administration"),o("staff","Salariés ou intervenants"),other,discuss],{}, {otherMax:120,exclusiveValues:exclusive}),
    q("team.visibility","Que voient les salariés dans le planning ?","single",[o("own_only","Leurs missions seulement",{"permissions.staff_scope":"assigned"}),o("all_missions","Toutes les missions",{"permissions.staff_scope":"all"}),discuss],{"permissions.staff_scope":null})
  ]},
  { id:"clients", section:"Clients et animaux", title:"Adresses et prestations multi-animaux", panes:[
    q("clients.multiple_addresses","Un client peut-il avoir plusieurs lieux de prestation ?","single",[o("yes","Oui",{"clients.multiple_addresses":true}),o("no","Non",{"clients.multiple_addresses":false}),discuss],{"clients.multiple_addresses":null}),
    q("orders.multiple_pets","Comment traiter une prestation pour plusieurs animaux du même foyer ?","single",[o("one_mission","Une seule mission pour tous"),o("separate_missions","Une mission par animal"),o("choice_each_order","Cela dépend de la commande"),discuss],{"orders.multiple_pets":null})
  ]},
  { id:"animal", section:"Fiche terrain", title:"Consignes et soins", help:"Les informations de santé, de caractère, d’alimentation et d’accès sont déjà prévues dans la fiche.", panes:[
    q("animal.instructions_edit","Qui peut modifier les consignes des animaux ?","single",[o("manager_only","La responsable uniquement",{"animal.instructions_editor":"manager"}),o("manager_staff","La responsable et les salariés",{"animal.instructions_editor":"shared"}),discuss],{"animal.instructions_editor":null}),
    q("animal.care_tracking","Faut-il confirmer qu’un soin a été réalisé ?","single",[o("instructions","Consulter les consignes seulement"),o("confirm","Confirmer chaque soin réalisé"),o("not_applicable","Aucun soin à suivre"),discuss],{"animal.care_tracking":null})
  ]},
  { id:"keys", section:"Accès au domicile", title:"Clés et consignes d’accès", panes:[
    q("keys.tracking","Que faut-il suivre pour les clés ?","multi",[o("location","Le lieu où elles se trouvent"),o("holder","La personne qui les détient"),o("transfer_history","Les remises et retours"),other,discuss],{}, {otherMax:120,exclusiveValues:exclusive}),
    q("keys.visibility","Qui voit les codes et consignes d’accès ?","single",[o("assigned_staff","Les personnes affectées à la mission",{"keys.visibility":"assigned"}),o("whole_team","Toute l’équipe",{"keys.visibility":"team"}),discuss],{"keys.visibility":null})
  ]},
  { id:"orders", section:"Prestations", title:"Prestations et forfaits", panes:[
    q("orders.pricing_unit","Comment les prestations sont-elles vendues ?","single",[o("unit","À l’unité",{"orders.sale_mode":"unit"}),o("package","En forfait",{"orders.sale_mode":"package"}),o("both","À l’unité et en forfait",{"orders.sale_mode":"both"}),other,discuss],{"orders.sale_mode":null},{otherMax:120}),
    q("orders.package_tracking","Que doit-on voir pour un forfait ?","single",[o("remaining","Le nombre de prestations restantes"),o("history","Les prestations déjà utilisées"),o("both","Les deux"),discuss],{"orders.package_tracking":null},{visibleWhen:{op:"in",questionId:"orders.pricing_unit",values:["package","both"]}})
  ]},
  { id:"recurring", section:"Planification", title:"Scénario : 18 promenades", help:"Une cliente commande 18 promenades. Comment choisit-on leurs dates ?", panes:[
    q("orders.recurring_schedule","Comment planifier les 18 promenades ?","multi",[o("manual","Choisir chaque date"),o("repeating_days","Répéter certains jours"),o("both","Combiner les deux méthodes"),discuss],{"orders.schedule":null},{exclusiveValues:exclusive}),
    q("orders.duration_tracking","Quelles durées suivre ?","multi",[o("planned","Durée prévue"),o("actual","Temps réellement effectué"),o("both","Les deux"),o("none","Aucun suivi de durée"),discuss],{"orders.duration_tracking":null},{exclusiveValues:exclusive})
  ]},
  { id:"prices", section:"Tarifs et suivi", title:"Prix et paiements", panes:[
    q("finance.pricing","Comment fixez-vous vos tarifs ?","single",[o("by_service","Par type de prestation"),o("by_duration","Selon la durée"),o("custom","Selon la demande"),o("combined","Combinaison de ces méthodes"),discuss],{"finance.pricing":"unconfirmed"}),
    q("finance.payment_scope","Que suivre dans l’outil ?","single",[o("none","Aucun suivi de paiement",{"finance.scope":"none"}),o("status","Payé ou à régler",{"finance.scope":"status"}),o("detailed","Détails des paiements",{"finance.scope":"detailed"}),discuss],{"finance.scope":null})
  ]},
  { id:"cancellation", section:"Prestations", title:"Annulation et report", panes:[
    q("missions.cancellation","Lorsqu’une prestation est annulée, quelles suites sont possibles ?","multi",[o("cancel_history","Annuler et conserver l’historique"),o("reschedule","Reprogrammer à une autre date"),o("credit","Garder la prestation à utiliser plus tard"),other,discuss],{"missions.cancellation":null},{exclusiveValues:exclusive,otherMax:120}),
    q("missions.cancellation_decider","Qui décide du report ou de la réutilisation ?","single",[o("manager","La responsable"),o("rule","Selon une règle définie"),discuss],{"missions.cancellation_decider":null},{visibleWhen:{op:"or",rules:[{op:"includes",questionId:"missions.cancellation",value:"reschedule"},{op:"includes",questionId:"missions.cancellation",value:"credit"}]}})
  ]},
  { id:"assignment", section:"Organisation des missions", title:"Affectation des missions", panes:[
    q("assignment.actor","Qui choisit le salarié pour une nouvelle mission ?","single",[o("manual","Je le choisis moi-même",{"assignment.actor":"manager"}),o("suggest_confirm","Le logiciel propose, je valide",{"assignment.actor":"manager_confirms"}),o("automatic","Le logiciel attribue selon mes règles",{"assignment.actor":"automatic"}),discuss],{"assignment.actor":null}),
    q("assignment.criteria","Sur quels critères ce choix doit-il reposer ?","multi",[o("availability","Disponibilités"),o("proximity","Proximité du client"),o("familiarity","Habitude avec cet animal"),o("skills","Compétences ou soins nécessaires"),other,discuss],{"assignment.criteria":null},{exclusiveValues:exclusive,otherMax:120})
  ]},
  { id:"conflicts", section:"Organisation des missions", title:"Chevauchements et remplacements", panes:[
    q("assignment.conflicts","En cas de chevauchement d’horaires, que faire ?","single",[o("block","Empêcher l’affectation"),o("warn","Avertir et me laisser décider"),discuss],{"assignment.conflicts":null}),
    q("assignment.replacement","Un salarié est absent le matin d’une mission : que faire ?","single",[o("manual","Je choisis le remplaçant"),o("suggest","Le logiciel propose des remplaçants"),o("auto","Le logiciel réattribue selon mes règles"),discuss],{"assignment.replacement":null})
  ]},
  { id:"replacement_detail", section:"Remplacement", title:"Validation du remplacement", panes:[q("assignment.replacement_approval","Qui valide le remplacement ?","single",[o("manager","La responsable"),o("automatic","Pas de validation, si les règles sont respectées"),discuss],{"assignment.replacement_approval":null})], visibleWhen:{op:"in",questionId:"assignment.replacement",values:["suggest","auto"]}, reason:"Une suggestion ou réattribution nécessite de savoir si une validation humaine reste nécessaire." },
  { id:"staff_planning", section:"Planning salarié", title:"Planning sur téléphone", panes:[
    q("staff.horizon","Quelle période le salarié consulte-t-il ?","single",[o("today","Aujourd’hui"),o("week","La semaine à venir"),o("both","Les deux"),discuss],{"staff.horizon":null}),
    q("staff.mission_actions","Quelles actions supplémentaires faut-il faire depuis une mission ?","multi",[o("complete","La marquer terminée"),o("incident","Signaler un problème"),o("report","Ajouter un compte rendu"),o("duration","Saisir le temps effectué"),discuss],{"staff.mission_actions":null},{exclusiveValues:exclusive})
  ]},
  { id:"incident", section:"Sécurité des missions", title:"Incident ou urgence", panes:[
    q("missions.incident_response","En cas d’incident, quelles actions prévoir ?","multi",[o("contact","Contacter la responsable"),o("report","Signaler l’incident"),o("procedure","Consulter une consigne"),discuss],{"missions.incident":null},{exclusiveValues:exclusive})
  ]},
  { id:"updates", section:"Planning salarié", title:"Changements de planning", panes:[
    q("staff.change_info","Comment les salariés consultent-ils les changements ?","single",[o("open_app","Ils consultent le planning quand ils le souhaitent"),o("alerts","Ils reçoivent une alerte"),o("both","Les deux"),discuss],{"staff.change_info":null}),
    q("staff.notifications","Par quels moyens envoyer les alertes ?","multi",[o("email","E-mail"),o("in_app","Alerte dans l’application"),o("sms","SMS"),o("none","Aucune alerte proactive"),discuss],{"staff.notifications":null},{exclusiveValues:exclusive})
  ]},
  { id:"geo", section:"Carte et déplacements", title:"Position des salariés", help:"La carte des clients, la recherche d’adresse et la distance en kilomètres sont déjà prévues. Cette question porte uniquement sur les salariés.", panes:[
    q("geo.enabled","Comment connaître la position des salariés ?","single",[o("reference_address","Adresse ou secteur de référence",{"geo.mode":"reference"},{"geo.enabled":true}),o("declared_position","Position ponctuelle déclarée",{"geo.mode":"on_demand"},{"geo.enabled":true}),o("work_gps","GPS pendant le travail",{"geo.mode":"gps_during_work"},{"geo.enabled":true}),o("no_location","Ne pas localiser les salariés",{"geo.mode":false},{"geo.enabled":false}),discuss],{"geo.enabled":null}),
    q("geo.metric","En plus des kilomètres, afficher aussi le temps de trajet ?","single",[o("distance","Les kilomètres suffisent"),o("travel_time","Afficher aussi le temps"),discuss],{"geo.metric":null},{visibleWhen:{op:"in",questionId:"geo.enabled",values:["reference_address","declared_position","work_gps"]}})
  ]},
  { id:"gps_mode", section:"Localisation", title:"Usage du GPS", panes:[q("geo.mode_detail","Quand utiliser la position GPS ?","single",[o("on_demand","À la demande, ponctuellement"),o("during_visit","Pendant une mission active"),o("live","En temps réel pendant le travail"),discuss],{"geo.mode_detail":null})], visibleWhen:{op:"eq",questionId:"geo.enabled",value:"work_gps"}, reason:"Le choix GPS exige de préciser son usage, sans supposer un suivi continu." },
  { id:"map_availability", section:"Carte et déplacements", title:"Disponibilité sur la carte", panes:[q("geo.availability","Un salarié proche est occupé : que montrer ?","single",[o("hide","Ne pas l’afficher"),o("show_busy","L’afficher comme indisponible"),o("warn","L’afficher avec un avertissement"),discuss],{"geo.availability":null})], visibleWhen:{op:"includes",questionId:"assignment.criteria",value:"proximity"}, reason:"Le critère proximité nécessite une règle pour les salariés occupés." },
  { id:"dashboard", section:"Tableau de bord", title:"Activité et panier moyen", panes:[
    q("dashboard.counting","Quand compter une prestation dans l’activité ?","single",[o("ordered","À la commande"),o("completed","Une fois réalisée"),o("separate","Séparer commandées et réalisées"),discuss],{"dashboard.counting":null}),
    q("dashboard.average_basket","Comment calculer le panier moyen ?","single",[o("per_order","Par commande"),o("per_service","Par prestation"),o("both","Les deux"),discuss],{"dashboard.average_basket":null})
  ]},
  { id:"data", section:"Données et communication", title:"Données à importer", panes:[
    q("data.sources","Où se trouvent vos données aujourd’hui ?","multi",[o("spreadsheets","Fichiers Excel ou CSV"),o("software","Logiciel existant"),o("paper_messages","Papier ou messages"),o("none","Pas de base structurée"),discuss],{"data.sources":null},{exclusiveValues:exclusive}),
    q("data.import_scope","Que souhaitez-vous reprendre dans le nouvel outil ?","multi",[o("clients","Fiches clients et animaux"),o("planning","Planning et missions"),o("history","Historique des prestations"),discuss],{"data.import_scope":null},{exclusiveValues:exclusive})
  ]},
  { id:"priorities", section:"Pour terminer", title:"Vos priorités", help:"Les besoins exprimés dans votre fiche restent acquis, même s’ils ne sont pas prioritaires au départ.", panes:[
    q("priorities.mvp","Quelles sont vos deux priorités pour commencer ?","multi",[o("planning","Planning"),o("clients","Clients et animaux"),o("orders","Commandes"),o("map","Carte"),o("stats","Statistiques")],{"priorities.mvp":null},{maxChoices:2}),
    q("priorities.missing","Un sujet important manque ?","single",[o("no","Non"),o("yes","Oui, ajouter une précision"),o("meeting","À évoquer ensemble")],{"priorities.missing":null},{inlineTextWhen:{op:"eq",questionId:"priorities.missing",value:"yes"},inlineTextLabel:"Quel sujet ?",inlineTextId:"priorities.note",inlineTextMax:120})
  ]}
];

export const sections = [...new Set(questions.map(x => x.section))];
