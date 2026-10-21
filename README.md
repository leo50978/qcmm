# Entretien de préparation — pet-sitting

Questionnaire adaptatif en français pour recueillir les décisions de la responsable d’une activité de pet-sitting à Paris. L’application est une base de cadrage ; elle ne constitue pas le logiciel de gestion final.

## Démarrer

- Installer Node.js 22 ou ultérieur, puis exécuter `npm install` et `npm run build` pour générer la feuille Tailwind requise par le site.
- Ouvrir PowerShell dans le dossier du projet et exécuter `powershell -ExecutionPolicy Bypass -File scripts/serve.ps1`.
- Ouvrir `http://127.0.0.1:4173` dans un navigateur récent.
- Sans réseau ou sans Firebase, choisir le mode démo. La progression locale de démo est conservée dans ce navigateur; une copie locale des brouillons Firebase expire après sept jours. Ne saisir aucune donnée réelle de client, de santé, de digicode ou de géolocalisation.
- Pour exécuter les tests automatisés après l’installation : `npm test`.

## Ce qui fonctionne

- Une carte par étape, navigation clavier, retour, vérification et modification des réponses.
- 18 écrans principaux, jusqu’à six approfondissements conditionnels et 24 écrans maximum sur un parcours; seules les précisions qui débloquent une décision métier deviennent obligatoires.
- Réponses « Autre » courtes, « à discuter », branches conditionnelles, faits dérivés et invalidation des branches devenues cachées.
- Sauvegarde locale de démo ou sauvegarde Firestore liée au compte Firebase, reprise et envoi complet ou explicitement incomplet.
- Espace d’analyse accessible seulement avec la revendication Firebase `admin: true`; exports JSON, CSV et Markdown protégés contre les injections CSV usuelles.
- Mesure locale agrégée de durée et de nombre d’écrans en démo, sans collecte ni transmission des réponses de test.

## Configuration

La configuration Web Firebase fournie par la commanditaire est dans `src/config/app-config.js`. Ces valeurs identifient le projet Web ; elles ne donnent pas de privilèges administratifs. L’authentification par e-mail/mot de passe, Firestore et les règles doivent être configurés dans Firebase comme décrit dans [DEPLOYMENT.md](DEPLOYMENT.md). `.env.example` est un aide-mémoire de valeurs publiques : le site statique ne lit pas de variables d’environnement.

`firebaseEnabled` choisit le mode Firebase ou démo. `businessName`, `privacyContact` et `retentionPeriod` permettent de personnaliser l’accueil et l’information de confidentialité. Compléter le contact et la durée avant tout partage avec la responsable.

## Tests et build

`npm test` exécute les tests du moteur (branches, réponses, progression et parcours). Pour inclure les tests de règles Firestore, lancer `firebase emulators:exec --only firestore --project demo-pet-questionnaire "npm test"`. `npm run build` produit le site statique dans `site/`, prêt pour GitHub Pages.

Les commandes réellement exécutées et les limites de validation sont consignées dans [TEST_REPORT.md](TEST_REPORT.md). La banque de questions et les décisions métier se trouvent dans [QUESTION_BANK.md](QUESTION_BANK.md), [DECISION_MAPPING.md](DECISION_MAPPING.md), [docs/MATRICE_DECISIONS.md](docs/MATRICE_DECISIONS.md) et [docs/REGLES_ADAPTATIVES.md](docs/REGLES_ADAPTATIVES.md).
