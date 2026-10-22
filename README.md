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
- L’espace responsable demande le code `1199` et affiche la réponse sauvegardée dans le navigateur courant. Les exports JSON, CSV et Markdown sont disponibles.
- Le code est une simple barrière d’interface, pas un contrôle de sécurité. Firestore limite chaque session anonyme à sa propre réponse; aucune autre réponse ne peut être consultée depuis cet espace.

## Configuration

La configuration Firebase Web fournie se trouve dans `src/config/app-config.js`. Dans la console Firebase du projet `pety-1f7c9`, activer le fournisseur **Anonyme**, créer Firestore en mode production, déployer les règles et autoriser le domaine GitHub Pages. Les étapes sont décrites dans [DEPLOYMENT.md](DEPLOYMENT.md).

Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant diffusion.

## Vérifications

- `npm test` lance les tests du moteur, des sessions anonymes et de l’affichage adaptatif.
- Pour tester Firestore, exécuter `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
- `npm run build` produit le site statique dans `site/`, déployé par GitHub Pages.
