# Traçabilité des besoins de la fiche

Les besoins ci-dessous sont confirmés par la fiche fournie. Le questionnaire précise les règles à appliquer sans demander si le module lui-même est souhaité. Les recommandations restent séparées et non validées.

| Besoin confirmé | Faits métier | Questions V4 | Précisions encore inconnues |
|---|---|---|---|
| Tableau de bord : compteurs mensuels promenades/visites/gardes, graphique historique, panier moyen, tableau salariés/prestations/heures | `dashboard.monthly_counts`, `dashboard.historical_chart`, `dashboard.staff_summary` | `dashboard.counting`, `dashboard.average_basket` | Période de comparaison, arrondis, traitement des annulations |
| Clients et animaux reliés, historique et panier personnel | `clients.linked_pets` | `clients.multiple_addresses`, `orders.multiple_pets` | Règles de fusion, conservation et doublons |
| Fiche mobile avec alertes santé, caractère, peurs, cachettes, alimentation, traitements, allergies, vétérinaire, clés et accès | `animal.mobile_profile` | `animal.instructions_edit`, `animal.care_tracking`, `keys.tracking`, `keys.visibility` | Qui saisit les dossiers réels et règle précise d’alerte |
| Saisie de prestation client/animal/type/quantité/prix et création des missions | `orders.admin_entry` | `orders.entry`, `orders.portal_validation`, `orders.pricing_unit`, `orders.package_tracking`, `orders.recurring_schedule`, `orders.duration_tracking`, `finance.pricing`, `finance.payment_scope`, `missions.cancellation` | Paiements détaillés, délais, remboursements et règles de forfait |
| Planning salarié quotidien, itinéraire vers Google/Apple Maps et alerte médicale | `staff.daily_timeline`, `staff.map_link` | `staff.horizon`, `staff.mission_actions`, `missions.incident_response`, `staff.notifications` | Détail d’alerte, escalade et informations affichées sur itinéraire |
| Carte des clients/animaux, recherche d’adresse, classement par proximité et kilomètres | `clients.map`, `clients.address_search`, `geo.client_distance_km` | `assignment.criteria`, `geo.metric`, `geo.availability` | Source et fraîcheur des adresses, temps de trajet |
| Position des salariés à préciser; aucun GPS temps réel acquis | `staff.employee_location` (unknown), `features.live_gps` (unknown) | `geo.enabled`, `geo.mode_detail` | Position fixe, ponctuelle ou GPS en service; finalité et durée |
| Planning par colonnes, glisser-déposer et import | `backoffice.staff_columns`, `backoffice.drag_reassign`, `backoffice.import` | `assignment.actor`, `assignment.criteria`, `assignment.conflicts`, `assignment.replacement`, `data.sources`, `data.import_scope` | Disponibilités, règles de conflit, formats et nettoyage des imports |
| Priorités de première livraison | À établir selon réponse | `priorities.mvp`, `priorities.missing` | Les priorités ne retirent pas les besoins confirmés de la fiche |

## Migration V3 vers V4

La correspondance exécutable est dans `src/data/migrations.js`; les réponses incompatibles sont archivées au lieu d’être recodées silencieusement.

| V3 | V4 | Traitement |
|---|---|---|
| `orders.entry`, `team.*`, `clients.multiple_addresses`, `animal.instructions_edit`, `animal.care_tracking`, `keys.*`, `orders.pricing_unit`, `orders.recurring_schedule`, `finance.*`, `assignment.conflicts`, `assignment.replacement`, `staff.horizon`, `geo.*`, `dashboard.*`, `priorities.*` | Identifiants compatibles conservés | Valeur préservée seulement si elle existe encore et passe la validation V4 |
| `clients.multiple_pets` | Aucun | Archivé; la fiche confirme déjà les animaux reliés au client |
| `animal.quick_info` | Aucun | Archivé; rubriques déjà confirmées par la fiche |
| `assignment.mode=manual` | `assignment.actor=manual` | Correspondance exacte |
| `assignment.mode=availability/proximity/familiarity` | `assignment.criteria` | Converti en critère précis; l’acteur reste sans réponse |
| `assignment.mode=combined` | Aucun choix automatique | Archivé, car les deux dimensions n’étaient pas séparées |
| `assignment.final_decider` | Aucun | Archivé pour éviter de dupliquer le choix de l’acteur |
| `missions.cancellation` mono-choix | même ID en multi-choix | Les valeurs explicites deviennent une liste; `several` est archivé |
| `staff.mission_actions=view` | Aucun | Retiré, car la consultation est comprise dans le planning demandé; les autres actions sont gardées |
| `staff.notifications=check_app` | `staff.change_info` | La consultation volontaire n’est pas convertie en alerte; elle reste à décider. Les anciens canaux e-mail/SMS/notification sont conservés |
| `data.sources=several` | Aucun | Retiré; autres sources réellement choisies gardées |
| `geo.metric=both` | `geo.metric=travel_time` | Le temps reste choisi; les kilomètres sont déjà un besoin confirmé |

Les documents envoyés avec `questionnaireVersion: 3.0.0` demeurent inchangés et se lisent avec la banque V3. La migration du brouillon n’est sauvegardée qu’à la prochaine modification ou au prochain envoi.
