/* Réglages du site. Pour changer le chapitre mis en avant sur l'accueil,
   modifier « chapitreEnCours ». Un chapitre apparaît sur le site dès que
   son fichier data/chXX.js est chargé dans index.html. */
window.SGN = {
  config: {
    titre: "Révision SGN",
    /* Adresse publique du site. Le QR code assets/qr-site.svg pointe vers elle :
       si l’adresse change, il faut refaire le QR code. */
    adresse: "https://sgn-lefebvre.github.io/sgn/",
    /* Codes élèves : adresse du script Google du professeur (voir CLAUDE.md, « Codes élèves »).
       Vide = pas de codes, le site fonctionne comme avant. Pour retirer les codes : remettre "". */
    comptes: { adresse: "https://script.google.com/macros/s/AKfycbz97Ei9hTx6oMpoIVUPe5E01Q4iwR1K3gI6audP1g3BccMFcWtIVjzkYrGfAuFiV5yJ2A/exec" },
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
