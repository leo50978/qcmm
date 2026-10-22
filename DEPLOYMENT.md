# Déployer le questionnaire

## Firebase

1. Dans le projet `pety-1f7c9`, activer Authentication → **Anonyme**.
2. Créer Firestore en mode production et déployer les règles et index du dépôt.
3. Dans Authentication → domaines autorisés, ajouter le domaine GitHub Pages.
4. Pour tester les règles localement : `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
5. Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant de partager le questionnaire.

La répondante ne crée aucun compte. Firebase conserve la session anonyme et limite chaque navigateur à sa propre réponse. L’espace responsable utilise le code `1199` pour afficher cette réponse sur le même navigateur. Le code est visible dans les fichiers du site et ne protège pas l’accès aux données; aucune Cloud Function n’est utilisée. Il n’est donc pas possible de consulter depuis cet espace les réponses enregistrées dans d’autres navigateurs.

## GitHub Pages

Le dépôt est `leo50978/qcmm`. Le workflow `.github/workflows/pages.yml` teste, construit et déploie sur les push vers `main`. Dans GitHub Settings → Pages, choisir **GitHub Actions** comme source. La clé publique SSH se trouve dans `GITHUB_SSH_PUBLIC_KEY.txt`; ne jamais ajouter la clé privée `.ssh/github_qcmm_ed25519` au dépôt.
