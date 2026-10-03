# Site SGN · M. Lefebvre

Site statique de révision pour des élèves de 1re STMG (sciences de gestion et numérique).
Aucun framework, aucune étape de build : HTML, CSS et JavaScript simples.

## Structure

- `index.html` : la page unique. Elle charge les données puis `assets/app.js`.
- `assets/app.js` : le moteur (navigation par `#/…`, synthèses, cartes, quiz, progression). Aucun contenu de cours.
- `assets/style.css` : le style. Les couleurs sont des variables en haut du fichier.
- `assets/fonts/` : polices hébergées dans le site (licence OFL). Ne pas les remplacer par un appel à Google Fonts.
- `data/config.js` : titre, professeur, chapitre en cours, noms des thèmes.
- `data/chXX.js` : un fichier par chapitre.

## Ajouter un chapitre

1. Copier un fichier `data/chXX.js` existant et remplacer le contenu.
2. Ajouter la ligne `<script src="data/chXX.js"></script>` dans `index.html`, avant `assets/app.js`.
3. Mettre à jour `chapitreEnCours` dans `data/config.js`, et `themes` si le chapitre ouvre un nouveau thème.

Un chapitre n'apparaît sur le site que si son fichier est chargé dans `index.html`.

## Format d'un chapitre

- `id`, `theme`, `titre`, `question`, `intro`.
- `synthese` : liste de blocs. Types : `h` (partie), `h3` (sous-partie), `p`, `def` (encadré de définition), `ex` (exemple), `conclusion`, `flow` (étapes avec flèches, `sansFleche: true` pour une simple liste d'étiquettes), `liste`, `table` (`head`, `rows`, `rowHead: true` si la première colonne sert d'en-tête), `img`.
- `cartes` : `{ terme, def }`.
- `qcm` : `{ q, c: [choix], r: index de la bonne réponse, e: explication }`.
- `situations` : comme un QCM, avec `s` (le mini-cas) en plus.

## Règles de contenu

- La synthèse du site reprend mot pour mot la synthèse distribuée en classe : on change la mise en forme, jamais le texte. Ne rien y ajouter.
- Les zones de la proxémie : ne pas interroger sur les distances chiffrées (cartes, QCM).
- L’onglet « Révision » (tous les chapitres mélangés) est désactivé : `revision: false` dans `data/config.js`.
- Ne jamais mettre en ligne les corrigés de cours, de TD ou de DS.
- Aucune donnée d'élève (nom, note, travail). La progression reste dans le navigateur de l'élève (`localStorage`).
- Un chapitre n'est ouvert qu'après la synthèse faite en classe.
- Écrire les apostrophes en typographique (’) et les guillemets en « » dans les textes.

## Fichiers de cours

- Les fichiers de cours du professeur (synthèses, TD, corrigés) se déposent dans `sources/`. Ce dossier est dans `.gitignore` : il ne doit jamais être envoyé sur GitHub, le dépôt est public.
- Pour créer un chapitre, lire la synthèse et le TD dans `sources/`, puis écrire `data/chXX.js`.

## Modifier sans casser la progression des élèves

- La progression d'un élève (cartes sues, erreurs) est repérée par la position de chaque carte et de chaque question dans son fichier.
- Ajouter les nouvelles cartes et questions à la fin des listes. Ne pas réordonner ni supprimer au milieu : corriger le texte sur place.

## Publier

- Avant de publier, laisser le professeur vérifier en ouvrant `index.html`.
- Publier = `git add`, `git commit`, `git push` sur la branche principale. L'adresse du site ne change jamais.

## Mise en ligne

GitHub Pages, depuis la branche principale, dossier racine. Le dépôt est public : ne rien y déposer d'autre que le site.
