# Déployer le questionnaire

## Firebase

1. Dans le projet `pety-1f7c9`, activer Authentication → **Anonyme**.
2. Créer Firestore en mode production et publier les règles et index du dépôt après validation de l’émulateur.
3. Dans Authentication → domaines autorisés, ajouter le domaine GitHub Pages.
4. Pour tester les règles localement : `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
5. Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant de partager le questionnaire.

La répondante ne crée aucun compte. Firebase conserve la session anonyme et limite chaque navigateur à ses propres formulaires. Chaque nouvel envoi crée une entrée distincte horodatée; l’espace responsable les classe du plus récent au plus ancien. Le code `1199` est visible dans les fichiers du site et n’accorde aucun accès Firestore. Sans authentification administrateur réelle, l’interface peut voir uniquement les réponses de la session courante. Aucune Cloud Function n’est utilisée. Pour une consultation inter-appareils, il faudra activer une authentification administrateur avec custom claim `admin: true`.

La règle V4 valide `schemaVersion`, `resolvedFacts` et `unresolvedDecisions`. Pour reprendre les nouveaux brouillons, publier `firestore.rules` avant de diffuser la V4. Les anciens documents V3 restent lisibles; leurs brouillons seront écrits au nouveau format à leur prochaine sauvegarde.

## GitHub Pages

Le dépôt est `leo50978/qcmm`. Le workflow `.github/workflows/pages.yml` teste, construit et déploie sur les push vers `main`. Dans GitHub Settings → Pages, choisir **GitHub Actions** comme source. La clé publique SSH se trouve dans `GITHUB_SSH_PUBLIC_KEY.txt`; ne jamais ajouter la clé privée `.ssh/github_qcmm_ed25519` au dépôt.
