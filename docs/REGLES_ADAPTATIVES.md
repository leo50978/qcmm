# Règles adaptatives

- Les règles sont des objets JSON de forme `always`, `eq`, `notEq`, `in`, `includes`, `answered`, `isKnown`, `and`, `or` ou `not`. Aucun `eval` ni exécutable depuis Firestore.
- La banque est ordonnée selon ses dépendances. À chaque réponse, les faits sont recalculés depuis les réponses et les conditions re-évaluées.
- Le moteur repère les questions déjà résolues et conserve la source. L’attribution manuelle établit `assignment.mode = manual_admin`; `assignment_role` est masqué avec statut résolu.
- Si une réponse parente ferme une branche, les réponses enfants sont retirées de l’état actif et n’entrent pas dans les exports.
- GPS « pendant le travail » rend la précision du moment d’usage obligatoire. GPS « à discuter » ne force pas de précision. Le mode de précision peut lui-même être « à discuter ».
- Une question visible n’est pas automatiquement requise. Les approfondissements facultatifs peuvent être passés; les questions de dépendance GPS et d’affectation visible sont requises.
- Une réponse `to_discuss` est une réponse valide et apparaît dans les points à clarifier. Une absence de réponse reste différente d’un choix à discuter.
- Le parcours utilise le nombre d’étapes actuellement visibles; le dénominateur se recalcule après changement de branche. Le nombre maximal codé est contrôlé par test.
- Les conflits entre deux faits de même identifiant sont exposés; ils ne sont pas silencieusement arbitrés.
- Le bouton « Envoyer en l’état » enregistre le statut `incomplete` après confirmation. Un envoi complet vérifie toutes les questions visibles requises.
