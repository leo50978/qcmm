# Schéma des réponses

## Collection `submissions`

Chaque document porte l’UID de session anonyme Firebase de la répondante; son navigateur conserve cette session pour la reprise.

| Champ | Type | Usage |
|---|---|---|
| `questionnaireVersion` | chaîne | Version d’interprétation des réponses |
| `status` | `draft`, `incomplete`, `submitted` | Brouillon modifiable; envoi final verrouillé |
| `respondentId` | UID anonyme | Correspond à l’UID du document |
| `answers` | map de réponses | Choix explicites seulement; faits recalculés dans le rapport |
| `createdAt`, `updatedAt`, `submittedAt` | timestamp serveur | Métadonnées minimales |

Les réponses masquées après un changement de branche sont retirées avant sauvegarde ou envoi. Aucune copie de démo ou de reprise locale n’est conservée. `answeredAt` est l’heure déclarée par le navigateur; les métadonnées du document utilisent l’horloge serveur.

Les états restent distincts : sans réponse, passée, sans objet, à clarifier et autre avec précision courte.

## Règles

- Une session anonyme peut lire et modifier uniquement son propre brouillon.
- Une session anonyme ne peut ni lister les documents ni lire ceux d’autrui.
- Seuls les comptes porteurs de `admin: true` peuvent lister et consulter toutes les réponses.
- Les envois `incomplete` et `submitted` sont immuables côté répondante; aucune suppression client n’est autorisée.

Le questionnaire n’accepte pas de données réelles de clients. Ne pas ajouter de données médicales, codes d’accès ou géolocalisation au schéma.
