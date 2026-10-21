# Matrice des décisions atomiques

| Fait / décision | Source de réponse | Besoin initial | Dépendance ou déduction | Redondance évitée |
|---|---|---|---|---|
| `orders.client_entry` | `orders.entry` | D + périmètre d’accès | Si clients aussi, questionner la validation; portail non accepté par défaut | Ne pas demander si des clients enregistrent après la même réponse |
| `clients.multiple_pets` / `clients.multiple_addresses` | `clients.*` | B | Structure relationnelle à définir selon réponse | Animaux et adresses restent deux faits séparés |
| `animal.instructions_editor` | `animal.instructions_edit` | C | Droits de modification | Ne déduit pas le droit de voir les codes |
| `keys.visibility` | `keys.visibility` | C | Accès sensible; visibilité équipe explicitement à confirmer | Pas de code réel demandé |
| `orders.sale_mode`, `orders.schedule` | `orders.*` | D | Commande versus missions planifiées | Le scénario 18 promenades porte sur calendrier, pas facture |
| `finance.scope` | `finance.payment_scope` | A + D | Détail financier seulement si sélectionné | Aucune comptabilité lourde supposée |
| `assignment.mode` | `assignment.mode` | E + G | `manual` produit `manual_admin`; masque `assignment.final_decider` comme déjà résolu | Pas de question répétée sur qui choisit en cas manuel |
| `assignment.conflicts` | `assignment.conflicts` | G | Bloquer ou avertir | Reste distinct du critère de sélection |
| `assignment.replacement` | `assignment.replacement` | E + G | Suggestion/auto ouvre une précision facultative de confirmation | Aucun remplacement automatique par défaut |
| `geo.enabled`, `geo.metric` | `geo.enabled`, `geo.metric` | F | GPS choisi rend `geo.mode_detail` obligatoire; aucun choix GPS ne produit cette question | Pas de GPS induit par l’usage mobile |
| `geo.availability` | `geo.availability` | F | Adresse de référence + temps de trajet ou les deux | La proximité ne déduit pas la disponibilité |
| `dashboard.counting`, `dashboard.average_basket` | `dashboard.*` | A | Règle de calcul confirmée par réponse | Compteurs mensuels et heures restent besoins exprimés |
| `data.sources`, `staff.notifications` | `data.sources`, `staff.notifications` | G + E | Canaux distincts, aucun canal automatique | Planning mobile n’implique pas notification push |
| Priorité MVP | `priorities.mvp` | A–G | Maximum deux choix exprimés | Une priorité n’efface pas les besoins initiaux |

Les réponses sont d’origine `explicit`; les valeurs de faits dérivés ont l’origine `logically_derived`; « à discuter » produit un fait `unresolved`. Le brief initial garde sa provenance et son statut « exprimé dans la fiche ».
