# Questionnaire de préparation · pet-sitting

Parcours individuel en français pour définir les besoins du futur logiciel de gestion. La répondante ouvre le questionnaire sans compte; une session Firebase anonyme sauvegarde ses réponses dans Firestore et permet de reprendre sur le même navigateur.

## Démarrer

- Installer Node.js 22 ou ultérieur, puis lancer `npm install` et `npm run build`.
- Dans PowerShell, exécuter `powershell -ExecutionPolicy Bypass -File scripts/serve.ps1`, puis ouvrir `http://127.0.0.1:4173`.
- Les réponses ne sont pas enregistrées si Firebase est indisponible. Aucune démo ou sauvegarde locale de remplacement n’est proposée.

## Parcours et données

- Une étape à la fois, avec retour, vérification et modification des réponses.
- Les questions suivent les réponses; les points « à discuter » sont conservés comme éléments à clarifier.
- Les brouillons et envois sont associés à l’identifiant anonyme Firebase du navigateur.
- L’espace responsable demande uniquement le code d’accès. Une Firebase Cloud Function vérifie le code côté serveur puis transmet les réponses à la page dédiée; les exports JSON, CSV et Markdown y sont disponibles.
- Firestore ne permet à une session anonyme d’accéder qu’à sa propre réponse. Seuls les administrateurs peuvent consulter la liste.

## Configuration

La configuration Firebase Web fournie se trouve dans `src/config/app-config.js`. Dans la console Firebase du projet `pety-1f7c9`, activer les fournisseurs **Anonyme** et **E-mail/Mot de passe**, créer Firestore en mode production, déployer les règles et autoriser le domaine GitHub Pages. Les étapes sont décrites dans [DEPLOYMENT.md](DEPLOYMENT.md).

Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant diffusion. Configurer `ADMIN_ACCESS_CODE` dans Firebase Secret Manager avant de déployer la fonction. Ne jamais enregistrer le code dans le dépôt.

## Vérifications

- `npm test` lance les tests du moteur, des sessions anonymes et de l’affichage adaptatif.
- Pour tester Firestore, exécuter `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
- `npm run build` produit le site statique dans `site/`, déployé par GitHub Pages.
