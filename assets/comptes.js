/* ==========================================================================
   Révision SGN : codes élèves et progression en ligne
   Actif seulement si data/config.js donne l'adresse du script Google (comptes.adresse).
   Sans adresse, ce fichier ne fait rien : le site fonctionne comme avant.
   Les jeux peuvent l'utiliser aussi : SGN_COMPTES.envoyerJeu("id-du-jeu", { temps: "18 min", ... }).
   ========================================================================== */
(function () {
  "use strict";

  var CFG = (window.SGN && window.SGN.config && window.SGN.config.comptes) || {};
  var ADRESSE = CFG.adresse || "";
  var CLE_CODE = "sgn-compte-code", CLE_CHOIX = "sgn-compte-choix", CLE_ATTENTE = "sgn-compte-a-envoyer", CLE_VERIF = "sgn-compte-a-verifier";
  var CLE_JEUX = "sgn-compte-jeux-a-envoyer";

  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { if (v === null || v === undefined) { localStorage.removeItem(k); } else { localStorage.setItem(k, v); } } catch (e) { /* stockage indisponible */ } }

  /* Code : 6 caractères, majuscules ou minuscules, avec ou sans tiret. */
  function normaliser(code) {
    var c = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    return c.length === 6 ? c.slice(0, 3) + "-" + c.slice(3) : null;
  }

  /* Appel au script Google. « text/plain » évite une vérification préalable que Google ne sait pas traiter.
     Google répond parfois lentement ou de travers : on abandonne au bout de 25 secondes, et on réessaie
     (jusqu'à « essais » fois). Une réponse sans « ok » compte comme un échec. */
  function appelUnique(donnees, delai) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var minuterie = ctrl ? setTimeout(function () { ctrl.abort(); }, delai || 25000) : null;
    return fetch(ADRESSE, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(donnees), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.text(); })
      .then(function (t) {
        clearTimeout(minuterie);
        var j = JSON.parse(t);
        if (!j || typeof j.ok !== "boolean") { throw new Error("réponse inattendue"); }
        return j;
      }, function (e) { clearTimeout(minuterie); throw e; });
  }
  function appel(donnees, essais) {
    essais = essais || 2;
    return appelUnique(donnees).catch(function (e) {
      if (essais <= 1) { throw e; }
      return new Promise(function (ok) { setTimeout(ok, 1500); }).then(function () { return appel(donnees, essais - 1); });
    });
  }

  /* Envoi de la progression : regroupé (une seconde après la dernière réponse), et réessayé plus tard
     si le réseau manque. Le dernier état à envoyer est gardé sur l'appareil. */
  var minuteur = null, enCours = null;
  function planifierEnvoi(chapitres) {
    if (!API.code()) { return; }
    ecrire(CLE_ATTENTE, JSON.stringify(chapitres));
    clearTimeout(minuteur);
    minuteur = setTimeout(envoyerAttente, 1200);
  }
  function envoyerAttente() {
    var code = API.code(), attente = lire(CLE_ATTENTE);
    if (enCours) { return enCours; }
    if (!code || !attente) { return Promise.resolve(); }
    enCours = appel({ action: "sauver", code: code, chapitres: JSON.parse(attente) })
      .then(function (r) { if (r && r.ok && lire(CLE_ATTENTE) === attente) { ecrire(CLE_ATTENTE, null); } })
      .catch(function () { /* hors ligne ou Google lent : on réessaiera */ })
      .then(function () {
        enCours = null;
        /* Il reste quelque chose à envoyer (échec, ou nouvelles réponses pendant l'envoi) : nouvel essai bientôt. */
        if (lire(CLE_ATTENTE)) { clearTimeout(minuteur); minuteur = setTimeout(envoyerAttente, 20000); }
      });
    return enCours;
  }
  window.addEventListener("online", envoyerAttente);

  /* Résultats de jeux : chaque partie attend sur l'appareil jusqu'à ce que Google l'ait bien reçue
     (réseau absent, Google en panne, élève qui ferme le jeu trop vite). Chaque partie garde le code
     de l'élève qui l'a jouée, même s'il se déconnecte ensuite. */
  var minuteurJeux = null, jeuxEnCours = null;
  function jeuxEnAttente() {
    try { var l = JSON.parse(lire(CLE_JEUX) || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
  }
  function envoyerJeux() {
    if (jeuxEnCours) { return jeuxEnCours; }
    var liste = jeuxEnAttente();
    if (!ADRESSE || !liste.length) { return Promise.resolve(); }
    var partie = liste[0];
    jeuxEnCours = appel({ action: "jeu", code: partie.code, jeu: partie.jeu, donnees: partie.donnees })
      .then(function (r) {
        /* Reçue (ou refusée pour de bon : code inconnu) : on la retire de la file. */
        if (r && (r.ok || r.erreur === "code")) {
          ecrire(CLE_JEUX, JSON.stringify(jeuxEnAttente().filter(function (p) { return p.id !== partie.id; })));
          return true;
        }
        return false;
      }, function () { return false; })
      .then(function (suite) {
        jeuxEnCours = null;
        if (suite && jeuxEnAttente().length) { return envoyerJeux(); }
        if (jeuxEnAttente().length) { clearTimeout(minuteurJeux); minuteurJeux = setTimeout(envoyerJeux, 20000); }
      });
    return jeuxEnCours;
  }
  window.addEventListener("online", envoyerJeux);

  function effacerCompte() {
    ecrire(CLE_CODE, null); ecrire(CLE_CHOIX, null); ecrire(CLE_ATTENTE, null); ecrire(CLE_VERIF, null);
  }

  var API = {
    actif: !!ADRESSE,
    normaliser: normaliser,
    code: function () { return API.actif ? normaliser(lire(CLE_CODE)) : null; },
    /* « code », « visiteur », ou null si l'élève n'a pas encore choisi */
    choix: function () { return API.actif ? lire(CLE_CHOIX) : "visiteur"; },
    continuerSansCode: function () { ecrire(CLE_CHOIX, "visiteur"); },
    /* Renvoie une promesse : { ok, progression } ou { ok: false, erreur: "code" | "trop" | "format" }.
       Si Google tarde (plus de 8 secondes) ou si le réseau manque, l'élève entre quand même : { ok: true, provisoire: true }.
       Le code est alors vérifié en arrière-plan (voir recuperer). */
    connecter: function (saisie) {
      var code = normaliser(saisie);
      if (!code) { return Promise.resolve({ ok: false, erreur: "format" }); }
      return appelUnique({ action: "connexion", code: code }, 8000)
        .then(function (r) {
          if (r.ok) { ecrire(CLE_CODE, code); ecrire(CLE_CHOIX, "code"); ecrire(CLE_VERIF, null); }
          return r;
        })
        .catch(function () {
          ecrire(CLE_CODE, code); ecrire(CLE_CHOIX, "code"); ecrire(CLE_VERIF, "1");
          return { ok: true, provisoire: true, progression: [] };
        });
    },
    /* Récupère la progression en ligne de l'élève connecté (au lancement du site, ou après une connexion provisoire).
       Renvoie { ok, progression }, { refuse: true } si le code n'existe pas, ou null si Google n'a pas répondu. */
    recuperer: function () {
      var code = API.code();
      if (!code) { return Promise.resolve(null); }
      return appel({ action: "connexion", code: code }, 3).then(function (r) {
        if (r.ok) { ecrire(CLE_VERIF, null); return r; }
        if (r.erreur === "code") {
          /* Code inconnu : on oublie le code, mais la progression reste sur l'appareil. */
          ecrire(CLE_CODE, null); ecrire(CLE_CHOIX, null); ecrire(CLE_ATTENTE, null); ecrire(CLE_VERIF, null);
          return { refuse: true, code: code };
        }
        return null;
      }).catch(function () { return null; });
    },
    aVerifier: function () { return !!lire(CLE_VERIF); },
    /* Déconnexion : on envoie d'abord les dernières réponses. Renvoie une promesse : true si l'élève est déconnecté,
       false si des réponses n'ont pas pu partir (il reste alors connecté ; « force » le déconnecte quand même).
       Les parties de jeux en attente restent sur l'appareil et partiront plus tard, avec leur code. */
    deconnecter: function (force) {
      clearTimeout(minuteur);
      if (force) { effacerCompte(); return Promise.resolve(true); }
      envoyerJeux();
      return envoyerAttente().then(function () { return envoyerAttente(); }).then(function () {
        if (lire(CLE_ATTENTE)) { return false; }
        effacerCompte();
        return true;
      });
    },
    planifierEnvoi: planifierEnvoi,
    envoyerMaintenant: envoyerAttente,
    /* Pour les jeux : un résultat de partie, rangé dans l'onglet « Jeu <id> » de la feuille du professeur.
       La partie attend sur l'appareil jusqu'à ce qu'elle soit reçue. */
    envoyerJeu: function (jeu, donnees) {
      var code = API.code();
      if (!code) { return Promise.resolve({ ok: false, erreur: "pas-connecte" }); }
      var liste = jeuxEnAttente();
      liste.push({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 8), code: code, jeu: jeu, donnees: donnees });
      ecrire(CLE_JEUX, JSON.stringify(liste.slice(-50)));
      return envoyerJeux().then(function () { return { ok: true, enAttente: jeuxEnAttente().length }; });
    },
    aEnvoyer: function () { return !!lire(CLE_ATTENTE); }
  };

  window.SGN_COMPTES = API;
  if (API.code()) { setTimeout(envoyerAttente, 2000); }
  if (jeuxEnAttente().length) { setTimeout(envoyerJeux, 2500); }
})();
