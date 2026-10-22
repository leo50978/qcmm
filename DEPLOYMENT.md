# Déployer le questionnaire

## Firebase

1. Dans le projet `pety-1f7c9`, activer Authentication → **Anonyme**.
2. Créer Firestore en mode production.
3. Saisir le code responsable dans Secret Manager : `firebase functions:secrets:set ADMIN_ACCESS_CODE --project pety-1f7c9`. Entrer le code transmis à la responsable dans l’invite; ne pas l’ajouter au dépôt.
4. Déployer le service de code, les règles et les index : `firebase deploy --only functions,firestore --project pety-1f7c9`.
5. Dans Authentication → domaines autorisés, ajouter le domaine GitHub Pages du site.
6. Pour les tests locaux des règles : `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
7. Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant de partager le questionnaire.

La répondante ne crée aucun compte. Firebase lui attribue automatiquement une session anonyme qui persiste dans son navigateur. Les règles limitent cette session à son document Firestore. La responsable entre un code dans l’application; une fonction Firebase le vérifie côté serveur et renvoie les réponses avec l’Admin SDK. Après cinq essais depuis la même adresse réseau, le service bloque les nouvelles tentatives pendant quinze minutes. Le code et les réponses ne sont pas livrés dans les fichiers publics du site.

Les Cloud Functions exigent le forfait Firebase Blaze et un compte de facturation lié. Les quotas gratuits s’appliquent, mais une consommation au-delà peut être facturée. Vérifier le budget du projet avant le déploiement.

## GitHub Pages

Le dépôt cible est `leo50978/qcmm`. Le workflow `.github/workflows/pages.yml` teste, construit et déploie sur les push vers `main`. Dans GitHub Settings → Pages, choisir **GitHub Actions** comme source. La clé publique SSH enregistrée se trouve dans `GITHUB_SSH_PUBLIC_KEY.txt`; la clé privée `.ssh/github_qcmm_ed25519` ne doit jamais être copiée dans le dépôt.
