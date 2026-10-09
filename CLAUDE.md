# Révision SGN · M. Lefebvre

Site statique de révision pour des élèves de 1re STMG (sciences de gestion et numérique).
Aucun framework, aucune étape de build : HTML, CSS et JavaScript simples.

## Nom et logo

- Le site s'appelle **Révision SGN** (titre dans `data/config.js`). « M. Lefebvre » est en sous-titre, sous le logo et sous le grand titre de l'accueil.
- Logo : trois barres qui montent, surmontées d'une flèche brisée qui grimpe (SVG `viewBox 0 0 42 40`, dans `index.html`, repris en grand sur l'accueil par `app.js`). Barres en corail clair (`--logo-bar`), flèche en corail (`--coral`). Le nom s'écrit à côté, en texte simple.
- Icônes : le même dessin sur un carré sombre (`#15231E`), barres crème, flèche corail. Favicon SVG dans `index.html`, icône d'écran d'accueil dans `assets/apple-touch-icon.png` (180 × 180).

## Structure

- `index.html` : la page unique. Elle charge les données puis `assets/app.js`.
- `assets/app.js` : le moteur (navigation par `#/…`, onglets, entraînement, progression). Aucun contenu de cours.
- `assets/style.css` : le style. Les couleurs sont des variables en haut du fichier.
- `assets/fonts/` : polices hébergées dans le site (licence OFL). Ne pas les remplacer par un appel à Google Fonts.
- `assets/comptes.js` : les codes élèves et la progression en ligne (voir « Codes élèves »). Ne fait rien tant que `comptes.document` est vide dans `data/config.js`.
- `prof.html` : la page de suivi du professeur, « Suivi SGN · Espace professeur » (aucun lien vers elle sur le site, protégée par la « clé du suivi »). Logo : les barres du logo élève avec une loupe corail ; icône d'écran d'accueil `assets/apple-touch-icon-prof.png`.
- `assets/qr-site.svg` : le QR code vers l'adresse publique du site (`adresse` dans `data/config.js`). Il s'affiche en bas de l'accueil (« Partager le site ») et en grand sur la page `#/partager`, avec un bouton « Partager » (téléphones) et « Copier le lien ». Si l'adresse du site change, refaire le QR code et vérifier qu'il se décode bien.
- `data/config.js` : titre, professeur, chapitre en cours, prochaine évaluation, noms des thèmes.
- `data/chXX.js` : un fichier par chapitre.
- `activites/` : les jeux, un dossier par jeu avec son `index.html`.
- `documents/chXX/` : les documents distribués en classe (TD, fiches), un dossier par chapitre. Jamais de corrigé.
- `sources/` : fichiers de cours du professeur. Dossier ignoré par Git, jamais publié.
- `sources/A-FAIRE.md` : le journal « Où on en est » (fait, reste à faire, idées pour plus tard). À lire en début de conversation et à tenir à jour.
- `sources/outils/verifier.js` : l'outil de vérification des chapitres (voir plus bas). Il reste sur l'ordinateur, il n'est pas publié.

## Ce que voit l'élève

Chaque chapitre a trois onglets, plus « Documents » s'il a des documents et « Jeux » s'il a un jeu :

- **Synthèse** : la synthèse du cours.
- **Lexique** : les définitions (liste `cartes`), avec un champ de recherche. Une fiche fusionnée affiche sa définition, puis ses sous-éléments en liste.
- **Entraînement** : Flashcards, QCM et Situations. Pas de longueur imposée : l'élève s'arrête quand il veut (« J'arrête là »), et chaque bonne réponse est validée.
  - **Une question validée (ou une flashcard sue) l'est pour toujours** : une erreur plus tard ne l'enlève pas (même règle que le suivi en ligne du professeur).
  - Une série ne contient **que ce qui n'est pas encore validé** : d'abord les questions jamais vues, puis les ratées. Quand elles sont faites, c'est le bilan : les questions déjà validées ne reviennent pas.
  - Quand tout est validé, le bilan propose **« Refaire pour m'entraîner »** : tout revient, une question ratée (ou une flashcard « À revoir ») revient à la fin jusqu'à être réussie, et la jauge ne bouge pas.
  - **Animations** (choix du professeur, pour que ce soit moins scolaire), toutes coupées si le téléphone demande de réduire les animations, et sans son : bonne réponse (coche, « +1 » qui s'envole, jauge qui se remplit), mauvaise réponse (petit tremblement), « 🔥 3 d'affilée ! » (puis 5, 10, 15, 20, 30), bilan (score qui défile, message selon le résultat, confettis), « Niveau 1 validé ✓ », « Chapitre maîtrisé ! » avec une médaille 🏅 ensuite sur la ligne du chapitre.
  - **Une couleur par chapitre**, la même que dans la page de suivi : 10 couleurs (1 vert d'eau, 2 soleil, 3 corail, 4 lavande, 5 ciel, 6 sauge, 7 rose, 8 moutarde, 9 lagon, 10 pêche), puis on recommence au chapitre 11 (choix du professeur : 10, pas plus). **Dans un chapitre, la couleur du chapitre** colore la synthèse (bord de l'introduction, soulignement des parties, définitions, exemples, conclusion, étapes, puces, en-têtes de tableau), les mini-cas, les questions, les étiquettes de niveau et les jauges ; **le lexique et les flashcards, eux, prennent tour à tour les 10 couleurs de la palette** (une couleur par fiche, qui tourne ; les puces des sous-éléments prennent la couleur de leur fiche ou de leur carte) ; pastille et bord de la ligne du chapitre, onglet actif, haut des cartes d'activité, carte de la question (variables `--ch1` à `--ch6` dans `assets/style.css`, fonction `teinte` dans `assets/app.js`). **Les jauges de progression prennent la couleur de leur chapitre** (dans la liste des chapitres et dans le chapitre) ; l'encadré « Chapitre validé à … % » reste blanc ; la jauge générale de l'accueil (« Ta progression ») est **en morceaux** : un morceau par chapitre ouvert, dans sa couleur, avec une petite légende (choix du professeur).
  - Chapitre **avec thèmes** (liste `themes`, le cas normal) : trois activités, Flashcards, QCM, Situations. « QCM » ouvre la liste des thèmes (avec seulement leur nom, sans écrire « thème » ni « partie »), plus « Tout le chapitre mélangé » ; un thème ouvre ensuite Niveau 1 · Je connais et Niveau 2 · Je réfléchis. « Situations » ouvre la liste des thèmes, plus « Toutes les situations mélangées », et un clic lance les mini-cas. L'élève peut ouvrir directement le niveau 2.
  - **Navigation** : chaque écran de l'entraînement a sa propre adresse (`#/chapitre/N/entrainement/qcm/T/1`, `…/situations/T`, `…/qcm/tout`, `…/flashcards`), donc le bouton retour du téléphone ou du navigateur remonte d'un écran. En haut de chaque écran : un seul bouton « ← Retour » qui remonte d'un écran (pas de fil d'Ariane, choix du professeur). Le titre de la série (« Les conflits · Niveau 2 ») s'affiche au-dessus de la jauge. Pendant une série, « J'arrête là » est toujours à droite de la jauge ; le bilan propose « Continuer » et « ← Retour ».
  - **Mémoire des onglets** : l'élève peut quitter une série (QCM, situations, flashcards) pour lire la synthèse ou le lexique, puis revenir par l'onglet « Entraînement » : il retrouve la même question, au même point. La synthèse et le lexique se rouvrent là où il lisait (avec sa recherche). Consulter le cours pendant l'entraînement est autorisé (choix du professeur). Cette mémoire tient tant que la page reste ouverte. Chaque ligne a sa jauge, chaque question affiche son niveau.
  - Chapitre **sans thèmes** (ancien format, encore géré par le moteur) : Flashcards, QCM, Situations, sans choix de thème ni de niveau.
- **Documents** : uniquement si le chapitre a une liste `documents` non vide. Chaque document s'ouvre dans un nouvel onglet.
- **Jeux** : uniquement si le chapitre a une liste `jeux`. Chaque jeu est une affiche entièrement cliquable (image, gros titre, une phrase, bouton « Jouer »), aussi reprise sur l'accueil.

**Chapitre verrouillé** (`verrouille: true`) : c'est le chapitre en cours en classe. Synthèse, lexique et entraînement affichent un cadenas et un message ; les jeux et les documents restent ouverts, pour que les élèves continuent de venir en cours. Un chapitre verrouillé ne compte ni dans les chiffres de l'accueil ni dans la progression, et le bouton « Réviser le chapitre » de l'accueil mène au dernier chapitre ouvert. Le cadenas ne cache que l'affichage : tout ce qui est dans `data/chXX.js` est public (dépôt GitHub public, fichier téléchargé par le navigateur). Un chapitre verrouillé ne contient donc **aucun cours** dans son fichier publié (`intro: ""`, `synthese`, `cartes`, `qcm`, `situations` vides) : le contenu attend dans `sources/chXX-complet.js`, jamais publié. L'outil de vérification signale une erreur si du cours reste dans le fichier d'un chapitre verrouillé.

Une jauge indique ce qui est validé, par activité et par chapitre. La jauge du chapitre compte les flashcards, les questions de QCM et toutes les questions des situations. Une situation à plusieurs questions est validée quand toutes ses questions sont justes. Il n'y a ni test noté, ni boutons « Lu, Su, Revu », ni carte mentale.

## Format d'un chapitre

- `id`, `theme` (le thème du programme, nommé dans `data/config.js`), `titre`, `question`, `intro` (le paragraphe d'introduction de la synthèse, ou une chaîne vide).
- `version` (facultatif, 1 par défaut) : à augmenter seulement quand un chapitre est entièrement refondu. La progression des élèves sur ce chapitre repart alors de zéro.
- `verrouille: true` (facultatif) : chapitre en cours en classe, voir plus haut. Pour ouvrir le chapitre, supprimer la ligne.
- `themes` : les thèmes de l'entraînement, `[{ partie, nom, notions: [...] }]`. Le nom s'affiche tel quel (sans « Thème »). `partie` (facultatif, par exemple « Partie 1 · Les interactions au sein d’un groupe ») s'affiche en titre au-dessus de ses thèmes, dans les menus QCM et Situations (choix du professeur, depuis le chapitre 4). `notions` liste les notions que chaque niveau de QCM du thème doit interroger ; elle n'est pas affichée, elle sert à l'outil de vérification : écrire chaque notion avec le mot exact employé dans les questions. Chaque QCM et chaque situation indique son numéro de thème (`theme: 1` pour le premier).
- `documents` (facultatif) : `{ titre, description, lien: "documents/chXX/fichier.pdf", ajout: "AAAA-MM-JJ" }`.
- `jeux` (facultatif) : `{ id, titre, ajout: "AAAA-MM-JJ", accroche, lien, affiche }`.
- `synthese` : liste de blocs. Types : `h` (partie), `h3` (sous-partie), `p`, `def` (encadré de définition), `ex` (exemple), `conclusion`, `flow` (étapes avec flèches), `liste`, `table` (`head`, `rows`, `rowHead: true` si la première colonne sert d'en-tête).
- `cartes` : `{ terme, def }`. Elles alimentent le lexique et les flashcards. Une fiche fusionnée regroupe plusieurs notions : `{ terme, def, sous: [{ terme, def }] }`. Sur la flashcard, le recto montre le titre, le verso la définition puis les sous-éléments.
- `qcm` : `{ q, c: [choix], r: index de la bonne réponse, e: explication }`. Dans un chapitre avec thèmes, ajouter `theme` et `niveau` (1 ou 2). Plusieurs bonnes réponses : `r` devient une liste (`r: [0, 2]`), et la question n'est validée que si tout est juste.
- **Question à classer (bacs)** : `{ theme, niveau, q, tri: [catégories], items: [[exemple, n° de catégorie], …], e }` sans `c` ni `r`. L'élève touche une étiquette, puis le bac où elle va ; validée seulement si tout est bien rangé. Une catégorie peut recevoir plusieurs exemples.
- **Question à relier (traits)** : même format avec `relier: true` ; `tri` contient les éléments de droite (souvent des définitions), un par élément de gauche (un pour un). L'élève touche un élément à gauche puis son partenaire à droite, un trait de couleur les relie.
- `situations` : chapitre sans thèmes, comme un QCM avec `s` (le mini-cas) en plus. Chapitre avec thèmes, un mini-cas : `{ theme, s: "le texte", questions: [{ q, c, r, e }, …] }`, avec 3 questions. Le texte reste affiché pendant les trois questions.

## Règles de contenu

- La synthèse du site reprend mot pour mot la synthèse distribuée en classe : on change la mise en forme, jamais le texte. Ne rien y ajouter.
- **Un QCM peut donner un exemple court ou une petite histoire d'une seule question ; une situation est un mini-cas avec une histoire et 3 questions.** (Choix du professeur, depuis le chapitre 4.)
- **Des exemples NOUVEAUX en majorité** (choix du professeur) : pour que l'élève prenne de la hauteur, la plupart des exemples des QCM et des mini-cas sont des situations qu'il n'a jamais vues (autres métiers, autres organisations), et non ceux du cours. Les exemples du cours peuvent revenir, mais en minorité. Les exemples nouveaux restent simples et indiscutables : une seule bonne catégorie possible.
- **Varier les formats** : à chaque niveau, mélanger QCM à une réponse, à plusieurs réponses, justifications, différences, bacs et questions à relier.
- **QCM** : 20 au minimum par chapitre, davantage si le chapitre est long. Au moins une question par notion de la synthèse. Chaque question a une explication, affichée après la réponse.
- **Couverture des notions, sans exception** (chapitres avec thèmes) : dans chaque thème, chaque notion est interrogée au moins une fois au niveau 1 **et** au moins une fois au niveau 2, car l'élève peut n'ouvrir qu'un seul niveau. Une notion qui n'apparaît que dans une mauvaise réponse (par exemple une phrase vraie d'une question « affirmation FAUSSE ») ne compte pas : ajouter une question plutôt que d'en laisser une de côté.
- **Sur mesure, sans remplissage** : il n'y a pas de quota fixe. Le nombre de QCM et de mini-cas s'ajuste au chapitre et à chaque thème, selon ses notions. Une question par notion et par niveau suffit le plus souvent ; ne pas ajouter de questions qui se ressemblent pour gonfler les chiffres. Chaque chapitre reste cohérent avec les autres (même format, mêmes règles) et sans doublon.
- **Deux niveaux de QCM** :
  - niveau 1, « Je connais » : retrouver la notion à partir de sa définition (QCM ou question à relier), puis la reconnaître dans des exemples simples ;
  - niveau 2, « Je réfléchis » : trouver l'affirmation fausse parmi quatre, cocher plusieurs bonnes réponses, comparer deux notions (« Coche la bonne différence… »), justifier un vrai ou faux (« … Cette phrase est FAUSSE. Coche la bonne justification. »), ou classer des exemples nouveaux dans des bacs. Les mauvaises réponses sont des « presque justes » (notions voisines du chapitre), pas des définitions sans rapport.
- **Consignes explicites** : l'élève doit savoir quoi cocher sans deviner. Le site ajoute tout seul « Coche la bonne réponse. » sous une question, sauf si elle contient déjà le mot « Coche ». Il affiche « Plusieurs réponses sont justes : coche-les toutes, puis valide. » quand `r` est une liste. Écrire la consigne dans la question pour les pièges, avec le mot clé en majuscules : « Coche l'affirmation FAUSSE. », « Coche TOUTES les… », « Coche l'élément qui ne fait PAS partie… », « « … » Cette phrase est FAUSSE. Coche la bonne justification. », « Coche la bonne différence entre… ». Un vrai ou faux s'écrit « « La phrase. » Vrai ou faux ? ».
- Les mauvaises réponses doivent être crédibles : des notions proches du même chapitre, pas des réponses absurdes. Elles ont la même longueur et le même style que la bonne réponse, pour qu’on ne puisse pas deviner « la plus longue ».
- Questions à cocher : varier le nombre de bonnes réponses (2 sur 4, 2 sur 5, 3 sur 5, 4 sur 5…), pour éviter le réflexe « tout sauf l’intrus ».
- Pas de doublon : deux questions d’un même thème et d’un même niveau ne testent pas la même idée sous deux formes.
- Les explications reprennent les définitions de la synthèse (elles peuvent reprendre l'exemple de la question) et donnent le « réflexe » qui permet de trancher (« Qui l'a créé ? L'organisation → formel »). Pas d'idée ni de règle qui n'est pas dans la synthèse.
- **Situations** : un mini-cas est un court texte avec une histoire et des personnages, suivi de 3 questions sur les notions du thème, sans reprendre un QCM. Le nombre de mini-cas dépend de la taille du thème, pour que ses notions soient travaillées en situation sans répétition : par exemple 1 mini-cas pour 3 ou 4 notions, 2 pour 5 à 7, 3 pour 8 ou plus. Les chapitres 1 à 3, validés par le professeur, gardent 2 mini-cas par thème. (Ancien format sans thèmes : 10 situations au minimum.)
- **Thèmes** : un thème par sous-partie de la synthèse (A, B, C…), rangé sous sa partie (champ `partie`), jamais à cheval sur deux parties : le chapitre peut ainsi s'ouvrir partie par partie (voir « Verrouiller ou ouvrir un chapitre »). Les chapitres 1 à 3 gardent leurs thèmes.
- **Flashcards** : une par notion de la synthèse, donc un nombre variable selon le chapitre. Les notions liées sont regroupées dans une fiche fusionnée (par exemple « Le conflit et ses types », « Les trois types d'organisations »).
- Ne rien inventer hors de la synthèse comme connaissance : pas de date, de chiffre, d'entreprise réelle ni d'affaire qui n'y figure pas. Les exemples inventés des questions (personnages, métiers, organisations imaginaires) sont permis et même souhaités (voir « Des exemples NOUVEAUX »).
- Chapitre 2 : pas de question sur les « mécanismes internes » ni sur « l'intérêt du contrôle de soi ».
- Les zones de la proxémie : ne pas interroger sur les distances chiffrées.
- Ne jamais mettre en ligne les corrigés de cours, de TD ou de DS.
- Aucune donnée d'élève dans le site publié. Sans code, la progression reste dans le navigateur de l'élève (`localStorage`). Avec les codes élèves, elle est aussi rangée dans le document Grist du professeur (Grist de l'État), **sous forme de codes seulement, jamais de noms**.
- Écrire les apostrophes en typographique (’) et les guillemets en « » dans les textes.

## Construire un chapitre (méthode complète)

Quand le professeur dit « construis le chapitre N » :

1. Lire la synthèse et le TD déposés dans `sources/`. Proposer d'abord, sans rien écrire : les thèmes (calqués sur les parties), la liste des notions de chaque thème, les fiches fusionnées, et le nombre de QCM et de mini-cas prévu pour chaque thème, justifié par ses notions. Attendre « go ».
2. Copier la structure du dernier chapitre construit (modèle : le chapitre 4, `sources/ch04-complet.js` tant qu'il est verrouillé) et remplacer le contenu. La synthèse est recopiée mot pour mot.
3. Écrire les fiches, puis les QCM thème par thème : pour chaque notion, une question de niveau 1 (définition → notion) et une question de niveau 2, en variant les quatre types. Puis les mini-cas, en nombre adapté à chaque thème.
4. Relire question par question : la bonne réponse est juste et tirée de la synthèse ; les mauvaises réponses sont crédibles et de même longueur ; pas de doublon dans un thème et un niveau ; pas de doublon entre un QCM et une question de mini-cas ; consigne explicite.
5. Lancer `node sources/outils/verifier.js N` et corriger jusqu'à « Aucune erreur ». Les points « À REVOIR » se regardent un par un.
6. **Boucle de relecture** (choix du professeur) : construire et analyser en même temps, par tours. À chaque tour, lancer l'outil puis une relecture complète et stricte par un relecteur neuf (exactitude, une seule bonne catégorie par exemple, couverture de chaque notion aux deux niveaux, doublons, réponses qui se devinent, niveau 2 vraiment plus difficile, part d'exemples nouveaux) ; corriger ; recommencer jusqu'à ce qu'il ne reste aucun point bloquant. Ne présenter au professeur que la version finale : pas de diagnostic à refaire ensuite.
7. **Relecture à froid obligatoire**, en une passe séparée, après l'outil : relire tout le chapitre (fiches, QCM, mini-cas), question par question, en cherchant ce que l'outil ne voit pas : bonne réponse discutable, mauvaise réponse qui pourrait être juste, deux questions qui testent la même chose avec les mêmes choix, notion qui n'est la bonne réponse d'aucune question d'un niveau, mini-cas qui contredit un QCM, phrase de fiche absente de la synthèse. Corriger, puis relancer l'outil. Ne jamais annoncer un chapitre comme terminé avant cette relecture.
8. Si le chapitre est nouveau : ajouter `<script src="data/chXX.js"></script>` dans `index.html`, avant `assets/app.js`, et mettre à jour `chapitreEnCours` dans `data/config.js` (et `themes` de `config.js` si le chapitre ouvre un nouveau thème du programme).
9. Tester dans le navigateur, y compris en largeur téléphone, puis faire un bilan honnête au professeur : chiffres, ce que la relecture a trouvé et corrigé, points incertains.

## Verrouiller ou ouvrir un chapitre

- Pendant que le chapitre se fait en classe : `verrouille: true` dans `data/chXX.js`, et tout le cours (intro, synthèse, fiches, QCM, situations) rangé dans `sources/chXX-complet.js`. Seuls le titre, la question, les jeux et les documents restent dans le fichier publié.
- **Partie par partie** (choix du professeur) : quand une partie est finie en classe, publier sa synthèse, ses fiches, ses QCM et ses mini-cas (ses thèmes) et enlever le cadenas ; ajouter ensuite la partie suivante **à la fin** des listes. La progression déjà validée est gardée ; la jauge du chapitre baisse quand une partie arrive (prévenir les élèves que c'est normal).
- À la fin du chapitre : remettre le contenu dans `data/chXX.js` (ou construire le chapitre avec la méthode ci-dessus), supprimer `verrouille: true`, lancer l'outil de vérification. Le chapitre entre alors dans les chiffres et la progression.

## Ajouter un document (TD, fiche)

1. Ranger le fichier dans `documents/chXX/` (PDF de préférence).
2. L'ajouter à la liste `documents` du chapitre : `{ titre, description, lien, ajout }`.
3. Jamais de corrigé de cours, de TD ou de DS.

## Codes élèves (progression en ligne et suivi du professeur)

- **Où sont les données (choix du proviseur, RGPD, 9 octobre 2026)** : plus de Google. Les données sont dans un document **Grist** du professeur, « Révision SGN · Suivi », sur le **Grist de l'État** (`grist.numerique.gouv.fr`, géré par la DINUM, accessible par le portail apps.education.fr et ProConnect). `data/config.js` : `comptes: { grist: "https://grist.numerique.gouv.fr", document: "<identifiant>" }`. **Seuls des codes** partent en ligne, **jamais de nom** : les noms restent sur les appareils du professeur (voir « Suivi »). GitHub n'héberge que le site (aucune donnée d'élève).
- **Principe** : chaque élève a un code de 6 caractères (`K7P-4MX`, sans 0/O, 1/I/L, 5/S), avec ou sans tiret, en majuscules ou minuscules. Il le tape une fois par appareil. **Le code ne s'affiche jamais à l'écran** (choix du professeur, 9 octobre 2026 : sur un grand écran, les voisins le liraient) : pendant la saisie, des points (bouton « Afficher » pour vérifier, et le navigateur ne propose pas de le retenir) ; une fois connecté, la barre du haut dit seulement « ● Connecté », avec « Me déconnecter » souligné juste dessous (« Quitter » sur petit téléphone). Sa progression reste sur l'appareil et part aussi dans Grist. On additionne partout : une question validée quelque part reste validée partout, et personne ne peut effacer la progression d'un élève depuis le site.
- **Tableaux du document Grist** : `Codes` (code, groupe « Élève » ou « Autre » ; jamais de nom), `Envois` (code, donnees, date : **chaque envoi ajoute une ligne avec seulement les réponses nouvelles** ; la progression d'un élève est la somme de ses lignes ; rien n'est jamais réécrit, donc deux appareils qui envoient en même temps ne peuvent pas s'écraser), `Jeux` (code, jeu, date, donnees : une ligne par partie), `Progression` (vide, gardé pour la compatibilité, lu mais plus écrit).
- **Règles d'accès du document** (Grist, « Règles d'accès ») : accès public « éditeur », mais chaque demande du site porte le code dans l'adresse (`?code_=K7P-4MX`) et les règles font qu'un élève ne lit que ses lignes, n'ajoute qu'à son code **et seulement si son code est dans la liste écrite dans les règles**, ne modifie ni n'efface rien ; la page prof lit tout avec `?prof_=<clé du suivi>` ; seul le propriétaire (le professeur, connecté à Grist) change la structure. **Ajouter un code** : l'ajouter au CSV et aux étiquettes, dans le tableau `Codes`, ET dans la liste des codes des règles d'accès (formules `user.LinkKey.code in [...]` des tableaux Envois, Jeux, Progression). Le diagnostic vérifie que Grist et le CSV ont les mêmes codes.
- **Ce que le site fait** (`assets/comptes.js`) : à la connexion, il vérifie le code (tableau `Codes`), lit les envois de l'élève, les additionne et retient ce qui est déjà en ligne (`sgn-compte-envoye`) ; ensuite il n'envoie que les nouveautés. Hors ligne, les réponses attendent (`sgn-compte-a-envoyer`) et partent au retour du réseau (essai toutes les 20 s). **Déconnexion** (« Me déconnecter », « Quitter » sur petit téléphone) : efface l'appareil (ordinateurs du lycée) **sans rien perdre** : ce qui n'est pas parti devient un « colis » au code de l'élève (`sgn-compte-colis`), envoyé dès que possible même si un autre élève s'est connecté. **Envoi express** quand l'élève quitte la page : une demande `fetch` « keepalive » (Grist refuse `sendBeacon`), ajoutée à `Envois`. **Témoin** : point vert « enregistré en ligne », point orange qui clignote « envoi en attente ». **Retour sur la page** : le site va chercher ce qui a été fait sur un autre appareil (au plus une fois par minute), additionne, et renvoie ce qui manquerait en ligne (réparation automatique).
- **Vitesse** (tests du 9 octobre 2026) : une réponse arrive en moins d'une seconde ; 30 connexions et 30 envois en même temps : tout arrivé du premier coup en 2 s (Google : jusqu'à 82 s) ; page prof en 0,2 s.
- **Code de test du professeur** : `sources/eleves/code-professeur.txt` (groupe « Autre »). L'utiliser pour les tests, jamais le code d'un élève.
- **Codes « Autre »** (tests, invités) : groupe « Autre » dans le tableau `Codes` et dans `eleves-codes.csv`. La page de suivi les affiche à part, hors des statistiques de la classe.
- **Fichiers privés** (dans `sources/eleves/`, jamais publiés) : `eleves-codes.csv` (nom, prénom, code, groupe), `etiquettes-a-imprimer.html`, `cle-suivi.txt` (**la clé du suivi**, à garder secrète), `code-professeur.txt`. Les anciens fichiers Google ont été retirés le 9 octobre 2026.
- **Suivi** : `prof.html`, ouverte avec la **clé du suivi** (`sources/eleves/cle-suivi.txt`), tapée une fois par appareil (« Rester connecté sur cet appareil », cochée par défaut, la garde dans ce navigateur : `sgn-prof-mdp`). Les **noms** ne sont jamais en ligne : le professeur ouvre une fois `eleves-codes.csv` sur chaque appareil (la page le garde dans ce navigateur : `sgn-prof-noms`, `sgn-prof-autres`) ; sans ce fichier, la page affiche les codes et propose de l'ouvrir. Deux parties :
  - **La classe** : « Vue d'ensemble » (chiffres clés, une carte par chapitre, tableau des élèves : nom, total, % par chapitre, dernière activité), puis un onglet par chapitre. **Tout ce qui concerne un chapitre est dans son onglet**, de haut en bas : la progression de la classe (Flashcards, puis pour chaque thème QCM N1, QCM N2, Mini-cas, et la moyenne de la classe), puis le QCM évalué (à venir), puis ses jeux (une ligne par partie, et la liste des élèves qui n'ont pas encore joué). Un chapitre verrouillé qui a un jeu a aussi son onglet. Les comptes « Autre » sont à part, hors des chiffres de la classe.
  - **Une couleur par chapitre** (les 10 couleurs du site élève, puis on recommence), partout : puce, carte, bandeau, fiche élève.
  - **Élève par élève** : recherche, « Précédent / Suivant », son code, puis chaque chapitre **exactement comme l'élève le voit** (jauge du chapitre, Flashcards « sues », QCM « validées » par thème avec Niveau 1 et Niveau 2, Situations par thème en mini-cas), et dans la carte du chapitre ses parties des jeux de ce chapitre. **Chaque carte de chapitre se replie et se déplie** en touchant sa bande de couleur (repliée par défaut, avec un résumé sur une ligne) ; un bouton « ▴ Replier » en bas de chaque chapitre déplié ; « Tout déplier / Tout replier » ; les chapitres dépliés le restent en passant d'un élève à l'autre. Mêmes calculs que `assets/app.js` (et même addition que `assets/comptes.js`) : si l'un change, changer l'autre. Ne rien y ajouter que l'élève ne voie pas (choix du professeur). Page de connexion : panneau bleu nuit « Bonjour M. Lefebvre » et carte de la clé. La connexion retire les espaces, coupe la majuscule automatique, a un bouton « Afficher », et réessaie 3 fois (30 s chacune) si le serveur tarde ; une mauvaise clé affiche « Clé du suivi incorrecte ». En-tête : « ↻ Actualiser » et « Me déconnecter » (efface la clé gardée ; « Quitter » sur téléphone).
- **Jeux** : plus aucun Google Form (retiré du jeu « Premier jour » le 9 octobre 2026). Un jeu envoie un résultat, sans prénom, avec `SGN_COMPTES.envoyerJeu("id-du-jeu", { temps: "18 min", enigmes: 6 })` (charger `../../data/config.js` puis `../../assets/comptes.js`). La partie attend sur l'appareil (`sgn-compte-jeux-a-envoyer`) jusqu'à ce que Grist l'ait reçue, avec le code de l'élève qui l'a jouée. Utiliser l'identifiant de la liste `jeux` du chapitre (ex. `ch04-premier-jour`).
- **Réseau du lycée** : le site doit pouvoir joindre `grist.numerique.gouv.fr`. À vérifier une fois au lycée sur un poste élève (point vert, et l'envoi se retrouve dans Grist).
- **Retirer les codes** : `comptes: { document: "" }` dans `data/config.js` et publier (le site fonctionne sans codes, les élèves gardent leur progression sur leur appareil).
- **Fin d'année** : archiver le document Grist (Grist garde aussi un historique) et repartir d'un document vide en septembre (nouvelle classe, nouveaux codes).

## Vérifier les chapitres

`node sources/outils/verifier.js` (ou `… verifier.js 3` pour un seul chapitre) contrôle : la forme des questions, les thèmes et niveaux, la couverture de chaque notion au niveau 1 et au niveau 2, les bonnes réponses trop longues, les questions à cocher trop semblables, les doublons, les apostrophes, les distances chiffrées, les corrigés, et signale si la synthèse a changé depuis la dernière publication. L'outil ne remplace pas la relecture : il repère les oublis, pas le sens.

## Ajouter un jeu

1. Ranger le fichier du jeu dans `activites/chXX-nom-du-jeu/index.html`.
2. Ajouter le jeu à la liste `jeux` du chapitre.
3. Dans le jeu, à la fin de la partie, écrire `localStorage.setItem('sgn-jeu-<id>', 'termine')` pour que le site affiche « terminé ».
4. Ajouter un lien de retour vers `../../index.html#/chapitre/N/jeux`.
5. Dessiner l'affiche du jeu : un fichier `affiche.svg` dans le dossier du jeu (viewBox `0 0 800 600`, sans texte, avec une couleur et un dessin propres au thème du jeu). Le bas de l'image est recouvert par le titre : y laisser une zone calme. Renseigner le champ `affiche`. Une image `affiche.jpg` fournie par le professeur peut la remplacer.
6. Les résultats du jeu vont seulement dans le suivi du professeur (Grist), avec `SGN_COMPTES.envoyerJeu` : jamais de Google Form, jamais de prénom ni de nom envoyé (le prénom tapé dans un jeu reste dans le jeu).

## Prochaine évaluation

Réglée dans `data/config.js` : `evaluation: { date: "AAAA-MM-JJ", chapitre: N }`. Sur l'accueil, sous le titre « Prochaine évaluation », une affiche « copie parfaite » dans l'esprit des affiches des jeux (choix du professeur, après avoir écarté le post-it, le ticket et le sablier) : fond bleu nuit, une copie qui flotte avec trois coches vertes qui se dessinent, une étoile, un reflet qui passe, étiquettes « Chapitre N » et délai, bouton blanc (dessin `DESSIN_COPIE` dans `assets/app.js`) ; dans la liste des chapitres et en haut du chapitre, une étiquette dans le même style bleu nuit (mini copie cochée, délai en jaune, reflet ; étoile en plus en haut du chapitre), fonction `etiquetteEval` dans `assets/app.js`. La pastille dit « dans N jours », puis « Demain ! » la veille et « Jour J, bonne chance ! » le jour même. Tout disparaît le lendemain de la date.

## Modifier sans casser la progression des élèves

- La progression d'un élève est repérée par la position de chaque carte et de chaque question dans son fichier.
- Ajouter les nouvelles cartes et questions à la fin des listes. Ne pas réordonner ni supprimer au milieu : corriger le texte sur place.
- Les questions des situations sont numérotées à la suite, dans l'ordre du fichier : ne pas ajouter de question au milieu d'un mini-cas déjà en ligne, ajouter plutôt un nouveau mini-cas à la fin.
- Pour une refonte complète d'un chapitre, augmenter son champ `version`.

## Vérifier sur téléphone

Chaque écran doit tenir en largeur téléphone (360 à 400 px) : rien ne doit dépasser à droite. `main.wrap` a `overflow-x: clip`, donc un débordement ne crée pas de barre de défilement : comparer le bord droit de chaque élément à la largeur de la fenêtre.

## Charte graphique (choix du professeur, à respecter)

- **Couleurs du site** : encre vert très sombre `#15231E` (textes, boutons), fond clair `#EEF3EF`, corail `--coral` (logo, accent), jaune soleil `--sun`, vert d'eau `--teal`. Variables en haut de `assets/style.css`, avec leurs versions pour le mode sombre.
- **Polices** : Bricolage Grotesque (titres) et Figtree (texte), hébergées dans `assets/fonts/`.
- **Une couleur par chapitre, 10 couleurs** (`--ch1` à `--ch10`, et `--ch1s` à `--ch10s` pour les fonds doux) : 1 vert d'eau, 2 soleil, 3 corail, 4 lavande, 5 ciel, 6 sauge, 7 rose, 8 moutarde, 9 lagon, 10 pêche ; au chapitre 11, on recommence à la première. Pas de 20 couleurs (choix du professeur). Fonction `teinte` dans `assets/app.js` et dans `prof.html` : les deux doivent rester identiques.
- **Ce qui prend la couleur du chapitre** : pastille et bord de la ligne du chapitre, onglet actif, haut des cartes d'activité, synthèse (introduction, parties, définitions, exemples, conclusion, étapes, puces, en-têtes de tableau), mini-cas, carte de la question, étiquettes de niveau, toutes les jauges du chapitre.
- **Lexique et flashcards** : les 10 couleurs tournent, une par fiche ; les puces des sous-éléments prennent la couleur de leur fiche (ou de leur carte).
- **Jauge générale de l'accueil** : en morceaux, un par chapitre ouvert, dans sa couleur, avec une légende. L'encadré « Chapitre validé à … % » reste blanc.
- **Réponses** : juste en vert, faux en rouge (ne pas changer).
- **Prochaine évaluation** : affiche « copie parfaite » sur fond bleu nuit (comme les affiches des jeux) ; étiquettes bleu nuit en petit. Essayés et écartés par le professeur : encadré jaune seul, noir et or, post-it, ticket, sablier, motifs.
- **Animations** : courtes, sans son, coupées si le téléphone demande de réduire les animations (voir « Entraînement »).
- **Page prof** : en-tête vert sombre avec le logo loupe, page de connexion bleu nuit « Bonjour M. Lefebvre », mêmes 10 couleurs de chapitres.
- **Méthode** : pour tout changement de présentation, proposer plusieurs maquettes, attendre le choix et le « go », puis montrer le rendu dans le navigateur avant de publier. Changer la présentation ne touche jamais la progression des élèves.

## Diagnostic (quand le professeur dit « fais le diagnostic »)

Objectif : qu'aucun élève ne tombe sur un problème, et que chaque donnée arrive sous le bon code dans Grist et la page prof. Toujours faire les deux parties, puis un compte rendu clair (« tout est OK » ou la liste des problèmes avec une proposition pour chacun) ; ne rien corriger sans « go ».

1. **Partie automatique** : `node sources/outils/diagnostic.js` (une à deux minutes). Il vérifie :
   - le site sur l'ordinateur : outil de vérification des chapitres, syntaxe de tout le code (site, page prof, jeux), `data/config.js` sur le vrai document Grist, chapitres bien chargés, rien de `sources/` sur GitHub, tout publié ;
   - le site en ligne : chaque fichier répond et est identique à celui de l'ordinateur ;
   - les données : les codes du CSV sans doublon et tous sur une étiquette, les mêmes codes (et groupes) dans Grist que dans le CSV, chaque code accepté, faux code refusé et incapable d'écrire, rien de lisible sans la clé du suivi, un code ne lit que ses réponses, personne ne peut modifier une réponse enregistrée, envoi « à blanc » avec le code de test (une ligne vide) relu.
2. **Passage d'élève dans le navigateur**, sur le site en ligne, en mode « sans code » (ne rien écrire dans Grist) : accueil (affiche d'évaluation, jauge en morceaux), liste des chapitres, synthèse, lexique, une flashcard, une question de QCM, une situation, le jeu ; aucune erreur dans la console ; en largeur téléphone (375 px), rien ne dépasse à droite ; page prof : l'écran de connexion s'affiche sans erreur. Puis vider le stockage du navigateur de test.
3. **Page prof** : si la clé du suivi est gardée dans le panneau, vérifier que chaque nom est en face du bon code (comparer avec `sources/eleves/eleves-codes.csv`).
4. Après le diagnostic : ne laisser aucun serveur de test lancé, `data/config.js` sur le vrai document Grist.
5. **Test de charge** (après un changement des envois, ou sur demande) : `node sources/outils/test-charge.js` envoie 30 connexions et 30 envois en même temps au vrai document Grist (code de test du professeur seulement, lignes vides). Attendu : 0 perdu, 30/30 retrouvés. Mesure du 9 octobre 2026 (Grist) : tout arrivé du premier coup en 2 s (avec Google le 5 octobre : jusqu'à 1 min 22 s).
6. **Diagnostic automatique du matin** : tâche planifiée « diagnostic-quotidien-sgn » de l'application Claude (chaque jour vers 6 h 30 ; si le Mac est fermé, elle part à l'ouverture de l'application). Elle fait les étapes 1 et 2 ci-dessus sans rien corriger ni publier, écrit son rapport dans `sources/rapports/diagnostic-AAAA-MM-JJ.md` (30 derniers gardés) et envoie une notification (« tout est OK » ou « N problème(s) »). Pour la changer : modifier la tâche, pas ce fichier seul.

## Créer quelque chose de nouveau (chapitre, jeu, QCM évalué…) : deux étapes en boucle

Façon de travailler du professeur : il demande la création, et tout le reste s'enchaîne sans qu'il ait à demander trente corrections. Chaque étape se fait **en boucle** : faire → vérifier → corriger → revérifier, jusqu'à ce qu'il ne reste rien à corriger.

1. **Création, avec la boucle** : construire, puis vérifier et corriger en boucle AVANT de montrer (pour un chapitre : outil de vérification + relecture stricte par un relecteur neuf, tour après tour, voir « Construire un chapitre » ; pour un jeu ou une page : chaque écran, chaque bouton, en largeur téléphone, en clair et en sombre). Montrer ensuite dans le panneau (aperçu local, rien en ligne). Le professeur ajuste s'il le souhaite ; chaque ajustement repasse dans la boucle. Pendant cette étape, ne pas parler de données.
2. **Liaison avec les comptes, avec la boucle** : quand le professeur valide, tout brancher (site élève, envoi des données vers le document Grist, page prof), publier sur son « go publie », puis tester **en boucle jusqu'à zéro erreur**, avec tous les tests : chaque page et chaque question jouée en largeur téléphone, envoi des données avec le code de test, réseau coupé puis remis, appli fermée, déconnexion sans réseau (colis), autre appareil, retour sur la page, chaque donnée vérifiée dans le bon ordre et sous le bon code dans Grist et dans la page prof. Dans la page prof, vérifier aussi les dates (« aujourd’hui », « hier », « il y a N jours ») avec une activité de la veille au soir : elles se comptent en jours du calendrier, pas en tranches de 24 heures (erreur trouvée par le grand test du 6 octobre 2026). Une erreur trouvée → corrigée → la boucle recommence. À la fin, donner au professeur un petit test à faire sur son téléphone (mode avion) et vérifier dans Grist que c’est arrivé. **À la sortie de cette étape, tout doit être parfait.**

Ne jamais annoncer une création comme terminée avant la fin de l'étape 2.

**Le grand test final se fait de temps en temps**, pas après chaque création (quand le professeur dit « grand test final »). Il doit trouver **zéro erreur**. S'il en trouve une, c'est que les boucles des étapes 1 et 2 ne sont pas assez efficaces : corriger l'erreur, **améliorer les boucles** (ajouter dans ce fichier la vérification qui manquait), et relancer le grand test.

## Les tests : trois niveaux (la phrase que dit le professeur)

- **« Test rapide »** (5 minutes environ) : site en ligne identique à l'ordinateur, aucune erreur de code, serveur Grist qui répond, chaque page principale ouverte en largeur téléphone. Fait de moi-même après chaque petite modification.
- **« Fais le diagnostic »** (15 à 20 minutes) : voir « Diagnostic ». Fait aussi chaque matin automatiquement. Fait de moi-même après chaque publication importante.
- **« Grand test final »** (1 à 2 heures, sans se presser ; de temps en temps, sur demande) : tout le diagnostic + test de charge + règles d'accès du document Grist ; toutes les questions de tous les chapitres jouées entièrement, en largeur téléphone, tablette et ordinateur, en clair et en sombre (« J'arrête là », « Refaire pour m'entraîner », mémoire des onglets, bouton retour, bilan) ; le trajet complet des données avec le code de test (hors ligne, page fermée, colis, autre appareil, retour sur la page), dans le bon ordre et sous le bon code dans Grist ; le jeu joué jusqu'au bout et son résultat dans Grist ; la page prof (clé du suivi gardée dans le panneau par « Rester connecté » ; ne jamais la demander ni l'écrire dans la conversation) : chaque onglet, chaque chapitre, chiffres comparés un par un avec Grist. Rapport final honnête (vérifié, simulé, reste à faire sur téléphone), écrit dans `sources/rapports/` et notification au professeur à la fin.

## Publier

- Avant de publier, laisser le professeur vérifier en ouvrant `index.html`.
- Ne jamais publier de sa propre initiative. Le professeur publie avec GitHub Desktop (« Commit to main », puis « Push origin »), ou demande explicitement à Claude Code de publier (« go publie ») : seulement dans ce cas, faire le commit et le push.
- Avant de publier : lancer l'outil de vérification, et vérifier que rien de `sources/` n'est ajouté.
- Le dépôt GitHub est public : ne rien y déposer d'autre que le site.
