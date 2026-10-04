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
  function sauver() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* stockage indisponible : on continue sans */ } }
  function prog(id) {
    store.ch = store.ch || {};
    var p = store.ch[id] = store.ch[id] || {};
    p.cartes = p.cartes || [];
    p.ok = p.ok || {};
    p.vu = p.vu || {};
    ["qcm", "situations"].forEach(function (t) { p.ok[t] = p.ok[t] || []; p.vu[t] = p.vu[t] || []; });
    return p;
  }
  function ajoute(liste, v) { if (liste.indexOf(v) < 0) { liste.push(v); } }
  function retire(liste, v) { var i = liste.indexOf(v); if (i >= 0) { liste.splice(i, 1); } }
  function compte(c) {
    var p = prog(c.id);
    function n(liste, max) { return liste.filter(function (i) { return i < max; }).length; }
    var r = { cartes: n(p.cartes, c.cartes.length), qcm: n(p.ok.qcm, c.qcm.length), situations: n(p.ok.situations, c.situations.length) };
    r.total = c.cartes.length + c.qcm.length + c.situations.length;
    r.fait = r.cartes + r.qcm + r.situations;
    r.pct = r.total ? Math.round(r.fait / r.total * 100) : 0;
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
      delai: reste === 0 ? "aujourd’hui" : reste === 1 ? "demain" : "dans " + reste + " jours" };
  }

  /* ---------- Blocs communs ---------- */
  function barre(valeur, total, classe) {
    var pct = total ? Math.round(valeur / total * 100) : 0;
    var i = el("i"); i.style.width = pct + "%";
    return el("div", { class: "bar" + (classe ? " " + classe : ""), role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(valeur) }, i);
  }
  function ligneChapitre(c) {
    var enCours = c.id === CFG.chapitreEnCours, ev = evaluation(), k = compte(c), nbJeux = (c.jeux || []).length;
    return el("li", null,
      el("a", { class: "ch-row", href: "#/chapitre/" + c.id },
        el("span", { class: "ch-num", "aria-hidden": "true", text: String(c.id) }),
        el("span", { class: "ch-name" }, "Chapitre " + c.id + " : " + c.titre,
          enCours ? el("span", { class: "pill", text: "en cours" }) : null,
          ev && ev.chapitre.id === c.id ? el("span", { class: "pill pill-eval", text: "évaluation " + ev.texte }) : null,
          el("small", { text: pluriel(c.cartes.length, "flashcard") + ", " + c.qcm.length + " QCM, " + pluriel(c.situations.length, "situation") + (nbJeux ? ", " + pluriel(nbJeux, "jeu", "jeux") : "") })),
        el("span", { class: "ch-pct" }, el("b", { text: k.pct + " %" }), barre(k.fait, k.total, "mini"))));
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
    var enCours = chapitre(CFG.chapitreEnCours) || CH[CH.length - 1];
    var nbCartes = 0, nbQ = 0, nbS = 0, fait = 0, total = 0;
    CH.forEach(function (c) { var k = compte(c); nbCartes += c.cartes.length; nbQ += c.qcm.length; nbS += c.situations.length; fait += k.fait; total += k.total; });
    var ev = evaluation(), jeux = tousLesJeux();
    var motsTitre = String(CFG.titre || "SGN").split(" "), dernierMot = motsTitre.pop();
    var pct = total ? Math.round(fait / total * 100) : 0;

    return [
      el("section", null,
        el("p", { class: "tag", text: (CFG.classe || "") + ", " + (CFG.matiere || "").toLowerCase() }),
        el("h1", { class: "display" }, motsTitre.length ? motsTitre.join(" ") + " " : null, el("span", { class: "marker", text: dernierMot })),
        CFG.prof ? el("p", { class: "subtitle", text: CFG.prof }) : null,
        el("p", { class: "lead", text: "Pour chaque chapitre : la synthèse, le lexique des définitions et un entraînement avec des flashcards, des QCM et des situations. Tu t’arrêtes quand tu veux, ta progression est gardée." }),
        el("div", { class: "actions" },
          enCours ? el("a", { class: "btn btn-dark", href: "#/chapitre/" + enCours.id, text: "Réviser le chapitre " + enCours.id }) : null),
        el("div", { class: "stats" },
          el("div", { class: "stat" }, el("b", { text: String(CH.length) }), el("span", { text: CH.length > 1 ? "chapitres" : "chapitre" })),
          el("div", { class: "stat" }, el("b", { text: String(nbCartes) }), el("span", { text: "flashcards" })),
          el("div", { class: "stat" }, el("b", { text: String(nbQ) }), el("span", { text: "questions de QCM" })),
          el("div", { class: "stat" }, el("b", { text: String(nbS) }), el("span", { text: "situations" })))),

      ev ? el("section", null,
        el("h2", { class: "h2", text: "Prochaine évaluation" }),
        el("div", { class: "card eval" },
          el("p", { class: "eval-date" }, el("strong", { text: ev.texte.charAt(0).toUpperCase() + ev.texte.slice(1) }), el("span", { class: "pill", text: ev.delai })),
          el("p", { class: "eval-ch", text: "Chapitre " + ev.chapitre.id + " : " + ev.chapitre.titre }),
          el("div", { class: "actions" },
            el("a", { class: "btn btn-dark", href: "#/chapitre/" + ev.chapitre.id + "/entrainement", text: "M’entraîner sur le chapitre " + ev.chapitre.id })))) : null,

      el("section", null,
        el("h2", { class: "h2", text: "Ta progression" }),
        el("div", { class: "card" },
          el("div", { class: "row-between" },
            el("strong", { text: pct + " % validé sur les " + pluriel(CH.length, "chapitre") }),
            el("span", { class: "soft", text: fait + " sur " + total + " flashcards et questions" })),
          barre(fait, total)),
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
          el("div", { class: "card step-card" }, el("h3", { text: "Jeux" }), el("p", { text: "Quand le chapitre en a un : une mise en situation à jouer." }))))
    ];
  }

  /* ---------- Page : chapitres ---------- */
  function pageChapitres() {
    return [
      el("h1", { class: "title", text: "Les chapitres" }),
      el("p", { class: "lead soft", text: pluriel(CH.length, "chapitre ouvert", "chapitres ouverts") + ". Les suivants arrivent au fil de l’année. À droite : ce que tu as déjà validé." }),
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
    return el("div", { class: "table-wrap", tabindex: "0", role: "region", "aria-label": b.titre || "Tableau" },
      el("table", { class: deux ? "two" : "" }, b.titre ? el("caption", { text: b.titre }) : null, thead, tbody));
  }
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
  function ongletLexique(c) {
    var sues = prog(c.id).cartes;
    var fiches = c.cartes.map(function (k, i) {
      return { k: k, n: el("div", { class: sues.indexOf(i) >= 0 ? "known" : "" }, el("dt", { text: k.terme }), el("dd", { text: k.def })) };
    });
    var liste = el("dl", { class: "vocab" }, fiches.map(function (f) { return f.n; }));
    var vide = el("p", { class: "soft", hidden: true, text: "Aucune définition ne correspond." });
    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    var champ = el("input", { class: "search", type: "search", placeholder: "Cherche un mot du chapitre", "aria-label": "Chercher dans le lexique",
      oninput: function () {
        var q = norm(champ.value.trim()), n = 0;
        fiches.forEach(function (f) {
          var ok = !q || norm(f.k.terme + " " + f.k.def).indexOf(q) >= 0;
          f.n.hidden = !ok; if (ok) { n++; }
        });
        vide.hidden = n > 0;
      } });
    return el("div", { class: "syn" },
      el("p", { class: "lead", text: pluriel(c.cartes.length, "définition") + " à connaître pour ce chapitre." }),
      c.cartes.length > 8 ? champ : null,
      liste, vide,
      suite(c, "entrainement", "M’entraîner avec les flashcards"));
  }

  /* ---------- Onglet : entraînement ---------- */
  var COULEURS = ["coral", "sun", "teal"];
  var surProgression = null; /* met à jour la jauge du chapitre affichée en haut de page */
  var mouvement = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* Flashcards : d'abord celles qui ne sont pas encore sues. L'élève s'arrête quand il veut. */
  function lancerFlashcards(cont, c, retour) {
    var p = prog(c.id), tous = c.cartes.map(function (k, i) { return i; });
    var file = melanger(tous.filter(function (i) { return p.cartes.indexOf(i) < 0; }))
      .concat(melanger(tous.filter(function (i) { return p.cartes.indexOf(i) >= 0; })));
    var pos = 0, sues = 0;
    function jauge() {
      var k = compte(c);
      return el("div", { class: "run-gauge" }, el("div", { class: "q-meta" },
        el("span", { text: k.cartes + " sur " + c.cartes.length + " sues" }),
        el("button", { class: "link-btn", type: "button", text: "J’arrête là", onclick: fin })), barre(k.cartes, c.cartes.length));
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
        el("span", { class: "flash-def", text: k.def }));
      var face = el("button", { class: "flash", type: "button", "aria-pressed": "false" }, el("span", { class: "flash-inner" }, recto, verso));
      var annonce = el("p", { class: "sr-only", "aria-live": "polite" });
      var pile = el("div", { class: "flash-stack c-" + COULEURS[i % 3] + (file.length - pos - 1 > 0 ? " has-more" : "") }, face);
      function repondre(su) {
        if (repondu) { return; }
        repondu = true;
        if (su) { ajoute(p.cartes, i); sues++; } else { retire(p.cartes, i); }
        sauver(); pos++;
        if (surProgression) { surProgression(); }
        if (!mouvement) { carte(); return; }
        pile.classList.add(su ? "leave-right" : "leave-left");
        window.setTimeout(carte, 240);
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
        annonce.textContent = retournee ? "Définition : " + k.def : "";
        boutons.style.visibility = "visible";
      });
      cont.appendChild(el("div", { class: "deck" }, jauge(), pile, annonce, boutons));
      remonter(cont);
      face.focus({ preventScroll: true });
    }
    function fin() {
      vider(cont);
      var k = compte(c);
      cont.appendChild(el("div", { class: "deck" },
        el("h2", { class: "syn-h3", text: pos === 0 ? "Flashcards" : pluriel(pos, "carte vue", "cartes vues") + ", dont " + pluriel(sues, "sue") }),
        el("p", { class: "score", text: k.cartes + " / " + c.cartes.length }),
        el("p", { class: "lead", text: k.cartes === c.cartes.length ? "Tu sais toutes les définitions du chapitre." : "Flashcards sues sur ce chapitre. Les autres reviendront en premier la prochaine fois." }),
        el("div", { class: "actions" },
          pos < file.length ? el("button", { class: "btn btn-dark", type: "button", text: "Continuer", onclick: carte }) : null,
          el("button", { class: "btn", type: "button", text: "Retour à l’entraînement", onclick: retour }))));
      remonter(cont);
    }
    carte();
  }

  /* QCM et situations : d'abord les questions jamais vues, puis les ratées, puis les validées.
     Pas de longueur imposée : chaque bonne réponse est validée tout de suite. */
  function lancerQuestions(cont, c, type, retour) {
    var p = prog(c.id), tous = c[type].map(function (q, i) { return i; });
    var nom = type === "qcm" ? "question" : "situation";
    var file = melanger(tous.filter(function (i) { return p.vu[type].indexOf(i) < 0; }))
      .concat(melanger(tous.filter(function (i) { return p.vu[type].indexOf(i) >= 0 && p.ok[type].indexOf(i) < 0; })))
      .concat(melanger(tous.filter(function (i) { return p.ok[type].indexOf(i) >= 0; })));
    var pos = 0, faites = 0, justes = 0, ratees = [];
    function jauge() {
      var n = compte(c)[type];
      return el("div", { class: "run-gauge" }, el("div", { class: "q-meta" },
        el("span", { text: n + " sur " + c[type].length + " validées" }),
        el("button", { class: "link-btn", type: "button", text: "J’arrête là", onclick: fin })), barre(n, c[type].length));
    }
    function question() {
      vider(cont);
      if (pos >= file.length) { fin(); return; }
      var i = file[pos], d = c[type][i];
      var ordre = d.c.map(function (x, n) { return n; });
      if (d.c.length > 2) { ordre = melanger(ordre); }
      var lettres = ["A", "B", "C", "D", "E"];
      var retourZone = el("div", { "aria-live": "polite" });
      var liste = el("div", { class: "choices" });
      var zoneJauge = el("div", null, jauge());
      var boutons = ordre.map(function (idx, n) {
        var b = el("button", { class: "choice", type: "button" }, el("kbd", { "aria-hidden": "true", text: lettres[n] }), el("span", { text: d.c[idx] }));
        b.addEventListener("click", function () { repondre(idx, b); });
        liste.appendChild(b);
        return { idx: idx, b: b };
      });
      function repondre(idx, bouton) {
        var juste = idx === d.r;
        boutons.forEach(function (x) { x.b.disabled = true; if (x.idx === d.r) { x.b.classList.add("is-ok"); } });
        ajoute(p.vu[type], i); faites++;
        if (juste) { justes++; ajoute(p.ok[type], i); }
        else { bouton.classList.add("is-ko"); ratees.push(i); retire(p.ok[type], i); }
        sauver(); pos++;
        if (surProgression) { surProgression(); }
        vider(zoneJauge).appendChild(jauge());
        var suivant = el("button", { class: "btn btn-dark", type: "button", text: pos >= file.length ? "Voir mon bilan" : (type === "qcm" ? "Question suivante" : "Situation suivante"), onclick: question });
        retourZone.appendChild(el("div", { class: "feedback " + (juste ? "ok" : "ko") },
          el("b", { text: juste ? "Bonne réponse, c’est validé" : "Ce n’est pas ça" }),
          el("span", { text: (juste ? "" : "La bonne réponse : " + d.c[d.r] + ". ") + d.e })));
        retourZone.appendChild(el("div", { class: "actions" }, suivant,
          pos < file.length ? el("button", { class: "btn", type: "button", text: "J’arrête là", onclick: fin }) : null));
        suivant.focus({ preventScroll: true });
      }
      cont.appendChild(el("div", { class: "quiz" },
        zoneJauge,
        d.s ? el("p", { class: "scenario" }, el("span", { class: "ex-label", text: "Situation" }), d.s) : null,
        el("h2", { class: "q-text", text: d.q }),
        liste, retourZone));
      remonter(cont);
      if (faites > 0) { boutons[0].b.focus({ preventScroll: true }); }
    }
    function fin() {
      vider(cont);
      var n = compte(c)[type], total = c[type].length;
      cont.appendChild(el("div", { class: "quiz" },
        el("h2", { class: "syn-h3", text: faites === 0 ? (type === "qcm" ? "QCM" : "Situations") : "Cette fois : " + pluriel(faites, nom) + ", " + pluriel(justes, "bonne réponse", "bonnes réponses") }),
        el("p", { class: "score", text: n + " / " + total }),
        el("p", { class: "lead", text: n === total ? "Tu as tout validé sur cette activité." : (type === "qcm" ? "Questions validées" : "Situations validées") + " sur ce chapitre. Les autres reviendront en premier la prochaine fois." }),
        ratees.length ? el("div", null,
          el("h3", { class: "syn-h3", text: "À revoir" }),
          el("ul", { class: "review" }, ratees.filter(function (x, n2, a) { return a.indexOf(x) === n2; }).map(function (i) {
            var d = c[type][i];
            return el("li", null, el("b", { text: (d.s ? d.s + " " : "") + d.q }), el("span", { text: "Réponse : " + d.c[d.r] + ". " + d.e }));
          }))) : null,
        el("div", { class: "actions" },
          pos < file.length ? el("button", { class: "btn btn-dark", type: "button", text: "Continuer", onclick: question }) : null,
          el("button", { class: "btn", type: "button", text: "Retour à l’entraînement", onclick: retour }))));
      remonter(cont);
    }
    question();
  }

  function ongletEntrainement(c, majEntete) {
    var zone = el("div");
    function menu() {
      vider(zone);
      majEntete();
      var k = compte(c);
      function activite(titre, quoi, fait, total, mot, lancer) {
        return el("div", { class: "card act" },
          el("div", { class: "act-txt" }, el("h3", { text: titre }), el("p", { class: "soft", text: quoi })),
          el("div", { class: "act-gauge" }, el("strong", { text: fait + " / " + total + " " + mot }), barre(fait, total)),
          el("button", { class: "btn btn-dark", type: "button", text: fait === 0 ? "Commencer" : fait === total ? "Refaire" : "Continuer", onclick: lancer }));
      }
      zone.appendChild(el("div", { class: "acts" },
        el("p", { class: "lead", text: "Tu t’arrêtes quand tu veux : chaque bonne réponse est validée et gardée pour la prochaine fois." }),
        activite("Flashcards", "Devine la définition, puis retourne la carte.", k.cartes, c.cartes.length, "sues", function () { lancerFlashcards(zone, c, menu); }),
        activite("QCM", "Des questions de cours, corrigées une par une.", k.qcm, c.qcm.length, "validées", function () { lancerQuestions(zone, c, "qcm", menu); }),
        activite("Situations", "Des mini-cas où tu appliques le cours.", k.situations, c.situations.length, "validées", function () { lancerQuestions(zone, c, "situations", menu); })));
      remonter(zone);
    }
    menu();
    return zone;
  }

  /* ---------- Onglet : jeux ---------- */
  function ongletJeux(c) {
    return el("div", null,
      el("p", { class: "lead", text: "Une autre façon de revoir le chapitre. Les jeux ne comptent pas dans ta jauge." }),
      el("div", { class: "games" }, (c.jeux || []).map(function (j) { return carteJeu(j, c, false); })));
  }

  /* ---------- Page : un chapitre ---------- */
  function pageChapitre(c, ongletId) {
    var anciens = { cartes: "entrainement", qcm: "entrainement", situations: "entrainement" };
    ongletId = anciens[ongletId] || ongletId;
    var onglets = [["synthese", "Synthèse"], ["lexique", "Lexique"], ["entrainement", "Entraînement"]];
    if (c.jeux && c.jeux.length) { onglets.push(["jeux", "Jeux"]); }
    var actif = onglets.filter(function (o) { return o[0] === ongletId; })[0] || onglets[0];
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

    var contenu = actif[0] === "lexique" ? ongletLexique(c)
      : actif[0] === "entrainement" ? ongletEntrainement(c, majEntete)
      : actif[0] === "jeux" ? ongletJeux(c)
      : ongletSynthese(c);

    return [
      el("a", { class: "btn back", href: "#/chapitres", text: "← Tous les chapitres" }),
      el("p", { class: "crumbs", text: "Thème " + c.theme + " : " + nomTheme(c.theme) + " › Chapitre " + c.id }),
      el("h1", { class: "title", text: c.titre }),
      el("p", { class: "question", text: c.question }),
      ev && ev.chapitre.id === c.id ? el("p", { class: "tag eval-tag", text: "Évaluation " + ev.texte + ", " + ev.delai }) : null,
      entete,
      el("nav", { class: "tabs tabs-" + onglets.length, id: "onglets", "aria-label": "Les rubriques du chapitre" }, onglets.map(function (o) {
        return el("a", { href: "#/chapitre/" + c.id + "/" + o[0], "aria-current": o[0] === actif[0] ? "page" : null, text: o[1] });
      })),
      contenu
    ];
  }

  /* ---------- Navigation ---------- */
  var derniereCle = null;
  function afficher() {
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    var nav = "accueil", contenu, cle = "accueil";
    if (parts[0] === "chapitres") { nav = "chapitres"; cle = "chapitres"; contenu = pageChapitres(); }
    else if (parts[0] === "chapitre" && chapitre(Number(parts[1]))) {
      nav = "chapitres"; cle = "chapitre-" + parts[1];
      contenu = pageChapitre(chapitre(Number(parts[1])), parts[2]);
    }
    else { contenu = pageAccueil(); }

    vider(app);
    contenu.forEach(function add(n) { if (Array.isArray(n)) { n.forEach(add); } else if (n) { app.appendChild(n); } });

    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      if (a.getAttribute("data-nav") === nav) { a.setAttribute("aria-current", "page"); } else { a.removeAttribute("aria-current"); }
    });
    var c = cle.indexOf("chapitre-") === 0 ? chapitre(Number(parts[1])) : null;
    var t = c ? "Chapitre " + c.id + " : " + c.titre : (cle === "chapitres" ? "Les chapitres" : "");
    document.title = (t ? t + " | " : "") + (CFG.titre || "SGN") + " · " + (CFG.prof || "");

    if (cle !== derniereCle) { window.scrollTo(0, 0); }
    else if (c) {
      var e = document.getElementById("onglets");
      if (e && e.getBoundingClientRect().top < 0) { e.scrollIntoView(); }
    }
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
    if (window.confirm("Effacer toute ta progression sur cet appareil (flashcards sues, questions validées, jeux terminés) ?")) {
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
  else { afficher(); }
})();
