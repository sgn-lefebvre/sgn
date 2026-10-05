/* ==========================================================================
   SGN · M. Lefebvre : moteur du site
   Aucun contenu de cours ici : tout le contenu est dans data/chXX.js.
   ========================================================================== */
(function () {
  "use strict";

  var SGN = window.SGN || { config: {}, chapitres: [] };
  var CFG = SGN.config;
  var CH = SGN.chapitres.slice().sort(function (a, b) { return a.id - b.id; });
  var app = document.getElementById("app");
  /* Le logo de la barre du haut (index.html), repris en grand sur l'accueil. */
  var LOGO = (document.querySelector(".logo-mark") || {}).outerHTML || "";

  /* ---------- Outils ---------- */
  function el(tag, props) {
    var n = document.createElement(tag);
    var kids = Array.prototype.slice.call(arguments, 2);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || v === undefined || v === false) { return; }
        if (k === "class") { n.className = v; }
        else if (k === "html") { n.innerHTML = v; }
        else if (k === "text") { n.textContent = v; }
        else if (k.slice(0, 2) === "on") { n.addEventListener(k.slice(2), v); }
        else { n.setAttribute(k, v === true ? "" : v); }
      });
    }
    (function add(list) {
      list.forEach(function (c) {
        if (c === null || c === undefined || c === false) { return; }
        if (Array.isArray(c)) { add(c); return; }
        n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    })(kids);
    return n;
  }
  function vider(n) { while (n.firstChild) { n.removeChild(n.firstChild); } return n; }
  function melanger(a) {
    var t = a.slice();
    for (var i = t.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = t[i]; t[i] = t[j]; t[j] = x;
    }
    return t;
  }
  function remonter(n) { if (n.getBoundingClientRect().top < 0) { n.scrollIntoView(); } }
  function pluriel(n, mot, mots) { return n + " " + (n > 1 ? (mots || mot + "s") : mot); }
  function chapitre(id) { return CH.filter(function (c) { return c.id === id; })[0]; }
  function nomTheme(t) { return (CFG.themes && CFG.themes[t]) || ""; }
  /* Thème d'entraînement d'un chapitre : un nom, ou { nom, notions }. */
  function nomDuTheme(x) { return typeof x === "string" ? x : x.nom; }
  /* Chapitre verrouillé (« verrouille: true ») : pas encore fini en classe. Seuls les jeux et les documents sont ouverts. */
  function ouvert(c) { return !c.verrouille; }
  var CH_OUVERTS = CH.filter(ouvert);

  /* ---------- Progression (enregistrée sur l'appareil) ----------
     Par chapitre : cartes = flashcards sues ; ok = questions validées (dernière réponse juste) ;
     vu = questions déjà rencontrées. Les numéros sont les positions dans data/chXX.js. */
  var KEY = "sgn-progression-v2";
  var store = (function () {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s) { return s; }
      var v1 = JSON.parse(localStorage.getItem("sgn-progression-v1"));
      if (v1 && v1.ch) {
        var repris = { ch: {} };
        Object.keys(v1.ch).forEach(function (id) { repris.ch[id] = { cartes: v1.ch[id].cartes || [] }; });
        return repris;
      }
    } catch (e) { /* stockage indisponible */ }
    return {};
  })();
  function sauverLocal() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* stockage indisponible : on continue sans */ } }
  function sauver() {
    sauverLocal();
    if (COMPTES && COMPTES.code()) { COMPTES.planifierEnvoi(exporterProgression()); }
  }

  /* ---------- Codes élèves (assets/comptes.js) : la progression est aussi gardée en ligne ----------
     Sur l'appareil comme en ligne, une question validée quelque part reste validée partout (on additionne). */
  var COMPTES = window.SGN_COMPTES && window.SGN_COMPTES.actif ? window.SGN_COMPTES : null;
  function exporterProgression() {
    return CH.filter(function (c) { return store.ch && store.ch[c.id]; }).map(function (c) {
      var p = prog(c.id);
      return { id: c.id, version: c.version || 1, cartes: p.cartes, okQcm: p.ok.qcm, vuQcm: p.vu.qcm, okSit: p.ok.situations, vuSit: p.vu.situations };
    });
  }
  function fusionnerProgression(lignes) {
    (lignes || []).forEach(function (l) {
      var c = chapitre(Number(l.id));
      if (!c || (Number(l.version) || 1) !== (c.version || 1)) { return; }   /* ancienne version d'un chapitre refondu */
      var p = prog(c.id);
      (l.cartes || []).forEach(function (i) { ajoute(p.cartes, i); });
      (l.okQcm || []).forEach(function (i) { ajoute(p.ok.qcm, i); });
      (l.vuQcm || []).forEach(function (i) { ajoute(p.vu.qcm, i); });
      (l.okSit || []).forEach(function (i) { ajoute(p.ok.situations, i); });
      (l.vuSit || []).forEach(function (i) { ajoute(p.vu.situations, i); });
    });
    sauverLocal();
  }
  function prog(id) {
    store.ch = store.ch || {};
    var c = chapitre(id), version = (c && c.version) || 1;
    /* Un chapitre refondu change de « version » : l'ancienne progression ne correspond plus aux positions. */
    if (store.ch[id] && (store.ch[id].version || 1) !== version) { store.ch[id] = null; }
    var p = store.ch[id] = store.ch[id] || {};
    if (version > 1) { p.version = version; }
    p.cartes = p.cartes || [];
    p.ok = p.ok || {};
    p.vu = p.vu || {};
    ["qcm", "situations"].forEach(function (t) { p.ok[t] = p.ok[t] || []; p.vu[t] = p.vu[t] || []; });
    return p;
  }
  function ajoute(liste, v) { if (liste.indexOf(v) < 0) { liste.push(v); } }
  /* Questions d'un chapitre, par type. Un « groupe » est ce que l'élève valide d'un bloc :
     une question de QCM, ou une situation (un mini-cas et ses questions, ou une situation simple).
     Les questions des situations sont numérotées à la suite, dans l'ordre du fichier. */
  function donnees(c) {
    if (c._donnees) { return c._donnees; }
    var qcm = { items: [], groupes: [] }, sit = { items: [], groupes: [] };
    c.qcm.forEach(function (d, i) {
      qcm.items.push({ d: d });
      qcm.groupes.push({ ids: [i], theme: d.theme, niveau: d.niveau });
    });
    c.situations.forEach(function (x) {
      var ids = (x.questions || [x]).map(function (d) { sit.items.push({ d: d, s: x.s }); return sit.items.length - 1; });
      sit.groupes.push({ ids: ids, theme: x.theme });
    });
    c._donnees = { qcm: qcm, situations: sit };
    return c._donnees;
  }
  function groupeValide(p, type, g) { return g.ids.every(function (i) { return p.ok[type].indexOf(i) >= 0; }); }
  function groupeVu(p, type, g) { return g.ids.some(function (i) { return p.vu[type].indexOf(i) >= 0; }); }
  function valides(c, type, groupes) {
    var p = prog(c.id);
    return (groupes || donnees(c)[type].groupes).filter(function (g) { return groupeValide(p, type, g); }).length;
  }
  /* La jauge du chapitre compte les flashcards, les questions de QCM et toutes les questions des situations. */
  function compte(c) {
    var p = prog(c.id), d = donnees(c);
    function n(liste, max) { return liste.filter(function (i) { return i < max; }).length; }
    var r = { cartes: n(p.cartes, c.cartes.length), qcm: valides(c, "qcm"), situations: valides(c, "situations"),
      questionsSit: n(p.ok.situations, d.situations.items.length) };
    r.total = c.cartes.length + c.qcm.length + d.situations.items.length;
    r.fait = r.cartes + r.qcm + r.questionsSit;
    /* Arrondi vers le bas : « 100 % » ne s'affiche que lorsque tout est vraiment validé. */
    r.pct = r.total ? Math.floor(r.fait / r.total * 100) : 0;
    return r;
  }
  function jeuTermine(j) { try { return localStorage.getItem("sgn-jeu-" + j.id) === "termine"; } catch (e) { return false; } }

  /* ---------- Prochaine évaluation (réglée dans data/config.js) ---------- */
  function evaluation() {
    var e = CFG.evaluation;
    if (!e || !e.date || !chapitre(e.chapitre)) { return null; }
    var p = String(e.date).split("-");
    var jour = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    if (isNaN(jour.getTime())) { return null; }
    var auj = new Date(); auj.setHours(0, 0, 0, 0);
    var reste = Math.round((jour - auj) / 86400000);
    if (reste < 0) { return null; }
    var texte = jour.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).replace(/ 1 /, " 1er ");
    return { chapitre: chapitre(e.chapitre), texte: texte,
      delai: reste === 0 ? "Jour J, bonne chance !" : reste === 1 ? "Demain !" : "dans " + reste + " jours" };
  }

  /* Dessin de l'affiche de la prochaine évaluation : une copie avec trois coches et une étoile. */
  var DESSIN_COPIE = '<svg viewBox="0 0 680 200" preserveAspectRatio="xMaxYMid slice" width="100%" height="100%">' +
    '<g class="eval-flotte"><g transform="rotate(5 575 120)"><rect x="500" y="20" width="150" height="200" rx="10" fill="#fff"/>' +
    '<rect x="518" y="40" width="70" height="8" rx="4" fill="#15231E"/><g fill="#D6DED9"><rect x="540" y="70" width="90" height="6" rx="3"/><rect x="540" y="98" width="80" height="6" rx="3"/><rect x="540" y="126" width="90" height="6" rx="3"/><rect x="540" y="154" width="70" height="6" rx="3"/></g>' +
    '<g fill="none" stroke="#1F7A5A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path class="eval-coche c1" d="M518 72 l6 6 l10 -12"/><path class="eval-coche c2" d="M518 100 l6 6 l10 -12"/><path class="eval-coche c3" d="M518 128 l6 6 l10 -12"/></g></g></g>' +
    '<path class="eval-etoile" d="M630 22 l7 15 l16 2 l-12 11 l3 16 l-14 -8 l-14 8 l3 -16 l-12 -11 l16 -2 z" fill="#F5BB5C"/></svg>';

  /* ---------- Blocs communs ---------- */
  /* Une couleur par chapitre, la même que dans la page de suivi du professeur : 10 couleurs
     (vert d'eau, soleil, corail, lavande, ciel, sauge, rose, moutarde, lagon, pêche), puis on recommence. */
  function numCouleur(c) { return ((c.id - 1) % 10) + 1; }
  function teinte(c) { var n = numCouleur(c); return "--cc:var(--ch" + n + ");--ccs:var(--ch" + n + "s)"; }
  /* Jauge générale en morceaux : chaque chapitre ouvert ajoute sa part, dans sa couleur. */
  function barreParChapitre(chapitres, total) {
    var b = el("div", { class: "bar bar-morceaux", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(total) });
    var fait = 0;
    chapitres.forEach(function (c) {
      var k = compte(c); fait += k.fait;
      if (!k.fait) { return; }
      var i = el("i", { title: "Chapitre " + c.id + " : " + k.fait + " validées" });
      i.style.width = (total ? k.fait / total * 100 : 0) + "%";
      i.style.background = "var(--ch" + numCouleur(c) + ")";
      b.appendChild(i);
    });
    b.setAttribute("aria-valuenow", String(fait));
    return el("div", null, b, el("div", { class: "legende-morceaux", "aria-hidden": "true" }, chapitres.map(function (c) {
      return el("span", null, el("b", { style: "background:var(--ch" + numCouleur(c) + ")" }), "Chap. " + c.id);
    })));
  }
  function barre(valeur, total, classe) {
    var pct = total ? Math.floor(valeur / total * 100) : 0;
    var i = el("i"); i.style.width = pct + "%";
    return el("div", { class: "bar" + (classe ? " " + classe : ""), role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(valeur) }, i);
  }
  function ligneChapitre(c) {
    var enCours = c.id === CFG.chapitreEnCours, ev = evaluation(), nbJeux = (c.jeux || []).length, nbDocs = (c.documents || []).length;
    var extras = (nbJeux ? ", " + pluriel(nbJeux, "jeu", "jeux") : "") + (nbDocs ? ", " + pluriel(nbDocs, "document") : "");
    if (!ouvert(c)) {
      var dispo = [nbJeux ? pluriel(nbJeux, "jeu", "jeux") : "", nbDocs ? pluriel(nbDocs, "document") : ""].filter(Boolean).join(" et ");
      return el("li", null,
        el("a", { class: "ch-row is-locked", href: "#/chapitre/" + c.id, style: teinte(c) },
          el("span", { class: "ch-num", "aria-hidden": "true", text: String(c.id) }),
          el("span", { class: "ch-name" }, "Chapitre " + c.id + " : " + c.titre,
            enCours ? el("span", { class: "pill", text: "en cours en classe" }) : null,
            el("small", { text: "Synthèse et entraînement à la fin du chapitre." + (dispo ? " Déjà ouvert : " + dispo + "." : "") })),
          el("span", { class: "ch-pct ch-lock" }, cadenas(), el("span", { class: "sr-only", text: "Pas encore disponible" }))));
    }
    var k = compte(c);
    return el("li", null,
      el("a", { class: "ch-row" + (k.pct === 100 ? " is-maitrise" : ""), href: "#/chapitre/" + c.id, style: teinte(c) },
        el("span", { class: "ch-num", "aria-hidden": "true", text: String(c.id) }),
        el("span", { class: "ch-name" }, "Chapitre " + c.id + " : " + c.titre,
          enCours ? el("span", { class: "pill", text: "en cours" }) : null,
          ev && ev.chapitre.id === c.id ? el("span", { class: "pill pill-eval", text: "évaluation " + ev.texte + " · " + ev.delai }) : null,
          el("small", { text: pluriel(c.cartes.length, "flashcard") + ", " + c.qcm.length + " QCM, " + pluriel(c.situations.length, "situation") + extras })),
        el("span", { class: "ch-pct" }, k.pct === 100 ? el("span", { class: "ch-medaille", title: "Chapitre maîtrisé", text: "🏅" }) : null,
          el("b", { text: k.pct + " %" }), barre(k.fait, k.total, "mini"))));
  }
  function cadenas() {
    var n = el("span", { class: "lock-icon", "aria-hidden": "true" });
    n.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" fill="currentColor"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
    return n;
  }
  function listeParTheme() {
    var themes = [];
    CH.forEach(function (c) { if (themes.indexOf(c.theme) < 0) { themes.push(c.theme); } });
    return themes.map(function (t) {
      return el("section", null,
        el("h3", { class: "theme-title", text: "Thème " + t + " : " + nomTheme(t) }),
        el("ul", { class: "ch-list" }, CH.filter(function (c) { return c.theme === t; }).map(ligneChapitre)));
    });
  }
  /* Un jeu = une affiche entièrement cliquable : image de fond, gros titre, une phrase, bouton « Jouer ». */
  function carteJeu(j, c, nouveau) {
    var fini = jeuTermine(j);
    return el("a", { class: "poster c-" + (j.couleur || "teal"), href: j.lien,
        onclick: function (e) { if (window.SGN_OUVRIR_JEU && window.SGN_OUVRIR_JEU(j)) { e.preventDefault(); } } },
      j.affiche ? el("img", { class: "poster-img", src: j.affiche, alt: "" }) : null,
      el("span", { class: "poster-body" },
        el("span", { class: "poster-tags" },
          el("span", { class: "pill", text: "Chapitre " + c.id }),
          nouveau ? el("span", { class: "pill pill-new", text: "nouveau" }) : null,
          fini ? el("span", { class: "pill pill-ok", text: "terminé" }) : null),
        el("span", { class: "poster-title", text: j.titre }),
        el("span", { class: "poster-text", text: j.accroche }),
        el("span", { class: "btn poster-btn", text: fini ? "Rejouer" : "Jouer" })));
  }
  function tousLesJeux() {
    var jeux = [];
    CH.forEach(function (c) { (c.jeux || []).forEach(function (j) { jeux.push({ j: j, c: c }); }); });
    jeux.sort(function (a, b) { return String(b.j.ajout || "").localeCompare(String(a.j.ajout || "")); });
    return jeux;
  }
  function estRecent(j) {
    if (!j.ajout) { return false; }
    var p = String(j.ajout).split("-"), d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return (new Date() - d) / 86400000 < 30;
  }

  /* ---------- Page : accueil ---------- */
  function pageAccueil() {
    /* Le bouton « Réviser » mène au chapitre en cours s'il est ouvert, sinon au dernier chapitre ouvert. */
    var enCours = chapitre(CFG.chapitreEnCours);
    if (!enCours || !ouvert(enCours)) { enCours = CH_OUVERTS[CH_OUVERTS.length - 1]; }
    var nbCartes = 0, nbQ = 0, nbS = 0, fait = 0, total = 0;
    CH_OUVERTS.forEach(function (c) { var k = compte(c); nbCartes += c.cartes.length; nbQ += c.qcm.length; nbS += c.situations.length; fait += k.fait; total += k.total; });
    var ev = evaluation(), jeux = tousLesJeux();
    var motsTitre = String(CFG.titre || "SGN").split(" "), dernierMot = motsTitre.pop();
    var pct = total ? Math.floor(fait / total * 100) : 0;

    return [
      el("section", null,
        el("p", { class: "tag", text: (CFG.classe || "") + ", " + (CFG.matiere || "").toLowerCase() }),
        el("h1", { class: "display display-logo" }, el("span", { class: "display-mark", html: LOGO }), el("span", null, motsTitre.length ? motsTitre.join(" ") + " " : null, el("span", { class: "marker", text: dernierMot }))),
        CFG.prof ? el("p", { class: "subtitle", text: CFG.prof }) : null,
        el("p", { class: "lead", text: "Pour chaque chapitre : la synthèse, le lexique des définitions et un entraînement avec des flashcards, des QCM et des situations. Tu t’arrêtes quand tu veux, ta progression est gardée." }),
        el("div", { class: "actions" },
          enCours ? el("a", { class: "btn btn-dark", href: "#/chapitre/" + enCours.id, text: "Réviser le chapitre " + enCours.id }) : null),
        el("div", { class: "stats" },
          el("div", { class: "stat" }, el("b", { text: String(CH_OUVERTS.length) }), el("span", { text: CH_OUVERTS.length > 1 ? "chapitres à réviser" : "chapitre à réviser" })),
          el("div", { class: "stat" }, el("b", { text: String(nbCartes) }), el("span", { text: "flashcards" })),
          el("div", { class: "stat" }, el("b", { text: String(nbQ) }), el("span", { text: "questions de QCM" })),
          el("div", { class: "stat" }, el("b", { text: String(nbS) }), el("span", { text: "situations" })))),

      ev ? el("section", null,
        el("h2", { class: "h2", text: "Prochaine évaluation" }),
        /* Affiche « copie parfaite » (dans l'esprit des affiches des jeux) : fond bleu nuit, une copie qui flotte,
           des coches qui se dessinent, une étoile, et un reflet qui passe. */
        el("div", { class: "eval-affiche" },
          el("span", { class: "eval-dessin", "aria-hidden": "true", html: DESSIN_COPIE }),
          el("div", { class: "eval-corps" },
            el("span", { class: "poster-tags" }, el("span", { class: "pill", text: "Chapitre " + ev.chapitre.id }), el("span", { class: "pill pill-delai", text: ev.delai })),
            el("p", { class: "eval-titre", text: "Évaluation " + ev.texte }),
            el("p", { class: "eval-ch", text: ev.chapitre.titre }),
            ouvert(ev.chapitre) ? el("a", { class: "btn eval-btn", href: "#/chapitre/" + ev.chapitre.id + "/entrainement", text: "M’entraîner sur le chapitre " + ev.chapitre.id }) : null))) : null,

      el("section", null,
        el("h2", { class: "h2", text: "Ta progression" }),
        el("div", { class: "card" },
          el("div", { class: "row-between" },
            el("strong", { text: pct + " % validé sur " + (CH_OUVERTS.length > 1 ? "les " + CH_OUVERTS.length + " chapitres ouverts" : "le chapitre ouvert") }),
            el("span", { class: "soft", text: fait + " sur " + total + " flashcards et questions" })),
          barreParChapitre(CH_OUVERTS, total)),
        listeParTheme()),

      jeux.length ? el("section", null,
        el("h2", { class: "h2", text: "Les jeux" }),
        el("div", { class: "games" }, jeux.map(function (x, i) { return carteJeu(x.j, x.c, i === 0 && estRecent(x.j)); }))) : null,

      el("section", null,
        el("h2", { class: "h2", text: "Dans chaque chapitre" }),
        el("div", { class: "grid-4" },
          el("div", { class: "card step-card" }, el("h3", { text: "Synthèse" }), el("p", { text: "La synthèse du cours, telle que tu l’as en classe." })),
          el("div", { class: "card step-card" }, el("h3", { text: "Lexique" }), el("p", { text: "Toutes les définitions à connaître, une par notion." })),
          el("div", { class: "card step-card" }, el("h3", { text: "Entraînement" }), el("p", { text: "Flashcards, QCM et situations. Chaque bonne réponse est validée." })),
          el("div", { class: "card step-card" }, el("h3", { text: "Jeux et documents" }), el("p", { text: "Quand le chapitre en a : une mise en situation à jouer, des TD à télécharger." })))),

      blocPartage()
    ];
  }

  /* ---------- Partager le site : QR code (image fixe assets/qr-site.svg), partage, copie du lien ---------- */
  function adresseSite() { return CFG.adresse || location.href.split("#")[0]; }
  function boutonsPartage() {
    var url = adresseSite(), info = el("p", { class: "soft share-info", "aria-live": "polite" });
    var partager = navigator.share ? el("button", { class: "btn btn-dark", type: "button", text: "Partager",
      onclick: function () { navigator.share({ title: CFG.titre || "Révision SGN", text: "Révisions de SGN en 1re STMG", url: url }).catch(function () {}); } }) : null;
    var copier = el("button", { class: "btn", type: "button", text: "Copier le lien", onclick: function () {
      function ok() { info.textContent = "Lien copié."; }
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(ok, function () { info.textContent = url; }); }
      else { info.textContent = url; }
    } });
    return [el("div", { class: "actions share-actions" }, partager, copier), info];
  }
  function blocPartage() {
    var url = adresseSite();
    return el("section", null,
      el("h2", { class: "h2", text: "Partager le site" }),
      el("div", { class: "card share" },
        el("a", { class: "share-qr", href: "#/partager", "aria-label": "Afficher le QR code en grand" },
          el("img", { src: "assets/qr-site.svg", alt: "QR code du site " + url, width: "148", height: "148" })),
        el("div", { class: "share-txt" },
          el("p", null, "Scanne le QR code avec l’appareil photo du téléphone, ou utilise le lien :"),
          el("p", { class: "share-url", text: url.replace(/^https?:\/\//, "").replace(/\/$/, "") }),
          boutonsPartage(),
          el("a", { class: "link-btn", href: "#/partager", text: "Agrandir le QR code" }))));
  }
  function pagePartager() {
    var url = adresseSite();
    return [
      el("a", { class: "btn back", href: "#/", text: "← Accueil" }),
      el("div", { class: "share-big" },
        el("h1", { class: "title", text: CFG.titre || "Révision SGN" }),
        el("p", { class: "lead", text: "Scanne ce QR code avec l’appareil photo de ton téléphone." }),
        el("img", { class: "share-big-qr", src: "assets/qr-site.svg", alt: "QR code du site " + url }),
        el("p", { class: "share-url", text: url.replace(/^https?:\/\//, "").replace(/\/$/, "") }),
        boutonsPartage())
    ];
  }

  /* ---------- Page : chapitres ---------- */
  function pageChapitres() {
    return [
      el("h1", { class: "title", text: "Les chapitres" }),
      el("p", { class: "lead soft", text: pluriel(CH_OUVERTS.length, "chapitre ouvert", "chapitres ouverts") + ". Les suivants arrivent au fil de l’année. À droite : ce que tu as déjà validé." }),
      listeParTheme()
    ];
  }

  /* ---------- Onglet : synthèse ---------- */
  function tableau(b) {
    var deux = b.head.length <= 2;
    var thead = el("thead", null, el("tr", null, b.head.map(function (h) { return el("th", { scope: "col", html: h }); })));
    var tbody = el("tbody", null, b.rows.map(function (r) {
      return el("tr", null, r.map(function (c, i) {
        return (b.rowHead && i === 0) ? el("th", { scope: "row", html: c }) : el("td", { html: c });
      }));
    }));
    /* Si le tableau est plus large que l'écran (téléphone), une indication invite à le faire glisser. Elle reste affichée. */
    var wrap = el("div", { class: "table-wrap", tabindex: "0", role: "region", "aria-label": b.titre || "Tableau" },
      el("table", { class: deux ? "two" : "" }, b.titre ? el("caption", { text: b.titre }) : null, thead, tbody));
    var indice = el("p", { class: "table-hint", hidden: true, "aria-hidden": "true", text: "Fais glisser le tableau →" });
    return el("div", { class: "table-block" }, indice, wrap);
  }
  function majIndicesTableaux() {
    Array.prototype.forEach.call(document.querySelectorAll(".table-block"), function (bloc) {
      var wrap = bloc.querySelector(".table-wrap"), indice = bloc.querySelector(".table-hint");
      indice.hidden = !(wrap.scrollWidth > wrap.clientWidth + 2);
    });
  }
  window.addEventListener("resize", majIndicesTableaux);
  function bloc(b) {
    switch (b.t) {
      case "h": return el("h2", { class: "syn-h", text: b.txt });
      case "h3": return el("h3", { class: "syn-h3", text: b.txt });
      case "p": return el("p", { html: b.html });
      case "def": return b.terme
        ? el("p", { class: "def" }, el("strong", { text: b.terme }), " ", el("span", { html: b.html }))
        : el("p", { class: "def", html: b.html });
      case "conclusion": return el("p", { class: "keep" }, el("span", { class: "keep-label", text: "Conclusion" }), el("span", { html: b.html }));
      case "ex": return el("p", { class: "ex" }, el("span", { class: "ex-label", text: "Exemple" }), el("span", { html: b.html }));
      case "flow": return el("div", { class: "flow" + (b.sansFleche ? " no-arrow" : "") },
        b.titre ? el("p", { class: "flow-title", text: b.titre }) : null,
        el("ol", null, b.etapes.map(function (e) { return el("li", null, el("span", { text: e })); })));
      case "liste": return el("div", null,
        b.titre ? el("p", { class: "list-title", text: b.titre }) : null,
        el("ul", { class: "plain-list" }, b.items.map(function (i) { return el("li", { html: i }); })));
      case "table": return tableau(b);
      default: return null;
    }
  }
  function suite(c, onglet, texte) {
    return el("div", { class: "next" }, el("a", { class: "btn btn-dark", href: "#/chapitre/" + c.id + "/" + onglet, text: texte }));
  }
  function ongletSynthese(c) {
    return el("div", null,
      el("div", { class: "syn" },
        c.intro ? el("div", { class: "intro", text: c.intro }) : null,
        c.synthese.map(bloc)),
      suite(c, "lexique", "Continuer avec le lexique"));
  }

  /* ---------- Onglet : lexique ---------- */
  /* Une fiche peut regrouper plusieurs notions : { terme, def, sous: [{ terme, def }] }. */
  function sousListe(k, carte) {
    if (!k.sous || !k.sous.length) { return null; }
    /* Dans une flashcard (un bouton), seules des balises <span> sont permises. */
    return el(carte ? "span" : "ul", { class: carte ? "flash-sous" : "sous" }, k.sous.map(function (x) {
      return el(carte ? "span" : "li", null, el("strong", { text: x.terme }), " : " + x.def);
    }));
  }
  function texteFiche(k) {
    return [k.terme, k.def].concat((k.sous || []).map(function (x) { return x.terme + " " + x.def; })).join(" ");
  }
  function ongletLexique(c, m) {
    var sues = prog(c.id).cartes;
    var fiches = c.cartes.map(function (k, i) {
      return { k: k, n: el("div", { class: sues.indexOf(i) >= 0 ? "known" : "" }, el("dt", { text: k.terme }),
        el("dd", null, k.def, sousListe(k))) };
    });
    var liste = el("dl", { class: "vocab" }, fiches.map(function (f) { return f.n; }));
    var vide = el("p", { class: "soft", hidden: true, text: "Aucune définition ne correspond." });
    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    var champ = el("input", { class: "search", type: "search", placeholder: "Cherche un mot du chapitre", "aria-label": "Chercher dans le lexique",
      oninput: function () {
        if (m) { m.recherche = champ.value; }
        var q = norm(champ.value.trim()), n = 0;
        fiches.forEach(function (f) {
          var ok = !q || norm(texteFiche(f.k)).indexOf(q) >= 0;
          f.n.hidden = !ok; if (ok) { n++; }
        });
        vide.hidden = n > 0;
      } });
    if (m && m.recherche) { champ.value = m.recherche; champ.dispatchEvent(new Event("input")); }
    return el("div", { class: "syn" },
      el("p", { class: "lead", text: pluriel(c.cartes.length, "définition") + " à connaître pour ce chapitre." }),
      c.cartes.length > 8 ? champ : null,
      liste, vide,
      suite(c, "entrainement", "M’entraîner avec les flashcards"));
  }

  /* ---------- Onglet : entraînement ---------- */
  var surProgression = null; /* met à jour la jauge du chapitre affichée en haut de page */
  var mouvement = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- Petites animations (coupées si le téléphone demande de réduire les animations) ---------- */
  /* Jauge : elle part de sa valeur précédente et se remplit en douceur. */
  function animerBarre(b, valeur, total) {
    var cible = (total ? Math.floor(valeur / total * 100) : 0) + "%", i = b.firstChild;
    b.setAttribute("aria-valuenow", String(valeur));
    if (!mouvement) { i.style.width = cible; return; }
    window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { i.style.width = cible; }); });
  }
  /* « +1 » qui s'envole d'un bouton quand une question est validée pour la première fois. */
  function plusUn(bouton) {
    if (!mouvement) { return; }
    var x = el("span", { class: "plus-un", "aria-hidden": "true", text: "+1" });
    bouton.appendChild(x);
    window.setTimeout(function () { if (x.parentNode) { x.parentNode.removeChild(x); } }, 1000);
  }
  /* Le score du bilan défile de 0 à sa valeur. */
  function compter(noeud, valeur, total) {
    if (!mouvement || valeur === 0) { return; }
    var t0 = null, duree = 700;
    function pas(t) {
      if (t0 === null) { t0 = t; }
      var r = Math.min(1, (t - t0) / duree);
      noeud.textContent = Math.round(valeur * (1 - Math.pow(1 - r, 3))) + " / " + total;
      if (r < 1) { window.requestAnimationFrame(pas); }
    }
    window.requestAnimationFrame(pas);
  }
  /* Confettis aux couleurs du site, dessinés sur une toile posée au-dessus de la page, puis retirés. */
  function confettis(nombre) {
    if (!mouvement || !document.body) { return; }
    var toile = el("canvas", { class: "confettis", "aria-hidden": "true" }), ctx = toile.getContext && toile.getContext("2d");
    if (!ctx) { return; }
    var L = toile.width = window.innerWidth, H = toile.height = window.innerHeight;
    document.body.appendChild(toile);
    var teintes = ["#F09080", "#F5BB5C", "#70C4B4", "#A99BE0", "#7FB2E5", "#15231E"], bouts = [];
    for (var n = 0; n < nombre; n++) {
      bouts.push({ x: L / 2 + (Math.random() - .5) * L * .3, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 4,
        r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3, l: 6 + Math.random() * 6, h: 4 + Math.random() * 4, c: teintes[n % teintes.length] });
    }
    var t0 = null;
    /* Sécurité : si le navigateur met l'animation en pause (onglet caché), la toile part quand même. */
    window.setTimeout(function () { if (toile.parentNode) { toile.parentNode.removeChild(toile); } }, 2500);
    function pas(t) {
      if (t0 === null) { t0 = t; }
      var age = t - t0;
      ctx.clearRect(0, 0, L, H);
      bouts.forEach(function (b) {
        b.vy += .35; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.globalAlpha = Math.max(0, 1 - age / 1800);
        ctx.fillStyle = b.c; ctx.fillRect(-b.l / 2, -b.h / 2, b.l, b.h); ctx.restore();
      });
      if (age < 1800) { window.requestAnimationFrame(pas); } else if (toile.parentNode) { toile.parentNode.removeChild(toile); }
    }
    window.requestAnimationFrame(pas);
  }

  /* Flashcards : seulement celles qui ne sont pas encore sues. Une carte sue le reste.
     Quand tout est su : « Refaire pour m'entraîner » (opts.entrainement), où une carte « À revoir » revient à la fin. */
  function lancerFlashcards(cont, c, retour, retourTexte, opts) {
    opts = opts || {};
    var p = prog(c.id), tous = c.cartes.map(function (k, i) { return i; }), libre = !!opts.entrainement;
    var file = libre ? melanger(tous.slice()) : melanger(tous.filter(function (i) { return p.cartes.indexOf(i) < 0; }));
    var pos = 0, sues = 0, vues = 0, avant = { cartes: compte(c).cartes, chapitre: compte(c).pct };
    var dejaVu = avant.cartes;
    function jauge() {
      var k = compte(c), b = barre(dejaVu, c.cartes.length);
      animerBarre(b, k.cartes, c.cartes.length); dejaVu = k.cartes;
      return el("div", { class: "run-gauge" }, el("div", { class: "q-meta" },
        el("span", { text: libre ? "Entraînement libre : " + pluriel(file.length - pos, "carte restante", "cartes restantes") : k.cartes + " sur " + c.cartes.length + " sues" }),
        el("button", { class: "link-btn", type: "button", text: "J’arrête là", onclick: fin })), b);
    }
    function carte() {
      vider(cont);
      if (pos >= file.length) { fin(); return; }
      var i = file[pos], k = c.cartes[i], retournee = false, repondu = false;
      var recto = el("span", { class: "flash-face flash-front" },
        el("span", { class: "flash-corner", text: "Chapitre " + c.id }),
        el("span", { class: "flash-side", text: "Terme" }),
        el("span", { class: "flash-term", text: k.terme }),
        el("span", { class: "flash-hint", text: "Devine la définition, puis touche la carte pour la retourner." }));
      var verso = el("span", { class: "flash-face flash-back", "aria-hidden": "true" },
        el("span", { class: "flash-corner", text: "Chapitre " + c.id }),
        el("span", { class: "flash-side", text: "Définition" }),
        el("span", { class: "flash-term small", text: k.terme }),
        el("span", { class: "flash-def", text: k.def }),
        sousListe(k, true));
      var face = el("button", { class: "flash", type: "button", "aria-pressed": "false" }, el("span", { class: "flash-inner" }, recto, verso));
      var annonce = el("p", { class: "sr-only", "aria-live": "polite" });
      /* Flashcards : les cartes prennent tour à tour les 10 couleurs de la palette (choix du professeur). */
      var pile = el("div", { class: "flash-stack" + (file.length - pos - 1 > 0 ? " has-more" : ""), style: "--accent:var(--ch" + ((i % 10) + 1) + ")" }, face);
      function repondre(su) {
        if (repondu) { return; }
        repondu = true; vues++;
        if (su) { if (p.cartes.indexOf(i) < 0) { plusUn(pile); } ajoute(p.cartes, i); sues++; }
        else if (libre) { file.push(i); }   /* entraînement libre : la carte revient à la fin */
        sauver(); pos++;
        if (surProgression) { surProgression(); }
        if (!mouvement) { carte(); return; }
        pile.classList.add(su ? "leave-right" : "leave-left");
        window.setTimeout(carte, su ? 420 : 240);
      }
      var boutons = el("div", { class: "two-btn" },
        el("button", { class: "btn", type: "button", text: "À revoir", onclick: function () { repondre(false); } }),
        el("button", { class: "btn btn-dark", type: "button", text: "Je la sais", onclick: function () { repondre(true); } }));
      boutons.style.visibility = "hidden";
      face.addEventListener("click", function () {
        retournee = !retournee;
        face.classList.toggle("is-back", retournee);
        face.setAttribute("aria-pressed", String(retournee));
        recto.setAttribute("aria-hidden", String(retournee));
        verso.setAttribute("aria-hidden", String(!retournee));
        annonce.textContent = retournee ? "Définition : " + texteFiche(k).slice(k.terme.length + 1) : "";
        boutons.style.visibility = "visible";
      });
      cont.appendChild(el("div", { class: "deck" }, jauge(), pile, annonce, boutons));
      remonter(cont);
      face.focus({ preventScroll: true });
    }
    function fin() {
      vider(cont);
      var k = compte(c), toutFait = pos >= file.length, total = c.cartes.length;
      var chapitreFini = k.pct === 100 && avant.chapitre < 100;
      var titre = vues === 0 && k.cartes === total ? "Tout est su ✓"
        : vues === 0 ? "Flashcards"
        : libre && toutFait ? "Entraînement terminé !"
        : k.cartes === total && avant.cartes < total ? "Bravo, tu sais toutes les définitions !"
        : pluriel(vues, "carte vue", "cartes vues") + ", dont " + pluriel(sues, "sue");
      var message = vues === 0 && k.cartes === total ? "Tu sais déjà toutes les définitions du chapitre. Tu peux les revoir pour t’entraîner : ta jauge ne bougera pas."
        : libre ? "Toutes les cartes ont été sues au moins une fois."
        : k.cartes === total ? "Tu sais toutes les définitions du chapitre." : "Flashcards sues sur ce chapitre. Les autres reviendront la prochaine fois.";
      var score = el("p", { class: "score", text: k.cartes + " / " + total });
      cont.appendChild(el("div", { class: "deck fin-serie" + (k.cartes === total ? " is-fini" : "") },
        chapitreFini ? el("p", { class: "medaille anim-pop" }, el("span", { "aria-hidden": "true", text: "🏅" }), "Chapitre maîtrisé !") : null,
        el("h2", { class: "syn-h3", text: titre }),
        score,
        el("p", { class: "lead", text: message }),
        el("div", { class: "actions" },
          !toutFait ? el("button", { class: "btn btn-dark", type: "button", text: "Continuer", onclick: carte }) : null,
          toutFait && k.cartes === total ? el("button", { class: "btn btn-dark", type: "button", text: "Refaire pour m’entraîner",
            onclick: function () { lancerFlashcards(cont, c, retour, retourTexte, { entrainement: true }); } }) : null,
          el("button", { class: "btn", type: "button", text: retourTexte || "Retour à l’entraînement", onclick: retour }))));
      remonter(cont);
      if (vues > 0) { compter(score, k.cartes, total); }
      if (chapitreFini || (vues > 0 && (k.cartes === total && avant.cartes < total || libre && toutFait))) { confettis(chapitreFini ? 160 : 70); }
    }
    carte();
  }

  /* QCM et situations : seulement ce qui n'est pas encore validé (d'abord jamais vu, puis raté).
     Une question validée l'est pour toujours (comme dans la feuille du professeur) : une erreur plus tard ne l'enlève pas.
     Quand tout est validé, la série s'arrête ; l'élève peut ensuite « Refaire pour m'entraîner » (opts.entrainement) :
     tout revient, une question ratée revient à la fin jusqu'à être réussie, et la jauge ne bouge pas.
     Une situation à plusieurs questions (mini-cas) garde son texte affiché pendant toutes ses questions.
     opts.groupes : les groupes à travailler (par défaut tout le type) ; opts.titre : le nom de l'activité. */
  var NIVEAUX = { 1: "Niveau 1 · Je connais", 2: "Niveau 2 · Je réfléchis" };
  function bonnes(d) { return [].concat(d.r); }
  /* Consigne affichée sous la question, sauf si la question dit déjà quoi cocher. */
  function consigne(d, multi) {
    if (multi) { return "Plusieurs réponses sont justes : coche-les toutes, puis valide."; }
    return /coche/i.test(d.q) ? "" : "Coche la bonne réponse.";
  }
  function lancerQuestions(cont, c, type, retour, opts) {
    opts = opts || {};
    var p = prog(c.id), D = donnees(c)[type], groupes = opts.groupes || D.groupes, libre = !!opts.entrainement;
    var ordre = libre ? melanger(groupes.slice())
      : melanger(groupes.filter(function (g) { return !groupeVu(p, type, g); }))
        .concat(melanger(groupes.filter(function (g) { return groupeVu(p, type, g) && !groupeValide(p, type, g); })));
    var file = [];
    ordre.forEach(function (g) { g.ids.forEach(function (id, k) { file.push({ id: id, k: k, n: g.ids.length, theme: g.theme }); }); });
    var pos = 0, faites = 0, justes = 0, ratees = [], serie = 0;
    var avant = { serie: valides(c, type, groupes), chapitre: compte(c).pct };
    var dejaVu = valides(c, type, groupes);   /* pour animer la jauge depuis sa valeur précédente */
    function jauge() {
      var n = valides(c, type, groupes), b = barre(dejaVu, groupes.length);
      animerBarre(b, n, groupes.length); dejaVu = n;
      return el("div", { class: "run-gauge" },
        opts.titre ? el("p", { class: "run-title", text: opts.titre + (libre ? " · entraînement libre" : "") }) : null,
        el("div", { class: "q-meta" },
          el("span", { text: libre ? "Entraînement libre : " + pluriel(file.length - pos, "question restante", "questions restantes") : n + " sur " + groupes.length + (type === "qcm" ? " validées" : " situations validées") }),
          el("button", { class: "link-btn", type: "button", text: "J’arrête là", onclick: fin })), b);
    }
    function question() {
      vider(cont);
      if (pos >= file.length) { fin(); return; }
      var f = file[pos], it = D.items[f.id], d = it.d, multi = Array.isArray(d.r), justesIdx = bonnes(d);
      var ordreChoix = d.c.map(function (x, n) { return n; });
      if (d.c.length > 2) { ordreChoix = melanger(ordreChoix); }
      var lettres = ["A", "B", "C", "D", "E", "F"];
      var retourZone = el("div", { "aria-live": "polite" });
      var liste = el("div", { class: "choices" + (multi ? " multi" : "") });
      var zoneJauge = el("div", null, jauge());
      var choisis = [];
      var valider = multi ? el("button", { class: "btn btn-dark", type: "button", text: "Valider", disabled: true, onclick: function () { repondre(choisis); } }) : null;
      var boutons = ordreChoix.map(function (idx, n) {
        var b = el("button", { class: "choice", type: "button", "aria-pressed": multi ? "false" : null },
          el("kbd", { "aria-hidden": "true", text: lettres[n] }), el("span", { text: d.c[idx] }));
        b.addEventListener("click", function () {
          if (!multi) { repondre([idx]); return; }
          var i2 = choisis.indexOf(idx);
          if (i2 >= 0) { choisis.splice(i2, 1); } else { choisis.push(idx); }
          b.classList.toggle("is-on", i2 < 0);
          b.setAttribute("aria-pressed", String(i2 < 0));
          valider.disabled = choisis.length === 0;
        });
        liste.appendChild(b);
        return { idx: idx, b: b };
      });
      function repondre(choix) {
        var juste = choix.length === justesIdx.length && choix.every(function (x) { return justesIdx.indexOf(x) >= 0; });
        var nouvelle = juste && p.ok[type].indexOf(f.id) < 0;
        boutons.forEach(function (x) {
          x.b.disabled = true;
          x.b.classList.remove("is-on");
          if (justesIdx.indexOf(x.idx) >= 0) { x.b.classList.add("is-ok"); if (choix.indexOf(x.idx) >= 0) { x.b.classList.add("anim-pop"); } }
          else if (choix.indexOf(x.idx) >= 0) { x.b.classList.add("is-ko", "anim-secoue"); }
        });
        if (valider) { var z = valider.parentNode; z.parentNode.removeChild(z); }
        ajoute(p.vu[type], f.id); faites++;
        if (juste) { justes++; serie++; ajoute(p.ok[type], f.id); }
        else {
          serie = 0; ratees.push(f.id);
          /* Entraînement libre : la question ratée revient à la fin, jusqu'à ce qu'elle soit réussie. */
          if (libre) { file.push({ id: f.id, k: f.k, n: f.n, theme: f.theme }); }
        }
        sauver(); pos++;
        if (surProgression) { surProgression(); }
        vider(zoneJauge).appendChild(jauge());
        if (nouvelle) {
          var choisi = boutons.filter(function (x) { return choix.indexOf(x.idx) >= 0; })[0];
          if (choisi) { plusUn(choisi.b); }
        }
        var dansLeCas = f.k + 1 < f.n;
        var suivant = el("button", { class: "btn btn-dark", type: "button", text: pos >= file.length ? "Voir mon bilan" : dansLeCas ? "Question suivante" : (type === "qcm" ? "Question suivante" : "Situation suivante"), onclick: question });
        var reponse = justesIdx.map(function (x) { return d.c[x]; }).join(" ; ");
        var palier = [3, 5, 10, 15, 20, 30].indexOf(serie) >= 0;
        retourZone.appendChild(el("div", { class: "feedback " + (juste ? "ok" : "ko") + (juste ? " anim-entree" : "") },
          palier ? el("span", { class: "serie-badge anim-pop", text: "🔥 " + serie + " d’affilée !" }) : null,
          el("b", { text: juste ? (libre ? "Bonne réponse" : "Bonne réponse, c’est validé") : (libre ? "Ce n’est pas ça : elle reviendra à la fin" : "Ce n’est pas ça") }),
          el("span", { text: (juste ? "" : (multi ? "Les bonnes réponses : " : "La bonne réponse : ") + reponse + ". ") + d.e })));
        retourZone.appendChild(el("div", { class: "actions" }, suivant,
          pos < file.length ? el("button", { class: "btn", type: "button", text: "J’arrête là", onclick: fin }) : null));
        suivant.focus({ preventScroll: true });
      }
      var etiquettes = [
        d.niveau && NIVEAUX[d.niveau] ? el("span", { class: "pill pill-niveau n" + d.niveau, text: NIVEAUX[d.niveau] }) : null,
        f.n > 1 ? el("span", { class: "pill", text: "Question " + (f.k + 1) + " sur " + f.n }) : null
      ].filter(Boolean);
      cont.appendChild(el("div", { class: "quiz" },
        zoneJauge,
        el("div", { class: "q-carte" },
          it.s ? el("p", { class: "scenario" }, el("span", { class: "ex-label", text: "Situation" }), it.s) : null,
          etiquettes.length ? el("p", { class: "q-tags" }, etiquettes) : null,
          el("h2", { class: "q-text" + (etiquettes.length ? " with-tags" : ""), text: d.q }),
          consigne(d, multi) ? el("p", { class: "q-hint", text: consigne(d, multi) }) : null,
          liste,
          valider ? el("div", { class: "actions" }, valider) : null),
        retourZone));
      /* Dans un mini-cas, on garde le texte à l'écran : on ne remonte qu'au début d'une nouvelle situation. */
      if (f.k === 0) { remonter(cont); }
      if (faites > 0) { boutons[0].b.focus({ preventScroll: true }); }
    }
    function fin() {
      vider(cont);
      var n = valides(c, type, groupes), total = groupes.length, toutFait = pos >= file.length;
      var chapitreFini = compte(c).pct === 100 && avant.chapitre < 100;
      var serieFinie = !libre && n === total && avant.serie < total;
      var titre, message;
      if (faites === 0 && n === total) { titre = "Tout est validé ✓"; message = "Tu as déjà réussi toutes ces " + (type === "qcm" ? "questions" : "situations") + ". Tu peux les refaire pour t’entraîner : ta jauge ne bougera pas."; }
      else if (faites === 0) { titre = type === "qcm" ? "QCM" : "Situations"; message = ""; }
      else {
        var taux = justes / faites;
        titre = libre && toutFait ? "Entraînement terminé !" : taux === 1 ? "Parfait !" : taux >= .7 ? "Bien joué !" : taux >= .4 ? "Tu progresses !" : "Continue, ça va venir !";
        message = libre ? "Tout a été réussi au moins une fois. " + pluriel(justes, "bonne réponse", "bonnes réponses") + " sur " + pluriel(faites, "essai") + "."
          : n === total ? "Tu as tout validé sur cette activité." : (type === "qcm" ? "Questions validées." : "Situations validées (une situation est validée quand toutes ses questions sont justes).") + " Les autres reviendront la prochaine fois.";
      }
      var score = el("p", { class: "score", text: n + " / " + total });
      cont.appendChild(el("div", { class: "quiz fin-serie" + (n === total ? " is-fini" : "") },
        opts.titre ? el("p", { class: "run-title", text: opts.titre }) : null,
        chapitreFini ? el("p", { class: "medaille anim-pop" }, el("span", { "aria-hidden": "true", text: "🏅" }), "Chapitre maîtrisé !") : null,
        serieFinie && !chapitreFini ? el("p", { class: "badge-valide anim-pop", text: (opts.titre ? opts.titre.split(" · ").pop() : "Activité") + " validé ✓" }) : null,
        el("h2", { class: "syn-h3", text: titre }),
        faites > 0 ? el("p", { class: "soft", text: "Cette fois : " + pluriel(faites, "question") + ", " + pluriel(justes, "bonne réponse", "bonnes réponses") }) : null,
        score,
        message ? el("p", { class: "lead", text: message }) : null,
        ratees.length ? el("div", null,
          el("h3", { class: "syn-h3", text: "À revoir" }),
          el("ul", { class: "review" }, ratees.filter(function (x, n2, a) { return a.indexOf(x) === n2; }).map(function (i) {
            var it = D.items[i], d = it.d;
            return el("li", null, el("b", { text: (it.s ? it.s + " " : "") + d.q }), el("span", { text: "Réponse : " + bonnes(d).map(function (x) { return d.c[x]; }).join(" ; ") + ". " + d.e }));
          }))) : null,
        el("div", { class: "actions" },
          !toutFait ? el("button", { class: "btn btn-dark", type: "button", text: "Continuer", onclick: question }) : null,
          toutFait && n === total ? el("button", { class: "btn btn-dark", type: "button", text: "Refaire pour m’entraîner",
            onclick: function () { lancerQuestions(cont, c, type, retour, Object.assign({}, opts, { entrainement: true })); } }) : null,
          el("button", { class: "btn", type: "button", text: opts.retourTexte || "Retour à l’entraînement", onclick: retour }))));
      remonter(cont);
      if (faites > 0) { compter(score, n, total); }
      if (chapitreFini || serieFinie || (libre && toutFait && faites > 0) || (faites > 0 && justes === faites)) { confettis(chapitreFini ? 160 : 70); }
    }
    question();
  }

  /* Chaque écran de l'entraînement a sa propre adresse, pour que le bouton retour du téléphone remonte d'un écran :
     #/chapitre/N/entrainement                 menu (Flashcards, QCM, Situations)
     #/chapitre/N/entrainement/flashcards      série de flashcards
     #/chapitre/N/entrainement/qcm             choix du thème (chapitre avec thèmes) ou série (sans thèmes)
     #/chapitre/N/entrainement/qcm/T           choix du niveau du thème T
     #/chapitre/N/entrainement/qcm/T/1         série : thème T, niveau 1 (ou 2)
     #/chapitre/N/entrainement/qcm/tout        série : tout le chapitre
     #/chapitre/N/entrainement/situations      choix du thème (ou série sans thèmes)
     #/chapitre/N/entrainement/situations/T    série : mini-cas du thème T (ou « tout ») */
  function ongletEntrainement(c, majEntete, chemin) {
    chemin = chemin || [];
    var base = "#/chapitre/" + c.id + "/entrainement";
    var zone = el("div");
    var avecThemes = !!(c.themes && c.themes.length);
    var D = donnees(c);
    function duTheme(type, t) { return D[type].groupes.filter(function (g) { return g.theme === t; }); }
    function nomT(t) { return c.themes && c.themes[t - 1] ? nomDuTheme(c.themes[t - 1]) : null; }
    function aller(h) { return function () { location.hash = h; }; }

    /* Un seul bouton pour remonter d'un écran. etapes : [[libellé, adresse], …], du menu à l'écran actuel. */
    function fil(etapes) {
      var parent = etapes[etapes.length - 2];
      /* Si l'on vient de l'écran parent, on revient vraiment en arrière : le retour du téléphone reste cohérent. */
      return el("nav", { class: "fil", "aria-label": "Revenir en arrière" },
        el("a", { class: "btn fil-retour", href: parent[1], text: "← Retour", title: "Revenir à : " + parent[0],
          onclick: function (ev) { if (adressePrecedente === parent[1]) { ev.preventDefault(); history.back(); } } }));
    }
    var E = ["Entraînement", base];

    function menu() {
      var k = compte(c);
      function activite(titre, quoi, fait, total, mot, lien, texteBouton) {
        return el("div", { class: "card act" },
          el("div", { class: "act-txt" }, el("h3", { text: titre }), el("p", { class: "soft", text: quoi })),
          el("div", { class: "act-gauge" }, el("strong", { text: fait + " / " + total + " " + mot }), barre(fait, total)),
          el("a", { class: "btn btn-dark", href: lien, text: texteBouton || (fait === 0 ? "Commencer" : fait === total ? "Refaire" : "Continuer") }));
      }
      zone.appendChild(el("div", { class: "acts" },
        el("p", { class: "lead", text: "Tu t’arrêtes quand tu veux : chaque bonne réponse est validée et gardée pour la prochaine fois." }),
        activite("Flashcards", "Devine la définition, puis retourne la carte.", k.cartes, c.cartes.length, "sues", base + "/flashcards"),
        avecThemes
          ? activite("QCM", "Choisis un thème, puis le niveau 1 ou le niveau 2.", k.qcm, c.qcm.length, "validées", base + "/qcm", "Choisir")
          : activite("QCM", "Des questions de cours, corrigées une par une.", k.qcm, c.qcm.length, "validées", base + "/qcm"),
        avecThemes
          ? activite("Situations", "Des mini-cas où tu appliques le cours. Choisis un thème.", k.situations, c.situations.length, "validées", base + "/situations", "Choisir")
          : activite("Situations", "Des mini-cas où tu appliques le cours.", k.situations, c.situations.length, "validées", base + "/situations")));
    }

    /* Écran de choix : fil d'Ariane, puis une carte avec des lignes (nom, jauge, bouton) */
    function ecran(etapes, titre, lignes) {
      zone.appendChild(el("div", { class: "acts" }, fil(etapes),
        el("section", { class: "card t-block" }, el("h3", { text: titre }), lignes)));
    }
    function ligne(titre, quoi, type, groupes, lien, texteBouton) {
      if (!groupes.length) { return null; }
      var fait = valides(c, type, groupes);
      return el("div", { class: "t-row" },
        el("div", { class: "t-txt" }, el("strong", { text: titre }), quoi ? el("span", { class: "soft", text: quoi }) : null),
        el("div", { class: "t-gauge" }, el("span", { class: "t-count", text: fait + " / " + groupes.length }), barre(fait, groupes.length, "mini")),
        el("a", { class: "btn btn-dark", href: lien, text: texteBouton || (fait === 0 ? "Commencer" : fait === groupes.length ? "Refaire" : "Continuer") }));
    }
    function serie(etapes, type, groupes, titre) {
      var parent = etapes[etapes.length - 2];
      zone.setAttribute("data-serie", "1");
      zone.appendChild(fil(etapes));
      var cont = el("div");
      zone.appendChild(cont);
      lancerQuestions(cont, c, type, aller(parent[1]), { groupes: groupes, titre: titre, retourTexte: "← Retour" });
    }

    var type = chemin[0], t = Number(chemin[1]), n = Number(chemin[2]);
    if (type === "flashcards") {
      zone.setAttribute("data-serie", "1");
      zone.appendChild(fil([E, ["Flashcards", base + "/flashcards"]]));
      var contF = el("div"); zone.appendChild(contF);
      lancerFlashcards(contF, c, aller(base), "← Retour");
    }
    else if ((type === "qcm" || type === "situations") && !avecThemes) {
      var nomA = type === "qcm" ? "QCM" : "Situations";
      serie([E, [nomA, base + "/" + type]], type, D[type].groupes, null);
    }
    else if (type === "qcm" && chemin[1] === "tout") {
      serie([E, ["QCM", base + "/qcm"], ["Tout le chapitre", base + "/qcm/tout"]], "qcm", D.qcm.groupes, "Tous les QCM du chapitre");
    }
    else if (type === "qcm" && nomT(t) && (n === 1 || n === 2)) {
      var gN = duTheme("qcm", t).filter(function (g) { return g.niveau === n; });
      serie([E, ["QCM", base + "/qcm"], [nomT(t), base + "/qcm/" + t], ["Niveau " + n, base + "/qcm/" + t + "/" + n]], "qcm", gN, nomT(t) + " · Niveau " + n);
    }
    else if (type === "qcm" && nomT(t)) {
      var niveau = function (k) { return duTheme("qcm", t).filter(function (g) { return g.niveau === k; }); };
      ecran([E, ["QCM", base + "/qcm"], [nomT(t), base + "/qcm/" + t]], nomT(t), [
        ligne("Niveau 1", "Je connais", "qcm", niveau(1), base + "/qcm/" + t + "/1"),
        ligne("Niveau 2", "Je réfléchis", "qcm", niveau(2), base + "/qcm/" + t + "/2")]);
    }
    else if (type === "qcm") {
      ecran([E, ["QCM", base + "/qcm"]], "QCM : choisis un thème", [
        c.themes.map(function (x, i) { return ligne(nomDuTheme(x), null, "qcm", duTheme("qcm", i + 1), base + "/qcm/" + (i + 1), "Choisir"); }),
        ligne("Tout le chapitre mélangé", "Les deux niveaux", "qcm", D.qcm.groupes, base + "/qcm/tout")]);
    }
    else if (type === "situations" && chemin[1] === "tout") {
      serie([E, ["Situations", base + "/situations"], ["Toutes", base + "/situations/tout"]], "situations", D.situations.groupes, "Toutes les situations du chapitre");
    }
    else if (type === "situations" && nomT(t)) {
      serie([E, ["Situations", base + "/situations"], [nomT(t), base + "/situations/" + t]], "situations", duTheme("situations", t), nomT(t) + " · Situations");
    }
    else if (type === "situations") {
      ecran([E, ["Situations", base + "/situations"]], "Situations : choisis un thème", [
        c.themes.map(function (x, i) {
          var g = duTheme("situations", i + 1);
          return ligne(nomDuTheme(x), pluriel(g.length, "mini-cas", "mini-cas"), "situations", g, base + "/situations/" + (i + 1));
        }),
        ligne("Toutes les situations mélangées", null, "situations", D.situations.groupes, base + "/situations/tout")]);
    }
    else { menu(); }
    return zone;
  }

  /* ---------- Onglet : documents (TD, fiches…) ----------
     Un document : { titre, description, lien, ajout: "AAAA-MM-JJ" }. Jamais de corrigé. */
  function ongletDocuments(c) {
    var docs = (c.documents || []).slice().sort(function (a, b) { return String(b.ajout || "").localeCompare(String(a.ajout || "")); });
    return el("div", { class: "docs" },
      el("p", { class: "lead", text: "Les documents distribués en classe pour ce chapitre." }),
      docs.length ? el("ul", { class: "doc-list" }, docs.map(function (d) {
        return el("li", null, el("a", { class: "card doc", href: d.lien, target: "_blank", rel: "noopener" },
          el("span", { class: "doc-txt" }, el("strong", { text: d.titre }), d.description ? el("span", { class: "soft", text: d.description }) : null),
          el("span", { class: "btn btn-dark", text: "Ouvrir" })));
      })) : el("p", { class: "soft", text: "Aucun document pour l’instant." }));
  }

  /* ---------- Chapitre verrouillé : message à la place de la synthèse, du lexique et de l'entraînement ---------- */
  function ongletVerrouille(c) {
    var autres = [];
    if (c.jeux && c.jeux.length) { autres.push(el("a", { class: "btn btn-dark", href: "#/chapitre/" + c.id + "/jeux", text: "Voir le jeu du chapitre" })); }
    if (c.documents && c.documents.length) { autres.push(el("a", { class: "btn", href: "#/chapitre/" + c.id + "/documents", text: "Voir les documents" })); }
    return el("div", { class: "card locked-card" },
      el("span", { class: "locked-icon" }, cadenas()),
      el("h2", { class: "syn-h3", text: "Pas encore disponible" }),
      el("p", { text: "Ce chapitre est en cours en classe. La synthèse, le lexique et l’entraînement s’ouvriront quand nous l’aurons terminé." }),
      autres.length ? el("div", { class: "actions" }, autres) : null);
  }

  /* ---------- Onglet : jeux ---------- */
  function ongletJeux(c) {
    return el("div", null,
      el("p", { class: "lead", text: "Une autre façon de revoir le chapitre. Les jeux ne comptent pas dans ta jauge." }),
      el("div", { class: "games" }, (c.jeux || []).map(function (j) { return carteJeu(j, c, false); })));
  }

  /* ---------- Page : un chapitre ---------- */
  /* Mémoire des onglets du chapitre ouvert : l'élève peut passer de l'entraînement à la synthèse ou au lexique
     et revenir exactement où il en était (même question, même endroit de la synthèse, même recherche).
     Tient tant que la page reste ouverte ; les réponses, elles, sont toujours enregistrées tout de suite. */
  var memoire = { chap: null };
  function memoireDuChapitre(c) {
    if (memoire.chap !== c.id) { memoire = { chap: c.id, serie: null, dernierEntrainement: null, positions: {}, recherche: "" }; }
    return memoire;
  }

  function pageChapitre(c, ongletId, chemin) {
    var m = memoireDuChapitre(c), adresse = location.hash, repris = false;
    var anciens = { cartes: "entrainement", qcm: "entrainement", situations: "entrainement" };
    ongletId = anciens[ongletId] || ongletId;
    var libre = ouvert(c);
    var onglets = [["synthese", "Synthèse"], ["lexique", "Lexique"], ["entrainement", "Entraînement"]];
    if (c.documents && c.documents.length) { onglets.push(["documents", "Documents"]); }
    if (c.jeux && c.jeux.length) { onglets.push(["jeux", "Jeux"]); }
    var fermes = libre ? [] : ["synthese", "lexique", "entrainement"];
    var accessibles = onglets.filter(function (o) { return fermes.indexOf(o[0]) < 0; });
    /* Chapitre verrouillé : on ouvre par défaut le jeu ou les documents. */
    var actif = onglets.filter(function (o) { return o[0] === ongletId; })[0] || accessibles[0] || onglets[0];
    var ev = evaluation();

    var entete = el("div", { class: "ch-gauge" });
    function majEntete() {
      var k = compte(c);
      vider(entete);
      entete.appendChild(el("div", { class: "row-between" },
        el("strong", { text: "Chapitre validé à " + k.pct + " %" }),
        el("span", { class: "soft", text: k.fait + " sur " + k.total + " flashcards et questions" })));
      entete.appendChild(barre(k.fait, k.total));
    }
    majEntete();
    surProgression = majEntete;

    /* Une série en cours (questions ou flashcards) est gardée telle quelle si l'on revient d'un autre onglet. */
    function entrainementGarde() {
      m.dernierEntrainement = adresse;
      if (m.serie && m.serie.adresse === adresse) { repris = true; return m.serie.node; }
      var z = ongletEntrainement(c, majEntete, chemin);
      m.serie = z.getAttribute("data-serie") ? { adresse: adresse, node: z } : null;
      return z;
    }
    var contenu = fermes.indexOf(actif[0]) >= 0 ? ongletVerrouille(c)
      : actif[0] === "lexique" ? ongletLexique(c, m)
      : actif[0] === "entrainement" ? entrainementGarde()
      : actif[0] === "documents" ? ongletDocuments(c)
      : actif[0] === "jeux" ? ongletJeux(c)
      : ongletSynthese(c);

    return [
      el("a", { class: "btn back", href: "#/chapitres", text: "← Tous les chapitres" }),
      el("p", { class: "crumbs", text: "Thème " + c.theme + " : " + nomTheme(c.theme) + " › Chapitre " + c.id }),
      el("h1", { class: "title", text: c.titre }),
      el("p", { class: "question", text: c.question }),
      ev && ev.chapitre.id === c.id ? el("p", { class: "tag eval-tag", text: "Évaluation " + ev.texte + " · " + ev.delai }) : null,
      libre ? entete : el("p", { class: "tag lock-tag", text: "Chapitre en cours en classe : synthèse et entraînement bientôt disponibles" }),
      el("nav", { class: "tabs tabs-" + onglets.length, id: "onglets", "aria-label": "Les rubriques du chapitre" }, onglets.map(function (o) {
        var ferme = fermes.indexOf(o[0]) >= 0;
        /* L'onglet Entraînement ramène à l'écran où l'élève en était (sa série en cours, par exemple). */
        var lien = o[0] === "entrainement" && m.dernierEntrainement && !ferme ? m.dernierEntrainement : "#/chapitre/" + c.id + "/" + o[0];
        return el("a", { href: lien, class: ferme ? "is-locked" : null, "aria-current": o[0] === actif[0] ? "page" : null },
          ferme ? cadenas() : null, ferme ? el("span", { class: "sr-only", text: "Verrouillé : " }) : null, o[1]);
      })),
      contenu
    ].concat([{ repris: repris, onglet: actif[0] }]);
  }

  /* ---------- Codes élèves : écran du code et bouton de la barre du haut ---------- */
  /* Récupère la progression en ligne et l'ajoute à celle de l'appareil. Si Google ne répond pas, nouvel essai plus tard. */
  function synchroniser(essai) {
    essai = essai || 1;
    COMPTES.recuperer().then(function (r) {
      if (!r) { if (essai < 6) { window.setTimeout(function () { synchroniser(essai + 1); }, 30000); } return; }
      if (r.refuse) {
        window.alert("Le code " + r.code + " n’est pas reconnu : vérifie-le, ou demande-le à " + (CFG.prof || "ton professeur") + ". Ce que tu as fait reste enregistré sur cet appareil.");
        afficher();
        return;
      }
      fusionnerProgression(r.progression);
      COMPTES.planifierEnvoi(exporterProgression());
      /* On rafraîchit l'affichage, sauf en pleine série pour ne pas déranger l'élève. */
      if (location.hash.indexOf("/entrainement/") < 0) { afficher(); }
    });
  }
  var MESSAGES_CODE = {
    format: "Un code a 6 caractères, par exemple K7P-4MX.",
    code: "Code inconnu. Vérifie-le, ou demande-le à " + (CFG.prof || "ton professeur") + ".",
    trop: "Trop d’essais en peu de temps. Réessaie dans quelques minutes.",
    reseau: "Pas de connexion à Internet. Réessaie, ou continue sans code.",
    serveur: "Le service ne répond pas. Réessaie plus tard, ou continue sans code."
  };
  function pageCode() {
    var champ = el("input", { class: "code-champ", type: "text", inputmode: "text", autocomplete: "off", autocapitalize: "characters", spellcheck: "false",
      maxlength: "9", placeholder: "K7P-4MX", "aria-label": "Ton code personnel" });
    var erreur = el("p", { class: "code-erreur", role: "alert" });
    var bouton = el("button", { class: "btn btn-dark", type: "submit", text: "Me connecter" });
    var form = el("form", { class: "code-form", onsubmit: function (ev) {
      ev.preventDefault();
      erreur.textContent = ""; bouton.disabled = true; bouton.textContent = "Connexion…";
      var patience = window.setTimeout(function () { bouton.textContent = "Connexion… encore un instant"; }, 4000);
      COMPTES.connecter(champ.value).then(function (r) {
        window.clearTimeout(patience);
        bouton.disabled = false; bouton.textContent = "Me connecter";
        if (!r.ok) { erreur.textContent = MESSAGES_CODE[r.erreur] || MESSAGES_CODE.serveur; champ.focus(); return; }
        fusionnerProgression(r.progression);
        if (r.provisoire) { synchroniser(); } else { COMPTES.planifierEnvoi(exporterProgression()); }
        location.hash = "#/";
        afficher();
      });
    } }, el("label", { class: "code-label", text: "Entre ton code personnel :" }), el("div", { class: "code-ligne" }, champ, bouton), erreur);
    var dejaVisiteur = COMPTES.choix() === "visiteur";
    return [
      el("section", { class: "code-page" },
        el("h1", { class: "title", text: CFG.titre || "Révision SGN" }),
        el("p", { class: "subtitle", text: CFG.prof || "" }),
        el("div", { class: "card code-card" },
          form,
          el("p", { class: "soft code-aide", text: "Avec ton code, ta progression est gardée en ligne : tu la retrouves sur ton téléphone comme sur les ordinateurs du lycée." }),
          el("p", { class: "code-ou", text: "ou" }),
          el("button", { class: "btn", type: "button", text: dejaVisiteur ? "Revenir sans code" : "Continuer sans code",
            onclick: function () { COMPTES.continuerSansCode(); location.hash = "#/"; afficher(); } }),
          el("p", { class: "soft code-aide", text: "Sans code, ta progression reste seulement sur cet appareil." })))
    ];
  }
  /* Déconnexion : les dernières réponses partent d'abord. Si elles ne peuvent pas partir (pas de réseau),
     l'élève est prévenu et choisit : réessayer, ou se déconnecter quand même (ces réponses seront perdues). */
  function deconnexion(force) {
    var btn = zoneCompte && zoneCompte.querySelector(".compte-btn");
    if (btn) { btn.disabled = true; btn.classList.add("compte-envoi"); }
    COMPTES.deconnecter(force).then(function (fait) {
      if (fait) {
        store = {}; memoire = { chap: null };
        try { localStorage.removeItem(KEY); } catch (e) { /* stockage indisponible */ }
        location.hash = "#/";
        afficher();
        return;
      }
      if (btn) { btn.disabled = false; btn.classList.remove("compte-envoi"); }
      var fond = el("div", { class: "alerte-fond", role: "dialog", "aria-modal": "true", "aria-labelledby": "alerte-titre" });
      function fermer() { if (fond.parentNode) { fond.parentNode.removeChild(fond); } }
      fond.appendChild(el("div", { class: "alerte" },
        el("h2", { id: "alerte-titre", class: "alerte-titre", text: "Tes dernières réponses ne sont pas encore envoyées." }),
        el("p", { text: "Vérifie ta connexion internet, puis réessaie. Si tu te déconnectes quand même, ces dernières réponses seront perdues." }),
        el("div", { class: "alerte-actions" },
          el("button", { class: "btn btn-dark", type: "button", text: "Réessayer", onclick: function () { fermer(); deconnexion(false); } }),
          el("button", { class: "btn", type: "button", text: "Me déconnecter quand même", onclick: function () { fermer(); deconnexion(true); } }))));
      document.body.appendChild(fond);
      fond.querySelector("button").focus();
    });
  }
  /* Bouton de la barre du haut : le code de l'élève (pour se déconnecter) ou « Me connecter » */
  var zoneCompte = null;
  function majCompte() {
    if (!COMPTES) { return; }
    var texte = document.getElementById("texte-progression");
    if (texte) { texte.textContent = COMPTES.code()
      ? "Connecté avec ton code : ta progression est enregistrée sur cet appareil et en ligne, pour ton professeur."
      : "Sans code, ta progression est enregistrée sur cet appareil seulement."; }
    if (!zoneCompte) {
      zoneCompte = el("div", { class: "compte" });
      var top = document.querySelector(".top-in");
      top.insertBefore(zoneCompte, document.getElementById("theme-btn"));
    }
    vider(zoneCompte);
    var code = COMPTES.code();
    if (code) {
      zoneCompte.appendChild(el("button", { class: "compte-btn", type: "button", title: "Me déconnecter",
        "aria-label": "Connecté avec le code " + code + ". Me déconnecter",
        onclick: function () {
          if (!window.confirm("Te déconnecter ? Ta progression reste enregistrée en ligne avec ton code " + code + ". Sur cet appareil, elle sera effacée (pratique sur un ordinateur du lycée).")) { return; }
          deconnexion(false);
        } }, el("span", { class: "compte-code", text: code }),
        el("span", { class: "compte-sortir" }, el("span", { class: "compte-long", text: "Me déconnecter" }), el("span", { class: "compte-court", text: "Quitter" }))));
    } else if (COMPTES.choix()) {
      zoneCompte.appendChild(el("a", { class: "compte-btn", href: "#/connexion", text: "Me connecter" }));
    }
  }

  /* ---------- Navigation ---------- */
  var derniereCle = null, adresseActuelle = location.hash, adressePrecedente = null;
  function afficher() {
    if (location.hash !== adresseActuelle) {
      /* On note où l'élève en était sur la page qu'il quitte, pour l'y ramener s'il revient. */
      if (memoire.positions) { memoire.positions[adresseActuelle] = window.scrollY; }
      adressePrecedente = adresseActuelle; adresseActuelle = location.hash;
    }
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    var nav = "accueil", contenu, cle = "accueil";
    majCompte();
    if (parts[0] === "chapitres") { nav = "chapitres"; cle = "chapitres"; contenu = pageChapitres(); }
    else if (parts[0] === "partager") { nav = ""; cle = "partager"; contenu = pagePartager(); }
    else if (parts[0] === "chapitre" && chapitre(Number(parts[1]))) {
      nav = "chapitres"; cle = "chapitre-" + parts[1];
      contenu = pageChapitre(chapitre(Number(parts[1])), parts[2], parts.slice(3));
    }
    else { contenu = pageAccueil(); }
    /* Codes élèves : à la première visite (ou sur « Me connecter »), l'écran du code passe avant tout le reste. */
    if (COMPTES && (!COMPTES.choix() || parts[0] === "connexion")) { nav = ""; cle = "connexion"; contenu = pageCode(); }

    var info = {};
    vider(app);
    /* Dans un chapitre, sa couleur (--cc) colore le bandeau, les jauges et les questions. */
    app.style.cssText = cle.indexOf("chapitre-") === 0 ? teinte(chapitre(Number(parts[1]))) : "";
    contenu.forEach(function add(n) { if (Array.isArray(n)) { n.forEach(add); } else if (n && n.nodeType) { app.appendChild(n); } else if (n) { info = n; } });
    majIndicesTableaux();

    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      if (a.getAttribute("data-nav") === nav) { a.setAttribute("aria-current", "page"); } else { a.removeAttribute("aria-current"); }
    });
    var c = cle.indexOf("chapitre-") === 0 ? chapitre(Number(parts[1])) : null;
    var t = c ? "Chapitre " + c.id + " : " + c.titre : (cle === "chapitres" ? "Les chapitres" : cle === "partager" ? "Partager le site" : "");
    document.title = (t ? t + " | " : "") + (CFG.titre || "SGN") + " · " + (CFG.prof || "");

    var e = document.getElementById("onglets");
    var position = c && memoire.positions ? memoire.positions[location.hash] : null;
    /* Retour sur la synthèse, le lexique ou une série en cours : on revient exactement où l'élève lisait. */
    if (c && position != null && (info.onglet !== "entrainement" || info.repris)) { window.scrollTo(0, position); }
    /* Dans un écran de l'entraînement (série, choix du thème…), on montre directement le haut de l'écran. */
    else if (c && parts.length > 3 && e) { e.scrollIntoView(); }
    else if (cle !== derniereCle) { window.scrollTo(0, 0); }
    else if (c && e && e.getBoundingClientRect().top < 0) { e.scrollIntoView(); }
    derniereCle = cle;
  }

  /* ---------- Thème clair / sombre ---------- */
  var themeBtn = document.getElementById("theme-btn");
  function majTheme() {
    var sombre = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", sombre ? "Passer en mode clair" : "Passer en mode sombre");
  }
  themeBtn.addEventListener("click", function () {
    var sombre = document.documentElement.getAttribute("data-theme") === "dark";
    var t = sombre ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("sgn-theme", t); } catch (e) { /* stockage indisponible */ }
    majTheme();
  });
  majTheme();

  document.getElementById("reset-btn").addEventListener("click", function () {
    var message = COMPTES && COMPTES.code()
      ? "Effacer la progression gardée sur cet appareil ? Celle enregistrée en ligne avec ton code est conservée et reviendra à ta prochaine connexion."
      : "Effacer toute ta progression sur cet appareil (flashcards sues, questions validées, jeux terminés) ?";
    if (window.confirm(message)) {
      store = {};
      try {
        localStorage.removeItem(KEY);
        localStorage.removeItem("sgn-progression-v1");
        CH.forEach(function (c) { (c.jeux || []).forEach(function (j) { localStorage.removeItem("sgn-jeu-" + j.id); }); });
      } catch (e) { /* stockage indisponible */ }
      afficher();
    }
  });

  /* Au retour d'un jeu (bouton Précédent du navigateur), la page est réaffichée pour montrer « terminé ». */
  window.addEventListener("pageshow", function (e) { if (e.persisted) { afficher(); } });
  window.addEventListener("hashchange", afficher);
  if (!CH.length) { app.appendChild(el("p", { class: "lead", text: "Aucun chapitre n’est encore ouvert." })); }
  else {
    afficher();
    if (COMPTES && COMPTES.code()) { synchroniser(); }
  }
})();
