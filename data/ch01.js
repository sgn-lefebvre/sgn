SGN.chapitres.push({
  id: 1,
  theme: 1,
  titre: "Les différents types d’organisation",
  question: "Comment définir les différents types d’organisation ?",
  intro: "",
  /* version 2 : refonte du chapitre (fiches fusionnées, thèmes, niveaux, mini-cas). La progression de l’ancienne version est remise à zéro. */
  version: 2,
  /* Thèmes de l’entraînement. « notions » : ce que chaque niveau de QCM du thème doit interroger au moins une fois
     (sert à la vérification, n’est pas affiché). Chaque QCM et chaque situation indique son numéro de thème. */
  themes: [
    { nom: "Les types d’organisations",
      notions: ["action collective organisée", "organisation", "entreprise privée", "organisation publique", "association", "but poursuivi"] },
    { nom: "Le fonctionnement des organisations",
      notions: ["structure de propriété", "actionnaires", "dirigeants", "hiérarchie", "statuts", "règlement intérieur"] },
    { nom: "La gouvernance et le contrôle",
      notions: ["gouvernance", "abus de pouvoir", "actionnaires", "électeurs", "assemblée générale", "donateurs"] }
  ],

  synthese: [
    { t: "h", txt: "Partie 1 – Connaître les différents types d’organisations" },
    { t: "p", html: "Une personne seule ne peut pas atteindre certains objectifs (distribuer des millions de repas, par exemple). Quand plusieurs individus se regroupent autour d’un objectif commun et se donnent des règles et des moyens pour durer, on parle d’<strong>action collective organisée</strong> : une organisation est née." },
    { t: "ex", html: "L’appel de Coluche en 1985 a donné naissance à l’association des Restos du Cœur." },
    { t: "def", html: "<strong>Une organisation</strong> est donc un groupe humain structuré et durable, qui se donne des règles et réunit des moyens pour atteindre un objectif commun." },
    { t: "table", titre: "Il existe trois types d’organisations", rowHead: true,
      head: ["", "L’entreprise privée", "L’organisation publique", "L’association"],
      rows: [
        ["Son but", "Son but est <strong>lucratif</strong>, elle vend des biens ou des services pour réaliser un profit", "Son but est de satisfaire l’<strong>intérêt général</strong>", "Son but est <strong>non lucratif</strong>, elle rend service sans partager de bénéfices"],
        ["Ses ressources", "Ses ressources viennent de ses ventes", "Ses ressources viennent des impôts", "Dons, cotisations, subventions, bénévolat"],
        ["Exemples", "Decathlon, une boulangerie", "La mairie de Villeneuve-d’Ascq, un lycée", "Les Restos du Cœur, un club sportif"]
      ] },
    { t: "p", html: "C’est donc le <strong>but poursuivi</strong> qui permet de distinguer les types d’organisations." },

    { t: "h", txt: "Partie 2 – Comprendre le fonctionnement des organisations" },
    { t: "def", html: "<strong>La structure de propriété</strong> désigne l’identité des propriétaires de l’organisation. Une entreprise appartient à ses <strong>actionnaires</strong> (chez Decathlon : la famille du fondateur et les salariés actionnaires). Une commune n’appartient à personne : elle est administrée au nom de ses habitants. Une association n’a pas de propriétaire." },
    { t: "p", html: "<strong>Qui dirige ?</strong> Dans l’entreprise, des dirigeants choisis par les propriétaires. À la mairie, le maire et ses adjoints. Dans l’association, un président et des bénévoles élus par les membres." },
    { t: "def", html: "<strong>La hiérarchie</strong> répartit l’autorité et les tâches : chaque responsable encadre une équipe, transmet les objectifs et contrôle le travail." },
    { t: "p", html: "<strong>Des règles écrites</strong> encadrent chaque organisation : les <strong>statuts</strong> fixent les règles générales de fonctionnement, et le <strong>règlement intérieur</strong> organise la vie quotidienne au travail (horaires, sécurité, discipline)." },

    { t: "h", txt: "Partie 3 – Gouverner et contrôler les organisations" },
    { t: "def", html: "La gouvernance désigne la manière dont une organisation est dirigée et contrôlée. Elle précise qui prend les décisions, comment elles sont prises et à qui les dirigeants doivent rendre des comptes." },
    { t: "p", html: "Son but est de s’assurer que les dirigeants agissent dans l’intérêt de l’organisation et de ses parties prenantes. Le contrôle est donc important pour éviter les abus de pouvoir et vérifier que les objectifs sont respectés." },
    { t: "liste", titre: "Le contrôle dépend du type d’organisation :", items: [
        "Dans une entreprise, les dirigeants sont principalement contrôlés par les propriétaires ou les actionnaires, qui peuvent les remplacer.",
        "Dans une organisation publique, le contrôle est exercé par les électeurs lorsqu’elle est dirigée par des élus, ou par une autorité publique comme l’État.",
        "Dans une association, les dirigeants rendent des comptes aux membres, notamment lors de l’assemblée générale. Les donateurs peuvent aussi exercer une influence en cessant de financer l’association."
      ] }
  ],

  /* Fiches fusionnées : une fiche peut regrouper plusieurs notions dans « sous ». */
  cartes: [
    { terme: "Action collective organisée", def: "Plusieurs individus se regroupent autour d’un objectif commun et se donnent des règles et des moyens pour durer." },
    { terme: "Organisation", def: "Groupe humain structuré et durable, qui se donne des règles et réunit des moyens pour atteindre un objectif commun." },
    { terme: "Les trois types d’organisations", def: "C’est le but poursuivi qui permet de distinguer les types d’organisations.",
      sous: [
        { terme: "Entreprise privée", def: "son but est lucratif, elle vend des biens ou des services pour réaliser un profit. Ses ressources viennent de ses ventes." },
        { terme: "Organisation publique", def: "son but est de satisfaire l’intérêt général. Ses ressources viennent des impôts." },
        { terme: "Association", def: "son but est non lucratif, elle rend service sans partager de bénéfices. Ses ressources : dons, cotisations, subventions, bénévolat." }
      ] },
    { terme: "La structure de propriété", def: "Elle désigne l’identité des propriétaires de l’organisation.",
      sous: [
        { terme: "Entreprise", def: "elle appartient à ses actionnaires." },
        { terme: "Commune", def: "elle n’appartient à personne : elle est administrée au nom de ses habitants." },
        { terme: "Association", def: "elle n’a pas de propriétaire." }
      ] },
    { terme: "Qui dirige ?", def: "Dans l’entreprise, des dirigeants choisis par les propriétaires. À la mairie, le maire et ses adjoints. Dans l’association, un président et des bénévoles élus par les membres." },
    { terme: "Hiérarchie", def: "Elle répartit l’autorité et les tâches : chaque responsable encadre une équipe, transmet les objectifs et contrôle le travail." },
    { terme: "Les règles écrites", def: "Des règles écrites encadrent chaque organisation.",
      sous: [
        { terme: "Statuts", def: "ils fixent les règles générales de fonctionnement." },
        { terme: "Règlement intérieur", def: "il organise la vie quotidienne au travail (horaires, sécurité, discipline)." }
      ] },
    { terme: "Gouvernance", def: "Manière dont une organisation est dirigée et contrôlée : qui prend les décisions, comment elles sont prises et à qui les dirigeants doivent rendre des comptes." },
    { terme: "Le contrôle des dirigeants", def: "Il est important pour éviter les abus de pouvoir et vérifier que les objectifs sont respectés. Il dépend du type d’organisation.",
      sous: [
        { terme: "Entreprise", def: "les dirigeants sont principalement contrôlés par les propriétaires ou les actionnaires, qui peuvent les remplacer." },
        { terme: "Organisation publique", def: "le contrôle est exercé par les électeurs lorsqu’elle est dirigée par des élus, ou par une autorité publique comme l’État." },
        { terme: "Association", def: "les dirigeants rendent des comptes aux membres, notamment lors de l’assemblée générale. Les donateurs peuvent aussi exercer une influence en cessant de financer l’association." }
      ] }
  ],

  /* QCM : pas d’histoire. theme = numéro dans « themes » ; niveau 1 « Je connais », niveau 2 « Je réfléchis ».
     r est une liste quand il y a plusieurs bonnes réponses : la question n’est validée que si tout est juste. */
  qcm: [
    /* Thème 1 : les types d’organisations */
    { theme: 1, niveau: 1, q: "Un groupe humain structuré et durable, qui se donne des règles et réunit des moyens pour atteindre un objectif commun, s’appelle :",
      c: ["Une organisation", "Une hiérarchie", "Une structure de propriété", "Une gouvernance"], r: 0,
      e: "Une organisation est un groupe humain structuré et durable, qui se donne des règles et réunit des moyens pour atteindre un objectif commun." },
    { theme: 1, niveau: 1, q: "Quand plusieurs individus se regroupent autour d’un objectif commun et se donnent des règles et des moyens pour durer, on parle :",
      c: ["D’action collective organisée", "De gouvernance", "De structure de propriété", "De hiérarchie"], r: 0,
      e: "C’est une action collective organisée : une organisation est née, comme les Restos du Cœur après l’appel de Coluche en 1985." },
    { theme: 1, niveau: 1, q: "Une organisation dont le but est lucratif et dont les ressources viennent de ses ventes est :",
      c: ["Une entreprise privée", "Une organisation publique", "Une association"], r: 0,
      e: "L’entreprise privée vend des biens ou des services pour réaliser un profit : son but est lucratif, ses ressources viennent de ses ventes." },
    { theme: 1, niveau: 1, q: "Une organisation dont le but est de satisfaire l’intérêt général et dont les ressources viennent des impôts est :",
      c: ["Une entreprise privée", "Une organisation publique", "Une association"], r: 1,
      e: "L’organisation publique a pour but de satisfaire l’intérêt général. Ses ressources viennent des impôts." },
    { theme: 1, niveau: 1, q: "Une organisation dont le but est non lucratif, financée par des dons, des cotisations, des subventions et du bénévolat, est :",
      c: ["Une entreprise privée", "Une organisation publique", "Une association"], r: 2,
      e: "L’association a un but non lucratif : elle rend service sans partager de bénéfices." },
    { theme: 1, niveau: 1, q: "Ce qui permet de distinguer les types d’organisations, c’est :",
      c: ["Le but poursuivi", "La hiérarchie", "Le nombre de membres", "Le règlement intérieur"], r: 0,
      e: "C’est le but poursuivi qui permet de distinguer les types d’organisations : lucratif, intérêt général ou non lucratif." },
    { theme: 1, niveau: 2, q: "Coche l’affirmation FAUSSE.",
      c: ["Une organisation publique cherche à satisfaire l’intérêt général", "Les ressources d’une organisation publique viennent des impôts", "Une association rend service sans partager de bénéfices", "Les ressources d’une entreprise privée viennent des impôts"], r: 3,
      e: "Les ressources d’une entreprise privée viennent de ses ventes : elle vend des biens ou des services pour réaliser un profit. Les impôts financent l’organisation publique." },
    { theme: 1, niveau: 2, q: "Coche TOUTES les ressources d’une association.",
      c: ["Les dons", "Les cotisations", "Les impôts", "Les subventions", "Les ventes"], r: [0, 1, 3],
      e: "Les ressources d’une association sont les dons, les cotisations, les subventions et le bénévolat. Les impôts financent l’organisation publique, les ventes l’entreprise privée." },
    { theme: 1, niveau: 2, q: "Coche ce qui permet de distinguer une entreprise privée, une organisation publique et une association.",
      c: ["Leur but poursuivi : profit, intérêt général ou service sans partage", "Leur taille : petite, moyenne ou grande organisation", "Leurs propriétaires : actionnaires, État ou membres", "Leur règlement intérieur : horaires, sécurité, discipline"], r: 0,
      e: "C’est le but poursuivi qui distingue les organisations : lucratif pour l’entreprise privée, intérêt général pour l’organisation publique, non lucratif pour l’association." },
    { theme: 1, niveau: 2, q: "« Une organisation, c’est simplement un groupe de personnes. » Cette phrase est FAUSSE. Coche la bonne justification.",
      c: ["Une organisation est structurée, durable, avec des règles et des moyens", "Une organisation doit compter au moins cent membres pour exister", "Une organisation poursuit toujours un but lucratif, comme une entreprise", "Une organisation appartient toujours à des actionnaires qui la dirigent"], r: 0,
      e: "Une organisation est un groupe humain structuré et durable, qui se donne des règles et réunit des moyens pour atteindre un objectif commun." },
    { theme: 1, niveau: 2, q: "« Un objectif commun suffit pour former une organisation. » Cette phrase est FAUSSE. Coche la bonne justification.",
      c: ["Il faut aussi se donner des règles et des moyens pour durer", "Il faut aussi réaliser un profit pour pouvoir durer", "Il faut aussi obtenir l’accord de la mairie pour exister", "Il faut aussi des actionnaires pour financer le projet"], r: 0,
      e: "On parle d’action collective organisée quand les individus se donnent des règles et des moyens pour durer : c’est alors une organisation." },
    { theme: 1, niveau: 2, q: "Coche les DEUX organisations publiques.",
      c: ["La mairie de Villeneuve-d’Ascq", "Un lycée", "Decathlon", "Les Restos du Cœur", "Une boulangerie"], r: [0, 1],
      e: "La mairie et le lycée servent l’intérêt général et sont financés par les impôts. Decathlon et la boulangerie sont des entreprises privées, les Restos du Cœur une association." },

    /* Thème 2 : le fonctionnement des organisations */
    { theme: 2, niveau: 1, q: "L’identité des propriétaires de l’organisation s’appelle :",
      c: ["La structure de propriété", "La gouvernance", "La hiérarchie", "Le règlement intérieur"], r: 0,
      e: "La structure de propriété désigne l’identité des propriétaires de l’organisation." },
    { theme: 2, niveau: 1, q: "Les propriétaires d’une entreprise sont :",
      c: ["Ses actionnaires", "Ses clients", "Ses électeurs", "Ses donateurs"], r: 0,
      e: "Une entreprise appartient à ses actionnaires." },
    { theme: 2, niveau: 1, q: "Dans une entreprise, les dirigeants sont :",
      c: ["Choisis par les propriétaires", "Élus par les habitants", "Élus par les membres", "Choisis par les clients"], r: 0,
      e: "Dans l’entreprise, les dirigeants sont choisis par les propriétaires. À la mairie, ce sont le maire et ses adjoints ; dans l’association, un président et des bénévoles élus par les membres." },
    { theme: 2, niveau: 1, q: "Ce qui répartit l’autorité et les tâches dans une organisation s’appelle :",
      c: ["La hiérarchie", "La structure de propriété", "La gouvernance", "Les statuts"], r: 0,
      e: "La hiérarchie répartit l’autorité et les tâches : chaque responsable encadre une équipe, transmet les objectifs et contrôle le travail." },
    { theme: 2, niveau: 1, q: "Le document qui fixe les règles générales de fonctionnement de l’organisation s’appelle :",
      c: ["Les statuts", "Le règlement intérieur", "La structure de propriété", "La gouvernance"], r: 0,
      e: "Les statuts fixent les règles générales de fonctionnement." },
    { theme: 2, niveau: 1, q: "Le document qui organise la vie quotidienne au travail (horaires, sécurité, discipline) s’appelle :",
      c: ["Les statuts", "Le règlement intérieur", "La structure de propriété", "La gouvernance"], r: 1,
      e: "Le règlement intérieur organise la vie quotidienne au travail : horaires, sécurité, discipline." },
    { theme: 2, niveau: 2, q: "Coche la bonne différence entre les statuts et le règlement intérieur.",
      c: ["Statuts : règles générales de fonctionnement ; règlement intérieur : vie quotidienne au travail", "Statuts : vie quotidienne au travail ; règlement intérieur : règles générales de fonctionnement", "Statuts : identité des propriétaires ; règlement intérieur : répartition de l’autorité", "Statuts : choix des dirigeants ; règlement intérieur : contrôle des dirigeants"], r: 0,
      e: "Les statuts fixent les règles générales de fonctionnement ; le règlement intérieur organise la vie quotidienne au travail (horaires, sécurité, discipline)." },
    { theme: 2, niveau: 2, q: "Coche l’affirmation FAUSSE.",
      c: ["Une entreprise appartient à ses actionnaires", "Une commune est administrée au nom de ses habitants", "Une association n’a pas de propriétaire", "Une commune appartient au maire qui la dirige"], r: 3,
      e: "La structure de propriété dépend du type d’organisation : une entreprise appartient à ses actionnaires, une association n’a pas de propriétaire, et une commune n’appartient à personne, elle est administrée au nom de ses habitants. Le maire la dirige, il ne la possède pas." },
    { theme: 2, niveau: 2, q: "« Dans une entreprise, ce sont les salariés qui choisissent les dirigeants. » Cette phrase est FAUSSE. Coche la bonne justification.",
      c: ["Les dirigeants sont choisis par les propriétaires, les actionnaires", "Les dirigeants sont élus par les habitants de la commune", "Les dirigeants sont élus par les membres en assemblée", "Les dirigeants sont désignés par le règlement intérieur"], r: 0,
      e: "Une entreprise appartient à ses actionnaires : ce sont les propriétaires qui choisissent les dirigeants." },
    { theme: 2, niveau: 2, q: "« La hiérarchie sert à partager les bénéfices. » Cette phrase est FAUSSE. Coche la bonne justification.",
      c: ["Elle répartit l’autorité et les tâches entre les responsables et les équipes", "Elle fixe les horaires, la sécurité et la discipline au travail", "Elle désigne l’identité des propriétaires de l’organisation", "Elle précise à qui les dirigeants doivent rendre des comptes"], r: 0,
      e: "La hiérarchie répartit l’autorité et les tâches : chaque responsable encadre une équipe, transmet les objectifs et contrôle le travail." },
    { theme: 2, niveau: 2, q: "Coche TOUS les éléments que l’on trouve dans le règlement intérieur.",
      c: ["Les horaires", "La sécurité", "La discipline", "L’identité des propriétaires", "Les règles générales de fonctionnement"], r: [0, 1, 2],
      e: "Le règlement intérieur organise la vie quotidienne au travail : horaires, sécurité, discipline. Les règles générales de fonctionnement sont dans les statuts." },
    { theme: 2, niveau: 2, q: "Coche les DEUX organisations dirigées par des personnes élues.",
      c: ["Une mairie", "Une association", "Une entreprise privée", "Une boulangerie", "Decathlon"], r: [0, 1],
      e: "La mairie est dirigée par le maire et ses adjoints, des élus ; l’association par un président et des bénévoles élus par les membres. Dans l’entreprise, les dirigeants sont choisis par les propriétaires." },

    /* Thème 3 : la gouvernance et le contrôle */
    { theme: 3, niveau: 1, q: "La manière dont une organisation est dirigée et contrôlée s’appelle :",
      c: ["La gouvernance", "La hiérarchie", "La structure de propriété", "Les statuts"], r: 0,
      e: "La gouvernance désigne la manière dont une organisation est dirigée et contrôlée : qui prend les décisions, comment elles sont prises et à qui les dirigeants doivent rendre des comptes." },
    { theme: 3, niveau: 1, q: "Le contrôle des dirigeants est important pour :",
      c: ["Éviter les abus de pouvoir et vérifier que les objectifs sont respectés", "Répartir l’autorité et les tâches entre les différentes équipes", "Fixer les horaires, la sécurité et la discipline au travail", "Désigner l’identité des propriétaires de l’organisation"], r: 0,
      e: "Le contrôle est important pour éviter les abus de pouvoir et vérifier que les objectifs sont respectés." },
    { theme: 3, niveau: 1, q: "Dans une entreprise, les dirigeants sont principalement contrôlés par :",
      c: ["Les propriétaires ou les actionnaires", "Les électeurs de la commune", "Les donateurs de l’association", "Les clients de l’entreprise"], r: 0,
      e: "Dans une entreprise, les dirigeants sont principalement contrôlés par les propriétaires ou les actionnaires, qui peuvent les remplacer." },
    { theme: 3, niveau: 1, q: "Dans une organisation publique dirigée par des élus, le contrôle est exercé par :",
      c: ["Les électeurs", "Les actionnaires", "Les donateurs", "Les clients"], r: 0,
      e: "Dans une organisation publique, le contrôle est exercé par les électeurs lorsqu’elle est dirigée par des élus, ou par une autorité publique comme l’État." },
    { theme: 3, niveau: 1, q: "Dans une association, les dirigeants rendent des comptes aux membres, notamment lors de :",
      c: ["L’assemblée générale", "Les élections municipales", "La réunion des actionnaires", "La rédaction du règlement intérieur"], r: 0,
      e: "Dans une association, les dirigeants rendent des comptes aux membres, notamment lors de l’assemblée générale." },
    { theme: 3, niveau: 1, q: "Ceux qui peuvent exercer une influence sur une association en cessant de la financer sont :",
      c: ["Les donateurs", "Les électeurs", "Les actionnaires", "Les clients"], r: 0,
      e: "Les donateurs peuvent exercer une influence en cessant de financer l’association." },
    { theme: 3, niveau: 2, q: "« La gouvernance, c’est seulement savoir qui dirige. » Cette phrase est FAUSSE. Coche la bonne justification.",
      c: ["Elle précise aussi comment les décisions sont prises et à qui on rend des comptes", "Elle désigne aussi l’identité des propriétaires de l’organisation", "Elle fixe aussi les horaires, la sécurité et la discipline au travail", "Elle répartit aussi l’autorité et les tâches entre les équipes"], r: 0,
      e: "La gouvernance précise qui prend les décisions, comment elles sont prises et à qui les dirigeants doivent rendre des comptes." },
    { theme: 3, niveau: 2, q: "Coche la bonne différence entre le contrôle dans une entreprise et dans une association.",
      c: ["Entreprise : les actionnaires, qui peuvent remplacer les dirigeants ; association : les membres, en assemblée générale", "Entreprise : les membres, en assemblée générale ; association : les actionnaires, qui peuvent remplacer les dirigeants", "Entreprise : les électeurs, lors des élections ; association : l’État, comme autorité publique", "Entreprise : l’État, comme autorité publique ; association : les électeurs, lors des élections"], r: 0,
      e: "Dans une entreprise, les propriétaires ou les actionnaires contrôlent les dirigeants et peuvent les remplacer. Dans une association, les dirigeants rendent des comptes aux membres, notamment lors de l’assemblée générale." },
    { theme: 3, niveau: 2, q: "Coche les DEUX acteurs qui peuvent contrôler une organisation publique.",
      c: ["Les électeurs", "Une autorité publique comme l’État", "Les actionnaires", "Les donateurs", "Les clients"], r: [0, 1],
      e: "Dans une organisation publique, le contrôle est exercé par les électeurs lorsqu’elle est dirigée par des élus, ou par une autorité publique comme l’État." },
    { theme: 3, niveau: 2, q: "Coche l’affirmation FAUSSE.",
      c: ["Dans une entreprise, les actionnaires peuvent remplacer les dirigeants", "Une organisation publique peut être contrôlée par l’État", "La gouvernance précise qui prend les décisions", "Les donateurs n’ont aucun moyen d’agir sur une association"], r: 3,
      e: "Les donateurs peuvent exercer une influence sur une association en cessant de la financer." },
    { theme: 3, niveau: 2, q: "Coche les DEUX raisons pour lesquelles le contrôle des dirigeants est important.",
      c: ["Éviter les abus de pouvoir", "Vérifier que les objectifs sont respectés", "Répartir les tâches entre les équipes", "Fixer les horaires de travail", "Choisir les clients de l’organisation"], r: [0, 1],
      e: "Le contrôle est important pour éviter les abus de pouvoir et vérifier que les objectifs sont respectés. Répartir les tâches, c’est le rôle de la hiérarchie ; les horaires figurent dans le règlement intérieur." }
  ],

  /* Situations : un mini-cas avec des personnages, suivi de 3 questions. Le texte reste affiché. */
  situations: [
    /* Thème 1 */
    { theme: 1,
      s: "Après une tempête, des habitants d’un village décident d’aider les familles sinistrées. Au début, chacun apporte ce qu’il peut, sans s’organiser. Puis ils créent une structure avec une présidente, des règles écrites, et récoltent des dons et des cotisations pour aider sur la durée. Ils ne se partagent aucun bénéfice.",
      questions: [
        { q: "Au tout début, avant de créer la structure, s’agit-il déjà d’une organisation ?",
          c: ["Non : il n’y a encore ni règles ni moyens pour durer", "Oui : il y a déjà un objectif commun à atteindre", "Oui : plusieurs personnes agissent déjà ensemble", "Non : personne ne réalise encore de profit"], r: 0,
          e: "Un objectif commun ne suffit pas : une organisation se donne des règles et réunit des moyens pour durer." },
        { q: "En se donnant des règles et des moyens pour durer, les habitants forment :",
          c: ["Une action collective organisée", "Une entreprise privée", "Une organisation publique", "Une hiérarchie"], r: 0,
          e: "Plusieurs individus se regroupent autour d’un objectif commun et se donnent des règles et des moyens pour durer : c’est une action collective organisée." },
        { q: "Quel type d’organisation ont-ils créé ?",
          c: ["Une association", "Une entreprise privée", "Une organisation publique"], r: 0,
          e: "Le but est non lucratif (aider sans partager de bénéfices) et les ressources sont des dons et des cotisations : c’est une association." }
      ] },
    { theme: 1,
      s: "Léa ouvre un magasin de vélos : elle vend et répare des vélos pour en vivre. La mairie de sa ville lui commande vingt vélos pour les agents municipaux et les paie avec l’argent des impôts. Le samedi, Léa entraîne bénévolement les jeunes d’un club de cyclisme financé par les cotisations de ses adhérents.",
      questions: [
        { q: "Le magasin de Léa est :",
          c: ["Une entreprise privée", "Une organisation publique", "Une association"], r: 0,
          e: "Léa vend des biens et des services pour réaliser un profit : son but est lucratif, c’est une entreprise privée." },
        { q: "La mairie qui achète les vélos est :",
          c: ["Une organisation publique", "Une entreprise privée", "Une association"], r: 0,
          e: "La mairie satisfait l’intérêt général et ses ressources viennent des impôts : c’est une organisation publique." },
        { q: "Qu’est-ce qui permet de distinguer le magasin, la mairie et le club ?",
          c: ["Le but que chacun poursuit", "Le nombre de personnes qui y travaillent", "Le lieu où chacun exerce son activité", "La présence de Léa dans chacun d’eux"], r: 0,
          e: "C’est le but poursuivi qui distingue les organisations : lucratif pour le magasin, intérêt général pour la mairie, non lucratif pour le club." }
      ] },

    /* Thème 2 */
    { theme: 2,
      s: "Karim crée une entreprise de livraison à vélo avec deux associés : tous les trois apportent l’argent de départ. Ils recrutent ensuite une gérante pour diriger l’entreprise. La gérante encadre deux chefs d’équipe, qui encadrent chacun cinq livreurs.",
      questions: [
        { q: "Qui sont les propriétaires de l’entreprise ?",
          c: ["Karim et ses deux associés", "La gérante qu’ils ont recrutée", "Les deux chefs d’équipe", "Les dix livreurs"], r: 0,
          e: "La structure de propriété désigne l’identité des propriétaires : ici, les trois associés qui ont apporté l’argent." },
        { q: "Qui a choisi la gérante pour diriger l’entreprise ?",
          c: ["Les propriétaires", "Les livreurs, par un vote", "Les clients de l’entreprise", "La mairie de la ville"], r: 0,
          e: "Dans l’entreprise, les dirigeants sont choisis par les propriétaires." },
        { q: "Gérante, puis chefs d’équipe, puis livreurs : cette répartition de l’autorité et des tâches, c’est :",
          c: ["La hiérarchie", "La structure de propriété", "La gouvernance", "Le règlement intérieur"], r: 0,
          e: "La hiérarchie répartit l’autorité et les tâches : chaque responsable encadre une équipe, transmet les objectifs et contrôle le travail." }
      ] },
    { theme: 2,
      s: "Adam vient d’être embauché dans un magasin de 300 salariés. Il veut connaître ses horaires et les consignes de sécurité. Sa responsable lui explique que le magasin appartient à des actionnaires, et que les règles générales de fonctionnement de la société sont écrites dans un autre document.",
      questions: [
        { q: "Dans quel document Adam trouvera-t-il ses horaires et les consignes de sécurité ?",
          c: ["Le règlement intérieur", "Les statuts", "La structure de propriété", "La gouvernance"], r: 0,
          e: "Le règlement intérieur organise la vie quotidienne au travail : horaires, sécurité, discipline." },
        { q: "Dans quel document sont écrites les règles générales de fonctionnement de la société ?",
          c: ["Les statuts", "Le règlement intérieur", "La structure de propriété", "La hiérarchie"], r: 0,
          e: "Les statuts fixent les règles générales de fonctionnement de l’organisation." },
        { q: "Les actionnaires du magasin en sont :",
          c: ["Les propriétaires", "Les dirigeants élus", "Les clients fidèles", "Les chefs d’équipe"], r: 0,
          e: "Une entreprise appartient à ses actionnaires : ce sont ses propriétaires." }
      ] },

    /* Thème 3 */
    { theme: 3,
      s: "Mécontents des résultats, les actionnaires d’une société de transport votent le remplacement de leur directeur général. Le même mois, dans la ville voisine, les habitants votent aux élections municipales et choisissent une nouvelle équipe.",
      questions: [
        { q: "Qui contrôle le directeur général de la société de transport ?",
          c: ["Les actionnaires", "Les électeurs", "Les donateurs", "Les clients"], r: 0,
          e: "Dans une entreprise, les dirigeants sont principalement contrôlés par les propriétaires ou les actionnaires, qui peuvent les remplacer." },
        { q: "Qui contrôle les dirigeants de la commune ?",
          c: ["Les électeurs", "Les actionnaires", "Les donateurs", "Les salariés"], r: 0,
          e: "Dans une organisation publique dirigée par des élus, le contrôle est exercé par les électeurs." },
        { q: "Dans les deux cas, à quoi sert ce contrôle ?",
          c: ["À vérifier que les dirigeants respectent les objectifs, sans abus de pouvoir", "À permettre aux dirigeants de décider seuls, sans rendre de comptes", "À partager les bénéfices entre les propriétaires et les électeurs", "À remplacer chaque année tous les dirigeants de l’organisation"], r: 0,
          e: "Le contrôle est important pour éviter les abus de pouvoir et vérifier que les objectifs sont respectés." }
      ] },
    { theme: 3,
      s: "La présidente d’une association d’aide aux sans-abri réunit les membres en assemblée générale : elle présente les comptes et les décisions de l’année, puis les membres votent. Quelques mois plus tard, un scandale éclate sur l’utilisation de l’argent collecté : en un an, les dons chutent de moitié.",
      questions: [
        { q: "Devant qui la présidente rend-elle des comptes ?",
          c: ["Les membres de l’association", "Les actionnaires de l’association", "Les électeurs de la commune", "Les clients de l’association"], r: 0,
          e: "Dans une association, les dirigeants rendent des comptes aux membres, notamment lors de l’assemblée générale." },
        { q: "Quand les dons chutent, qui exerce une influence sur l’association ?",
          c: ["Les donateurs", "Les électeurs", "Les actionnaires", "L’État"], r: 0,
          e: "Les donateurs peuvent exercer une influence en cessant de financer l’association." },
        { q: "La présidente rend des comptes et les membres votent : quelle notion cette assemblée générale illustre-t-elle ?",
          c: ["La gouvernance de l’association", "La hiérarchie de l’association", "La structure de propriété de l’association", "Le règlement intérieur de l’association"], r: 0,
          e: "La gouvernance précise qui prend les décisions, comment elles sont prises et à qui les dirigeants doivent rendre des comptes : ici, la présidente rend des comptes aux membres en assemblée générale." }
      ] }
  ]
});
