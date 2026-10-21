# Rapport de validation

## Ce qui a été préparé

- Suite `node:test` couvrant l’audit des identifiants et conditions, les branches GPS, les faits résolus, les réponses à discuter, la validation, les réponses Autre, plusieurs parcours et la reprise du même état.
- Trois scénarios supplémentaires du stockage local : reprise/effacement, expiration après sept jours et indisponibilité de `localStorage`.
- Suite complémentaire de règles Firestore à exécuter avec l’émulateur Firebase.
- Mesure agrégée locale en mode démo : nombre de sessions, durée totale, nombre total d’écrans, sessions terminées ou interrompues. Aucune réponse n’est mesurée ni transmise.

## Résultats réellement observés dans cet environnement

| Contrôle | Résultat |
|---|---|
| Lecture intégrale du prompt | Effectuée (614 lignes, 17 sections) |
| Audit des fichiers | Le dossier ne contenait que le prompt Markdown; pas de dépôt Git initialisé |
| Manifestes JSON | `package.json`, `firebase.json` et `firestore.indexes.json` analysés sans erreur avec PowerShell |
| Scénarios du moteur JavaScript | 18/18 exécutés avec le moteur V8 intégré, à partir des callbacks de `tests/questionnaire.test.js` |
| Scénarios de persistance locale | 3/3 exécutés avec le moteur V8 intégré, à partir des callbacks de `tests/persistence.test.js` |
| Syntaxe des modules source | 7/7 fichiers JavaScript sous `src/` analysés par V8 après retrait de leur syntaxe d’import/export |
| `npm test` sous Node.js | 21 réussis, 0 échec, 1 ignoré (suite Firestore Emulator) |
| `npm run build` | Réussi : CSS Tailwind généré et site assemblé dans `site/` |
| Installation npm | Réussie avec Node.js 22.23.4 et npm 10.9.9; npm signale 27 vulnérabilités dans les dépendances (17 modérées, 10 élevées) |
| Tests Firestore Emulator | Non exécutés : Java et Firebase CLI absents |
| Parcours navigateur et mobile | Non exécutés : Edge et Chrome sont présents, mais le lancement headless échoue dans cet environnement (Edge : processus GPU; Chrome : aucun DOM restitué) |
| Workflow GitHub Pages | Ajouté dans `.github/workflows/pages.yml`; exécution après push à vérifier |
| Déploiement GitHub Pages | En attente du push initial vers `leo50978/qcmm` |
| Clé SSH GitHub | Authentification vérifiée pour `leo50978/qcmm` avec la nouvelle clé |

Les 21 scénarios réussis correspondent à l’exécution réelle de `npm test` sous Node.js. Un scénario Firestore reste ignoré tant que l’émulateur n’est pas disponible. Le contrôle navigateur headless précédemment tenté n’a pas produit de DOM fiable. Le déploiement permettra de vérifier le rendu final, la connexion Firebase et les domaines autorisés.




