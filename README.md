# Questionnaire de préparation · pet-sitting

Parcours individuel en français pour définir les besoins du futur logiciel de gestion. La répondante ouvre le questionnaire sans compte; une session Firebase anonyme sauvegarde ses réponses dans Firestore et permet de reprendre sur le même navigateur.

## Démarrer

- Installer Node.js 22 ou ultérieur, puis lancer `npm install` et `npm run build`.
- Dans PowerShell, exécuter `powershell -ExecutionPolicy Bypass -File scripts/serve.ps1`, puis ouvrir `http://127.0.0.1:4173`.
- Les réponses ne sont pas enregistrées si Firebase est indisponible. Aucune démo ou sauvegarde locale de remplacement n’est proposée.

## Parcours et données

- Une étape à la fois, avec retour, vérification et modification des réponses.
- Questionnaire V4 construit depuis les besoins confirmés de la fiche : 18 étapes standard et 22 au maximum selon les branches. Les points « à clarifier » restent ouverts.
- Les besoins déjà exprimés (fiches liées, carte clients, distance en kilomètres, planning mobile, modules du tableau de bord) ne sont pas redemandés. Les modalités encore inconnues sont posées séparément.
- Les faits métier portent une provenance et un statut. Les exports JSON, Markdown et CSV séparent les besoins de départ, les choix, les sujets ouverts et les recommandations non validées.
- Les brouillons V3 sont migrés avec la table de correspondance `src/data/migrations.js`; les réponses ambiguës sont archivées et les anciennes soumissions restent analysées avec leur banque V3.
- Chaque envoi crée un formulaire distinct, daté et associé à la session anonyme Firebase du navigateur. Un brouillon peut être repris avant envoi.
- L’espace responsable demande le code `1199` et affiche l’historique des formulaires enregistrés dans le navigateur courant, du plus récent au plus ancien. Les exports JSON, CSV et Markdown sont disponibles pour chaque formulaire.
- Le code est une simple barrière d’interface, pas un contrôle de sécurité. Toute session anonyme peut lister les réponses dans Firestore; cette configuration expose les réponses à un visiteur techniquement averti. Voir [DEPLOYMENT.md](DEPLOYMENT.md).

## Configuration

La configuration Firebase Web fournie se trouve dans `src/config/app-config.js`. Dans la console Firebase du projet `pety-1f7c9`, activer le fournisseur **Anonyme**, créer Firestore en mode production, déployer les règles et autoriser le domaine GitHub Pages. Les étapes sont décrites dans [DEPLOYMENT.md](DEPLOYMENT.md).

Compléter `businessName`, `privacyContact` et `retentionPeriod` dans `src/config/app-config.js` avant diffusion.

## Vérifications

- `npm test` lance les tests du moteur V4, des branches, de migration, des sessions anonymes et de l’affichage adaptatif.
- Pour tester Firestore, exécuter `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`.
- `npm run build` produit le site statique dans `site/`, déployé par GitHub Pages.
