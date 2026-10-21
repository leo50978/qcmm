# Déployer le questionnaire

## Firebase

1. Dans le projet `pety-1f7c9`, activer Authentication → **Anonyme** et **E-mail/Mot de passe**.
2. Créer Firestore en mode production.
3. Déployer les règles et index avec Firebase CLI : `firebase deploy --only firestore --project pety-1f7c9`.
4. Dans Authentication → domaines autorisés, ajouter le domaine GitHub Pages du site.
5. Pour les tests locaux des règles : `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
6. Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant de partager le questionnaire.

La répondante ne crée aucun compte. Firebase lui attribue automatiquement une session anonyme qui persiste dans son navigateur. Les règles limitent cette session à son document Firestore; les comptes avec la revendication `admin: true` peuvent consulter les réponses.

Pour attribuer le rôle administrateur, utiliser des identifiants Google Application Default Credentials autorisés et lancer `node scripts/set-admin-claim.mjs <UID> grant`. Révoquer le rôle avec `node scripts/set-admin-claim.mjs <UID> revoke`. Ne jamais copier les identifiants dans le dépôt.

## GitHub Pages

Le dépôt cible est `leo50978/qcmm`. Le workflow `.github/workflows/pages.yml` teste, construit et déploie sur les push vers `main`. Dans GitHub Settings → Pages, choisir **GitHub Actions** comme source. La clé publique SSH enregistrée se trouve dans `GITHUB_SSH_PUBLIC_KEY.txt`; la clé privée `.ssh/github_qcmm_ed25519` ne doit jamais être copiée dans le dépôt.
