/* Réglages du site. Pour changer le chapitre mis en avant sur l'accueil,
   modifier « chapitreEnCours ». Un chapitre apparaît sur le site dès que
   son fichier data/chXX.js est chargé dans index.html. */
window.SGN = {
  config: {
    titre: "SGN",
    prof: "M. Lefebvre",
    classe: "1re STMG",
    matiere: "Sciences de gestion et numérique",
    chapitreEnCours: 4,
    revision: false, /* true pour afficher l’onglet « Révision » (tous les chapitres mélangés) */
    themes: {
      1: "De l’individu à l’acteur"
    }
  },
  chapitres: []
};
