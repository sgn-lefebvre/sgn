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

  var ETAPES = [
    { id: "synthese", n: 1, nom: "Je relis", quoi: "La synthèse du chapitre." },
    { id: "cartes", n: 2, nom: "Je retiens", quoi: "Les définitions, en cartes à retourner." },
    { id: "qcm", n: 3, nom: "QCM", quoi: "Des questions de cours, avec chaque réponse expliquée." },
    { id: "situations", n: 4, nom: "Situations", quoi: "Des mini-cas où tu appliques le cours, comme dans une étude de documents." }
  ];

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

  /* ---------- Progression (enregistrée sur l'appareil) ---------- */
  var KEY = "sgn-progression-v1";
  var store = (function () {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  })();
  function sauver() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* stockage indisponible : on continue sans */ } }
  function prog(id) {
    store.ch = store.ch || {};
    var p = store.ch[id] = store.ch[id] || {};
    p.marks = p.marks || {};
    p.cartes = p.cartes || [];
    p.err = p.err || {};
    p.err.qcm = p.err.qcm || [];
    p.err.situations = p.err.situations || [];
    p.score = p.score || {};
    return p;
  }
  function ajoute(liste, v) { if (liste.indexOf(v) < 0) { liste.push(v); } }
  function retire(liste, v) { var i = liste.indexOf(v); if (i >= 0) { liste.splice(i, 1); } }
  function nbMaitrises() { return CH.filter(function (c) { return prog(c.id).marks.su; }).length; }
  function toutesErreurs() {
    var items = [];
    CH.forEach(function (c) {
      ["qcm", "situations"].forEach(function (type) {
        prog(c.id).err[type].forEach(function (i) { if (c[type][i]) { items.push({ ch: c.id, type: type, i: i }); } });
      });
    });
    return items;
  }

  /* ---------- Blocs communs ---------- */
  function points(c) {
    var m = prog(c.id).marks;
    return el("span", { class: "dots", role: "img", "aria-label": "Lu : " + (m.lu ? "oui" : "non") + ", su : " + (m.su ? "oui" : "non") + ", revu : " + (m.revu ? "oui" : "non") },
      el("i", { class: m.lu ? "on" : "" }), el("i", { class: m.su ? "on" : "" }), el("i", { class: m.revu ? "on" : "" }));
  }
  function ligneChapitre(c) {
    var enCours = c.id === CFG.chapitreEnCours;
    return el("li", null,
      el("a", { class: "ch-row", href: "#/chapitre/" + c.id },
        el("span", { class: "ch-num", "aria-hidden": "true", text: String(c.id) }),
        el("span", { class: "ch-name" }, "Chapitre " + c.id + " : " + c.titre, enCours ? el("span", { class: "pill", text: "en cours" }) : null,
          el("small", { text: pluriel(c.cartes.length, "carte") + ", " + pluriel(c.qcm.length + c.situations.length, "question") })),
        points(c)));
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
  function barre(valeur, total) {
    var pct = total ? Math.round(valeur / total * 100) : 0;
    var i = el("i"); i.style.width = pct + "%";
    return el("div", { class: "bar", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(valeur) }, i);
  }

  /* ---------- Page : accueil ---------- */
  var actionEnAttente = null;

  function pageAccueil() {
    var enCours = chapitre(CFG.chapitreEnCours) || CH[CH.length - 1];
    var nbCartes = 0, nbQ = 0, nbS = 0;
    CH.forEach(function (c) { nbCartes += c.cartes.length; nbQ += c.qcm.length; nbS += c.situations.length; });
    var su = nbMaitrises();

    return [
      el("section", null,
        el("p", { class: "tag", text: "Première STMG, " + (CFG.matiere || "").toLowerCase() }),
        el("h1", { class: "display" }, (CFG.titre || "SGN") + " ", el("span", { class: "marker", text: CFG.classe || "" })),
        el("p", { class: "lead", text: "Pour chaque chapitre, un parcours en 4 étapes : tu relis la synthèse, tu retiens les définitions, tu t’entraînes sur des QCM puis sur des situations. De quoi arriver prêt à l’évaluation." }),
        el("div", { class: "actions" },
          enCours ? el("a", { class: "btn btn-dark", href: "#/chapitre/" + enCours.id, text: "Réviser le chapitre " + enCours.id }) : null,
          CFG.revision ? el("button", { class: "btn", type: "button", text: "Quiz éclair, 10 questions", onclick: function () { actionEnAttente = "eclair"; location.hash = "#/revision"; } }) : null),
        el("div", { class: "stats" },
          el("div", { class: "stat" }, el("b", { text: String(CH.length) }), el("span", { text: CH.length > 1 ? "chapitres" : "chapitre" })),
          el("div", { class: "stat" }, el("b", { text: String(nbCartes) }), el("span", { text: "cartes de définitions" })),
          el("div", { class: "stat" }, el("b", { text: String(nbQ) }), el("span", { text: "questions de QCM" })),
          el("div", { class: "stat" }, el("b", { text: String(nbS) }), el("span", { text: "situations" })))),

      enCours ? el("section", null,
        el("h2", { class: "h2", text: "Le chapitre en cours" }),
        el("div", { class: "card card-coral" },
          el("h3", { text: "Chapitre " + enCours.id + " : " + enCours.titre }),
          el("p", { class: "soft", text: enCours.question }),
          el("div", { class: "actions" },
            el("a", { class: "btn btn-dark", href: "#/chapitre/" + enCours.id, text: "Ouvrir le chapitre " + enCours.id })))) : null,

      el("section", null,
        el("h2", { class: "h2", text: "Ta progression" }),
        el("div", { class: "card" },
          el("div", { class: "row-between" },
            el("strong", { text: su + " chapitre" + (su > 1 ? "s" : "") + " sur " + CH.length + " maîtrisé" + (su > 1 ? "s" : "") }),
            el("span", { class: "soft", text: "Coche « Su » dans chaque chapitre" })),
          barre(su, CH.length))),

      el("section", null,
        el("h2", { class: "h2", text: "Les chapitres" }),
        listeParTheme()),

      el("section", null,
        el("h2", { class: "h2", text: "Le parcours en 4 étapes" }),
        el("div", { class: "grid-4" }, ETAPES.map(function (e) {
          return el("div", { class: "card step-card" }, el("h3", { text: e.n + ". " + e.nom }), el("p", { text: e.quoi }));
        })))
    ];
  }

  /* ---------- Page : chapitres ---------- */
  function pageChapitres() {
    return [
      el("h1", { class: "title", text: "Les chapitres" }),
      el("p", { class: "lead soft", text: pluriel(CH.length, "chapitre ouvert", "chapitres ouverts") + ". Les suivants arrivent au fil de l’année. Les trois points à droite : lu, su, revu." }),
      listeParTheme()
    ];
  }

  /* ---------- Synthèse ---------- */
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
      case "retenir": return el("p", { class: "keep" }, el("span", { class: "keep-label", text: "À retenir" }), el("span", { html: b.html }));
      case "flow": return el("div", { class: "flow" + (b.sansFleche ? " no-arrow" : "") },
        b.titre ? el("p", { class: "flow-title", text: b.titre }) : null,
        el("ol", null, b.etapes.map(function (e) { return el("li", null, el("span", { text: e })); })));
      case "liste": return el("div", null,
        b.titre ? el("p", { class: "list-title", text: b.titre }) : null,
        el("ul", { class: "plain-list" }, b.items.map(function (i) { return el("li", { html: i }); })));
      case "table": return tableau(b);
      case "img": return el("figure", { class: "figure" },
        b.legende ? el("figcaption", { text: b.legende }) : null,
        b.src.indexOf("data:") === 0
          ? el("img", { src: b.src, alt: b.alt || "" })
          : el("a", { href: b.src, target: "_blank", rel: "noopener", "aria-label": "Ouvrir l’image en grand" }, el("img", { src: b.src, alt: b.alt || "", loading: "lazy" })));
      default: return null;
    }
  }
  function vocabulaire(c) {
    var sues = prog(c.id).cartes;
    return el("dl", { class: "vocab" }, c.cartes.map(function (k, i) {
      return el("div", { class: sues.indexOf(i) >= 0 ? "known" : "" }, el("dt", { text: k.terme }), el("dd", { text: k.def }));
    }));
  }
  function etapeSynthese(c) {
    return el("div", { class: "syn" },
      c.synthese.map(bloc),
      suite(c, "cartes", "Étape suivante : les cartes de définitions"));
  }
  function suite(c, etape, texte) {
    return el("div", { class: "next" }, el("a", { class: "btn btn-dark", href: "#/chapitre/" + c.id + "/" + etape, text: texte }));
  }

  /* ---------- Cartes à retourner ---------- */
  function lancerCartes(cont, items, opts) {
    opts = opts || {};
    var fin = opts.fin;
    var ordre = melanger(items), pos = 0, sues = 0, aRevoir = [];
    var COULEURS = ["coral", "sun", "teal"];
    var mouvement = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    function carte() {
      vider(cont);
      if (pos >= ordre.length) { bilan(); return; }
      var it = ordre[pos], c = chapitre(it.ch), k = c.cartes[it.i], retournee = false, repondu = false;
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
      var reste = ordre.length - pos - 1;
      var pile = el("div", { class: "flash-stack c-" + COULEURS[it.i % 3] + (reste > 0 ? " has-more" : "") }, face);
      function repondre(su) {
        if (repondu) { return; }
        repondu = true;
        if (su) { ajoute(prog(it.ch).cartes, it.i); sues++; } else { retire(prog(it.ch).cartes, it.i); aRevoir.push(it); }
        sauver(); pos++;
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
      cont.appendChild(el("div", { class: "deck" },
        el("div", { class: "q-meta" }, el("span", { text: "Carte " + (pos + 1) + " sur " + ordre.length + ", chapitre " + c.id }),
          opts.retour ? el("button", { class: "link-btn", type: "button", text: "Arrêter", onclick: opts.retour }) : null),
        barre(pos, ordre.length), pile, annonce, boutons));
      remonter(cont);
      face.focus({ preventScroll: true });
    }
    function bilan() {
      cont.appendChild(el("div", { class: "deck" },
        el("p", { class: "soft", text: "Paquet terminé" }),
        el("p", { class: "score", text: sues + " / " + ordre.length }),
        el("p", { class: "lead", text: sues === ordre.length ? "Tu sais toutes les cartes de ce paquet." : pluriel(aRevoir.length, "carte") + " à revoir." }),
        el("div", { class: "actions" },
          aRevoir.length ? el("button", { class: "btn btn-dark", type: "button", text: "Revoir les " + pluriel(aRevoir.length, "carte") + " à revoir", onclick: function () { lancerCartes(cont, aRevoir, opts); } }) : null,
          el("button", { class: "btn", type: "button", text: "Recommencer le paquet", onclick: function () { lancerCartes(cont, items, opts); } }),
          opts.retour ? el("button", { class: "btn", type: "button", text: "Retour", onclick: opts.retour }) : null,
          fin ? fin() : null)));
      remonter(cont);
    }
    carte();
  }

  function etapeCartes(c) {
    var zone = el("div");
    var mode = "cartes";
    var seg = el("div", { class: "seg", role: "group", "aria-label": "Affichage" });
    function tous() { return c.cartes.map(function (k, i) { return { ch: c.id, i: i }; }); }
    function accueilCartes() {
      vider(zone);
      var sues = prog(c.id).cartes;
      var restantes = tous().filter(function (it) { return sues.indexOf(it.i) < 0; });
      var opts = { retour: accueilCartes };
      zone.appendChild(el("div", { class: "deck" },
        el("p", { class: "lead", text: pluriel(c.cartes.length, "terme") + " à connaître. Devine la définition, retourne la carte, puis dis si tu la sais." }),
        el("div", { class: "row-between" }, el("strong", { text: pluriel(sues.length, "carte sue", "cartes sues") + " sur " + c.cartes.length })),
        barre(sues.length, c.cartes.length),
        el("div", { class: "actions" },
          el("button", { class: "btn btn-dark", type: "button", text: "Toutes les cartes (" + c.cartes.length + ")", onclick: function () { lancerCartes(zone, tous(), opts); } }),
          el("button", { class: "btn", type: "button", disabled: restantes.length === 0 || restantes.length === c.cartes.length, text: "Celles que je ne sais pas encore (" + restantes.length + ")", onclick: function () { lancerCartes(zone, restantes, opts); } }))));
    }
    function glossaire() { vider(zone); zone.appendChild(vocabulaire(c)); }
    function dessinerSeg() {
      vider(seg);
      [["cartes", "Cartes"], ["glossaire", "Glossaire"]].forEach(function (m) {
        seg.appendChild(el("button", { type: "button", "aria-pressed": String(mode === m[0]), text: m[1], onclick: function () { mode = m[0]; dessinerSeg(); if (mode === "cartes") { accueilCartes(); } else { glossaire(); } } }));
      });
    }
    dessinerSeg(); accueilCartes();
    return el("div", null, seg, zone, suite(c, "qcm", "Étape suivante : les QCM"));
  }

  /* ---------- Quiz (QCM et situations) ---------- */
  function lancerQuiz(cont, items, opts) {
    opts = opts || {};
    var pos = 0, bonnes = 0, ratees = [];
    function question() {
      vider(cont);
      if (pos >= items.length) { bilan(); return; }
      var it = items[pos], c = chapitre(it.ch), d = c[it.type][it.i];
      var ordre = d.c.map(function (x, i) { return i; });
      if (d.c.length > 3) { ordre = melanger(ordre); }
      var lettres = ["A", "B", "C", "D", "E"];
      var retour = el("div", { "aria-live": "polite" });
      var liste = el("div", { class: "choices" });
      var boutons = ordre.map(function (idx, n) {
        var b = el("button", { class: "choice", type: "button" }, el("kbd", { "aria-hidden": "true", text: lettres[n] }), el("span", { text: d.c[idx] }));
        b.addEventListener("click", function () { repondre(idx, b); });
        liste.appendChild(b);
        return { idx: idx, b: b };
      });
      function repondre(idx, bouton) {
        var juste = idx === d.r, p = prog(it.ch);
        boutons.forEach(function (x) { x.b.disabled = true; if (x.idx === d.r) { x.b.classList.add("is-ok"); } });
        if (juste) { bonnes++; retire(p.err[it.type], it.i); }
        else { bouton.classList.add("is-ko"); ratees.push(it); ajoute(p.err[it.type], it.i); }
        sauver();
        var dernier = pos === items.length - 1;
        var suivant = el("button", { class: "btn btn-dark", type: "button", text: dernier ? "Voir mon score" : "Question suivante", onclick: function () { pos++; question(); } });
        retour.appendChild(el("div", { class: "feedback " + (juste ? "ok" : "ko") },
          el("b", { text: juste ? "Bonne réponse" : "Ce n’est pas ça" }),
          el("span", { text: (juste ? "" : "La bonne réponse : " + d.c[d.r] + ". ") + d.e })));
        retour.appendChild(suivant);
        suivant.focus({ preventScroll: true });
      }
      cont.appendChild(el("div", { class: "quiz" },
        el("div", { class: "q-meta" }, el("span", { text: "Question " + (pos + 1) + " sur " + items.length + ", chapitre " + c.id }),
          opts.retour ? el("button", { class: "link-btn", type: "button", text: "Arrêter", onclick: opts.retour }) : null),
        barre(pos, items.length),
        d.s ? el("p", { class: "scenario" }, el("span", { class: "ex-label", text: "Situation" }), d.s) : null,
        el("h2", { class: "q-text", text: d.q }),
        liste, retour));
      remonter(cont);
      if (pos > 0) { boutons[0].b.focus({ preventScroll: true }); }
    }
    function bilan() {
      var total = items.length, pct = total ? bonnes / total : 0;
      if (opts.enregistrer) { opts.enregistrer(bonnes, total); }
      var message = pct === 1 ? "Sans faute. Tu maîtrises ces questions."
        : pct >= 0.8 ? "Très bien. Reprends juste les questions ratées."
        : pct >= 0.5 ? "C’est en bonne voie. Relis les explications, puis refais tes erreurs."
        : "Relis la synthèse et les cartes, puis recommence.";
      cont.appendChild(el("div", { class: "quiz" },
        el("p", { class: "soft", text: "Ton score" }),
        el("p", { class: "score", text: bonnes + " / " + total }),
        el("p", { class: "lead", text: message }),
        ratees.length ? el("div", null,
          el("h3", { class: "syn-h3", text: "À revoir" }),
          el("ul", { class: "review" }, ratees.map(function (it) {
            var d = chapitre(it.ch)[it.type][it.i];
            return el("li", null, el("b", { text: (d.s ? d.s + " " : "") + d.q }), el("span", { text: "Réponse : " + d.c[d.r] + ". " + d.e }));
          }))) : null,
        el("div", { class: "actions" },
          ratees.length ? el("button", { class: "btn btn-dark", type: "button", text: "Refaire mes " + pluriel(ratees.length, "erreur"), onclick: function () { lancerQuiz(cont, melanger(ratees), opts); } }) : null,
          el("button", { class: "btn", type: "button", text: "Retour", onclick: function () { if (opts.retour) { opts.retour(); } } }),
          opts.fin ? opts.fin() : null)));
      remonter(cont);
    }
    question();
  }

  function etapeQuiz(c, type) {
    var zone = el("div");
    var estQcm = type === "qcm";
    function tous() { return c[type].map(function (q, i) { return { ch: c.id, type: type, i: i }; }); }
    function accueilQuiz() {
      vider(zone);
      var p = prog(c.id), err = p.err[type].filter(function (i) { return c[type][i]; });
      var total = c[type].length, sc = p.score[type];
      var opts = {
        retour: accueilQuiz,
        enregistrer: function (ok, n) { p.score[type] = { ok: ok, n: n }; sauver(); },
        fin: function () {
          return estQcm ? el("a", { class: "btn", href: "#/chapitre/" + c.id + "/situations", text: "Étape suivante : les situations" })
            : el("a", { class: "btn", href: "#/chapitres", text: "Tous les chapitres" });
        }
      };
      zone.appendChild(el("div", { class: "quiz" },
        el("p", { class: "lead", text: estQcm
          ? pluriel(total, "question") + " sur le chapitre. Chaque réponse est expliquée."
          : pluriel(total, "situation") + " à analyser, comme dans une étude de documents. Chaque réponse est expliquée." }),
        sc ? el("p", { class: "soft" }, "Ton dernier score : ", el("strong", { text: sc.ok + " / " + sc.n })) : null,
        el("div", { class: "actions" },
          total > 10 ? el("button", { class: "btn btn-dark", type: "button", text: "10 questions au hasard", onclick: function () { lancerQuiz(zone, melanger(tous()).slice(0, 10), opts); } }) : null,
          el("button", { class: "btn" + (total > 10 ? "" : " btn-dark"), type: "button", text: (estQcm ? "Toutes les questions (" : "Toutes les situations (") + total + ")", onclick: function () { lancerQuiz(zone, melanger(tous()), opts); } }),
          el("button", { class: "btn btn-coral", type: "button", disabled: err.length === 0, text: "Mes erreurs (" + err.length + ")", onclick: function () { lancerQuiz(zone, melanger(err.map(function (i) { return { ch: c.id, type: type, i: i }; })), opts); } }))));
    }
    accueilQuiz();
    return el("div", null, zone);
  }

  /* ---------- Page : un chapitre ---------- */
  function pageChapitre(c, etapeId) {
    var etape = ETAPES.filter(function (e) { return e.id === etapeId; })[0] || ETAPES[0];
    var p = prog(c.id);
    var marques = el("div", { class: "marks", role: "group", "aria-label": "Où j’en suis sur ce chapitre" });
    function dessinerMarques() {
      vider(marques);
      [["lu", "📖", "Lu"], ["su", "✅", "Su"], ["revu", "🔁", "Revu"]].forEach(function (m) {
        marques.appendChild(el("button", { class: "mark", type: "button", "aria-pressed": String(!!p.marks[m[0]]), onclick: function () { p.marks[m[0]] = !p.marks[m[0]]; sauver(); dessinerMarques(); } },
          el("span", { "aria-hidden": "true", text: m[1] }), m[2]));
      });
    }
    dessinerMarques();

    var contenu = etape.id === "synthese" ? etapeSynthese(c)
      : etape.id === "cartes" ? etapeCartes(c)
      : etapeQuiz(c, etape.id);

    return [
      el("a", { class: "btn back", href: "#/chapitres", text: "← Tous les chapitres" }),
      el("p", { class: "crumbs", text: "Thème " + c.theme + " : " + nomTheme(c.theme) + " › Chapitre " + c.id }),
      el("h1", { class: "title", text: c.titre }),
      el("p", { class: "question", text: c.question }),
      c.intro ? el("div", { class: "intro", text: c.intro }) : null,
      marques,
      el("nav", { class: "steps", id: "etapes", "aria-label": "Les 4 étapes du chapitre" }, ETAPES.map(function (e) {
        return el("a", { href: "#/chapitre/" + c.id + "/" + e.id, "aria-current": e.id === etape.id ? "step" : null }, el("b", { text: String(e.n) }), e.nom);
      })),
      contenu
    ];
  }

  /* ---------- Page : révision ---------- */
  function pageRevision() {
    var zone = el("div");
    function toutesQuestions() {
      var items = [];
      CH.forEach(function (c) {
        ["qcm", "situations"].forEach(function (type) { c[type].forEach(function (q, i) { items.push({ ch: c.id, type: type, i: i }); }); });
      });
      return items;
    }
    function toutesCartes() {
      var items = [];
      CH.forEach(function (c) { c.cartes.forEach(function (k, i) { items.push({ ch: c.id, i: i }); }); });
      return items;
    }
    function accueilRevision() {
      vider(zone);
      var err = toutesErreurs(), cartes = toutesCartes();
      var opts = { retour: accueilRevision };
      zone.appendChild(el("div", null,
        el("h1", { class: "title", text: "Révision" }),
        el("p", { class: "lead soft", text: "Tous les chapitres ouverts, mélangés. Pratique avant une évaluation qui porte sur plusieurs chapitres." }),
        el("div", { class: "actions" },
          el("button", { class: "btn btn-dark", type: "button", text: "Quiz éclair, 10 questions", onclick: eclair }),
          el("button", { class: "btn btn-coral", type: "button", disabled: err.length === 0, text: "Mes erreurs (" + err.length + ")", onclick: function () { lancerQuiz(zone, melanger(err), opts); } }),
          el("button", { class: "btn", type: "button", text: "Toutes les cartes (" + cartes.length + ")", onclick: function () { lancerCartes(zone, cartes, opts); } })),
        el("h2", { class: "h2", text: "Par chapitre" }),
        listeParTheme()));
      function eclair() { lancerQuiz(zone, melanger(toutesQuestions()).slice(0, 10), opts); }
      if (actionEnAttente === "eclair") { actionEnAttente = null; eclair(); }
    }
    accueilRevision();
    return [zone];
  }

  /* ---------- Navigation ---------- */
  var derniereCle = null;
  function afficher() {
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    var nav = "accueil", contenu, cle = parts[0] || "accueil";
    if (parts[0] === "chapitres") { nav = "chapitres"; contenu = pageChapitres(); }
    else if (parts[0] === "chapitre" && chapitre(Number(parts[1]))) {
      nav = "chapitres"; cle = "chapitre-" + parts[1];
      contenu = pageChapitre(chapitre(Number(parts[1])), parts[2]);
    }
    else if (parts[0] === "revision" && CFG.revision) { nav = "revision"; contenu = pageRevision(); }
    else { cle = "accueil"; contenu = pageAccueil(); }

    vider(app);
    contenu.forEach(function add(n) { if (Array.isArray(n)) { n.forEach(add); } else if (n) { app.appendChild(n); } });

    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      if (a.getAttribute("data-nav") === nav) { a.setAttribute("aria-current", "page"); } else { a.removeAttribute("aria-current"); }
    });
    var titres = { accueil: "", chapitres: "Les chapitres", revision: "Révision" };
    var c = parts[0] === "chapitre" ? chapitre(Number(parts[1])) : null;
    var t = c ? "Chapitre " + c.id + " : " + c.titre : titres[nav];
    document.title = (t ? t + " | " : "") + (CFG.titre || "SGN") + " · " + (CFG.prof || "");

    if (cle !== derniereCle) { window.scrollTo(0, 0); }
    else if (parts[0] === "chapitre") {
      var e = document.getElementById("etapes");
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
    if (window.confirm("Effacer toute ta progression sur cet appareil (chapitres cochés, cartes sues, erreurs) ?")) {
      store = {};
      try { localStorage.removeItem(KEY); } catch (e) { /* stockage indisponible */ }
      afficher();
    }
  });

  if (CFG.revision) {
    var lienRevision = document.querySelector('[data-nav="revision"]');
    if (lienRevision) { lienRevision.hidden = false; }
  }

  window.addEventListener("hashchange", afficher);
  if (!CH.length) { app.appendChild(el("p", { class: "lead", text: "Aucun chapitre n’est encore ouvert." })); }
  else { afficher(); }
})();
