# Objectif SGN · M. Lefebvre

Site statique de révision pour des élèves de 1re STMG (sciences de gestion et numérique).
Aucun framework, aucune étape de build : HTML, CSS et JavaScript simples.

## Structure

- `index.html` : la page unique. Elle charge les données puis `assets/app.js`.
- `assets/app.js` : le moteur (navigation par `#/…`, onglets, entraînement, progression). Aucun contenu de cours.
- `assets/style.css` : le style. Les couleurs sont des variables en haut du fichier.
- `assets/fonts/` : polices hébergées dans le site (licence OFL). Ne pas les remplacer par un appel à Google Fonts.
- `data/config.js` : titre, professeur, chapitre en cours, prochaine évaluation, noms des thèmes.
- `data/chXX.js` : un fichier par chapitre.
- `activites/` : les jeux, un dossier par jeu avec son `index.html`.
- `sources/` : fichiers de cours du professeur. Dossier ignoré par Git, jamais publié.

## Ce que voit l'élève

Chaque chapitre a trois onglets, plus un quatrième s'il a un jeu :

- **Synthèse** : la synthèse du cours.
- **Lexique** : les définitions (liste `cartes`), avec un champ de recherche.
- **Entraînement** : Flashcards, QCM et Situations. Pas de longueur imposée : l'élève s'arrête quand il veut, et chaque bonne réponse est validée. Les questions jamais vues passent d'abord, puis les ratées, puis les validées.
- **Jeux** : uniquement si le chapitre a une liste `jeux`. Chaque jeu est une affiche entièrement cliquable (image, gros titre, une phrase, bouton « Jouer »), aussi reprise sur l'accueil.

Une jauge indique ce qui est validé, par activité et par chapitre. Il n'y a ni test noté, ni boutons « Lu, Su, Revu », ni carte mentale.

## Format d'un chapitre

- `id`, `theme`, `titre`, `question`, `intro` (le paragraphe d'introduction de la synthèse, ou une chaîne vide).
- `jeux` (facultatif) : `{ id, titre, ajout: "AAAA-MM-JJ", accroche, lien, affiche }`.
- `synthese` : liste de blocs. Types : `h` (partie), `h3` (sous-partie), `p`, `def` (encadré de définition), `ex` (exemple), `conclusion`, `flow` (étapes avec flèches), `liste`, `table` (`head`, `rows`, `rowHead: true` si la première colonne sert d'en-tête).
- `cartes` : `{ terme, def }`. Elles alimentent le lexique et les flashcards.
- `qcm` : `{ q, c: [choix], r: index de la bonne réponse, e: explication }`.
- `situations` : comme un QCM, avec `s` (le mini-cas) en plus.

## Règles de contenu

- La synthèse du site reprend mot pour mot la synthèse distribuée en classe : on change la mise en forme, jamais le texte. Ne rien y ajouter.
- **QCM** : 20 au minimum par chapitre, davantage si le chapitre est long. Au moins une question par notion de la synthèse.
- **Situations** : 10 au minimum par chapitre.
- **Flashcards** : une par notion de la synthèse, donc un nombre variable selon le chapitre.
- Les zones de la proxémie : ne pas interroger sur les distances chiffrées.
- Ne jamais mettre en ligne les corrigés de cours, de TD ou de DS.
- Aucune donnée d'élève dans le site. La progression reste dans le navigateur de l'élève (`localStorage`).
- Écrire les apostrophes en typographique (’) et les guillemets en « » dans les textes.

## Ajouter un chapitre

1. Lire la synthèse et le TD déposés dans `sources/`.
2. Copier un fichier `data/chXX.js` existant et remplacer le contenu.
3. Ajouter la ligne `<script src="data/chXX.js"></script>` dans `index.html`, avant `assets/app.js`.
4. Mettre à jour `chapitreEnCours` dans `data/config.js`, et `themes` si le chapitre ouvre un nouveau thème.

## Ajouter un jeu

1. Ranger le fichier du jeu dans `activites/chXX-nom-du-jeu/index.html`.
2. Ajouter le jeu à la liste `jeux` du chapitre.
3. Dans le jeu, à la fin de la partie, écrire `localStorage.setItem('sgn-jeu-<id>', 'termine')` pour que le site affiche « terminé ».
4. Ajouter un lien de retour vers `../../index.html#/chapitre/N/jeux`.
5. Dessiner l'affiche du jeu : un fichier `affiche.svg` dans le dossier du jeu (viewBox `0 0 800 600`, sans texte, avec une couleur et un dessin propres au thème du jeu). Le bas de l'image est recouvert par le titre : y laisser une zone calme. Renseigner le champ `affiche`. Une image `affiche.jpg` fournie par le professeur peut la remplacer.
6. Ne pas modifier l'envoi des résultats du jeu vers le Google Form du professeur.

## Prochaine évaluation

Réglée dans `data/config.js` : `evaluation: { date: "AAAA-MM-JJ", chapitre: N }`. Le bandeau de l'accueil disparaît tout seul le lendemain de la date.

## Modifier sans casser la progression des élèves

- La progression d'un élève est repérée par la position de chaque carte et de chaque question dans son fichier.
- Ajouter les nouvelles cartes et questions à la fin des listes. Ne pas réordonner ni supprimer au milieu : corriger le texte sur place.

## Publier

- Avant de publier, laisser le professeur vérifier en ouvrant `index.html`.
- Ne faire ni commit ni push : le professeur publie lui-même avec GitHub Desktop (« Commit to main », puis « Push origin »).
- Le dépôt GitHub est public : ne rien y déposer d'autre que le site.
