# Schéma de données et accès

## Collection `submissions`

Document ID = UID Firebase Authentication du répondant (un document par répondant).

| Champ | Type | Usage |
|---|---|---|
| `questionnaireVersion` | chaîne | Interprétation stable des réponses |
| `status` | `draft`, `incomplete`, `submitted` | Brouillon modifiable; états incomplet/soumis terminaux |
| `respondentId` | chaîne UID | Doit correspondre au document et à l’utilisateur authentifié |
| `answers` | map d’identifiants vers `{ value, otherText?, inlineText?, answeredAt? }` ou `{ status: 'skipped' }` | Réponses explicites seulement; faits recalculés dans le rapport |
| `createdAt`, `updatedAt`, `submittedAt` | timestamp serveur | Métadonnées minimales |

Les réponses masquées après changement de branche sont retirées avant sauvegarde/envoi. La copie locale de reprise expire au bout de sept jours; elle est effacée après un envoi Firebase réussi ou une déconnexion dont la sauvegarde distante a réussi. Si la déconnexion survient hors ligne, la copie reste disponible jusqu’à son expiration pour éviter de perdre le brouillon. Les faits n’ont pas autorité de stockage; ils sont recalculés selon la version des questions. `answeredAt` est une heure déclarée par le navigateur et sert uniquement à situer une réponse dans l’interface; seules les métadonnées Firestore `createdAt`, `updatedAt` et `submittedAt` utilisent l’horloge serveur.

Les états de réponse distincts sont : absente (`unanswered`), passée (`skipped` sur une étape facultative), sans objet (`not_applicable`), à discuter (`to_discuss`) et autre (`other` avec une précision de 120 caractères maximum).

## Règles

- Répondant authentifié : `get` et écritures sur son propre document uniquement.
- `list` et lecture d’autres documents : revendication `admin: true` attribuée côté serveur.
- Aucun rôle n’est lu depuis une donnée éditable par le client. Pas de suppression côté client.
- Brouillon modifiable; `incomplete` et `submitted` immuables côté répondant.
- Le mode démo écrit localement dans `localStorage`; il ne prétend pas être une sauvegarde Firebase.

Les réponses ne contiennent pas de données réelles de clients finaux. Éviter d’ajouter des données de santé, de digicode ou de géolocalisation au schéma.
