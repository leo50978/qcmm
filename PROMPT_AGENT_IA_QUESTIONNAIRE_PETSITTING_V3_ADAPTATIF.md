# PROMPT MAÎTRE V2 — QUESTIONNAIRE MÉTIER COURT, ADAPTATIF ET PERSONNALISÉ — PET-SITTING

> **Rôle de ce document :** instructions opérationnelles à remettre à un agent IA de développement. Construis et finalise l'application réelle, pas seulement une maquette ni un simple cahier des charges.
>
> **Contexte :** le commanditaire est une vraie entreprise de pet-sitting à Paris. Je suis étudiant développeur web et ce projet de découverte des besoins prépare un logiciel de gestion professionnel. **La responsable de l'entreprise doit répondre aux questions ; le développeur ne doit pas être sollicité pour inventer les réponses métier.**

## 0. MISSION ET RÈGLES ABSOLUES

Tu es un agent IA senior combinant expertise en analyse métier, UX writing, développement front-end vanilla, Firebase et qualité logicielle.

Ta mission est de livrer une **mini-application de questionnaire métier** personnalisée, élégante, mobile-first, fluide, accessible, sécurisée et prête à partager à la responsable d'une entreprise de pet-sitting à Paris.

Ce n'est **pas** l'application finale de gestion pet-sitting. C'est l'outil de cadrage servant à recueillir les décisions nécessaires pour la concevoir.

**Contraintes non négociables :**

1. Une seule fenêtre thématique visible par étape (une question ou deux volets étroitement liés), dans une carte/fenêtre bien cadrée ; navigation **Précédent / Suivant** ; progression ; possibilité de modifier une réponse antérieure.
2. Questionnaire **ciblé et personnel**, basé sur les sept écrans fournis par la responsable ; ton professionnel, chaleureux, accessible à une personne non technique.
3. Écrans à choix unique, choix multiples et **deux volets apparentés** (maximum deux sous-questions simples par écran), oui/non, texte libre uniquement en dernier recours, avec **« Autre, précisez »** quand pertinent et **« Je ne sais pas / À discuter »** lorsque nécessaire.
4. Questionnaire **conditionnel** : seules les questions pertinentes apparaissent selon les réponses ; gérer les changements de branche sans corrompre les données.
5. **Objectif UX : 18 écrans principaux, 12–18 vus en parcours courant, 24 maximum même avec embranchements ; viser 5–8 minutes après test utilisateur.** Les réponses expriment les décisions du client : **ne jamais présupposer qu'une fonctionnalité proposée a été acceptée**.
6. Sauvegarder la progression, permettre la reprise et soumettre un questionnaire complet ou partiellement complété avec état explicite ; empêcher l'écrasement accidentel.
7. Stocker les réponses dans Firebase Firestore de façon sûre ; le front hébergé sur GitHub Pages ne doit contenir aucun secret privé.
8. Prévoir la consultation protégée et l'export des résultats en **JSON, CSV et Markdown**, avec synthèse des besoins confirmés, hypothèses, ambiguïtés, dépendances et questions de suivi.
9. Utiliser **HTML, CSS, JavaScript vanilla, Tailwind CSS, GSAP, Firebase et GitHub Pages**. Ne pas transformer le projet en React, Vue, Next.js ou autre framework sans nécessité clairement justifiée.
10. Produire de vrais fichiers, le code, les tests, la documentation, les instructions Firebase et le workflow de publication ; ne pas s'arrêter à une proposition théorique.

Si des éléments externes (accès Firebase, déploiement GitHub, logo et nom réel de l'entreprise) ne sont pas disponibles, crée un projet fonctionnel en local et un mode démo sans backend avec données fictives, documente précisément les étapes manuelles restantes. **N'invente pas de configuration Firebase, de clés, de domaine ou d'identité de client.**

## 1. CONTEXTE MÉTIER OFFICIEL — 7 ÉCRANS À COUVRIR

La responsable a exprimé les besoins suivants. Ils constituent le **socle** du questionnaire, mais pas des décisions détaillées déjà validées.

### A. Tableau de bord — activité et panier moyen
- Compteurs mensuels de promenades, visites, gardes.
- Diagramme en bâtons d'activité par mois et analyse de saisonnalité.
- Panier moyen global et par type de prestation.
- Tableau compact des salariés : nom, prestations, heures.
- Vérifier la signification exacte de « prestation », « panier moyen », « heures », états à compter, période, avoirs et annulations.

### B. Fiches clients et animaux reliées
- Coordonnées du client, animaux associés, historique d'achat.
- Présentation deux colonnes ou onglets ; cartes animaux cliquables.
- Panier moyen personnel du client.
- Clarifier foyer, plusieurs responsables, plusieurs animaux, plusieurs adresses, doublons, recherche, historique et consentements.

### C. Fiche terrain de l'animal
- Consultation mobile structurée, alertes santé en haut.
- Comportement, caractère, peurs, cachettes ; alimentation stricte ; médicaments, allergies, vétérinaire.
- Clés : « Boîte sur place », « Détenue par X », « Au bureau ».
- Accès parisien : Digicode 1, Interphone, Digicode 2, Étage et porte.
- Clarifier saisie, validation, droit d'accès, protocole en cas d'urgence, conservation et séparation conceptuelle des informations animal / logement / clés.

### D. Saisie des prestations par l'administrateur
- Enregistrement rapide d'une commande reçue, ex. **18 promenades**.
- Sélection animal, type, quantité et prix.
- Création de missions à planifier et alimentation de statistiques.
- Clarifier différence commande / ligne de commande / mission, fréquence, dates, prix, forfait, paiement, annulation, report et modification.

### E. Planning salarié mobile
- Feuille de route chronologique du jour.
- Adresse cliquable vers Google Maps ou Apple Plans.
- Alertes de santé visibles directement sur la mission.
- Clarifier statut des missions, début/fin, heures effectives, compte rendu, incident, notifications, planning futur, offline.

### F. Carte générale et proximité
- Carte interactive administrateur avec marqueurs chat, chien, domicile / salarié.
- Recherche d'une adresse et classement des salariés par proximité avec distance en kilomètres.
- Clarifier : adresses de référence versus positions ponctuelles ou GPS réel ; distance à vol d'oiseau versus trajet ; disponibilité ; mode de déplacement ; confidentialité et consentement ; géolocalisation mobile en arrière-plan.

### G. Back-office, planning glisser-déposer et import
- Chaque salarié est une colonne de planning, missions déplaçables par drag & drop.
- Clarifier contrôles de conflits, confirmation, notifications, gestion des absences, créneaux, import (CSV, Excel, source existante), correction des données et historique des changements.

## 2. PUBLIC CIBLE, PERSONNALISATION ET MICROCOPY

- Utilisatrice visée : responsable/gestionnaire de l'entreprise ; maîtrise technique non supposée.
- Langue : **français naturel, soigné et non technique**.
- Bannière d'accueil personnalisable : nom / logo de l'entreprise si fournis, à défaut nom neutre (« Votre futur logiciel de gestion »).
- Texte d'accueil proposé :
  « Nous avons étudié votre fiche de besoins. Ce court parcours va nous aider à comprendre votre façon de travailler et à préparer un logiciel réellement adapté à votre équipe. Il n'y a pas de mauvaise réponse : choisissez ce qui correspond le mieux à votre fonctionnement ou à vos préférences. »
- Insister discrètement sur la confidentialité des réponses et le fait qu'il n'est pas nécessaire de connaître le vocabulaire informatique.
- Demander l'accord pour enregistrer les réponses, expliquer leur usage, afficher une information de confidentialité adaptée et un contact du responsable du traitement à renseigner.
- À l'introduction, indiquer une **durée estimée mesurée / recalculée après réalisation**, sans promettre une durée irréaliste.
- Éviter d'afficher « QCM d'examen » ou un score ; préférer « Entretien de préparation », « Choix de fonctionnement ».
- Transitions contextuelles entre sections, ex. « Merci, passons à la façon dont vous organisez vos équipes ».

## 3. UX/UI À LIVRER

### Expérience
- Une unique carte de question centrée ; largeur desktop conseillée ~600–720 px ; grand confort sur mobile ; pas de longues listes visibles simultanément.
- En-tête discret : identité visuelle, section, progression (ex. 14/31 du parcours actuellement pertinent).
- En dessous : titre question court, explication facultative, cartes d'options cliquables, champ texte pour « Autre », commandes Précédent/Suivant ; bouton « Passer » uniquement si la question est facultative.
- Option « Je ne sais pas / À discuter » pour les décisions difficiles, traitée comme réponse distincte, pas comme validation d'une capacité.
- Choix multiples : cases à cocher ; choix unique : radio. Ne pas ambiguïser la sélection.
- Question longue : reformuler en situation courte + phrase de contexte. Éviter les doubles questions ; si deux décisions indépendantes, séparer.
- Afficher un **résumé de vérification** par thèmes avant l'envoi, permettant « Modifier » une réponse.
- Après envoi : page de remerciement personnalisée ; ne pas montrer de données internes ou une interface admin.
- Animations GSAP : entrée/sortie discrètes (<~400 ms), pas de défilement horizontal agressif, gestion des doubles clics, prise en charge `prefers-reduced-motion`.
- Accessibilité : HTML sémantique, focus visible, labels, annonces `aria-live` non intrusives, navigation clavier complète, contrastes lisibles et tailles tactiles suffisantes.

### États incontournables
- Chargement, question sans réponse, validation, progression enregistrée, hors ligne, erreur Firebase, reprise, réponse modifiée, soumission, déjà soumis, session expirée, formulaire inexistant.
- Responsive téléphone/tablette/ordinateur.
- Aucun composant décoratif inutile, aucune animation bloquante.

## 4. MOTEUR DE QUESTIONNAIRE DATA-DRIVEN

Créer des questions éditables sans toucher à la logique du rendu, idéalement `src/data/questions.js` (ou JSON valide) et un moteur séparé.

Chaque question comprend au minimum :

```js
{
  id: 'orders.recurring_schedule',
  section: 'commandes',
  title: 'Une cliente réserve 18 promenades. Comment choisissez-vous leurs dates ?',
  help: 'Choisissez le cas le plus proche de votre méthode de travail.',
  type: 'single',
  required: true,
  options: [
    { value: 'manual', label: 'Je choisis chaque date une par une' },
    { value: 'recurring', label: 'Je définis une répétition (ex. chaque lundi)' },
    { value: 'both', label: 'Les deux selon la demande' },
    { value: 'unsure', label: 'À discuter' }
  ],
  visibleWhen: { questionId: 'orders.bulk', operator: 'equals', value: 'yes' },
  tags: ['planning', 'commandes'],
  insight: 'Détermine la génération manuelle ou récurrente des missions.'
}
```

- Définir et vérifier un schéma pour les types (`single`, `multi`, `yes_no`, `text`, `number`, etc.), les conditions (`equals`, `includes`, `notEquals`, `and`, `or`), et les validations.
- **Distinguer `non répondu`, `passé`, `sans objet`, `À discuter`, `Autre` et réponse positive.**
- Recalculer la route conditionnelle après chaque modification ; exclure des exports métier les réponses cachées devenues invalides, tout en préservant si utile l'historique technique privé.
- Bloquer les branches cycliques / questions orphelines ; vérifier que tous les `option.value` et ID sont uniques.
- Calculer la progression sur le parcours applicable, sans fausse estimation si de nouvelles branches apparaissent.
- Empêcher perte de réponse par clic arrière, rechargement ou animation interrompue.
- Prévoir une version de questionnaire (`questionnaireVersion`) stockée avec chaque soumission afin que les anciens résultats restent interprétables.

## 5. PARCOURS COURT À IMPLÉMENTER — 18 ÉCRANS PRINCIPAUX

**RÈGLE IMPÉRATIVE : remplacer l'ancienne approche 75–95 questions par un entretien court.** Ne pas produire 75 questions visibles ou un formulaire long. Les 18 écrans ci-dessous couvrent toutes les décisions de premier niveau des 7 écrans métier transmis. Une ou deux questions secondaires peuvent apparaître uniquement en cas de besoin, dans la limite de 24 écrans visibles sur **n'importe quel** chemin. Parcours habituel cible : 12–18 écrans, 5–8 minutes **à vérifier avec la responsable ou un testeur représentatif**. Prévoir un rendez-vous de clarification après lecture des réponses pour les points techniques sensibles : le questionnaire ne prétend pas tout décider.

### Principes des questions à deux volets
- Une fenêtre = **un thème et au maximum deux décisions étroitement liées**. Exemple : « Qui répartit les missions ? » et « Comment sont-elles attribuées ? ».
- Afficher le volet A puis le volet B dans une **même carte**, chacun avec 2–4 options claires ; une seule transition « Suivant ». Sur petit écran, afficher les volets l'un sous l'autre sans grille dense.
- Les deux réponses possèdent **des identifiants distincts** et sont enregistrées séparément ; une réponse au volet A ne doit pas écraser le B.
- Ne pas regrouper des décisions indépendantes, des questions longues, ni des tableaux complexes. Ne pas transformer un écran en matrice fatigante.
- **« Autre, préciser »** et **« À discuter / Je ne sais pas »** disponibles là où utiles. Texte libre facultatif de 120 caractères, affiché seulement si « Autre » est choisi.
- Utiliser surtout des questions simples et des situations concrètes ; jamais forcer une option non représentative.

### Parcours de base — formulation et réponses attendues
Les formulations sont des propositions à affiner pour clarté, neutralité et usage mobile ; préserver le sens et la couverture.

**Écran 01 — Fonctionnement actuel (double volet)**
- A. « Aujourd'hui, comment recevez-vous les demandes ? » [Téléphone, E-mail, SMS/messagerie, Site, Autre] **multi**.
- B. « Dans le futur outil, qui enregistrera les prestations ? » [Équipe uniquement, Clients aussi, À discuter] **single**.
- Décisions : canaux actuels vs périmètre futur ; si « Clients aussi », ne pas promettre un portail client, générer un **point de cadrage distinct**.

**Écran 02 — Équipe et accès (double volet)**
- A. « Qui utilisera le logiciel ? » [Responsable/administrateurs, Salariés/intervenants, Autres] **multi**.
- B. « Les salariés doivent-ils voir uniquement leurs missions ? » [Oui, Toutes les missions, À discuter] **single**.
- Décisions : rôles, permissions et confidentialité.

**Écran 03 — Clients et adresses (double volet)**
- A. « Un client peut-il avoir plusieurs animaux ? » [Oui, Non, Parfois/à discuter].
- B. « Un même client peut-il demander une intervention à plusieurs adresses ? » [Oui, Non, À discuter].
- Décisions : relations client-animal-adresse et fiches liées.

**Écran 04 — Fiche terrain (double volet)**
- A. « Quelles informations doivent être immédiatement visibles ? » [Santé et médicaments, Comportement et cachettes, Nourriture, Coordonnées d'urgence] **multi**.
- B. « Qui peut modifier les consignes ? » [Responsable uniquement, Responsable et salariés, À discuter].
- Décisions : organisation mobile, droits d'édition ; maintenir dans le questionnaire de conception les rubriques déjà explicitement demandées, même non cochées (une non-sélection n'est pas une suppression validée).

**Écran 05 — Clés et accès (double volet)**
- A. « Comment suivez-vous les clés ? » [Lieu où elles se trouvent, Détenteur actuel, Historique des transferts, Autre] **multi**.
- B. « Qui doit voir digicodes et accès ? » [Personnel affecté, Toute l'équipe, À discuter].
- Décisions : inventaire, traçabilité, accès sensibles ; consigner les risques d'un accès large.

**Écran 06 — Prestations et commandes (double volet)**
- A. « Vendez-vous les prestations à l'unité, en forfait ou les deux ? » [À l'unité, En forfait, Les deux, Autre].
- B. « Une commande peut-elle inclure plusieurs animaux ? » [Oui, Non, À discuter].
- Décisions : commandes, lignes de commande et unités facturées.

**Écran 07 — 18 promenades : planification (scénario)**
- « Si une cliente commande 18 promenades, comment choisir leurs dates ? » [Une par une, Jours répétés automatiquement, Les deux, À discuter].
- Décisions : missions générées séparément et planification récurrente ; ne pas confondre commande et mission.

**Écran 08 — Prix et activité (double volet)**
- A. « Comment fixez-vous vos tarifs ? » [Prix par type de prestation, Prix selon durée, Prix personnalisé, Combinaison] .
- B. « Souhaitez-vous suivre les paiements dans cet outil ? » [Non, Statut payé/non payé, Factures/paiements détaillés, À discuter].
- Décisions : tarification et périmètre financier (la comptabilité lourde n'est pas présumée).

**Écran 09 — Annulation/report (scénario)**
- « Une promenade prévue est annulée. Que doit permettre le logiciel ? » [Supprimer du planning en gardant l'historique, Reporter à une autre date, Conserver une prestation à utiliser plus tard, Plusieurs de ces possibilités, À discuter].
- Décisions : états, restitution de quantités, statistiques ; la politique financière est à confirmer en suivi si nécessaire.

**Écran 10 — Affectation (double volet)**
- A. « Comment choisissez-vous un intervenant ? » [Manuellement, Selon disponibilité, Selon proximité, Selon familiarité avec l'animal, Combinaison] .
- B. « En cas de chevauchement d'horaires, que souhaitez-vous ? » [Bloquer, Avertir mais laisser décider, À discuter].
- Décisions : logique planning, conflits, dispatching.

**Écran 11 — Remplacement (scénario)**
- « Un pet-sitter est absent au dernier moment. Que devrait-il se passer ? » [Je réattribue manuellement, Le logiciel suggère des remplaçants, Le logiciel réattribue automatiquement, À discuter].
- Décisions : niveau d'automatisation ; pas de réattribution automatique par défaut.

**Écran 12 — Planning salarié (double volet)**
- A. « Quels jours le salarié doit-il pouvoir consulter ? » [Aujourd'hui, Semaine à venir, Les deux].
- B. « Que doit-il pouvoir faire pour une mission ? » [Consulter seulement, Marquer terminée, Signaler un problème, Ajouter un compte rendu] **multi**.
- Décisions : lecture/écriture, cycle de mission ; liens Maps et alertes santé déjà demandés et donc non reposés inutilement.

**Écran 13 — Retards et urgences (scénario)**
- « Si un animal nécessite des soins ou si une mission se passe mal, quelle action doit être possible ? » [Contacter rapidement le responsable, Signaler un incident dans le logiciel, Consulter une procédure d'urgence, Plusieurs de ces possibilités].
- Décisions : communication et incidents ; toujours distinguer le protocole interne d'un avis vétérinaire.

**Écran 14 — Carte et proximité (double volet)**
- A. « Pour comparer les intervenants, quelle localisation suffit ? » [Adresse/zone de référence, Position déclarée ponctuellement, Position GPS pendant le travail, À discuter].
- B. « Le classement doit-il montrer… ? » [Distance en km, Temps de trajet, Les deux, À discuter].
- Décisions : coût/architecture de la carte et cadre de confidentialité ; **ne pas demander le GPS continu en arrière-plan** dans le parcours de base.

**Écran 15 — Disponibilité cartographique (conditionnel, scénario court)**
- Visible seulement si carte/proximité souhaitée et classement avancé confirmé.
- « Une personne est proche mais déjà occupée. Faut-il… ? » [Ne pas la proposer, L'afficher comme indisponible, L'afficher normalement avec un avertissement].
- Décisions : filtrage intelligent par disponibilité.

**Écran 16 — Tableau de bord (double volet)**
- A. « Quand une prestation doit-elle compter comme réalisée ? » [Dès la commande, Une fois effectuée, Afficher commandées et effectuées séparément].
- B. « Pour le panier moyen, quelle base souhaitez-vous ? » [Par commande, Par prestation, Les deux, À discuter].
- Décisions : règles de calcul indispensables ; historique mensuel et heures salariées déjà exprimés dans la fiche.

**Écran 17 — Données existantes et alertes (double volet)**
- A. « Où sont vos données aujourd'hui ? » [Fichiers Excel/CSV, Logiciel existant, Papier/messages, Plusieurs supports, Aucune base structurée].
- B. « Comment prévenir les salariés d'un changement ? » [Ils consultent le planning, E-mail, Notification dans l'application, SMS, À discuter] **multi**.
- Décisions : stratégie import, notification ; coûts SMS et limites des notifications web à confirmer ultérieurement.

**Écran 18 — Priorités et dernière précision (double volet)**
- A. « Qu'est-ce qui vous ferait gagner le plus de temps dès la première version ? » [Planning, Fiches clients/animaux, Saisie commandes, Carte, Statistiques] : maximum **deux choix**, les sept écrans transmis restent des besoins initiaux, cela ne les supprime pas.
- B. « Y a-t-il une situation importante que nous n'avons pas abordée ? » [Non, Oui — champ court facultatif, Je préfère en parler ensemble].
- Décisions : priorisation et angle mort.

### Approfondissements conditionnels (maximum 6 écrans supplémentaires par parcours ; 24 écrans au total)
Créer une **bibliothèque limitée** d'approfondissements, et un budget de parcours :
1. **Portail client** si les clients saisissent les commandes eux-mêmes : réservations autonomes, validation admin ou non.
2. **Garde longue durée** si durée/nuitée a des règles distinctes : facturation et créneaux.
3. **Soins et médicaments** si suivi d'administration nécessaire : consulter les instructions seulement ou confirmer les soins ; jamais d'avis médical automatisé.
4. **Clés** si transferts suivis : simple localisation ou journal de remise/retour.
5. **GPS** si position GPS choisie : ponctuelle pendant service ou réellement temps réel, avec rappel de limites juridiques/techniques.
6. **Gestion financière** si facturation détaillée souhaitée : statut, documents, remboursements.
7. **Réaffectation** si automatisation souhaitée : validation humaine ou attribution automatique.
8. **Import complexe** si plusieurs sources : format principal et besoin de dédoublonnage.
9. **Rapport terrain** si option choisie : notes, photos, durée réelle.
10. **Gestion d'horaires** si les affectations dépendent de la disponibilité : qui gère congés et horaires.
L'agent choisit les approfondissements **uniquement selon leur impact réel sur l'architecture**, classe par criticité et limite chaque parcours à six supplémentaires. Les approfondissements non posés deviennent des **points de suivi documentés** plutôt que des hypothèses silencieusement validées.

### Couverture et exports obligatoires
- Conserver une **matrice de traçabilité** des sept écrans fournis par la responsable vers les questions affichées et les éléments déjà explicitement demandés.
- Pour chaque besoin : état `exprimé dans la fiche`, `confirmé par réponse`, `à clarifier`, `recommandation non validée`, ou `hors périmètre confirmé`. Ne jamais convertir une simple non-sélection en refus.
- S'assurer que les scénarios 18 promenades, multiples animaux, traitements, clés, salarié absent, replanification, GPS/proximité et panier moyen sont couverts par une question **ou explicitement marqués pour suivi**.
- À la soumission, produire une synthèse qui **ne cache pas les zones non résolues** et propose un entretien complémentaire court ciblé si utile.

## 6. QUESTIONNEMENT NON BIAISÉ ET LOGIQUES À TESTER

- Commencer par le processus **actuel**, puis demander le **fonctionnement souhaité** ; ne pas présenter une fonctionnalité complexe comme nécessaire par défaut.
- Distinguer « c'est ainsi que nous travaillons » de « je voudrais que le futur logiciel fonctionne ainsi ».
- Pour chaque scénario, offrir des propositions réalistes, plus une issue « Autre » et/ou « À discuter ».
- Deux volets maximum pour des décisions **étroitement liées** dans un même écran ; ne jamais mélanger des décisions indépendantes.
- Demander la **priorité** uniquement lorsque c'est utile et éviter d'interroger sur tous les détails hypothétiques.
- Limiter le nombre de questions visibles par le branchement conditionnel ; ne pas supprimer les questions de sécurité incontournables.
- Prévoir un audit de la banque de questions : couverture des 7 écrans, absence de doublons, cohérence des branches, exhaustivité des scénarios majeurs.

## 7. ARCHITECTURE DE PROJET SUGGÉRÉE

Conserver une arborescence claire, adaptable si tu trouves une organisation plus simple :

```text
pet-sitting-discovery/
├── index.html
├── 404.html
├── assets/
│   ├── icons/
│   └── images/
├── src/
│   ├── main.js
│   ├── styles.css
│   ├── config/
│   │   ├── appConfig.example.js
│   │   └── firebase.js
│   ├── data/
│   │   ├── questions.js
│   │   ├── sections.js
│   │   └── rules.js
│   ├── engine/
│   │   ├── questionnaire.js
│   │   ├── branching.js
│   │   ├── validation.js
│   │   └── insights.js
│   ├── services/
│   │   ├── persistence.js
│   │   ├── submissions.js
│   │   └── exports.js
│   ├── ui/
│   │   ├── render.js
│   │   ├── transitions.js
│   │   └── accessibility.js
│   └── utils/
│       └── escape.js
├── tests/
├── firebase.rules
├── firebase.indexes.json
├── package.json
├── README.md
├── QUESTION_BANK.md
├── DECISION_MAPPING.md
├── DATA_SCHEMA.md
├── DEPLOYMENT.md
└── .github/workflows/deploy.yml
```

Vanilla JS peut utiliser Vite comme outil de build **uniquement** si cela simplifie Tailwind et GitHub Pages ; ce n'est pas un framework applicatif. Si tu utilises Vite, configurer correctement la propriété `base` pour le sous-chemin GitHub Pages et les assets ; éviter des routes d'historique non prises en charge par GitHub Pages.

## 8. FIREBASE, SÉCURITÉ ET CONFIDENTIALITÉ

**Important : les clés de configuration web Firebase ne sont pas des secrets d'accès serveur. La sécurité dépend des règles Firestore, de l'authentification et de l'architecture. Ne jamais embarquer de compte de service, identifiant privilégié, mot de passe, secret API fournisseur ou clé privée dans les fichiers publics.**

### Modèle d'accès à définir et implémenter
- Application répondante : accès uniquement à **sa propre session**, au moyen d'une authentification effective ou d'un mécanisme de jeton et d'un intermédiaire serveur sécurisé.
- **Ne pas utiliser uniquement un identifiant de questionnaire dans l'URL** comme prétendue autorisation suffisante.
- Préférer pour une première livraison : Firebase Authentication (par exemple lien de connexion par e-mail si le contexte le permet) et règles Firestore garantissant qu'un répondant ne lit/écrit que ses réponses ; l'administration est accessible uniquement à un compte admin explicitement autorisé.
- Si utiliser l'authentification anonyme : expliquer ses limites sur un autre appareil et prévoir une reprise compatible ; ne jamais afficher de liste des soumissions aux comptes anonymes.
- Le rôle admin ne doit jamais être attribuable par modification client d'un champ `role` ; utiliser une revendication sécurisée (custom claim) ou une liste d'UID gérée hors du front public, avec règles auditées.
- Soumission : une fois finalisée, prévoir immutabilité côté répondant ou procédure explicite de correction ; refuser la modification arbitraire des résultats finalisés.
- Les règles Firestore doivent bloquer `list`/`read` non autorisés ; limiter les champs et la taille attendus autant que possible ; éviter les écritures publiques illimitées et prévoir un contrôle anti-abus raisonnable.
- N'enregistrer **aucune donnée réelle de clients finaux, digicode, renseignement médical ou géolocalisation** dans les réponses au questionnaire : recueillir des **règles de fonctionnement**, pas des données de leurs clients.
- Consentement / information : préciser finalité du questionnaire, responsable, destinataires, durée de conservation à fixer avec le commanditaire, droit de suppression / rectification et canal de contact ; éviter les promesses légales non vérifiées.
- Prévoir `createdAt`, `updatedAt`, `submittedAt`, `questionnaireVersion`, `status`, identifiant de session/compte, réponses typées et métadonnées minimales.
- Sauvegarde automatique avec debounce raisonnable ; gérer les écritures concurrentes, la perte de réseau et les erreurs visibles. `localStorage` éventuel uniquement pour données non sensibles et reprise temporaire, avec stratégie de synchronisation.
- Fournir `firebase.rules` **testées** avec scénarios autorisé / interdit. Si la sécurité réelle ne peut pas être vérifiée, bloquer l'activation publique et le signaler explicitement.
- Les exports administratifs se font via interface authentifiée, sans exposer la base entière côté client.

### Exemple de structure conceptuelle

```json
{
  "questionnaireVersion": "1.0.0",
  "status": "draft",
  "respondentId": "uid-authentifie",
  "createdAt": "timestamp-serveur",
  "updatedAt": "timestamp-serveur",
  "submittedAt": null,
  "answers": {
    "orders.recurring_schedule": {
      "value": "both",
      "answeredAt": "timestamp"
    }
  }
}
```

Ce schéma est une illustration, à adapter aux contraintes de sécurité/règles/tailles de Firestore. Ne pas prétendre que des timestamps clients sont fiables pour l'audit.

## 9. SYNTHÈSE ET EXPORT POUR LE DÉVELOPPEUR

Créer une interface d'analyse **réservée à l'administrateur** contenant :

1. État du questionnaire : brouillon, soumis, incomplet.
2. Réponses par thème, avec intitulé original et valeur lisible ; choix « Autre » détaillé.
3. **Décisions confirmées** provenant directement des réponses.
4. **Questions ouvertes / À discuter**, identifiées explicitement.
5. **Contradictions possibles** à vérifier (ex. besoin de position temps réel sans mécanisme de partage consenti).
6. **Conséquences fonctionnelles proposées**, clairement indiquées comme *recommandations non validées*.
7. Liste structurée des **fonctionnalités MVP / phase ultérieure**, uniquement si les priorités ont été exprimées.
8. Export **JSON, CSV, Markdown** ; fichiers UTF-8, caractères français correctement conservés, CSV protégé contre l'injection de formules au besoin ; pas de secret ni de donnée privée inutile.
9. Rapport `ANALYSE_BESOINS.md` comportant : contexte, décisions, dépendances, exclusions, questions restantes, hypothèses, risques, mapping vers les sept écrans.
10. Les synthèses automatiques doivent être déterministes ou signaler leurs incertitudes ; ne jamais inventer une réponse de la responsable.

## 10. DESIGN SYSTEM ET ANIMATIONS

- Style : minimaliste, premium, clair, professionnel ; fond doux, cartes blanches, typographie lisible, spacing régulier.
- Couleurs : palette cohérente neutre avec accent discret (ex. bleu nuit / turquoise léger), sans ressembler à un site vétérinaire anxiogène ; alerte rouge réservée aux informations réellement critiques.
- Animations GSAP : transitions subtiles, progression animée, sections respirantes, fin de questionnaire soignée.
- Respect de `prefers-reduced-motion`, fonctionnement complet si GSAP échoue, pas de dépendance aux animations pour la navigation.
- Installer correctement Tailwind dans le pipeline de production ; éviter le CDN de développement Tailwind en version publique si non adapté à la production.
- Utiliser des icônes cohérentes en SVG licites, sans ressources externes inutiles.
- Pas de photos réelles de clients ou d'animaux sans droit d'usage.

## 11. QUALITÉ, TESTS ET CRITÈRES D'ACCEPTATION

### Tests du moteur
- Toutes les questions ont des ID uniques et des options valides.
- Toutes les conditions pointent vers une question existante et antérieure ou respectent un graphe acyclique.
- Les choix multiples, les réponses « Autre », « À discuter » et les champs libres sont validés correctement.
- Boutons Précédent/Suivant gardent les réponses.
- Un changement de réponse désactive les branches non pertinentes et les exclut de la synthèse.
- Le taux de progression reste cohérent lorsqu'une branche s'ouvre ou se ferme.
- Aucun utilisateur ne peut finaliser une question requise visible non répondue.
- Test de rechargement et reprise après fermeture.
- Soumission double ne crée pas deux réponses divergentes.

### Tests sécurité
- Un répondant A ne peut pas lire/modifier les réponses de B.
- Un répondant ne peut pas voir la console admin.
- Un utilisateur standard ne peut pas devenir admin en modifiant l'interface ou un document.
- La finalisation suit une politique d'édition claire.
- Firestore refuse les lectures de collection anonymes/non autorisées.
- Aucune clé privée ou donnée sensible dans le dépôt/public build.

### Tests UX
- Petite largeur mobile (~320px), mobile courant, tablette, ordinateur.
- Navigation clavier, lecteur d'écran pour titre question et statut ; focus correctement restauré après transition.
- Très longues options et saisies libres, accents et apostrophes.
- Connexion lente / hors ligne et erreurs visibles.
- Animation réduite prise en charge.
- Contraste, taille des contrôles, facilité de sélection.

### Scénarios métier vérifiables
- Parcours d'une responsable qui travaille uniquement par téléphone, sans GPS temps réel et sans paiement dans le logiciel.
- Parcours d'une responsable avec forfaits récurrents, planning complexe et notifications.
- Parcours avec réponses « À discuter » et « Autre ».
- Parcours de modification d'un choix ancien affectant plusieurs sous-questions.
- Vérifier que tous les sept écrans de la fiche originale sont couverts par au moins une série de questions.

## 12. DÉPLOIEMENT ET DOCUMENTATION

- Préparer `README.md` avec installation, commandes, fonctionnement, variables d'environnement publiques, mode démo, tests et dépannage.
- Préparer `DEPLOYMENT.md` avec étapes Firebase (projet, Auth, domaines autorisés, Firestore, règles, index, éventuellement App Check) et GitHub Pages.
- GitHub Actions pour build/test/deploy, configuration du `base` et des assets selon repository ou domaine personnalisé.
- Fournir un exemple `.env.example` **sans valeurs sensibles** et `.gitignore` robuste.
- Fournir `QUESTION_BANK.md` : inventaire des questions, options, conditions, décisions éclairées, priorité.
- Fournir `DECISION_MAPPING.md` : lien entre réponses et exigences métier, sans confondre souhait, obligation et hypothèse.
- Fournir `DATA_SCHEMA.md` : collections, droits, statut des réponses, versionnage.
- Fournir `TEST_REPORT.md` : commandes exécutées et résultats réels ; ne jamais marquer un test « OK » si non exécuté.
- Si GitHub/Firebase ne sont pas connectés, ne pas inventer un site déjà en ligne ; livrer les fichiers et la checklist des dernières opérations requises.

## 13. PLAN D'EXÉCUTION DEMANDÉ À L'AGENT

**Procède dans cet ordre et exécute effectivement les tâches.**

### Étape A — Audit
1. Inspecte le dépôt et les fichiers existants.
2. Conserve les acquis et évite de supprimer du code utile.
3. Identifie les ressources disponibles et les contraintes manquantes.
4. Produit une courte liste de risques, mais n'interromps pas le travail pour des questions non bloquantes.

### Étape B — Analyse métier
1. Établis les décisions à prendre à partir de la fiche des sept écrans.
2. Implémente les **18 écrans principaux** définis dans la section 5 et une bibliothèque d’approfondissements conditionnels ; documente-les dans `QUESTION_BANK.md`.
3. Sépare questions obligatoires, conditionnelles et optionnelles.
4. Affine la rédaction : deux volets courts au maximum, choix non biaisés, « Autre » et « À discuter », parcours de 24 écrans maximum.
5. Conçois le graphe de branchement ; impose 18 écrans principaux maximum, 12–18 habituels, et jamais plus de 24 visibles ; teste le temps réel d’exécution.
6. Crée un mapping entre chaque question, chaque règle métier et les sept écrans.

### Étape C — Réalisation produit
1. Initialise le projet HTML/CSS/vanilla JS/Tailwind/GSAP.
2. Implémente le moteur data-driven, le rendu d'une seule fenêtre thématique par écran et le routage des branches.
3. Implémente la sauvegarde/reprise, le résumé, la soumission et le message final.
4. Implémente l'interface d'administration sécurisée et les exports.
5. Intègre Firebase Auth/Firestore et les règles de sécurité ; propose un mode démo clair si configuration absente.
6. Soigne UX, responsive, microcopy, états d'erreur et accessibilité.

### Étape D — Validation
1. Exécute lint si configuré, tests unitaires du moteur, tests de navigation et tests de règles Firebase lorsqu'outillés.
2. Corrige les erreurs.
3. Vérifie les scénarios métier, branches et exports.
4. Génère `TEST_REPORT.md` honnête, listant ce qui a réellement été testé et ce qui reste à tester.

### Étape E — Préparation livraison
1. Prépare les fichiers de configuration exemples et la documentation de déploiement.
2. Configure GitHub Pages via GitHub Actions si accès au dépôt et permissions disponibles.
3. Explique en fin de travail : fichiers créés, fonctionnalités prêtes, questions métier couvertes, tests exécutés, points non finalisés faute d'accès et prochaines actions exactes.

## 14. DÉFINITION DE « TERMINÉ »

Le travail n'est terminé que lorsque :

- [ ] Une responsable peut ouvrir l'application et voir un accueil réellement personnalisé (ou un fallback neutre explicite).
- [ ] Elle voit **une question à la fois** et peut avancer/reculer facilement.
- [ ] Les scénarios conditionnels fonctionnent et ne montrent pas de questions inutiles.
- [ ] Les réponses restent conservées et sont révisables avant soumission.
- [ ] Un formulaire peut être envoyé et récupéré en environnement Firebase correctement configuré.
- [ ] Les permissions sont effectives et testées, sans exposition publique des résultats.
- [ ] L'admin peut lire et exporter les réponses et produire un rapport de cadrage sans les déformer.
- [ ] Les sept besoins initiaux sont réellement couverts, avec les cas limites essentiels.
- [ ] L'app est mobile-first, accessible, élégante et tolérante aux erreurs.
- [ ] Le code est documenté, testable et déployable sur GitHub Pages.
- [ ] Tout ce qui dépend encore de credentials, de configuration ou de validation métier est signalé clairement.

## 15. CONSIGNES FINALES

**Ne me renvoie pas seulement un prompt ou une reformulation de cette spécification : travaille directement dans le projet.**

Prends les décisions techniques de faible impact de manière autonome. Sur les choix métier non confirmés, **pose la question dans l'application**, et non au développeur. N'enregistre jamais comme approuvée une fonctionnalité simplement suggérée.

Optimise le temps demandé à la responsable sans sacrifier la précision du cadrage. L'objectif final n'est pas de recueillir le maximum de clics, mais d'obtenir les décisions nécessaires pour construire sans ambiguïté le véritable logiciel de pet-sitting.

**Commence par auditer le dépôt, puis construis la banque de questions, le moteur conditionnel, l'interface et le flux de sauvegarde/export jusqu'à une livraison vérifiée.**

## 16. VALIDATION DE LA CONCISION (BLOQUANTE)

- Instrumenter les durées **de manière respectueuse et agrégée** en test local, sans surveillance secrète : temps total, nombre d'écrans, abandons volontaires durant les tests.
- Exécuter au moins trois parcours : minimal, courant, maximal ; `maxVisibleScreens <= 24` est un critère bloquant.
- Tester sur écran mobile et vérifier qu'aucune carte ne nécessite une lecture longue ou un défilement excessif.
- Tester un parcours auprès d'une personne non technique ; viser 5–8 minutes. Si l'essai dépasse, supprimer d'abord les doublons, raccourcir les libellés et déplacer les décisions secondaires en suivi.
- Ne pas utiliser de grilles/matrices nombreuses, de longues réponses libres obligatoires, ni de faux « 5 minutes » sans mesure.
- Conserver le principe d'un **entretien de cadrage** : pour les règles rares et complexes, la bonne sortie est parfois « À clarifier » plutôt qu'une 25e question.


---

# 17. EXTENSION V3 PRIORITAIRE — MOTEUR DE DÉCISIONS ADAPTATIF

> **Cette section est impérative et prévaut sur toute formulation moins précise dans les sections précédentes.** Le questionnaire n'est pas seulement conditionnel : il mémorise les *décisions métier déjà acquises*, déduit uniquement les conséquences logiquement certaines, saute les questions redondantes et rend obligatoires les précisions déclenchées par certains choix.

## 17.1 Règle fondamentale : demander seulement les informations manquantes

- Chaque choix est associé à zéro ou plusieurs **faits métier atomiques** (`facts`), avec identifiant stable, valeur, origine (`explicit`, `derived`, `unresolved`), question source et horodatage.
- Avant d'afficher une question, évaluer si tous les faits indispensables à cette question sont déjà connus et confirmés. Si oui, **ne pas afficher** la question : la réponse est *résolue*, pas *ignorée sans justification*.
- Exemple : `assignment.mode = manual_admin` obtenu sur une question précédente => ne pas demander « L'administrateur doit-il attribuer les missions ? ».
- Ne **jamais** déduire une préférence non logique. « Planning mobile = oui » n'implique PAS « Notifications push = oui ». Dans ce cas poser une question pertinente distincte ou consigner `unresolved`.
- Les informations de la fiche initiale sont des **besoins exprimés**, pas automatiquement des modalités validées ; le moteur conserve la provenance `brief` distincte des réponses de la responsable.
- Une option « Plusieurs méthodes » ne doit pas être réduite à une seule ; la déduction reste exacte et conservatrice.

## 17.2 Questions conditionnelles et caractère obligatoire dynamique

Une question peut posséder :

- `visibleWhen` : règle de pertinence ; cachée si faux.
- `requiredWhen` : règle d'obligation ; si vrai, la question **visible** doit être renseignée pour continuer ou finaliser (selon le comportement UX retenu).
- `resolvedWhen` ou `resolvesFacts` : reconnaissance d'une décision déjà établie ; si résolue, ne pas redemander.
- `followUps` : questions de précision ; déclenchées uniquement par certains choix, avec limite de profondeur.
- `reason` : explication interne du pourquoi de la question, du saut ou de l'obligation ; traçabilité dans la console d'audit.

**Distinction essentielle :** `visibleWhen = true` n'implique pas `requiredWhen = true`. Un approfondissement ne devient obligatoire que si la réponse de la responsable crée une dépendance métier bloquante. Exemple GPS = oui => choix du type de géolocalisation obligatoire ; GPS = non => choix GPS masqué et non obligatoire. Si la responsable choisit « À discuter », le point est explicitement `unresolved` et peut être soumis sans réponse inventée, sauf consigne juridique/sécurité incontournable à reformuler sans forcer une préférence.

## 17.3 Deux volets coordonnés dans une seule fenêtre

Une carte peut contenir deux volets **fortement liés** : A = décision principale, B = précision du choix A. Chaque volet a son propre `id`, valeur et validation ; B ne s'affiche et ne devient obligatoire que si A l'exige. Ne jamais créer deux obligations artificielles simplement pour réduire le nombre d'écrans.

**Exemple de carte :**
- A (obligatoire) : « Comment attribuez-vous vos missions ? » Choix : manuellement par l'administrateur / attribution proposée automatiquement / plusieurs méthodes / à discuter.
- B (conditionnel) : si « attribution proposée automatiquement » ou « plusieurs méthodes » : « Sur quels critères ? » Choix multiples : disponibilités / trajet / compétences / autres / à discuter. B devient obligatoire *en tant que précision nécessaire*, mais « à discuter » reste une réponse valide enregistrée comme indécision.

## 17.4 Modèle de configuration de référence

```js
const questions = [
  {
    id: 'geo.enabled',
    type: 'single',
    title: 'Souhaitez-vous utiliser la localisation des salariés ?',
    options: ['yes', 'no', 'to_discuss'],
    visibleWhen: { op: 'always' },
    requiredWhen: { op: 'always' },
    producesFacts: {
      yes: { 'geo.enabled': true },
      no: { 'geo.enabled': false },
      to_discuss: { 'geo.enabled': 'unresolved' }
    }
  },
  {
    id: 'geo.mode',
    type: 'single',
    title: 'Quel type de localisation vous conviendrait ?',
    options: ['reference_address', 'on_demand', 'live_during_work', 'to_discuss'],
    visibleWhen: { op: 'eq', fact: 'geo.enabled', value: true },
    requiredWhen: { op: 'eq', fact: 'geo.enabled', value: true },
    producesFacts: {}
  }
];
```

Ce code est une **illustration du schéma**, pas la totalité de la banque de questions. L'agent doit unifier ce modèle avec l'architecture proposée aux sections précédentes plutôt que gérer deux moteurs concurrents. Les règles se déclarent sous forme d'AST/JSON sérialisable (`eq`, `in`, `includes`, `and`, `or`, `not`, `always`, `isKnown`) ; pas d'`eval` ni d'exécution arbitraire de fonctions sérialisées depuis Firestore.

## 17.5 Algorithme déterministe de recalcul

Après **chaque** réponse et à la restauration d'une session :

1. Lire les réponses explicites et la version de questionnaire.
2. Recalculer l'ensemble des faits dérivés **à partir de zéro**, en ordre topologique pour éviter les effets des anciennes branches.
3. Détecter les conflits entre faits explicitement déclarés ; **ne pas les résoudre silencieusement**.
4. Évaluer pour chaque question : pertinente ? déjà résolue ? conditionnellement obligatoire ?
5. Construire la liste des écrans visibles, vérifier le plafond de **24**, et préserver la position sur la question pertinente la plus proche.
6. Désactiver les réponses devenues hors parcours ; les conserver, si nécessaire, uniquement en historique technique protégé avec `inactiveReason`, **jamais** dans les décisions validées du rapport.
7. Mettre à jour le compteur de progression et les obligations. La progression doit se recalculer sans indiquer faussement qu'une section est terminée.
8. Autoriser la navigation arrière et les modifications ; lors du changement d'une décision parente, invalider les dépendances devenues non pertinentes.
9. À la soumission, valider **toutes** les questions visibles et requises, pas uniquement la dernière carte ; inclure les éléments `unresolved` dans le rapport à clarifier.

La sauvegarde Firebase doit porter sur les **réponses explicites** et la version ; les faits dérivés peuvent être recalculés plutôt qu'utilisés comme autorité. Le rapport doit différencier : `explicit`, `logically_derived`, `unresolved`, `not_asked_due_to_branch`, `out_of_scope`. Une question sautée car résolue doit exposer sa source pour audit.

## 17.6 Optimisation de l'effort mental

- Prioriser les choix qui **résolvent plusieurs décisions** ; ne pas répéter une question dont le sens est déjà couvert par un volet antérieur.
- Réduire les redondances entre les sept écrans d'origine grâce à une **matrice de décisions atomiques** reliant besoins, faits, questions et règles de branchement.
- Éviter de présenter plus de deux volets dans une même carte ; afficher B seulement après la réponse à A.
- Présenter « à discuter » comme issue légitime, sans parcours punitif.
- Montrer une estimation de progression seulement si elle est robuste aux embranchements ; préférer « étape x du parcours actuel » plutôt qu'un total fictivement fixe.
- Maintenir l'objectif **12–18 écrans typiques, maximum 24**, sans sacrifier une obligation critique ; si un chemin dépasse 24, consolider des questions étroitement liées ou signaler les sujets rares dans le rapport pour un second échange.

## 17.7 Tests d'acceptation supplémentaires — bloquants

Créer des tests automatisés couvrant au minimum :

1. `geo.enabled = no` => `geo.mode` invisible, facultativité sans objet, aucune réponse GPS dans l'export métier.
2. `geo.enabled = yes` => `geo.mode` visible **et obligatoire**.
3. `geo.enabled = to_discuss` => pas de précision GPS forcée, point « à clarifier » explicite.
4. Retour arrière : `yes -> no` => réévaluation et purge des faits GPS dérivés du rapport ; navigation et progression recalculées.
5. Attribution manuelle explicitement choisie => question redondante sur l'attribution manuelle masquée comme `resolved` ; provenance conservée.
6. Question deux volets : volet B invisible lorsque non pertinent, visible et requis lorsqu'il est déclenché ; l'état de B ne pollue pas le rapport lorsqu'il est masqué.
7. Changement de réponse entraînant conflit => avertissement ou clarification, jamais écrasement silencieux.
8. Soumission refusée quand une question **visible et requise** n'est pas répondue ; soumission autorisée avec choix explicite « à discuter ».
9. Trois parcours simulés (minimal, typique, maximal) et vérification de l'absence de questions redondantes, de boucles, de doublons et de dépassement de 24 écrans.
10. Sauvegarde/restauration Firestore : même parcours recalculé et même statut de validation après rechargement.

**Livrables additionnels obligatoires :** `docs/MATRICE_DECISIONS.md` (faits, sources, redondances, dépendances), `docs/REGLES_ADAPTATIVES.md` (branches, obligations, « à discuter », invalidations) et tests du moteur.
