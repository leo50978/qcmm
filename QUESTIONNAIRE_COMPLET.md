# Questionnaire V4 — questions et choix affichés

Liste générée depuis `src/data/questions.js`. Les options ci-dessous sont les réponses proposées dans le site; elles ne sont pas des réponses déjà fournies par la responsable.

## 01. Votre fonctionnement — Demandes et commandes
_Nous avons étudié votre fiche. Précisons comment les demandes deviennent des prestations._

### Comment recevez-vous les demandes ?
- Type : Choix multiples.
- Identifiant : `intake.channels`.
- Téléphone (`phone`)
- E-mail (`email`)
- SMS ou messagerie (`messaging`)
- Site internet (`website`)
- Autre (`other`)
- À clarifier ensemble (`to_discuss`)
- Précision demandée si « Autre » : 120 caractères maximum.

### Qui saisira les prestations ?
- Type : Choix unique.
- Identifiant : `orders.entry`.
- L’équipe uniquement (`team_only`)
- Les clients aussi (`clients_and_team`)
- À clarifier ensemble (`to_discuss`)

## 02. Commandes par les clients — Validation des commandes
**Affichage conditionnel :** `{"op":"eq","questionId":"orders.entry","value":"clients_and_team"}`
**Pourquoi :** La saisie directe par un client nécessite une règle de confirmation.

### Quand un client saisit une commande, que se passe-t-il ?
- Type : Choix unique.
- Identifiant : `orders.portal_validation`.
- La responsable la valide avant confirmation (`admin_approval`)
- Elle est confirmée automatiquement (`direct`)
- À clarifier ensemble (`to_discuss`)

## 03. Votre équipe — Équipe et accès
_Les accès aux missions et aux informations sensibles peuvent être différents._

### Qui utilisera le logiciel ?
- Type : Choix multiples.
- Identifiant : `team.users`.
- Responsable ou administration (`manager`)
- Salariés ou intervenants (`staff`)
- Autre (`other`)
- À clarifier ensemble (`to_discuss`)
- Précision demandée si « Autre » : 120 caractères maximum.

### Que voient les salariés dans le planning ?
- Type : Choix unique.
- Identifiant : `team.visibility`.
- Leurs missions seulement (`own_only`)
- Toutes les missions (`all_missions`)
- À clarifier ensemble (`to_discuss`)

## 04. Clients et animaux — Adresses et prestations multi-animaux

### Un client peut-il avoir plusieurs lieux de prestation ?
- Type : Choix unique.
- Identifiant : `clients.multiple_addresses`.
- Oui (`yes`)
- Non (`no`)
- À clarifier ensemble (`to_discuss`)

### Comment traiter une prestation pour plusieurs animaux du même foyer ?
- Type : Choix unique.
- Identifiant : `orders.multiple_pets`.
- Une seule mission pour tous (`one_mission`)
- Une mission par animal (`separate_missions`)
- Cela dépend de la commande (`choice_each_order`)
- À clarifier ensemble (`to_discuss`)

## 05. Fiche terrain — Consignes et soins
_Les informations de santé, de caractère, d’alimentation et d’accès sont déjà prévues dans la fiche._

### Qui peut modifier les consignes des animaux ?
- Type : Choix unique.
- Identifiant : `animal.instructions_edit`.
- La responsable uniquement (`manager_only`)
- La responsable et les salariés (`manager_staff`)
- À clarifier ensemble (`to_discuss`)

### Faut-il confirmer qu’un soin a été réalisé ?
- Type : Choix unique.
- Identifiant : `animal.care_tracking`.
- Consulter les consignes seulement (`instructions`)
- Confirmer chaque soin réalisé (`confirm`)
- Aucun soin à suivre (`not_applicable`)
- À clarifier ensemble (`to_discuss`)

## 06. Accès au domicile — Clés et consignes d’accès

### Que faut-il suivre pour les clés ?
- Type : Choix multiples.
- Identifiant : `keys.tracking`.
- Le lieu où elles se trouvent (`location`)
- La personne qui les détient (`holder`)
- Les remises et retours (`transfer_history`)
- Autre (`other`)
- À clarifier ensemble (`to_discuss`)
- Précision demandée si « Autre » : 120 caractères maximum.

### Qui voit les codes et consignes d’accès ?
- Type : Choix unique.
- Identifiant : `keys.visibility`.
- Les personnes affectées à la mission (`assigned_staff`)
- Toute l’équipe (`whole_team`)
- À clarifier ensemble (`to_discuss`)

## 07. Prestations — Prestations et forfaits

### Comment les prestations sont-elles vendues ?
- Type : Choix unique.
- Identifiant : `orders.pricing_unit`.
- À l’unité (`unit`)
- En forfait (`package`)
- À l’unité et en forfait (`both`)
- Autre (`other`)
- À clarifier ensemble (`to_discuss`)
- Précision demandée si « Autre » : 120 caractères maximum.

### Que doit-on voir pour un forfait ?
- Type : Choix unique.
- Identifiant : `orders.package_tracking`.
- Affichage conditionnel : `{"op":"in","questionId":"orders.pricing_unit","values":["package","both"]}`.
- Le nombre de prestations restantes (`remaining`)
- Les prestations déjà utilisées (`history`)
- Les deux (`both`)
- À clarifier ensemble (`to_discuss`)

## 08. Planification — Scénario : 18 promenades
_Une cliente commande 18 promenades. Comment choisit-on leurs dates ?_

### Comment planifier les 18 promenades ?
- Type : Choix multiples.
- Identifiant : `orders.recurring_schedule`.
- Choisir chaque date (`manual`)
- Répéter certains jours (`repeating_days`)
- Combiner les deux méthodes (`both`)
- À clarifier ensemble (`to_discuss`)

### Quelles durées suivre ?
- Type : Choix multiples.
- Identifiant : `orders.duration_tracking`.
- Durée prévue (`planned`)
- Temps réellement effectué (`actual`)
- Les deux (`both`)
- Aucun suivi de durée (`none`)
- À clarifier ensemble (`to_discuss`)

## 09. Tarifs et suivi — Prix et paiements

### Comment fixez-vous vos tarifs ?
- Type : Choix unique.
- Identifiant : `finance.pricing`.
- Par type de prestation (`by_service`)
- Selon la durée (`by_duration`)
- Selon la demande (`custom`)
- Combinaison de ces méthodes (`combined`)
- À clarifier ensemble (`to_discuss`)

### Que suivre dans l’outil ?
- Type : Choix unique.
- Identifiant : `finance.payment_scope`.
- Aucun suivi de paiement (`none`)
- Payé ou à régler (`status`)
- Détails des paiements (`detailed`)
- À clarifier ensemble (`to_discuss`)

## 10. Prestations — Annulation et report

### Lorsqu’une prestation est annulée, quelles suites sont possibles ?
- Type : Choix multiples.
- Identifiant : `missions.cancellation`.
- Annuler et conserver l’historique (`cancel_history`)
- Reprogrammer à une autre date (`reschedule`)
- Garder la prestation à utiliser plus tard (`credit`)
- Autre (`other`)
- À clarifier ensemble (`to_discuss`)
- Précision demandée si « Autre » : 120 caractères maximum.

### Qui décide du report ou de la réutilisation ?
- Type : Choix unique.
- Identifiant : `missions.cancellation_decider`.
- Affichage conditionnel : `{"op":"or","rules":[{"op":"includes","questionId":"missions.cancellation","value":"reschedule"},{"op":"includes","questionId":"missions.cancellation","value":"credit"}]}`.
- La responsable (`manager`)
- Selon une règle définie (`rule`)
- À clarifier ensemble (`to_discuss`)

## 11. Organisation des missions — Affectation des missions

### Qui choisit le salarié pour une nouvelle mission ?
- Type : Choix unique.
- Identifiant : `assignment.actor`.
- Je le choisis moi-même (`manual`)
- Le logiciel propose, je valide (`suggest_confirm`)
- Le logiciel attribue selon mes règles (`automatic`)
- À clarifier ensemble (`to_discuss`)

### Sur quels critères ce choix doit-il reposer ?
- Type : Choix multiples.
- Identifiant : `assignment.criteria`.
- Disponibilités (`availability`)
- Proximité du client (`proximity`)
- Habitude avec cet animal (`familiarity`)
- Compétences ou soins nécessaires (`skills`)
- Autre (`other`)
- À clarifier ensemble (`to_discuss`)
- Précision demandée si « Autre » : 120 caractères maximum.

## 12. Organisation des missions — Chevauchements et remplacements

### En cas de chevauchement d’horaires, que faire ?
- Type : Choix unique.
- Identifiant : `assignment.conflicts`.
- Empêcher l’affectation (`block`)
- Avertir et me laisser décider (`warn`)
- À clarifier ensemble (`to_discuss`)

### Un salarié est absent le matin d’une mission : que faire ?
- Type : Choix unique.
- Identifiant : `assignment.replacement`.
- Je choisis le remplaçant (`manual`)
- Le logiciel propose des remplaçants (`suggest`)
- Le logiciel réattribue selon mes règles (`auto`)
- À clarifier ensemble (`to_discuss`)

## 13. Remplacement — Validation du remplacement
**Affichage conditionnel :** `{"op":"in","questionId":"assignment.replacement","values":["suggest","auto"]}`
**Pourquoi :** Une suggestion ou réattribution nécessite de savoir si une validation humaine reste nécessaire.

### Qui valide le remplacement ?
- Type : Choix unique.
- Identifiant : `assignment.replacement_approval`.
- La responsable (`manager`)
- Pas de validation, si les règles sont respectées (`automatic`)
- À clarifier ensemble (`to_discuss`)

## 14. Planning salarié — Planning sur téléphone

### Quelle période le salarié consulte-t-il ?
- Type : Choix unique.
- Identifiant : `staff.horizon`.
- Aujourd’hui (`today`)
- La semaine à venir (`week`)
- Les deux (`both`)
- À clarifier ensemble (`to_discuss`)

### Quelles actions supplémentaires faut-il faire depuis une mission ?
- Type : Choix multiples.
- Identifiant : `staff.mission_actions`.
- La marquer terminée (`complete`)
- Signaler un problème (`incident`)
- Ajouter un compte rendu (`report`)
- Saisir le temps effectué (`duration`)
- À clarifier ensemble (`to_discuss`)

## 15. Sécurité des missions — Incident ou urgence

### En cas d’incident, quelles actions prévoir ?
- Type : Choix multiples.
- Identifiant : `missions.incident_response`.
- Contacter la responsable (`contact`)
- Signaler l’incident (`report`)
- Consulter une consigne (`procedure`)
- À clarifier ensemble (`to_discuss`)

## 16. Planning salarié — Changements de planning

### Comment les salariés consultent-ils les changements ?
- Type : Choix unique.
- Identifiant : `staff.change_info`.
- Ils consultent le planning quand ils le souhaitent (`open_app`)
- Ils reçoivent une alerte (`alerts`)
- Les deux (`both`)
- À clarifier ensemble (`to_discuss`)

### Par quels moyens envoyer les alertes ?
- Type : Choix multiples.
- Identifiant : `staff.notifications`.
- E-mail (`email`)
- Alerte dans l’application (`in_app`)
- SMS (`sms`)
- Aucune alerte proactive (`none`)
- À clarifier ensemble (`to_discuss`)

## 17. Carte et déplacements — Position des salariés
_La carte des clients, la recherche d’adresse et la distance en kilomètres sont déjà prévues. Cette question porte uniquement sur les salariés._

### Comment connaître la position des salariés ?
- Type : Choix unique.
- Identifiant : `geo.enabled`.
- Adresse ou secteur de référence (`reference_address`)
- Position ponctuelle déclarée (`declared_position`)
- GPS pendant le travail (`work_gps`)
- Ne pas localiser les salariés (`no_location`)
- À clarifier ensemble (`to_discuss`)

### En plus des kilomètres, afficher aussi le temps de trajet ?
- Type : Choix unique.
- Identifiant : `geo.metric`.
- Affichage conditionnel : `{"op":"in","questionId":"geo.enabled","values":["reference_address","declared_position","work_gps"]}`.
- Les kilomètres suffisent (`distance`)
- Afficher aussi le temps (`travel_time`)
- À clarifier ensemble (`to_discuss`)

## 18. Localisation — Usage du GPS
**Affichage conditionnel :** `{"op":"eq","questionId":"geo.enabled","value":"work_gps"}`
**Pourquoi :** Le choix GPS exige de préciser son usage, sans supposer un suivi continu.

### Quand utiliser la position GPS ?
- Type : Choix unique.
- Identifiant : `geo.mode_detail`.
- À la demande, ponctuellement (`on_demand`)
- Pendant une mission active (`during_visit`)
- En temps réel pendant le travail (`live`)
- À clarifier ensemble (`to_discuss`)

## 19. Carte et déplacements — Disponibilité sur la carte
**Affichage conditionnel :** `{"op":"includes","questionId":"assignment.criteria","value":"proximity"}`
**Pourquoi :** Le critère proximité nécessite une règle pour les salariés occupés.

### Un salarié proche est occupé : que montrer ?
- Type : Choix unique.
- Identifiant : `geo.availability`.
- Ne pas l’afficher (`hide`)
- L’afficher comme indisponible (`show_busy`)
- L’afficher avec un avertissement (`warn`)
- À clarifier ensemble (`to_discuss`)

## 20. Tableau de bord — Activité et panier moyen

### Quand compter une prestation dans l’activité ?
- Type : Choix unique.
- Identifiant : `dashboard.counting`.
- À la commande (`ordered`)
- Une fois réalisée (`completed`)
- Séparer commandées et réalisées (`separate`)
- À clarifier ensemble (`to_discuss`)

### Comment calculer le panier moyen ?
- Type : Choix unique.
- Identifiant : `dashboard.average_basket`.
- Par commande (`per_order`)
- Par prestation (`per_service`)
- Les deux (`both`)
- À clarifier ensemble (`to_discuss`)

## 21. Données et communication — Données à importer

### Où se trouvent vos données aujourd’hui ?
- Type : Choix multiples.
- Identifiant : `data.sources`.
- Fichiers Excel ou CSV (`spreadsheets`)
- Logiciel existant (`software`)
- Papier ou messages (`paper_messages`)
- Pas de base structurée (`none`)
- À clarifier ensemble (`to_discuss`)

### Que souhaitez-vous reprendre dans le nouvel outil ?
- Type : Choix multiples.
- Identifiant : `data.import_scope`.
- Fiches clients et animaux (`clients`)
- Planning et missions (`planning`)
- Historique des prestations (`history`)
- À clarifier ensemble (`to_discuss`)

## 22. Pour terminer — Vos priorités
_Les besoins exprimés dans votre fiche restent acquis, même s’ils ne sont pas prioritaires au départ._

### Quelles sont vos deux priorités pour commencer ?
- Type : Choix multiples.
- Identifiant : `priorities.mvp`.
- Maximum : 2 choix.
- Planning (`planning`)
- Clients et animaux (`clients`)
- Commandes (`orders`)
- Carte (`map`)
- Statistiques (`stats`)

### Un sujet important manque ?
- Type : Choix unique.
- Identifiant : `priorities.missing`.
- Non (`no`)
- Oui, ajouter une précision (`yes`)
- À évoquer ensemble (`meeting`)
- Texte affiché si la condition est satisfaite : « Quel sujet ? » (120 caractères maximum).
