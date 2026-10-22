# Déployer le questionnaire

## Firebase

1. Dans le projet `pety-1f7c9`, activer Authentication → **Anonyme**.
2. Créer Firestore en mode production et publier les règles et index du dépôt après validation de l’émulateur.
3. Dans Authentication → domaines autorisés, ajouter le domaine GitHub Pages.
4. Pour tester les règles localement : `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
5. Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant de partager le questionnaire.

La répondante ne crée aucun compte. Firebase conserve la session anonyme pour ses brouillons et envois. Chaque nouvel envoi crée une entrée Firestore distincte horodatée; l’espace responsable charge tous les formulaires et les classe du plus récent au plus ancien. Pour permettre cette lecture sans connexion administrateur ni Cloud Function, les règles autorisent tout utilisateur anonyme du site à lister la collection `submissions`. Le code `1199` ne protège donc que l’interface; les réponses ne sont pas confidentielles contre une personne techniquement avertie. Utiliser cette configuration seulement si cette exposition est acceptée.

Après chaque modification de `firestore.rules`, publier les règles depuis le dossier du projet avec `firebase deploy --only firestore:rules --project pety-1f7c9`. Si les formulaires ne s’enregistrent pas encore, vérifier dans la console Firebase que le fournisseur Authentication **Anonyme** est activé et que les règles de ce dépôt sont publiées.

La règle V4 valide `schemaVersion`, `resolvedFacts` et `unresolvedDecisions`. Pour reprendre les nouveaux brouillons, publier `firestore.rules` avant de diffuser la V4. Les anciens documents V3 restent lisibles; leurs brouillons seront écrits au nouveau format à leur prochaine sauvegarde.

## GitHub Pages

Le dépôt est `leo50978/qcmm`. Le workflow `.github/workflows/pages.yml` teste, construit et déploie sur les push vers `main`. Dans GitHub Settings → Pages, choisir **GitHub Actions** comme source. La clé publique SSH se trouve dans `GITHUB_SSH_PUBLIC_KEY.txt`; ne jamais ajouter la clé privée `.ssh/github_qcmm_ed25519` au dépôt.
