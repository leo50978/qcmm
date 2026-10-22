# Rapport de validation V4

## Résultats locaux

| Contrôle | Résultat |
|---|---|
| `npm test` | 22 réussis, 1 ignoré; tests de parcours, branches, faits, migration V3, exports et route mobile |
| Banque de questions | 18 étapes au parcours standard; 22 sur le parcours branché testé; audit sans erreur |
| Émulateur Firestore | Non exécuté localement : aucun émulateur disponible dans cet environnement |
| `npm run build` | Réussi; CSS Tailwind et site GitHub Pages préparés dans `site/` |
| Navigation et hauteur en navigateur | Pas validées contre l’application courante : la tentative locale n’a pas réussi à ouvrir une session Firebase. Les tests de logique mobile restent exécutés sans navigateur |
| Publication GitHub Pages | Commit `ffb2411` poussé sur `main`; workflows GitHub déclenchés et en attente au moment du rapport |
| Déploiement des règles Firestore | Non effectué; le fichier `firestore.rules` contient le schéma V4, mais doit être publié dans la console ou CLI Firebase |

Le workflow GitHub du dépôt démarre l’émulateur Firestore avant le build. Vérifier son résultat sur Actions avant de considérer la publication comme validée.

## Limites fonctionnelles connues

- Le code d’interface `1199` n’est pas une autorisation Firestore. Les règles protègent les réponses et interdisent la lecture anonyme des formulaires d’autres navigateurs; l’espace responsable actuel ne peut consulter que ceux de la session locale. Un accès responsable multi-appareils demande une véritable authentification Firebase portant la custom claim `admin: true`.
- Le fournisseur anonyme doit être activé dans Firebase. Les nouvelles règles V4 doivent être publiées pour accepter `schemaVersion`, `resolvedFacts` et `unresolvedDecisions`.
- Le contact confidentialité et la durée de conservation restent à confirmer avant diffusion.
- Le temps de remplissage de 5 à 8 minutes n’a pas été mesuré auprès d’une répondante.
