# Questionnaire du site - questions et reponses proposees

Document genere directement depuis `src/data/questions.js`.
Question and answer labels below are copied exactly as displayed on the site.
Conditional questions are included with their display conditions.
IDs and internal values are included in parentheses for reference.

## 01. Votre fonctionnement - Votre fonctionnement actuel
_Commençons par la façon dont les demandes arrivent aujourd’hui._

### Comment recevez-vous les demandes ?
- Type : Choix multiples.
- Identifiant : `intake.channels`.
- Nombre maximum de choix : 5.
- Choix proposes :
  - Téléphone (valeur technique : `phone`)
  - E-mail (valeur technique : `email`)
  - SMS ou messagerie (valeur technique : `messaging`)
  - Site internet (valeur technique : `website`)
  - Autre (valeur technique : `other`)
- Champ de precision si ? Autre ? est choisi : maximum 120 caracteres.

### Qui saisira les prestations ?
- Type : Choix unique.
- Identifiant : `orders.entry`.
- Choix proposes :
  - L’équipe uniquement (valeur technique : `team_only`)
  - Les clients aussi (valeur technique : `clients_and_team`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 02. Commandes par les clients - Commandes par les clients
**Facultatif.**
**Raison / contexte :** Un client qui saisit lui-même une commande crée un besoin de cadrage de validation.
**Display condition:** `{"op":"eq","questionId":"orders.entry","value":"clients_and_team"}`

### Faut-il valider les commandes clients ?
- Type : Choix unique.
- Identifiant : `orders.portal_validation`.
- Choix proposes :
  - Oui, avant confirmation (valeur technique : `admin_approval`)
  - Non, confirmation automatique (valeur technique : `direct`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 03. Votre équipe - Équipe et accès
_Les accès pourront ensuite être adaptés aux responsabilités de chacun._

### Qui utilisera le logiciel ?
- Type : Choix multiples.
- Identifiant : `team.users`.
- Choix proposes :
  - Responsable ou administration (valeur technique : `manager`)
  - Salariés ou intervenants (valeur technique : `staff`)
  - Autre (valeur technique : `other`)
- Champ de precision si ? Autre ? est choisi : maximum 120 caracteres.

### Que voient les salariés ?
- Type : Choix unique.
- Identifiant : `team.visibility`.
- Choix proposes :
  - Leurs missions seulement (valeur technique : `own_only`)
  - Toutes les missions (valeur technique : `all_missions`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 04. Clients et animaux - Clients et adresses

### Un client peut-il avoir plusieurs animaux ?
- Type : Choix unique.
- Identifiant : `clients.multiple_pets`.
- Choix proposes :
  - Oui (valeur technique : `yes`)
  - Non (valeur technique : `no`)
  - Cela dépend des cas (valeur technique : `sometimes`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### Un client peut-il avoir plusieurs adresses ?
- Type : Choix unique.
- Identifiant : `clients.multiple_addresses`.
- Choix proposes :
  - Oui (valeur technique : `yes`)
  - Non (valeur technique : `no`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 05. Fiche terrain - Informations utiles sur place
_Il s’agit des rubriques à consulter en mission, pas de données réelles sur un animal._

### Quelles infos consulter en mission ?
- Type : Choix multiples.
- Identifiant : `animal.quick_info`.
- Nombre maximum de choix : 4.
- Choix proposes :
  - Santé et médicaments (valeur technique : `health`)
  - Comportement et cachettes (valeur technique : `behavior`)
  - Alimentation (valeur technique : `food`)
  - Contact d’urgence (valeur technique : `emergency`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### Qui devrait pouvoir modifier les consignes ?
- Type : Choix unique.
- Identifiant : `animal.instructions_edit`.
- Choix proposes :
  - La responsable uniquement (valeur technique : `manager_only`)
  - La responsable et les salariés (valeur technique : `manager_staff`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 06. Suivi des soins - Suivi des soins
**Facultatif.**
**Raison / contexte :** Le suivi d’exécution des soins change les droits et les traces à conserver.
**Display condition:** `{"op":"includes","questionId":"animal.quick_info","value":"health"}`

### Quel suivi des soins souhaitez-vous ?
- Type : Choix unique.
- Identifiant : `animal.care_tracking`.
- Choix proposes :
  - Voir les consignes (valeur technique : `instructions`)
  - Confirmer chaque soin réalisé (valeur technique : `confirm`)
  - Sans objet pour mon activité (valeur technique : `not_applicable`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 07. Accès au domicile - Clés et informations d’accès

### Comment suivez-vous les clés ?
- Type : Choix multiples.
- Identifiant : `keys.tracking`.
- Choix proposes :
  - Lieu où elles se trouvent (valeur technique : `location`)
  - Personne qui les détient (valeur technique : `holder`)
  - Historique des transferts (valeur technique : `transfer_history`)
  - Autre (valeur technique : `other`)
  - À clarifier ensemble (valeur technique : `to_discuss`)
- Champ de precision si ? Autre ? est choisi : maximum 120 caracteres.

### Qui voit les consignes d’accès ?
- Type : Choix unique.
- Identifiant : `keys.visibility`.
- Choix proposes :
  - L’équipe affectée (valeur technique : `assigned_staff`)
  - Toute l’équipe (valeur technique : `whole_team`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 08. Prestations - Prestations et commandes

### Comment vendez-vous les prestations ?
- Type : Choix unique.
- Identifiant : `orders.pricing_unit`.
- Choix proposes :
  - À l’unité (valeur technique : `unit`)
  - En forfait (valeur technique : `package`)
  - Les deux (valeur technique : `both`)
  - Autre (valeur technique : `other`)
  - À clarifier ensemble (valeur technique : `to_discuss`)
- Champ de precision si ? Autre ? est choisi : maximum 120 caracteres.

### Une commande peut-elle inclure plusieurs animaux ?
- Type : Choix unique.
- Identifiant : `orders.multiple_pets`.
- Choix proposes :
  - Oui (valeur technique : `yes`)
  - Non (valeur technique : `no`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 09. Planification - Scénario : 18 promenades
_Une cliente commande 18 promenades. Comment choisissez-vous leurs dates ?_

### Comment choisir les dates ?
- Type : Choix unique.
- Identifiant : `orders.recurring_schedule`.
- Choix proposes :
  - Je choisis chaque date (valeur technique : `manual`)
  - Je répète certains jours (valeur technique : `repeating_days`)
  - Les deux selon le besoin (valeur technique : `both`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 10. Tarifs et suivi - Prix et paiements

### Comment fixez-vous vos tarifs ?
- Type : Choix unique.
- Identifiant : `finance.pricing`.
- Choix proposes :
  - Prix par type de prestation (valeur technique : `by_service`)
  - Prix selon la durée (valeur technique : `by_duration`)
  - Prix défini selon la demande (valeur technique : `custom`)
  - Une combinaison de ces méthodes (valeur technique : `combined`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### Que souhaitez-vous suivre dans cet outil ?
- Type : Choix unique.
- Identifiant : `finance.payment_scope`.
- Choix proposes :
  - Pas les paiements (valeur technique : `none`)
  - Payé ou à régler (valeur technique : `status`)
  - Factures et paiements détaillés (valeur technique : `detailed`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 11. Prestations - Scénario : annulation ou report

### Une promenade est annulée : que faire ?
- Type : Choix unique.
- Identifiant : `missions.cancellation`.
- Choix proposes :
  - La retirer, garder l’historique (valeur technique : `cancel_history`)
  - La déplacer (valeur technique : `reschedule`)
  - La reporter à plus tard (valeur technique : `credit`)
  - Plusieurs de ces options (valeur technique : `several`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 12. Organisation des missions - Affectation et horaires

### Comment choisir l’intervenant ?
- Type : Choix unique.
- Identifiant : `assignment.mode`.
- Choix proposes :
  - Je choisis (valeur technique : `manual`)
  - Selon ses disponibilités (valeur technique : `availability`)
  - Selon sa proximité (valeur technique : `proximity`)
  - Selon sa connaissance de l’animal (valeur technique : `familiarity`)
  - Combiner ces critères (valeur technique : `combined`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### En cas de chevauchement d’horaires, que souhaitez-vous ?
- Type : Choix unique.
- Identifiant : `assignment.conflicts`.
- Choix proposes :
  - Empêcher l’affectation (valeur technique : `block`)
  - Avertir et me laisser décider (valeur technique : `warn`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 13. Organisation des missions - Responsabilité de l’affectation
**Raison / contexte :** La réponse manuelle établit déjà que la responsable choisit l’intervenant ; éviter de lui redemander cette décision.
**Display condition:** `{"op":"isKnown","fact":"assignment.mode"}`

### Qui confirme l’affectation ?
- Type : Choix unique.
- Identifiant : `assignment.final_decider`.
- Choix proposes :
  - La responsable (valeur technique : `manager`)
  - Le salarié confirme (valeur technique : `staff`)
  - Le logiciel, selon les règles (valeur technique : `automatic`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 14. Organisation des missions - Scénario : absence de dernière minute

### Un intervenant est absent : que faire ?
- Type : Choix unique.
- Identifiant : `assignment.replacement`.
- Choix proposes :
  - Je choisis le remplaçant (valeur technique : `manual`)
  - Suggérer des remplaçants (valeur technique : `suggest`)
  - Réattribuer automatiquement (valeur technique : `auto`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 15. Remplacement - Validation d’un remplacement
**Facultatif.**
**Raison / contexte :** Un remplacement automatisé ou suggéré dépend d’une règle de validation humaine.
**Display condition:** `{"op":"in","questionId":"assignment.replacement","values":["suggest","auto"]}`

### Qui confirme le remplacement ?
- Type : Choix unique.
- Identifiant : `assignment.replacement_approval`.
- Choix proposes :
  - La responsable (valeur technique : `manager`)
  - Attribution automatique (valeur technique : `automatic`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 16. Planning salarié - Planning sur téléphone

### Quelle période le salarié devrait-il consulter ?
- Type : Choix unique.
- Identifiant : `staff.horizon`.
- Choix proposes :
  - Aujourd’hui (valeur technique : `today`)
  - La semaine à venir (valeur technique : `week`)
  - Les deux (valeur technique : `both`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### Que devrait-il pouvoir faire dans une mission ?
- Type : Choix multiples.
- Identifiant : `staff.mission_actions`.
- Nombre maximum de choix : 4.
- Choix proposes :
  - Consulter la mission (valeur technique : `view`)
  - La marquer terminée (valeur technique : `complete`)
  - Signaler un problème (valeur technique : `incident`)
  - Ajouter un compte rendu (valeur technique : `report`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 17. Sécurité des missions - Scénario : incident ou urgence

### En cas d’incident, quelle aide prévoir ?
- Type : Choix unique.
- Identifiant : `missions.incident_response`.
- Choix proposes :
  - Appeler la responsable (valeur technique : `contact`)
  - Signaler l’incident (valeur technique : `report`)
  - Consulter une procédure (valeur technique : `procedure`)
  - Plusieurs options (valeur technique : `several`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 18. Carte et déplacements - Carte et proximité
_Le suivi GPS en continu n’est pas supposé. Choisissez le niveau qui vous convient._

### Quel niveau de localisation ?
- Type : Choix unique.
- Identifiant : `geo.enabled`.
- Choix proposes :
  - Adresse ou secteur (valeur technique : `reference_address`)
  - Position ponctuelle (valeur technique : `declared_position`)
  - GPS pendant la mission (valeur technique : `work_gps`)
  - Aucune localisation (valeur technique : `no_location`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### Que devrait montrer la comparaison ?
- Type : Choix unique.
- Identifiant : `geo.metric`.
- Display condition: `{"op":"in","questionId":"geo.enabled","values":["reference_address","declared_position","work_gps"]}`.
- Choix proposes :
  - Distance en kilomètres (valeur technique : `distance`)
  - Temps de trajet (valeur technique : `travel_time`)
  - Les deux (valeur technique : `both`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 19. Localisation - Précision de la localisation
**Raison / contexte :** Le choix GPS déclenche une précision d’usage avant tout cadrage technique ou juridique.
**Display condition:** `{"op":"eq","questionId":"geo.enabled","value":"work_gps"}`

### Quand la position GPS serait-elle utilisée ?
- Type : Choix unique.
- Identifiant : `geo.mode_detail`.
- Choix proposes :
  - À la demande, ponctuellement (valeur technique : `on_demand`)
  - Pendant une mission active (valeur technique : `during_visit`)
  - En temps réel pendant le travail (valeur technique : `live`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 20. Carte et déplacements - Disponibilité sur la carte
**Facultatif.**
**Raison / contexte :** La proximité ne suffit pas à déterminer si un intervenant occupé apparaît dans les résultats.
**Display condition:** `{"op":"and","rules":[{"op":"eq","questionId":"geo.enabled","value":"reference_address"},{"op":"in","questionId":"geo.metric","values":["travel_time","both"]}]}`

### Un intervenant proche est occupé : que montrer ?
- Type : Choix unique.
- Identifiant : `geo.availability`.
- Choix proposes :
  - Ne pas l’afficher (valeur technique : `hide`)
  - L’afficher indisponible (valeur technique : `show_busy`)
  - Afficher un avertissement (valeur technique : `warn`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 21. Tableau de bord - Activité et panier moyen

### Quand compter une prestation ?
- Type : Choix unique.
- Identifiant : `dashboard.counting`.
- Choix proposes :
  - À la commande (valeur technique : `ordered`)
  - Une fois réalisée (valeur technique : `completed`)
  - Séparer commandées et réalisées (valeur technique : `separate`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### Comment souhaitez-vous calculer le panier moyen ?
- Type : Choix unique.
- Identifiant : `dashboard.average_basket`.
- Choix proposes :
  - Par commande (valeur technique : `per_order`)
  - Par prestation (valeur technique : `per_service`)
  - Les deux (valeur technique : `both`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 22. Données et communication - Données existantes et changements

### Où se trouvent vos données aujourd’hui ?
- Type : Choix multiples.
- Identifiant : `data.sources`.
- Nombre maximum de choix : 5.
- Choix proposes :
  - Fichiers Excel ou CSV (valeur technique : `spreadsheets`)
  - Logiciel existant (valeur technique : `software`)
  - Papier ou messages (valeur technique : `paper_messages`)
  - Plusieurs supports (valeur technique : `several`)
  - Pas de base structurée (valeur technique : `none`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

### Comment signaler un changement ?
- Type : Choix multiples.
- Identifiant : `staff.notifications`.
- Nombre maximum de choix : 4.
- Choix proposes :
  - Consulter le planning (valeur technique : `check_app`)
  - E-mail (valeur technique : `email`)
  - Notification (valeur technique : `in_app`)
  - SMS (valeur technique : `sms`)
  - À clarifier ensemble (valeur technique : `to_discuss`)

## 23. Pour terminer - Vos priorités
_Les sujets déjà mentionnés dans votre fiche restent des besoins exprimés, même s’ils ne sont pas prioritaires au départ._

### Quelles sont vos deux priorités ?
- Type : Choix multiples.
- Identifiant : `priorities.mvp`.
- Nombre maximum de choix : 2.
- Choix proposes :
  - Planning (valeur technique : `planning`)
  - Clients et animaux (valeur technique : `clients`)
  - Commandes (valeur technique : `orders`)
  - Carte (valeur technique : `map`)
  - Statistiques (valeur technique : `stats`)

### Un sujet important manque ?
- Type : Choix unique.
- Identifiant : `priorities.missing`.
- Choix proposes :
  - Non (valeur technique : `no`)
  - Oui, ajouter une précision (valeur technique : `yes`)
  - À évoquer ensemble (valeur technique : `meeting`)
- Champ texte conditionnel affiche : ? Quel sujet ? (facultatif) ? (maximum 120 caracteres).
