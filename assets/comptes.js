/* ==========================================================================
   Révision SGN : codes élèves et progression en ligne
   Actif seulement si data/config.js donne le document Grist du professeur (comptes.document), sur le Grist de l'État
   (grist.numerique.gouv.fr, via apps.education.fr). Sans document, ce fichier ne fait rien : le site fonctionne sans codes.
   Seuls les codes et la progression partent en ligne, jamais de nom. Chaque envoi AJOUTE une ligne au tableau « Envois »
   avec seulement ce qui est nouveau : rien n'est jamais réécrit, donc deux appareils qui envoient en même temps ne peuvent
   pas s'écraser. La progression d'un élève est la somme de ses lignes. Les règles d'accès du document Grist font qu'un élève
   ne peut lire et ajouter que ses propres lignes (avec un code valide), et que personne ne peut modifier ni effacer.
   Les jeux peuvent l'utiliser aussi : SGN_COMPTES.envoyerJeu("id-du-jeu", { temps: "18 min", ... }).
   ========================================================================== */
(function () {
  "use strict";

  var CFG = (window.SGN && window.SGN.config && window.SGN.config.comptes) || {};
  var BASE = CFG.document ? (CFG.grist || "https://grist.numerique.gouv.fr") + "/api/docs/" + CFG.document + "/tables/" : "";
  var ADRESSE = BASE;
  var CLE_CODE = "sgn-compte-code", CLE_CHOIX = "sgn-compte-choix", CLE_ATTENTE = "sgn-compte-a-envoyer", CLE_VERIF = "sgn-compte-a-verifier";
  var CLE_JEUX = "sgn-compte-jeux-a-envoyer", CLE_COLIS = "sgn-compte-colis", CLE_ENVOYE = "sgn-compte-envoye";

  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { if (v === null || v === undefined) { localStorage.removeItem(k); } else { localStorage.setItem(k, v); } } catch (e) { /* stockage indisponible */ } }

  /* Code : 6 caractères, majuscules ou minuscules, avec ou sans tiret. */
  function normaliser(code) {
    var c = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    return c.length === 6 ? c.slice(0, 3) + "-" + c.slice(3) : null;
  }

  /* ---------- Échanges avec Grist ----------
     Chaque demande porte le code de l'élève dans l'adresse (« ?code_=K7P-4MX ») : les règles d'accès du document s'en servent.
     Une demande qui traîne est abandonnée au bout de « delai » ms ; une erreur réseau ou serveur fait échouer la promesse
     (on réessaiera), un refus des règles d'accès (403) est rendu tel quel. */
  function requete(methode, table, code, corps, delai, keepalive) {
    var ctrl = window.AbortController && !keepalive ? new AbortController() : null;
    var minuterie = ctrl ? setTimeout(function () { ctrl.abort(); }, delai || 15000) : null;
    return fetch(BASE + table + "/records?code_=" + encodeURIComponent(code), {
      method: methode, credentials: "omit", keepalive: !!keepalive,
      headers: corps ? { "Content-Type": "application/json" } : {},
      body: corps ? JSON.stringify(corps) : undefined, signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      clearTimeout(minuterie);
      if (r.status === 403) { return { interdit: true }; }
      if (!r.ok) { throw new Error("Grist " + r.status); }
      return r.text().then(function (t) { return t ? JSON.parse(t) || {} : {}; });
    }, function (e) { clearTimeout(minuterie); throw e; });
  }
  function liste(v) {
    if (Array.isArray(v)) { return v.map(Number).filter(function (n) { return n >= 0; }); }
    try { return liste(JSON.parse(v || "[]")); } catch (e) { return []; }
  }
  function union(a, b) { var s = {}; a.concat(b).forEach(function (n) { s[n] = 1; }); return Object.keys(s).map(Number).sort(function (x, y) { return x - y; }); }
  var CHAMPS = ["cartes", "okQcm", "vuQcm", "okSit", "vuSit"];
  /* Ajoute un chapitre (ligne Grist ou envoi express) à l'ensemble : on additionne ; une version plus récente
     d'un chapitre refondu remplace l'ancienne, une version plus ancienne est ignorée. */
  function ajouterChapitre(ensemble, c) {
    var id = Number(c && (c.id || c.chapitre)), version = Number(c && c.version) || 1;
    if (!(id > 0 && id < 100)) { return; }
    var e = ensemble[id];
    if (!e || version > e.version) { e = ensemble[id] = { id: id, version: version, maj: c.maj || "" }; CHAMPS.forEach(function (k) { e[k] = []; }); }
    if (version < e.version) { return; }
    CHAMPS.forEach(function (k) { e[k] = union(e[k], liste(c[k])); });
    if (c.maj && c.maj > e.maj) { e.maj = c.maj; }
  }
  /* Le code existe-t-il ? (l'élève ne peut lire que la ligne de son propre code dans la liste des codes) */
  function codeValide(code) {
    return requete("GET", "Codes", code, null, 10000).then(function (r) { return !!(r.records && r.records.length); });
  }
  function connexion(code, delai) {
    return requete("GET", "Codes", code, null, delai).then(function (r) {
      if (r.interdit || !(r.records && r.records.length)) { return { ok: false, erreur: "code" }; }
      return Promise.all([requete("GET", "Progression", code, null, delai), requete("GET", "Envois", code, null, delai)]).then(function (res) {
        var ensemble = {};
        ((res[0].records) || []).forEach(function (l) { ajouterChapitre(ensemble, l.fields); });
        ((res[1].records) || []).forEach(function (l) { try { JSON.parse(l.fields.donnees || "[]").forEach(function (c) { ajouterChapitre(ensemble, c); }); } catch (e) { /* envoi abîmé : ignoré */ } });
        var progression = Object.keys(ensemble).map(function (k) { return ensemble[k]; });
        retenirEnLigne(code, progression, true);
        return { ok: true, code: code, progression: progression };
      });
    });
  }
  /* Enregistre des réponses : une nouvelle ligne dans « Envois » (un ajout n'écrase jamais rien). */
  function sauver(code, chapitres) {
    if (!chapitres || !chapitres.length) { return Promise.resolve({ ok: true }); }
    return requete("POST", "Envois", code, { records: [{ fields: { code: code, donnees: JSON.stringify(chapitres), date: new Date().toISOString() } }] }).then(function (r) {
      if (!r.interdit) { return { ok: true }; }
      /* Refusé : code retiré de la liste (le colis sera abandonné), ou autre souci (on réessaiera). */
      return codeValide(code).then(function (v) { if (v) { throw new Error("écriture refusée"); } return { ok: false, erreur: "code" }; });
    });
  }

  /* ---------- Ce qui est déjà en ligne ----------
     Pour n'envoyer que du nouveau, l'appareil retient ce que le serveur a déjà pour l'élève connecté (lu à la connexion,
     puis complété à chaque envoi confirmé). S'il l'oublie, il renvoie tout : ce n'est qu'un doublon, sans conséquence. */
  function envoye() {
    try { var e = JSON.parse(lire(CLE_ENVOYE) || "null"); return e && e.code === API.code() ? e : { code: API.code(), ch: {} }; } catch (x) { return { code: API.code(), ch: {} }; }
  }
  function retenirEnLigne(code, chapitres, remplacer) {
    var e = remplacer ? { code: code, ch: {} } : envoye();
    (chapitres || []).forEach(function (c) { ajouterChapitre(e.ch, c); });
    e.code = code;
    ecrire(CLE_ENVOYE, JSON.stringify(e));
  }
  /* Ce qui reste à envoyer : les réponses de l'appareil que le serveur n'a pas encore. */
  function nouveautes(chapitres) {
    var ens = envoye().ch, res = [];
    (chapitres || []).forEach(function (c) {
      var id = Number(c && c.id), version = Number(c && c.version) || 1, e = ens[id];
      if (!(id > 0 && id < 100)) { return; }
      var d = { id: id, version: version }, vide = true;
      CHAMPS.forEach(function (k) {
        var deja = e && e.version === version ? e[k] : [];
        d[k] = liste(c[k]).filter(function (n) { return deja.indexOf(n) < 0; });
        if (d[k].length) { vide = false; }
      });
      if (!vide || (e && version > e.version)) { res.push(d); }
    });
    return res;
  }
  function jeu(code, idJeu, donnees) {
    var id = String(idJeu || "").replace(/[^a-z0-9-]/gi, "").slice(0, 40);
    if (!id || !donnees || typeof donnees !== "object") { return Promise.resolve({ ok: true }); }
    return requete("POST", "Jeux", code, { records: [{ fields: { code: code, jeu: id, date: new Date().toISOString(), donnees: JSON.stringify(donnees) } }] }).then(function (r) {
      if (!r.interdit) { return { ok: true }; }
      return codeValide(code).then(function (v) { if (v) { throw new Error("écriture refusée"); } return { ok: false, erreur: "code" }; });
    });
  }
  /* Les demandes du site, avec la même forme de réponse qu'avant ({ ok, ... }). */
  function appelUnique(donnees, delai) {
    if (donnees.action === "connexion") { return connexion(donnees.code, delai); }
    if (donnees.action === "sauver") { return sauver(donnees.code, donnees.chapitres); }
    if (donnees.action === "jeu") { return jeu(donnees.code, donnees.jeu, donnees.donnees); }
    return Promise.reject(new Error("action inconnue"));
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
  /* Témoin d'envoi : le site est prévenu à chaque changement (« attente » ou « ok »). */
  function signaler() { try { window.dispatchEvent(new CustomEvent("sgn-envoi", { detail: { attente: !!lire(CLE_ATTENTE) } })); } catch (e) { /* vieux navigateur */ } }
  function planifierEnvoi(chapitres) {
    if (!API.code()) { return; }
    ecrire(CLE_ATTENTE, JSON.stringify(chapitres));
    signaler();
    clearTimeout(minuteur);
    minuteur = setTimeout(envoyerAttente, 1200);
  }
  function envoyerAttente() {
    var code = API.code(), attente = lire(CLE_ATTENTE);
    if (enCours) { return enCours; }
    if (!code || !attente) { return Promise.resolve(); }
    var nouv = nouveautes(JSON.parse(attente));
    enCours = appel({ action: "sauver", code: code, chapitres: nouv })
      .then(function (r) {
        if (r && r.ok) { retenirEnLigne(code, nouv); if (lire(CLE_ATTENTE) === attente) { ecrire(CLE_ATTENTE, null); } }
      })
      .catch(function () { /* hors ligne ou serveur lent : on réessaiera */ })
      .then(function () {
        enCours = null;
        signaler();
        /* Il reste quelque chose à envoyer (échec, ou nouvelles réponses pendant l'envoi) : nouvel essai bientôt. */
        if (lire(CLE_ATTENTE)) { clearTimeout(minuteur); minuteur = setTimeout(envoyerAttente, 20000); }
      });
    return enCours;
  }
  window.addEventListener("online", envoyerAttente);

  /* « Colis » : la progression pas encore partie d'un élève qui s'est déconnecté (ordinateur du lycée sans réseau, par exemple).
     Elle n'est jamais effacée : elle reste sur l'appareil avec le code de cet élève, et part dès que possible, sur sa fiche à lui,
     même si un autre élève s'est connecté entre-temps. La feuille additionne : un envoi en double ne compte jamais deux fois. */
  var minuteurColis = null, colisEnCours = null;
  function colisEnAttente() {
    try { var l = JSON.parse(lire(CLE_COLIS) || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
  }
  function envoyerColis() {
    if (colisEnCours) { return colisEnCours; }
    var liste = colisEnAttente();
    if (!ADRESSE || !liste.length) { return Promise.resolve(); }
    var colis = liste[0];
    colisEnCours = appel({ action: "sauver", code: colis.code, chapitres: colis.chapitres })
      .then(function (r) {
        /* Reçu (ou refusé pour de bon : code inconnu) : on le retire de la file. */
        if (r && (r.ok || r.erreur === "code")) {
          ecrire(CLE_COLIS, JSON.stringify(colisEnAttente().filter(function (c) { return c.id !== colis.id; })));
          return true;
        }
        return false;
      }, function () { return false; })
      .then(function (suite) {
        colisEnCours = null;
        if (suite && colisEnAttente().length) { return envoyerColis(); }
        if (colisEnAttente().length) { clearTimeout(minuteurColis); minuteurColis = setTimeout(envoyerColis, 20000); }
      });
    return colisEnCours;
  }
  window.addEventListener("online", envoyerColis);

  /* Envoi express quand l'élève quitte la page (onglet fermé, autre appli, téléphone verrouillé) : ce qui reste part
     immédiatement, en une seule demande « keepalive » qui survit à la fermeture, ajoutée au tableau « Envois »
     (un ajout n'écrase jamais rien). On garde quand même tout sur l'appareil jusqu'à une confirmation normale. */
  function envoiExpress() {
    if (!ADRESSE) { return; }
    try {
      var code = API.code(), attente = lire(CLE_ATTENTE), date = new Date().toISOString();
      var express = function (c, chapitres) {
        requete("POST", "Envois", c, { records: [{ fields: { code: c, donnees: JSON.stringify(chapitres), date: date } }] }, 0, true).catch(function () { /* l'envoi normal reprendra */ });
      };
      if (code && attente) { var n = nouveautes(JSON.parse(attente)); if (n.length) { express(code, n); } }
      colisEnAttente().slice(0, 3).forEach(function (c) { express(c.code, c.chapitres); });
    } catch (e) { /* tant pis : l'envoi normal reprendra */ }
  }
  window.addEventListener("pagehide", envoiExpress);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") { envoiExpress(); } });

  /* Résultats de jeux : chaque partie attend sur l'appareil jusqu'à ce que le serveur l'ait bien reçue
     (réseau absent, serveur en panne, élève qui ferme le jeu trop vite). Chaque partie garde le code
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
    ecrire(CLE_CODE, null); ecrire(CLE_CHOIX, null); ecrire(CLE_ATTENTE, null); ecrire(CLE_VERIF, null); ecrire(CLE_ENVOYE, null);
  }

  var API = {
    actif: !!ADRESSE,
    normaliser: normaliser,
    code: function () { return API.actif ? normaliser(lire(CLE_CODE)) : null; },
    /* « code », « visiteur », ou null si l'élève n'a pas encore choisi */
    choix: function () { return API.actif ? lire(CLE_CHOIX) : "visiteur"; },
    continuerSansCode: function () { ecrire(CLE_CHOIX, "visiteur"); },
    /* Renvoie une promesse : { ok, progression } ou { ok: false, erreur: "code" | "format" }.
       Si le serveur tarde (plus de 8 secondes) ou si le réseau manque, l'élève entre quand même : { ok: true, provisoire: true }.
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
       Renvoie { ok, progression }, { refuse: true } si le code n'existe pas, ou null si le serveur n'a pas répondu. */
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
    /* Déconnexion : immédiate, et sans rien perdre. Si des réponses ne sont pas encore parties, elles deviennent un « colis »
       au nom de cet élève (son code), gardé sur l'appareil et envoyé dès que possible. Renvoie une promesse : true.
       Les parties de jeux en attente restent aussi sur l'appareil et partiront plus tard, avec leur code. */
    deconnecter: function () {
      clearTimeout(minuteur);
      var code = API.code(), attente = lire(CLE_ATTENTE);
      if (code && attente) {
        try {
          var liste = colisEnAttente();
          liste.push({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 8), code: code, chapitres: nouveautes(JSON.parse(attente)) });
          ecrire(CLE_COLIS, JSON.stringify(liste.slice(-30)));
        } catch (e) { /* stockage indisponible */ }
      }
      effacerCompte();
      signaler();
      envoyerColis(); envoyerJeux();
      return Promise.resolve(true);
    },
    planifierEnvoi: planifierEnvoi,
    envoyerMaintenant: envoyerAttente,
    /* Pour les jeux : un résultat de partie, rangé dans le tableau « Jeux » du document Grist du professeur.
       La partie attend sur l'appareil jusqu'à ce qu'elle soit reçue. */
    envoyerJeu: function (jeu, donnees) {
      var code = API.code();
      if (!code) { return Promise.resolve({ ok: false, erreur: "pas-connecte" }); }
      var liste = jeuxEnAttente();
      liste.push({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 8), code: code, jeu: jeu, donnees: donnees });
      ecrire(CLE_JEUX, JSON.stringify(liste.slice(-50)));
      return envoyerJeux().then(function () { return { ok: true, enAttente: jeuxEnAttente().length }; });
    },
    aEnvoyer: function () { return !!lire(CLE_ATTENTE); },
    colisEnAttente: function () { return colisEnAttente().length; }
  };

  window.SGN_COMPTES = API;
  if (API.code()) { setTimeout(envoyerAttente, 2000); }
  if (jeuxEnAttente().length) { setTimeout(envoyerJeux, 2500); }
  if (colisEnAttente().length) { setTimeout(envoyerColis, 3000); }
})();
