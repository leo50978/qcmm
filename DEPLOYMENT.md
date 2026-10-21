# Préparer Firebase et GitHub Pages

## Firebase

1. Dans le projet Firebase `pety-1f7c9`, vérifier que l’application Web et les domaines autorisés correspondent à l’URL de prévisualisation/GitHub Pages.
2. Activer **Authentication → E-mail/Mot de passe**. Créer ou laisser créer le compte de la responsable. L’inscription crée un compte qui ne peut accéder qu’à son propre document.
3. Installer Firebase CLI (`npm install --global firebase-tools`), se connecter (`firebase login`), créer la base Firestore en mode production, puis publier les règles et index déclarés dans `firebase.json` avec `firebase deploy --only firestore --project pety-1f7c9`. `firestore.indexes.json` ne demande aucun index composé.
4. Pour l’administration, installer les dépendances de développement, fournir à l’outil local des identifiants Google Application Default Credentials autorisés pour Firebase Admin, puis lancer `node scripts/set-admin-claim.mjs <UID> grant`. Remplacer `<UID>` par l’UID réel visible dans Firebase Authentication. Retirer ensuite le rôle avec `node scripts/set-admin-claim.mjs <UID> revoke`. Le compte doit se reconnecter. Ne jamais copier le fichier de credentials dans le dépôt, ni ajouter une commande d’administration au JavaScript public.
5. Pour vérifier les règles sans toucher au projet de production : lancer `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`. Le workflow GitHub Actions exécute les tests JavaScript et les tests de règles dans cet émulateur.
6. Avant partage, compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js`; faire valider l’information de confidentialité et la durée par la commanditaire.
7. Envisager Firebase App Check et une stratégie de limitation d’abus avant diffusion publique. Ne saisir aucune donnée réelle de clients finaux dans ce questionnaire.

Les règles limitent chaque utilisateur à `get` et à l’écriture du document dont l’identifiant est son UID. Les opérations `list` sont réservées aux comptes portant la revendication d’administration. Une réponse `submitted` ou `incomplete` devient immuable côté répondant.

## GitHub Pages

1. Créer un dépôt GitHub et y pousser le contenu du projet.
2. Dans **Settings → Pages**, choisir **GitHub Actions** comme source.
3. Pousser sur `main` ou `master`, ou lancer manuellement le workflow **Build and deploy to GitHub Pages**. Le workflow exécute les tests, génère Tailwind, prépare `site/` et déploie ce dossier.
4. Ajouter le domaine de prévisualisation dans Firebase Authentication → Authorized domains. Pour un domaine personnalisé, configurer le DNS et le domaine dans Pages.

Le dépôt GitHub cible est `leo50978/qcmm`. Le push et la publication restent à effectuer. La clé publique SSH à enregistrer dans GitHub se trouve dans `GITHUB_SSH_PUBLIC_KEY.txt`; sa clé privée locale à conserver est `.ssh/github_qcmm_ed25519` et ne doit jamais être copiée dans le dépôt.
