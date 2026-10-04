SGN.chapitres.push({
  id: 2,
  theme: 1,
  titre: "L’identité et le comportement des individus",
  question: "Comment un individu devient-il acteur dans une organisation ?",
  intro: "Chaque personne agit différemment face à une même situation. Ce chapitre a montré que notre comportement dépend de ce que nous sommes (Partie 1), de la façon dont nous réagissons (Partie 2) et, aujourd’hui, des traces que nous laissons en ligne (Partie 3).",
  /* version 2 : refonte du chapitre (fiches fusionnées, thèmes, niveaux, mini-cas). La progression de l’ancienne version est remise à zéro. */
  version: 2,
  /* Thèmes de l’entraînement. « notions » : ce que chaque niveau de QCM du thème doit interroger au moins une fois
     (sert à la vérification, n’est pas affiché). Chaque QCM et chaque situation indique son numéro de thème. */
  themes: [
    { nom: "Personnalité, émotions et perception",
      notions: ["personnalité", "traits de personnalité", "émotion", "émotions de base", "perception", "étapes"] },
    { nom: "Attitude, comportement et contrôle de soi",
      notions: ["attitude", "comportement", "contrôle de soi"] },
    { nom: "L’identité numérique",
      notions: ["trace", "identité numérique", "e-réputation", "contrôler son e-réputation"] }
  ],

  synthese: [
    { t: "h", txt: "Partie 1 — Les facteurs d’influence du comportement" },
    { t: "def", html: "La <strong>personnalité</strong> est une manière habituelle et durable de penser, de ressentir et d’agir. Elle se décrit par des <strong>traits de personnalité</strong> : introverti ou extraverti, calme ou anxieux, logique ou affectif, soumis ou autonome… Elle se construit avec le temps et rend chaque individu unique." },
    { t: "def", html: "Les <strong>émotions</strong> sont des réactions rapides, souvent involontaires et de courte durée, face à un événement : joie, colère, peur, tristesse, surprise, dégoût (les 6 émotions de base universelles). Elles peuvent avoir un fort impact sur notre comportement si elles ne sont pas maîtrisées." },
    { t: "def", html: "La <strong>perception</strong> est la manière dont chacun interprète ce qui l’entoure à partir de ses cinq sens. Elle suit 4 étapes :" },
    { t: "flow", etapes: ["Sensation", "Attention", "Compréhension", "Mémorisation"] },
    { t: "p", html: "Elle est différente pour chacun (expériences, humeur, environnement) : c’est pourquoi Léna, Karim et Jade ne voient pas la même chose dans la même situation." },

    { t: "h", txt: "Partie 2 — Attitude et comportement" },
    { t: "p", html: "Les <strong>émotions</strong> et la <strong>perception</strong> sont des mécanismes internes : ils se passent à l’intérieur de nous et ne se voient pas. Mais ils ont une conséquence directe sur notre <strong>attitude</strong> et notre <strong>comportement</strong>, qui eux sont visibles. Le <strong>contrôle de soi</strong> permet justement d’agir sur ces réactions internes (gérer ses émotions, prendre du recul sur sa perception) pour adopter un bon comportement." },
    { t: "def", html: "L’<strong>attitude</strong> est notre manière de penser ou de ressentir face à une situation : elle est intérieure, on la devine (un <strong>A</strong>djectif : calme, stressé, motivé…)." },
    { t: "def", html: "Le <strong>comportement</strong> est la réaction observable : on le voit (une a<strong>C</strong>tion : aider, claquer la porte, répondre poliment…)." },
    { t: "def", html: "Le <strong>contrôle de soi</strong>, c’est maîtriser ses émotions pour adopter un comportement adapté : comme Malik chez Topgym, il permet d’agir de façon professionnelle, d’éviter les conflits et de devenir un acteur efficace de l’organisation." },

    { t: "h", txt: "Partie 3 — L’identité numérique" },
    { t: "def", html: "Sur Internet, tout ce que nous faisons laisse une <strong>trace</strong> — même sans rien publier (Arnaud et la vidéo !). L’<strong>identité numérique</strong> est l’ensemble de ces traces : celles que l’on publie <strong>volontairement</strong> (photos, publications) et celles collectées <strong>à notre insu</strong> (historique, recherches)." },
    { t: "def", html: "L’<strong>e-réputation</strong> est l’image et l’opinion que les internautes ont d’une personne, d’une entreprise ou d’une organisation sur Internet. Elle compte aussi dans la vie professionnelle : un recruteur peut chercher notre nom avant un entretien (le cas Sarah). Il faut donc la contrôler : se googliser, réfléchir avant de publier, paramétrer ses comptes, faire supprimer un contenu (CNIL)." },
    { t: "conclusion", html: "Personnalité, émotions, perception, attitude, contrôle de soi et identité numérique expliquent les différences de comportement entre les individus. Les comprendre permet de mieux s’intégrer dans une organisation et de coopérer efficacement : c’est ainsi qu’un individu devient un <strong>acteur</strong> de l’organisation." }
  ],

  /* Fiches fusionnées : une fiche peut regrouper plusieurs notions dans « sous ». */
  cartes: [
    { terme: "La personnalité et ses traits", def: "Manière habituelle et durable de penser, de ressentir et d’agir. Elle se construit avec le temps et rend chaque individu unique.",
      sous: [
        { terme: "Traits de personnalité", def: "introverti ou extraverti, calme ou anxieux, logique ou affectif, soumis ou autonome…" }
      ] },
    { terme: "Les émotions", def: "Réactions rapides, souvent involontaires et de courte durée, face à un événement.",
      sous: [
        { terme: "Les 6 émotions de base", def: "joie, colère, peur, tristesse, surprise, dégoût." }
      ] },
    { terme: "La perception et ses étapes", def: "Manière dont chacun interprète ce qui l’entoure à partir de ses cinq sens. Elle est différente pour chacun (expériences, humeur, environnement).",
      sous: [
        { terme: "Les 4 étapes", def: "sensation → attention → compréhension → mémorisation." }
      ] },
    { terme: "Attitude", def: "Notre manière de penser ou de ressentir face à une situation : elle est intérieure, on la devine (un Adjectif : calme, stressé, motivé…)." },
    { terme: "Comportement", def: "La réaction observable : on le voit (une aCtion : aider, claquer la porte, répondre poliment…)." },
    { terme: "Contrôle de soi", def: "Maîtriser ses émotions pour adopter un comportement adapté." },
    { terme: "L’identité numérique et ses traces", def: "Sur Internet, tout ce que nous faisons laisse une trace, même sans rien publier. L’identité numérique est l’ensemble de ces traces.",
      sous: [
        { terme: "Traces publiées volontairement", def: "photos, publications." },
        { terme: "Traces collectées à notre insu", def: "historique, recherches." }
      ] },
    { terme: "L’e-réputation", def: "Image et opinion que les internautes ont d’une personne, d’une entreprise ou d’une organisation sur Internet. Elle compte aussi dans la vie professionnelle.",
      sous: [
        { terme: "La contrôler", def: "se googliser, réfléchir avant de publier, paramétrer ses comptes, faire supprimer un contenu (CNIL)." }
      ] }
  ],

  /* QCM : pas d’histoire. theme = numéro dans « themes » ; niveau 1 « Je connais », niveau 2 « Je réfléchis ».
     r est une liste quand il y a plusieurs bonnes réponses : la question n’est validée que si tout est juste. */
  qcm: [
    /* Thème 1 : personnalité, émotions et perception */
    { theme: 1, niveau: 1, q: "Une manière habituelle et durable de penser, de ressentir et d’agir s’appelle :",
      c: ["La personnalité", "L’attitude", "L’émotion", "La perception"], r: 0,
      e: "La personnalité est une manière habituelle et durable de penser, de ressentir et d’agir. Elle se construit avec le temps." },
    { theme: 1, niveau: 1, q: "« Introverti ou extraverti », « calme ou anxieux » sont :",
      c: ["Des traits de personnalité", "Des émotions de base", "Des comportements", "Des étapes de la perception"], r: 0,
      e: "La personnalité se décrit par des traits : introverti ou extraverti, calme ou anxieux, logique ou affectif, soumis ou autonome…" },
    { theme: 1, niveau: 1, q: "Une réaction rapide, souvent involontaire et de courte durée, face à un événement, s’appelle :",
      c: ["Une émotion", "Une attitude", "Un trait de personnalité", "Une perception"], r: 0,
      e: "Les émotions sont des réactions rapides, souvent involontaires et de courte durée, face à un événement." },
    { theme: 1, niveau: 1, q: "Joie, colère, peur, tristesse, surprise et dégoût sont :",
      c: ["Les 6 émotions de base", "Des traits de personnalité", "Des attitudes", "Les étapes de la perception"], r: 0,
      e: "Ce sont les 6 émotions de base universelles." },
    { theme: 1, niveau: 1, q: "La manière dont chacun interprète ce qui l’entoure à partir de ses cinq sens s’appelle :",
      c: ["La perception", "La personnalité", "L’attitude", "L’émotion"], r: 0,
      e: "La perception est la manière dont chacun interprète ce qui l’entoure à partir de ses cinq sens." },
    { theme: 1, niveau: 1, q: "Dans la perception, l’étape où les cinq sens captent l’information s’appelle :",
      c: ["La sensation", "L’attention", "La compréhension", "La mémorisation"], r: 0,
      e: "La perception suit 4 étapes : sensation → attention → compréhension → mémorisation. La sensation vient en premier." },
    { theme: 1, niveau: 2, q: "Coche l’affirmation FAUSSE.",
      c: ["La personnalité se construit avec le temps", "Les émotions sont souvent involontaires", "La perception est différente pour chacun", "La personnalité change d’un jour à l’autre"], r: 3,
      e: "La personnalité est une manière habituelle et durable de penser, de ressentir et d’agir : elle ne change pas d’un jour à l’autre." },
    { theme: 1, niveau: 2, q: "Coche les DEUX émotions qui font partie des 6 émotions de base.",
      c: ["La surprise", "La jalousie", "Le dégoût", "La fierté", "L’ennui"], r: [0, 2],
      e: "Les 6 émotions de base universelles sont : joie, colère, peur, tristesse, surprise, dégoût." },
    { theme: 1, niveau: 2, q: "Coche la bonne différence entre une émotion et la personnalité.",
      c: ["L’émotion est rapide et de courte durée ; la personnalité est habituelle et durable", "L’émotion est habituelle et durable ; la personnalité est rapide et de courte durée", "L’émotion vient des cinq sens ; la personnalité vient de l’attention", "L’émotion est un trait de personnalité ; la personnalité est une émotion"], r: 0,
      e: "L’émotion est une réaction rapide, souvent involontaire et de courte durée. La personnalité est une manière habituelle et durable de penser, de ressentir et d’agir." },
    { theme: 1, niveau: 2, q: "Coche le bon ordre des étapes de la perception.",
      c: ["Sensation → attention → compréhension → mémorisation", "Attention → sensation → mémorisation → compréhension", "Compréhension → sensation → attention → mémorisation", "Sensation → compréhension → attention → mémorisation"], r: 0,
      e: "Les sens captent l’information (sensation), on y prête attention, on la comprend, puis on la mémorise." },
    { theme: 1, niveau: 2, q: "« Face à la même situation, tout le monde perçoit la même chose. » Cette phrase est FAUSSE. Coche la bonne justification.",
      c: ["La perception dépend des expériences, de l’humeur et de l’environnement", "La perception dépend uniquement des traits de personnalité de chacun", "La perception dépend uniquement de la durée de la situation vécue", "La perception dépend uniquement des 6 émotions de base de chacun"], r: 0,
      e: "La perception est différente pour chacun : elle dépend des expériences, de l’humeur et de l’environnement." },
    { theme: 1, niveau: 2, q: "Coche TOUS les traits de personnalité.",
      c: ["Introverti", "Anxieux", "Logique", "La colère", "La sensation"], r: [0, 1, 2],
      e: "Introverti, anxieux et logique sont des traits de personnalité. La colère est une émotion, la sensation une étape de la perception." },

    /* Thème 2 : attitude, comportement et contrôle de soi */
    { theme: 2, niveau: 1, q: "Notre manière de penser ou de ressentir face à une situation, intérieure, que l’on devine, s’appelle :",
      c: ["L’attitude", "Le comportement", "La perception", "La personnalité"], r: 0,
      e: "L’attitude est notre manière de penser ou de ressentir face à une situation : elle est intérieure, on la devine (un Adjectif : calme, stressé, motivé…)." },
    { theme: 2, niveau: 1, q: "La réaction observable, celle que l’on voit, s’appelle :",
      c: ["Le comportement", "L’attitude", "L’émotion", "La perception"], r: 0,
      e: "Le comportement est la réaction observable : on le voit (une aCtion : aider, claquer la porte, répondre poliment…)." },
    { theme: 2, niveau: 1, q: "Maîtriser ses émotions pour adopter un comportement adapté, c’est :",
      c: ["Le contrôle de soi", "L’attitude", "La perception", "La personnalité"], r: 0,
      e: "Le contrôle de soi, c’est maîtriser ses émotions pour adopter un comportement adapté." },
    { theme: 2, niveau: 2, q: "Coche TOUS les comportements.",
      c: ["Claquer la porte", "Répondre poliment", "Être stressé", "Aider un collègue", "Être motivé"], r: [0, 1, 3],
      e: "Un comportement est une action que l’on voit : claquer la porte, répondre poliment, aider. « Stressé » et « motivé » sont des adjectifs : ils décrivent une attitude." },
    { theme: 2, niveau: 2, q: "Coche la bonne différence entre l’attitude et le comportement.",
      c: ["L’attitude est intérieure, on la devine ; le comportement est une action que l’on voit", "L’attitude est une action que l’on voit ; le comportement est intérieur, on le devine", "L’attitude est habituelle et durable ; le comportement est rapide et involontaire", "L’attitude vient des cinq sens ; le comportement vient de la mémorisation"], r: 0,
      e: "L’attitude est intérieure, on la devine (un Adjectif). Le comportement est la réaction observable, on le voit (une aCtion)." },
    { theme: 2, niveau: 2, q: "« Contrôler ses émotions, c’est ne plus rien ressentir. » Cette phrase est FAUSSE. Coche la bonne justification.",
      c: ["C’est maîtriser ses émotions pour adopter un comportement adapté", "C’est changer de personnalité pour s’adapter aux autres", "C’est cacher son attitude en ne réagissant plus jamais", "C’est interpréter la situation à partir de ses cinq sens"], r: 0,
      e: "Le contrôle de soi ne supprime pas les émotions : il permet de les maîtriser pour adopter un comportement adapté." },

    /* Thème 3 : l’identité numérique */
    { theme: 3, niveau: 1, q: "L’ensemble des traces que nous laissons sur Internet s’appelle :",
      c: ["L’identité numérique", "L’e-réputation", "La personnalité", "La perception"], r: 0,
      e: "L’identité numérique est l’ensemble des traces laissées sur Internet : celles que l’on publie volontairement et celles collectées à notre insu." },
    { theme: 3, niveau: 1, q: "L’image et l’opinion que les internautes ont d’une personne ou d’une organisation sur Internet s’appellent :",
      c: ["L’e-réputation", "L’identité numérique", "La personnalité", "L’attitude"], r: 0,
      e: "L’e-réputation est l’image et l’opinion que les internautes ont d’une personne, d’une entreprise ou d’une organisation sur Internet." },
    { theme: 3, niveau: 1, q: "L’historique et les recherches sont des traces :",
      c: ["Collectées à notre insu", "Publiées volontairement", "Qui ne font pas partie de l’identité numérique", "Visibles seulement par nos amis"], r: 0,
      e: "Sur Internet, tout ce que nous faisons laisse une trace : l’historique et les recherches sont collectés à notre insu." },
    { theme: 3, niveau: 1, q: "Pour contrôler son e-réputation et faire supprimer un contenu qui nous concerne, on peut s’adresser à :",
      c: ["La CNIL", "La mairie", "Le rectorat", "La chambre de commerce"], r: 0,
      e: "Pour contrôler son e-réputation, on peut faire supprimer un contenu, avec l’aide de la CNIL." },
    { theme: 3, niveau: 2, q: "Coche TOUTES les pratiques qui permettent de contrôler son e-réputation.",
      c: ["Se googliser", "Publier sans réfléchir", "Paramétrer ses comptes", "Faire supprimer un contenu", "Accepter toutes les demandes d’abonnés"], r: [0, 2, 3],
      e: "Pour contrôler son e-réputation : se googliser, réfléchir avant de publier, paramétrer ses comptes, faire supprimer un contenu (CNIL)." },
    { theme: 3, niveau: 2, q: "Coche les DEUX traces que l’on publie volontairement.",
      c: ["Une photo de vacances", "L’historique de navigation", "Une publication sur un réseau", "Les recherches tapées", "Les pages consultées"], r: [0, 2],
      e: "Les photos et les publications sont des traces que l’on publie volontairement. L’historique, les recherches et les pages consultées sont collectés à notre insu, même sans rien publier." },
    { theme: 3, niveau: 2, q: "Coche la bonne différence entre l’identité numérique et l’e-réputation.",
      c: ["Identité numérique : l’ensemble de nos traces ; e-réputation : l’image que les internautes ont de nous", "Identité numérique : l’image que les internautes ont de nous ; e-réputation : l’ensemble de nos traces", "Identité numérique : les entreprises seulement ; e-réputation : les personnes seulement", "Identité numérique : les traces volontaires ; e-réputation : les traces collectées à notre insu"], r: 0,
      e: "L’identité numérique est l’ensemble des traces que nous laissons. L’e-réputation est l’image et l’opinion que les internautes ont d’une personne, d’une entreprise ou d’une organisation." },
    { theme: 3, niveau: 2, q: "Coche l’affirmation FAUSSE.",
      c: ["L’e-réputation concerne aussi les entreprises et les organisations", "Un recruteur peut chercher notre nom avant un entretien", "Les photos que l’on publie font partie de l’identité numérique", "L’e-réputation ne compte pas dans la vie professionnelle"], r: 3,
      e: "L’e-réputation compte aussi dans la vie professionnelle : un recruteur peut chercher notre nom avant un entretien." }
  ],

  /* Situations : un mini-cas avec des personnages, suivi de 3 questions. Le texte reste affiché. */
  situations: [
    /* Thème 1 */
    { theme: 1,
      s: "Depuis des années, Chloé est organisée, calme et réfléchie, au lycée comme dans son club de sport. Ce matin pourtant, en apprenant qu’elle a raté son permis, elle est envahie par la tristesse. Le soir, cela va déjà mieux.",
      questions: [
        { q: "« Organisée, calme et réfléchie depuis des années » : que décrit-on ?",
          c: ["Sa personnalité", "Son émotion", "Sa perception", "Son comportement"], r: 0,
          e: "Une manière habituelle et durable d’agir, décrite par des traits (organisée, calme, réfléchie) : c’est la personnalité." },
        { q: "La tristesse de ce matin, qui passe dans la journée, est :",
          c: ["Une émotion", "Un trait de personnalité", "Une attitude durable", "Une étape de la perception"], r: 0,
          e: "C’est une réaction rapide, souvent involontaire et de courte durée face à un événement : une émotion." },
        { q: "La tristesse fait partie :",
          c: ["Des 6 émotions de base", "Des traits de personnalité", "Des étapes de la perception", "Des traces numériques"], r: 0,
          e: "Les 6 émotions de base universelles sont : joie, colère, peur, tristesse, surprise, dégoût." }
      ] },
    { theme: 1,
      s: "Emma et Noah assistent au même cours. Emma, assise devant, écoute et retient l’essentiel. Noah, fatigué et assis au fond de la salle, entend la voix du professeur mais pense à autre chose : à la fin, il n’a rien retenu.",
      questions: [
        { q: "Qu’est-ce qui explique qu’ils ne retiennent pas la même chose ?",
          c: ["Leur perception n’est pas la même", "Leur personnalité a changé pendant le cours", "Leur e-réputation n’est pas la même", "Leur identité numérique n’est pas la même"], r: 0,
          e: "La perception est différente pour chacun : chacun interprète ce qui l’entoure à sa façon." },
        { q: "Noah entend la voix mais pense à autre chose. À quelle étape de la perception bloque-t-il ?",
          c: ["L’attention", "La sensation", "La compréhension", "La mémorisation"], r: 0,
          e: "Ses sens captent la voix (sensation), mais il n’y prête pas attention : sans attention, pas de compréhension ni de mémorisation." },
        { q: "Qu’est-ce qui a influencé la perception de Noah ?",
          c: ["Sa fatigue et sa place au fond de la salle", "Son e-réputation auprès du professeur", "Le nombre d’élèves présents dans la classe", "Les 6 émotions de base qu’il ressent"], r: 0,
          e: "La perception dépend des expériences, de l’humeur (la fatigue) et de l’environnement (le fond de la salle)." }
      ] },

    /* Thème 2 */
    { theme: 2,
      s: "Pour son premier jour, Sami, nouveau vendeur, est stressé. Devant les clients, il sourit et répond poliment. En plein rush, une cliente s’énerve au comptoir : Sami sent la colère monter, mais il respire, reste calme et lui propose un échange.",
      questions: [
        { q: "« Sami est stressé » décrit :",
          c: ["Son attitude", "Son comportement", "Sa personnalité", "Sa perception"], r: 0,
          e: "L’attitude est intérieure, on la devine : « stressé » est un adjectif." },
        { q: "« Il sourit et répond poliment » décrit :",
          c: ["Son comportement", "Son attitude", "Son émotion", "Sa personnalité"], r: 0,
          e: "Le comportement est la réaction observable : sourire et répondre sont des actions, on les voit." },
        { q: "Face à la cliente, Sami respire et reste calme. Il fait preuve :",
          c: ["De contrôle de soi", "De perception", "D’e-réputation", "De personnalité"], r: 0,
          e: "Sami maîtrise son émotion (la colère) pour adopter un comportement adapté : c’est le contrôle de soi." }
      ] },
    { theme: 2,
      s: "Agacée par une remarque de son responsable, Lina soupire et lève les yeux au ciel devant toute l’équipe. Le lendemain, face à une remarque du même genre, elle prend une grande inspiration et répond calmement.",
      questions: [
        { q: "Quelle phrase décrit un comportement de Lina ?",
          c: ["Lina soupire et lève les yeux au ciel", "Lina est agacée par la remarque", "Lina trouve la remarque injuste", "Lina est de nature anxieuse"], r: 0,
          e: "Le comportement est une action que l’on voit : soupirer, lever les yeux au ciel." },
        { q: "Quelle phrase décrit l’attitude de Lina le premier jour ?",
          c: ["Elle est agacée", "Elle soupire", "Elle lève les yeux au ciel", "Elle répond calmement"], r: 0,
          e: "L’attitude est intérieure, on la devine : « agacée » est un adjectif. Les autres phrases décrivent des actions, donc des comportements." },
        { q: "Le lendemain, qu’est-ce qui a changé ?",
          c: ["Elle a maîtrisé son émotion pour adopter un comportement adapté", "Elle a changé de personnalité en une seule nuit", "Elle ne ressent plus aucune émotion face aux remarques", "Elle a modifié son identité numérique pendant la nuit"], r: 0,
          e: "Le contrôle de soi, c’est maîtriser ses émotions pour adopter un comportement adapté." }
      ] },

    /* Thème 3 */
    { theme: 3,
      s: "Tom regarde beaucoup de vidéos de football sans jamais rien publier. Sa plateforme lui propose pourtant de plus en plus de vidéos sur ce thème. Le week-end, il publie une photo de son match et commente la vidéo d’un ami.",
      questions: [
        { q: "Comment la plateforme connaît-elle ses goûts ?",
          c: ["Grâce aux traces collectées à son insu", "Grâce à ses publications volontaires", "Grâce à son contrôle de soi", "Grâce à ses traits de personnalité"], r: 0,
          e: "Même sans rien publier, Tom laisse des traces : son historique est collecté à son insu." },
        { q: "La photo du match et le commentaire sont des traces :",
          c: ["Publiées volontairement", "Collectées à son insu", "Qui ne laissent aucune trace", "Visibles seulement par Tom"], r: 0,
          e: "Photos et publications sont des traces que l’on publie volontairement." },
        { q: "Toutes ces traces, ensemble, forment :",
          c: ["Son identité numérique", "Son e-réputation en ligne", "Sa personnalité de joueur", "Sa perception du football"], r: 0,
          e: "L’identité numérique est l’ensemble des traces : celles publiées volontairement et celles collectées à notre insu." }
      ] },
    { theme: 3,
      s: "Sarah passe un entretien d’embauche demain. Ce soir, la recruteuse tape son nom dans un moteur de recherche et trouve des photos de soirée visibles par tout le monde. Dans la même ville, un restaurant perd des clients depuis la publication de plusieurs avis négatifs en ligne.",
      questions: [
        { q: "Que consulte la recruteuse ?",
          c: ["L’e-réputation de Sarah", "La personnalité de Sarah", "L’attitude de Sarah", "La perception de Sarah"], r: 0,
          e: "L’e-réputation compte aussi dans la vie professionnelle : un recruteur peut chercher notre nom avant un entretien." },
        { q: "Que pouvait faire Sarah pour l’éviter ?",
          c: ["Paramétrer ses comptes pour limiter qui voit ses photos", "Changer de personnalité avant son entretien d’embauche", "Supprimer son historique de navigation chaque soir", "Demander à la mairie d’effacer toutes ses photos"], r: 0,
          e: "Paramétrer ses comptes fait partie des façons de contrôler son e-réputation, avec se googliser, réfléchir avant de publier et faire supprimer un contenu." },
        { q: "L’exemple du restaurant montre que l’e-réputation concerne aussi :",
          c: ["Les entreprises et les organisations", "Uniquement les personnes célèbres", "Uniquement les jeunes sur les réseaux", "Uniquement les recruteurs"], r: 0,
          e: "L’e-réputation est l’image et l’opinion que les internautes ont d’une personne, d’une entreprise ou d’une organisation sur Internet." }
      ] }
  ]
});
