/* Réglages du site. Pour changer le chapitre mis en avant sur l'accueil,
   modifier « chapitreEnCours ». Un chapitre apparaît sur le site dès que
   son fichier data/chXX.js est chargé dans index.html. */
window.SGN = {
  config: {
    titre: "Révision SGN",
    /* Adresse publique du site. Le QR code assets/qr-site.svg pointe vers elle :
       si l’adresse change, il faut refaire le QR code. */
    adresse: "https://sgn-lefebvre.forge.apps.education.fr/",
    /* Codes élèves : le document Grist du professeur, sur le Grist de l'État (grist.numerique.gouv.fr, via apps.education.fr).
       Voir CLAUDE.md, « Codes élèves ». Vide = pas de codes, le site fonctionne sans. Pour retirer les codes : document: "". */
    comptes: { grist: "https://grist.numerique.gouv.fr", document: "qT8SS4r63tmmJkmSeaHBNf",
      /* Remise à zéro, une fois par appareil, de la progression gardée sur l'appareil pour un code ("*" : tous les codes).
         Changer la date pour refaire une remise. Effacer aussi les lignes de ce code dans Grist. */
      remises: { "PRO-SGN": "2026-10-09" } },
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
