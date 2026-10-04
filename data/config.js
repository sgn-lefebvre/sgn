/* Réglages du site. Pour changer le chapitre mis en avant sur l'accueil,
   modifier « chapitreEnCours ». Un chapitre apparaît sur le site dès que
   son fichier data/chXX.js est chargé dans index.html. */
window.SGN = {
  config: {
    titre: "Objectif SGN",
    prof: "M. Lefebvre",
    classe: "1re STMG",
    matiere: "Sciences de gestion et numérique",
    chapitreEnCours: 4,
    /* Prochaine évaluation, affichée sur l'accueil. Date au format AAAA-MM-JJ.
       Le bandeau disparaît tout seul le lendemain. Pour le retirer avant : date: "" */
    evaluation: { date: "2026-10-09", chapitre: 3 },
    themes: {
      1: "De l’individu à l’acteur"
    }
  },
  chapitres: []
};
