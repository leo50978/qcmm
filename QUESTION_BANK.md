# Banque du questionnaire

Version `4.0.0`. Les modules écrits dans la fiche sont considérés comme des besoins confirmés. Le parcours précise leurs règles de fonctionnement; il ne redemande pas si ces modules sont souhaités.

Le parcours standard affiche 18 étapes. Les branches ouvertes peuvent aller jusqu’à 22 étapes : saisie client, suivi des forfaits, report/crédit, validation d’un remplacement, précision GPS et gestion des salariés occupés. Les deux décisions liées restent ensemble sur mobile. Le plafond de 24 est vérifié par test. La durée de 5 à 8 minutes n’a pas encore été mesurée auprès d’une répondante.

La liste exacte des libellés et options est générée dans [QUESTIONNAIRE_COMPLET.md](QUESTIONNAIRE_COMPLET.md) par `node scripts/export-question-bank.mjs`. L’ancienne banque est conservée dans `src/data/questions-v3.js` et la liste affichée V3 dans [QUESTIONNAIRE_COMPLET_V3.md](QUESTIONNAIRE_COMPLET_V3.md).

## Parcours et conditions

| Étape | Décisions | Condition |
|---|---|---|
| 1 | `intake.channels`, `orders.entry` | Toujours |
| 2 | `orders.portal_validation` | Saisie des commandes par les clients |
| 3 | `team.users`, `team.visibility` | Toujours |
| 4 | `clients.multiple_addresses`, `orders.multiple_pets` | Toujours; ne redemande pas si un client possède plusieurs animaux |
| 5 | `animal.instructions_edit`, `animal.care_tracking` | Toujours; le suivi des soins est indépendant des blocs santé déjà confirmés |
| 6 | `keys.tracking`, `keys.visibility` | Toujours; aucun vrai code d’accès demandé |
| 7 | `orders.pricing_unit`, `orders.package_tracking` | Le détail de décompte apparaît si unité ou mixte |
| 8 | `orders.recurring_schedule`, `orders.duration_tracking` | Toujours; 18 prestations commandées ne signifient pas 18 réalisées |
| 9 | `finance.pricing`, `finance.payment_scope` | Toujours; le suivi des paiements reste à décider |
| 10 | `missions.cancellation`, `missions.cancellation_decider` | Décideur demandé si report ou crédit possible |
| 11 | `assignment.actor`, `assignment.criteria` | Deux faits distincts : responsable de l’affectation et critères multiples |
| 12 | `assignment.conflicts`, `assignment.replacement` | Toujours |
| 13 | `assignment.replacement_approval` | Suggestion ou réaffectation automatique |
| 14 | `staff.horizon`, `staff.mission_actions` | Toujours; la consultation de mission est acquise |
| 15 | `missions.incident_response` | Actions d’incident |
| 16 | `staff.change_info`, `staff.notifications` | Consultation volontaire du planning séparée des alertes proactives |
| 17 | `geo.enabled`, `geo.metric` | Position des salariés seulement; carte des clients et kilomètres restent confirmés |
| 18 | `geo.mode_detail` | GPS pendant le travail |
| 19 | `geo.availability` | Critère de proximité sélectionné |
| 20 | `dashboard.counting`, `dashboard.average_basket` | Toujours |
| 21 | `data.sources`, `data.import_scope` | Toujours; « plusieurs supports » supprimé |
| 22 | `priorities.mvp`, `priorities.missing` | Toujours; seules les deux priorités ont un maximum intentionnel |

Les étapes 2, 7, 13, 18 et 19 sont conditionnelles. Dans le cas normal, ces étapes sont masquées, de même que le second volet de l’étape 7 si la vente à l’unité est choisie : 18 étapes restent visibles. Le chemin le plus complet compte 22 étapes, sous le plafond de 24.

## Faits et obligation

`client-brief.js` contient les besoins confirmés et leurs références internes. Le statut `unknown` indique une modalité non donnée, par exemple la localisation des salariés ou un portail client. Les choix issus d’une réponse sont `questionnaire`; les valeurs explicitement calculées sont `derived`. Les faits « à clarifier » ont un statut distinct et ne deviennent jamais des oui/non.

`shouldShow()` et `isRequired()` sont des fonctions déterministes. `recalculate()` fournit un journal des questions affichées ou masquées, avec raison et obligation; le journal apparaît dans l’export, pas dans l’interface répondante. Les options « à clarifier » et « aucun/sans objet » sont exclusives dans les questions à choix multiple. La précision « Autre » est conservée et vérifiée.
