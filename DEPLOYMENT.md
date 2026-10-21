# Préparer Firebase et GitHub Pages

## Firebase

1. Dans le projet Firebase `pety-1f7c9`, vérifier que l’application Web est active et que les domaines autorisés incluent le domaine GitHub Pages.
2. Activer **Authentication → E-mail/Mot de passe**. Créer le compte de la responsable. Chaque répondant inscrit ne peut accéder qu’à son propre document.
3. Avec Firebase CLI connecté à un compte ayant les droits nécessaires, créer la base Firestore en mode production, puis publier les règles et index avec `firebase deploy --only firestore --project pety-1f7c9`.
4. Pour attribuer le rôle d’administration, utiliser les identifiants Google Application Default Credentials autorisés et `node scripts/set-admin-claim.mjs <UID> grant`. Retirer le rôle avec `node scripts/set-admin-claim.mjs <UID> revoke`. Ne jamais ajouter les identifiants au dépôt.
5. Les tests de règles peuvent être exécutés sans toucher à la production avec `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
6. Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant diffusion publique.

Les règles limitent chaque utilisateur à son document. La lecture de listes est réservée aux administrateurs; une réponse envoyée ou marquée incomplète devient immuable côté répondant.

## GitHub Pages

Le dépôt cible est `leo50978/qcmm`. Le code est poussé sur `main` et le workflow `.github/workflows/pages.yml` construit, teste et publie le site à chaque push. Dans GitHub **Settings → Pages**, choisir **GitHub Actions** comme source si cela n’est pas déjà configuré. Ajouter ensuite le domaine GitHub Pages aux domaines autorisés de Firebase Authentication.

La clé publique SSH enregistrée dans GitHub se trouve dans `GITHUB_SSH_PUBLIC_KEY.txt`. La clé privée locale `.ssh/github_qcmm_ed25519` ne doit jamais être copiée dans le dépôt.
