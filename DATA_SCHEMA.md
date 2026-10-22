# Schéma des réponses

## Collection `submissions`

| Champ | Type | Usage |
|---|---|---|
| `questionnaireVersion` | chaîne | Banque utilisée pour interpréter les réponses (`4.0.0`) |
| `schemaVersion` | entier | Schéma de données (`4`) |
| `status` | `draft`, `incomplete`, `submitted` | Brouillon modifiable; réponse envoyée verrouillée |
| `respondentId` | chaîne | UID de la session Firebase anonyme |
| `answers` | map | Réponses actives; un sous-champ `__archived` peut garder les réponses de branche et les valeurs V3 ambiguës |
| `resolvedFacts` | map | Faits issus de la fiche, réponses et dérivations, avec valeur, source, statut et preuve |
| `unresolvedDecisions` | liste d’identifiants | Réponses actives « à clarifier » |
| `createdAt`, `updatedAt`, `submittedAt` | timestamp serveur | Création, sauvegarde et envoi; `submittedAt` reste nul sur un brouillon |

Les réponses hors branche ne sont jamais incluses dans le rapport ou l’envoi final. Elles restent archivées dans un brouillon afin d’être récupérables si la personne revient à cette branche; elles ne sont restaurées que si elles restent valides pour la question. Les soumissions V3 déjà finalisées restent inchangées et sont affichées avec la banque V3. Les brouillons V3 sont migrés en mémoire puis enregistrés en V4 à la prochaine sauvegarde.

## Provenance des faits

Chaque fait comporte `value`, `source` (`client_brief`, `questionnaire` ou `derived`), `status` (`confirmed`, `to_discuss`, `unknown`, `invalidated`), `evidence` et `dependsOn`. La fiche initiale est codée dans `src/data/client-brief.js`; les faits de fonctionnement ne sont pas présumés à partir d’un besoin de module. `recalculate()` fournit aussi une trace déterministe d’affichage, masquage et obligation.

## Règles d’accès

- Une session anonyme ne peut lire, modifier ou lister que ses propres brouillons avec une requête filtrée par `respondentId`.
- Une session anonyme ne peut pas lire les réponses d’autrui ni modifier une réponse envoyée.
- La règle Firestore permet une liste complète aux comptes ayant la custom claim `admin: true`. Le code `1199` dans l’interface n’est pas cette autorisation; l’interface actuelle ne récupère que les formulaires de la session anonyme courante.
- La suppression client est interdite.

Les réponses de cadrage ne doivent contenir aucun vrai digicode, adresse privée, donnée médicale identifiable ou position GPS réelle. L’entreprise doit encore confirmer le contact de confidentialité et la durée de conservation avant la diffusion.
