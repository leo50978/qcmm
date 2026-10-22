# Rapport de validation

## Contrôles exécutés

| Contrôle | Résultat |
|---|---|
| `npm test` sans émulateur | 24 réussis, 1 ignoré (test des règles Firestore) |
| Règles Firestore | 23 tests réussis dans l’émulateur lors de la validation précédente; les règles n’ont pas changé depuis |
| Code admin | Code exact, limites d’essais et flux code invalide/valide vers la page réponses vérifiés avec navigateur et Firebase simulé |
| `npm run build` | Réussi : CSS Tailwind et site préparé dans `site/` |
| Vérification navigateur locale | Parcours rendu dans Chrome avec session Firebase simulée; accueil, étape, progression mobile et passage à l’étape suivante vérifiés |
| Hauteur mobile 375 × 667 | La page reste à 667 px; aucune extension du document; groupes denses séparés en étapes |
| Firebase Functions réelle | Non déployée ni testée dans le projet de production |

## À activer avant usage réel

Dans Firebase `pety-1f7c9`, activer le fournisseur **Anonyme**, saisir `ADMIN_ACCESS_CODE` dans Secret Manager, déployer la fonction avec `firebase deploy --only functions`, et autoriser le domaine GitHub Pages. Les fonctions Firebase demandent le forfait Blaze. Compléter le nom de l’entreprise, le contact confidentialité et la durée de conservation dans `src/config/app-config.js`.
