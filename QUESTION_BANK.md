# Banque de questions

Version `3.0.0`. Les réponses indiquent les choix de la responsable; elles ne valent pas acceptation d’une fonctionnalité non choisie. Une option « à discuter » est une réponse explicite non résolue. Les six approfondissements maximum sont facultatifs, sauf la précision GPS et la question d’affectation qui deviennent requises si leurs conditions sont remplies.

| Écran / volet | Décision posée | Type | Condition ou obligation |
|---|---|---|---|
| 01 A `intake.channels` | Canaux de demande actuels; autre avec précision | Multiple | Obligatoire |
| 01 B `orders.entry` | Équipe ou clients saisissent les prestations | Unique | Obligatoire; « clients aussi » ouvre un point de cadrage |
| 02 A `team.users` | Rôles utilisateurs | Multiple | Obligatoire |
| 02 B `team.visibility` | Missions visibles par les salariés | Unique | Obligatoire |
| 03 A/B `clients.multiple_pets`, `clients.multiple_addresses` | Animaux et adresses par client | Unique chacun | Obligatoires |
| 04 A/B `animal.quick_info`, `animal.instructions_edit` | Rubriques terrain et droits de modification | Multiple + unique | Obligatoires |
| 05 A/B `keys.tracking`, `keys.visibility` | Suivi et visibilité des clés | Multiple + unique | Obligatoires; les codes ne sont jamais saisis |
| 06 A/B `orders.pricing_unit`, `orders.multiple_pets` | Vente à l’unité/forfait et commandes multi-animaux | Unique | Obligatoires |
| 07 `orders.recurring_schedule` | Dates d’une commande de 18 promenades | Unique | Obligatoire |
| 08 A/B `finance.pricing`, `finance.payment_scope` | Tarifs et périmètre des paiements | Unique chacun | Obligatoires; suivi détaillé non présumé |
| 09 `missions.cancellation` | Annulation, report, quantité à utiliser | Unique | Obligatoire |
| 10 A/B `assignment.mode`, `assignment.conflicts` | Choix d’un intervenant et conflits d’horaires | Unique chacun | Obligatoires |
| Adaptatif `assignment.final_decider` | Confirmation de l’affectation si le choix n’est pas manuel | Unique | Obligatoire si visible; résolu sans question si mode manuel |
| 11 `assignment.replacement` | Remplacement en cas d’absence | Unique | Obligatoire |
| 12 A/B `staff.horizon`, `staff.mission_actions` | Horizon mobile et actions sur mission | Unique + multiple | Obligatoires |
| 13 `missions.incident_response` | Contact, signalement et procédure en cas d’incident | Unique | Obligatoire |
| 14 A/B `geo.enabled`, `geo.metric` | Type de localisation et distance/temps | Unique | Métrique visible avec localisation |
| 15 `geo.availability` | Affichage d’un intervenant déjà occupé | Unique | Facultatif; adresse de référence et classement par temps |
| 16 A/B `dashboard.counting`, `dashboard.average_basket` | Règles de compteurs et panier moyen | Unique chacun | Obligatoires |
| 17 A/B `data.sources`, `staff.notifications` | Sources à importer et moyen de prévenir l’équipe | Multiple | Obligatoires |
| 18 A/B `priorities.mvp`, `priorities.missing` | Deux priorités et angle mort | Multiple (maximum 2) + unique | Obligatoires; précision texte 120 caractères si demandée |
| Approfondissement `orders.portal_validation` | Validation d’une commande saisie par un client | Unique | Facultatif si clients saisissent |
| Approfondissement `animal.care_tracking` | Consulter, confirmer ou indiquer « sans objet » pour le suivi d’un soin | Unique | Facultatif si rubrique santé sélectionnée |
| Approfondissement `geo.mode_detail` | Moment d’usage GPS | Unique | Requis si GPS pendant le travail |
| Approfondissement `assignment.replacement_approval` | Validation d’un remplacement | Unique | Facultatif si suggestion/réaffectation automatique |

Le parcours comprend 17 écrans toujours pertinents au niveau de base, l’écran d’affectation conditionnel/résolu, et les approfondissements liés aux choix. Parcours maximal codé : 22 écrans visibles, sous le plafond de 24. La durée cible de 5–8 minutes doit encore être mesurée auprès d’une personne non technique; aucune durée n’est annoncée comme mesurée.
