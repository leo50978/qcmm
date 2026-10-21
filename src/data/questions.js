const o = (value, label, facts = {}, derivedFacts = {}) => ({ value, label, facts, derivedFacts });
const discuss = o("to_discuss", "Je ne sais pas encore / à discuter");
const other = o("other", "Autre, préciser");
const notApplicable = o("not_applicable", "Sans objet pour mon activité", {"animal.care_tracking":"not_applicable"});
const q = (id, title, type, options, facts = {}, extra = {}) => ({
  id, title, type, options,
  producesFacts: facts, ...extra
});

export const questions = [
  { id: "process", section: "Votre fonctionnement", title: "Votre fonctionnement actuel", help: "Commençons par la façon dont les demandes arrivent aujourd’hui.", panes: [
    q("intake.channels", "Comment recevez-vous les demandes ?", "multi", [o("phone","Téléphone"),o("email","E-mail"),o("messaging","SMS ou messagerie"),o("website","Site internet"),other], {}, { maxChoices: 5, otherMax: 120, exclusiveValues:["to_discuss"] }),
    q("orders.entry", "Dans le futur outil, qui enregistrera les prestations ?", "single", [o("team_only","L’équipe uniquement", {"orders.client_entry":false}),o("clients_and_team","Les clients aussi", {"orders.client_entry":true}),discuss], {"orders.client_entry":null})
  ]},
  { id: "portal", section: "Commandes par les clients", title: "Commandes par les clients", panes: [
    q("orders.portal_validation", "Pour une commande saisie par un client, quelle étape souhaitez-vous ?", "single", [o("admin_approval","La responsable la vérifie avant confirmation"),o("direct","Elle est confirmée sans validation manuelle"),discuss],{"orders.portal_validation":null})
  ], visibleWhen:{op:"eq",questionId:"orders.entry",value:"clients_and_team"}, optional:true, reason:"Un client qui saisit lui-même une commande crée un besoin de cadrage de validation." },
  { id: "team", section: "Votre équipe", title: "Équipe et accès", help: "Les accès pourront ensuite être adaptés aux responsabilités de chacun.", panes: [
    q("team.users", "Qui utilisera le logiciel ?", "multi", [o("manager","Responsable ou administration"),o("staff","Salariés ou intervenants"),other], {}, { otherMax:120 }),
    q("team.visibility", "Les salariés doivent-ils voir uniquement leurs missions ?", "single", [o("own_only","Oui, leurs missions uniquement", {"permissions.staff_scope":"assigned"}),o("all_missions","Non, toutes les missions", {"permissions.staff_scope":"all"}),discuss], {"permissions.staff_scope":null})
  ]},
  { id: "clients", section: "Clients et animaux", title: "Clients et adresses", panes: [
    q("clients.multiple_pets", "Un client peut-il avoir plusieurs animaux ?", "single", [o("yes","Oui",{"clients.multiple_pets":true}),o("no","Non",{"clients.multiple_pets":false}),o("sometimes","Cela dépend des cas",{"clients.multiple_pets":"sometimes"}),discuss], {"clients.multiple_pets":null}),
    q("clients.multiple_addresses", "Un même client peut-il demander une intervention à plusieurs adresses ?", "single", [o("yes","Oui",{"clients.multiple_addresses":true}),o("no","Non",{"clients.multiple_addresses":false}),discuss], {"clients.multiple_addresses":null})
  ]},
  { id: "animal", section: "Fiche terrain", title: "Informations utiles sur place", help: "Il s’agit des rubriques à consulter en mission, pas de données réelles sur un animal.", panes: [
    q("animal.quick_info", "Quelles rubriques doivent être faciles à repérer ?", "multi", [o("health","Santé et médicaments"),o("behavior","Comportement et cachettes"),o("food","Alimentation"),o("emergency","Coordonnées d’urgence"),discuss], {}, {maxChoices:4,exclusiveValues:["to_discuss"]}),
    q("animal.instructions_edit", "Qui devrait pouvoir modifier les consignes ?", "single", [o("manager_only","La responsable uniquement",{"animal.instructions_editor":"manager"}),o("manager_staff","La responsable et les salariés",{"animal.instructions_editor":"shared"}),discuss], {"animal.instructions_editor":null})
  ]},
  { id: "care", section: "Suivi des soins", title: "Suivi des soins", panes: [
    q("animal.care_tracking", "Pour les soins, quel niveau de suivi serait utile ?", "single", [o("instructions","Consulter les consignes seulement"),o("confirm","Confirmer qu’un soin prévu a été fait"),notApplicable,discuss],{"animal.care_tracking":null})
  ], visibleWhen:{op:"includes",questionId:"animal.quick_info",value:"health"}, optional:true, reason:"Le suivi d’exécution des soins change les droits et les traces à conserver." },
  { id: "keys", section: "Accès au domicile", title: "Clés et informations d’accès", panes: [
    q("keys.tracking", "Comment suivez-vous les clés ?", "multi", [o("location","Lieu où elles se trouvent"),o("holder","Personne qui les détient"),o("transfer_history","Historique des transferts"),other,discuss], {}, {otherMax:120,exclusiveValues:["to_discuss"]}),
    q("keys.visibility", "Qui devrait voir les codes et consignes d’accès ?", "single", [o("assigned_staff","Le personnel affecté à la mission",{"keys.visibility":"assigned"}),o("whole_team","Toute l’équipe",{"keys.visibility":"team"}),discuss], {"keys.visibility":null})
  ]},
  { id: "orders", section: "Prestations", title: "Prestations et commandes", panes: [
    q("orders.pricing_unit", "Comment vendez-vous les prestations ?", "single", [o("unit","À l’unité",{"orders.sale_mode":"unit"}),o("package","En forfait",{"orders.sale_mode":"package"}),o("both","Les deux",{"orders.sale_mode":"both"}),other,discuss], {"orders.sale_mode":null},{otherMax:120}),
    q("orders.multiple_pets", "Une commande peut-elle inclure plusieurs animaux ?", "single", [o("yes","Oui",{"orders.multiple_pets":true}),o("no","Non",{"orders.multiple_pets":false}),discuss], {"orders.multiple_pets":null})
  ]},
  { id: "recurring", section: "Planification", title: "Scénario : 18 promenades", help: "Une cliente commande 18 promenades. Comment choisissez-vous leurs dates ?", panes: [
    q("orders.recurring_schedule", "Comment répartir les dates ?", "single", [o("manual","Je choisis chaque date une par une",{"orders.schedule":"manual"}),o("repeating_days","Je définis des jours qui se répètent",{"orders.schedule":"recurring"}),o("both","Les deux selon la demande",{"orders.schedule":"mixed"}),discuss], {"orders.schedule":null})
  ]},
  { id: "prices", section: "Tarifs et suivi", title: "Prix et paiements", panes: [
    q("finance.pricing", "Comment fixez-vous vos tarifs ?", "single", [o("by_service","Prix par type de prestation"),o("by_duration","Prix selon la durée"),o("custom","Prix défini selon la demande"),o("combined","Une combinaison de ces méthodes"),discuss],{"finance.pricing":"unconfirmed"}),
    q("finance.payment_scope", "Que souhaitez-vous suivre dans cet outil ?", "single", [o("none","Pas les paiements",{"finance.scope":"none"}),o("status","Payé ou à régler",{"finance.scope":"status"}),o("detailed","Factures et paiements détaillés",{"finance.scope":"detailed"}),discuss],{"finance.scope":null})
  ]},
  { id: "cancellation", section: "Prestations", title: "Scénario : annulation ou report", panes: [
    q("missions.cancellation", "Une promenade est annulée. Que devrait permettre le logiciel ?", "single", [o("cancel_history","La retirer du planning en gardant l’historique"),o("reschedule","La déplacer à une autre date"),o("credit","Garder la prestation à utiliser plus tard"),o("several","Plusieurs de ces possibilités"),discuss],{"missions.cancellation":"unconfirmed"})
  ]},
  { id: "assignment", section: "Organisation des missions", title: "Affectation et horaires", panes: [
    q("assignment.mode", "Comment choisissez-vous la personne qui intervient ?", "single", [o("manual","Je choisis moi-même",{"assignment.mode":"manual_admin"}),o("availability","Selon les disponibilités",{"assignment.mode":"availability"}),o("proximity","Selon la proximité",{"assignment.mode":"proximity"}),o("familiarity","Selon sa connaissance de l’animal",{"assignment.mode":"familiarity"}),o("combined","Combinaison de critères",{"assignment.mode":"combined"}),discuss],{"assignment.mode":null}),
    q("assignment.conflicts", "En cas de chevauchement d’horaires, que souhaitez-vous ?", "single", [o("block","Empêcher l’affectation"),o("warn","Avertir et me laisser décider"),discuss],{"assignment.conflicts":null})
  ]},
  { id: "assignment_role", section: "Organisation des missions", title: "Responsabilité de l’affectation", reason:"La réponse manuelle établit déjà que la responsable choisit l’intervenant ; éviter de lui redemander cette décision.", visibleWhen:{op:"isKnown",fact:"assignment.mode"}, resolvedWhen:{op:"eq",fact:"assignment.mode",value:"manual_admin"}, panes: [
    q("assignment.final_decider", "Quand le choix n’est pas manuel, qui devrait confirmer l’affectation ?", "single", [o("manager","La responsable confirme"),o("staff","Le salarié confirme sa disponibilité"),o("automatic","Le logiciel décide selon les règles choisies"),discuss],{"assignment.final_decider":null})
  ]},
  { id: "replacement", section: "Organisation des missions", title: "Scénario : absence de dernière minute", panes: [
    q("assignment.replacement", "Un intervenant est absent. Que devrait faire le logiciel ?", "single", [o("manual","Je réattribue la mission moi-même"),o("suggest","Il me suggère des remplaçants"),o("auto","Il réattribue automatiquement"),discuss],{"assignment.replacement":null})
  ]},
  { id: "replacement_detail", section: "Remplacement", title: "Validation d’un remplacement", panes: [
    q("assignment.replacement_approval", "Si le logiciel propose ou choisit un remplaçant, qui confirme ?", "single", [o("manager","La responsable confirme"),o("automatic","L’attribution peut être automatique"),discuss],{"assignment.replacement_approval":null})
  ], visibleWhen:{op:"in",questionId:"assignment.replacement",values:["suggest","auto"]}, optional:true, reason:"Un remplacement automatisé ou suggéré dépend d’une règle de validation humaine." },
  { id: "staff_planning", section: "Planning salarié", title: "Planning sur téléphone", panes: [
    q("staff.horizon", "Quelle période le salarié devrait-il consulter ?", "single", [o("today","Aujourd’hui"),o("week","La semaine à venir"),o("both","Les deux"),discuss],{"staff.horizon":null}),
    q("staff.mission_actions", "Que devrait-il pouvoir faire dans une mission ?", "multi", [o("view","Consulter la mission"),o("complete","La marquer terminée"),o("incident","Signaler un problème"),o("report","Ajouter un compte rendu"),discuss],{}, {maxChoices:4})
  ]},
  { id: "incident", section: "Sécurité des missions", title: "Scénario : incident ou urgence", panes: [
    q("missions.incident_response", "Si une mission se passe mal, quelle aide serait utile ?", "single", [o("contact","Contacter rapidement la responsable"),o("report","Signaler l’incident dans l’outil"),o("procedure","Consulter une procédure préparée par l’entreprise"),o("several","Plusieurs de ces possibilités"),discuss],{"missions.incident":"unconfirmed"})
  ]},
  { id: "geo", section: "Carte et déplacements", title: "Carte et proximité", help: "Le suivi GPS en continu n’est pas supposé. Choisissez le niveau qui vous convient.", panes: [
    q("geo.enabled", "Quelle localisation suffirait pour comparer les intervenants ?", "single", [o("reference_address","Adresse ou secteur de référence",{"geo.mode":"reference"},{"geo.enabled":true}),o("declared_position","Position indiquée ponctuellement",{"geo.mode":"on_demand"},{"geo.enabled":true}),o("work_gps","Position GPS pendant le travail",{"geo.mode":"gps_during_work"},{"geo.enabled":true}),o("no_location","Pas de localisation",{"geo.mode":false},{"geo.enabled":false}),o("to_discuss","Je ne sais pas encore / à discuter",{}, {"geo.enabled":null})],{"geo.enabled":null}),
    q("geo.metric", "Que devrait montrer la comparaison ?", "single", [o("distance","Distance en kilomètres"),o("travel_time","Temps de trajet"),o("both","Les deux"),discuss],{"geo.metric":null},{visibleWhen:{op:"in",questionId:"geo.enabled",values:["reference_address","declared_position","work_gps"]}})
  ]},
  { id: "gps_mode", section: "Localisation", title: "Précision de la localisation", panes: [
    q("geo.mode_detail", "Quand la position GPS serait-elle utilisée ?", "single", [o("on_demand","À la demande, ponctuellement"),o("during_visit","Pendant une mission active"),o("live","En temps réel pendant le travail"),discuss],{"geo.mode_detail":null})
  ], visibleWhen:{op:"eq",questionId:"geo.enabled",value:"work_gps"}, reason:"Le choix GPS déclenche une précision d’usage avant tout cadrage technique ou juridique." },
  { id: "map_availability", section: "Carte et déplacements", title: "Disponibilité sur la carte", panes: [
    q("geo.availability", "Une personne est proche mais déjà occupée. Que devrait faire la carte ?", "single", [o("hide","Ne pas la proposer"),o("show_busy","L’afficher comme indisponible"),o("warn","L’afficher avec un avertissement"),discuss],{"geo.availability":null})
  ], visibleWhen:{op:"and",rules:[{op:"eq",questionId:"geo.enabled",value:"reference_address"},{op:"in",questionId:"geo.metric",values:["travel_time","both"]}]}, optional:true, reason:"La proximité ne suffit pas à déterminer si un intervenant occupé apparaît dans les résultats." },
  { id: "dashboard", section: "Tableau de bord", title: "Activité et panier moyen", panes: [
    q("dashboard.counting", "Quand une prestation doit-elle compter comme réalisée ?", "single", [o("ordered","Dès la commande"),o("completed","Une fois effectuée"),o("separate","Afficher commandées et effectuées séparément"),discuss],{"dashboard.counting":null}),
    q("dashboard.average_basket", "Comment souhaitez-vous calculer le panier moyen ?", "single", [o("per_order","Par commande"),o("per_service","Par prestation"),o("both","Les deux"),discuss],{"dashboard.average_basket":null})
  ]},
  { id: "data", section: "Données et communication", title: "Données existantes et changements", panes: [
    q("data.sources", "Où se trouvent vos données aujourd’hui ?", "multi", [o("spreadsheets","Fichiers Excel ou CSV"),o("software","Logiciel existant"),o("paper_messages","Papier ou messages"),o("several","Plusieurs supports"),o("none","Pas de base structurée"),discuss],{"data.sources":null},{maxChoices:5,exclusiveValues:["several","none","to_discuss"]}),
    q("staff.notifications", "Comment prévenir l’équipe d’un changement de planning ?", "multi", [o("check_app","Elle consulte le planning"),o("email","E-mail"),o("in_app","Notification dans l’application"),o("sms","SMS"),discuss],{"staff.notifications":null},{maxChoices:4,exclusiveValues:["to_discuss"]})
  ]},
  { id: "priorities", section: "Pour terminer", title: "Vos priorités", help: "Les sujets déjà mentionnés dans votre fiche restent des besoins exprimés, même s’ils ne sont pas prioritaires au départ.", panes: [
    q("priorities.mvp", "Quels sujets vous feraient gagner le plus de temps en premier ?", "multi", [o("planning","Planning"),o("clients","Fiches clients et animaux"),o("orders","Saisie des commandes"),o("map","Carte"),o("stats","Statistiques")],{"priorities.mvp":null},{maxChoices:2}),
    q("priorities.missing", "Y a-t-il une situation importante que nous n’avons pas abordée ?", "single", [o("no","Non"),o("yes","Oui, je souhaite ajouter une précision"),o("meeting","Je préfère en parler ensemble")],{"priorities.missing":null},{inlineTextWhen:{op:"eq",questionId:"priorities.missing",value:"yes"},inlineTextLabel:"Quelle situation ? (facultatif)",inlineTextId:"priorities.note",inlineTextMax:120})
  ]},
];

export const sections = [...new Set(questions.map(x => x.section))];
