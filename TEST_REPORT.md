# Rapport de validation

## Contrôles exécutés

| Contrôle | Résultat |
|---|---|
| `npm test` avec Firestore Emulator | 23 réussis, aucun échec ni test ignoré |
| Règles Firestore | Accès anonyme limité à son propre document; liste admin autorisée; soumission terminée immuable |
| `npm run build` | Réussi : CSS Tailwind et site préparé dans `site/` |
| Vérification navigateur locale | Parcours rendu dans Chrome avec session Firebase simulée; accueil, étape, progression mobile et passage à l’étape suivante vérifiés |
| Hauteur mobile 375 × 667 | La page reste à 667 px; aucune extension du document; groupes denses séparés en étapes |
| Authentification Firebase réelle | Non testée dans le projet de production |

## À activer avant usage réel

Dans Firebase `pety-1f7c9`, activer les fournisseurs **Anonyme** et **E-mail/Mot de passe**, publier les règles Firestore et autoriser le domaine GitHub Pages. Compléter le nom de l’entreprise, le contact confidentialité et la durée de conservation dans `src/config/app-config.js`.
