"use strict";
/* Sésame — ce qui est propre à ce site : l'accueil, les étapes « pari », « manip » et « reponse »,
   les messages interceptés et les manipulations (roue de César, fréquences, Enigma, échange de clés).
   Chargé après app.js, dont il utilise les outils ($, $$, h, S, sauver, reussir, bandeauSucces…). */

const ESCALES = () => PARCOURS.flatMap(p => p.chapitres).sort((a, b) => a.an - b.an);
const fr = (x, d = 4) => x.toFixed(d).replace(".", ",");
const calme = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const nettoyer = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const puissanceMod = (g, a, p) => { let r = 1; for (let k = 0; k < a; k++) r = r * g % p; return r; };

/* ============================================================
   Étapes propres à Sésame
   ============================================================ */
/* Pari : l'élève s'engage avant d'expérimenter. Aucune correction ici, c'est la suite qui tranche. */
function etapePari(z, c, i, e) {
  S.paris = S.paris || {};
  const afficher = () => {
    const fait = S.paris[c.id];
    z.innerHTML = `<h1>${h(e.titre)}</h1><p class="prose question">${h(e.q)}</p>${e.doc || ""}<div class="choix pari">${e.choix.map((x, k) => `<button data-k="${k}" ${fait !== undefined ? "disabled" : ""} class="${fait === k ? "mise" : ""}">${h(x)}</button>`).join("")}</div>
      ${fait !== undefined ? `<div class="succes pari-note" role="status"><div><strong>Pari noté.</strong><p>Pas de correction pour l'instant : c'est l'expérience qui va trancher. Ton pari te sera rappelé au moment du verdict.</p></div><a class="btn" href="${suivant(c, i)}">Continuer</a></div>` : `<p class="muet">Engage-toi : ta réponse est enregistrée et ne pourra plus être modifiée.</p>`}`;
    $$(".choix button", z).forEach(b => b.onclick = () => { S.paris[c.id] = +b.dataset.k; sauver(); const { gain } = reussir(c, i, 3); if (gain) toast(`+${gain} XP`); afficher(); $(".pari-note a", z).focus({ preventScroll: true }); });
  };
  afficher();
}

/* Manipulation : validée quand le widget signale que l'objectif est atteint. */
function etapeManip(z, c, i, e) {
  z.innerHTML = `<h1>${h(e.titre)}</h1><div class="prose">${e.intro || ""}</div><div class="widget"></div>`;
  let fait = false; const ok = etoiles => { if (fait) return; fait = true; if (avancement(c).f === c.etapes.length - 1 && !S.faits[idEtape(c, i)]) confettis(); bandeauSucces(z, c, i, etoiles, e.expl);
    const pari = (S.paris || {})[c.id]; if (e.verdict && pari !== undefined) z.insertAdjacentHTML("beforeend", `<p class="verdict"><strong>Ton pari.</strong> ${h(e.verdict[pari])}</p>`); };
  const zone = $(".widget", z);
  MANIPS[e.widget](zone, ok);
}
/* ============================================================
   Parties : chaque dossier et chaque message s'ouvre sur un bandeau aux couleurs de sa partie
   ============================================================ */
const dateNb = d => h(d).replace(/av\. J\.-C\./g, '<span class="nb">av. J.-C.</span>');
function bandeEpoque(ep, lieu, date) {
  const p = PARCOURS.find(x => x.id === ep);
  return `<div class="bande-epoque" role="presentation"><div class="bande-int"><span class="bande-nom">${h(p ? p.titre : "")}</span><span class="bande-lieu">${h(lieu)}, ${dateNb(date)}</span></div><div class="bande-frise" aria-hidden="true"></div></div>`;
}

/* ============================================================
   Messages interceptés : des cryptogrammes à casser, sans leçon
   ============================================================ */
const lireNombre = s => {
  const t = String(s).replace(/[\s  ]/g, "").replace(/,/g, ".").replace(/−/g, "-");
  const f = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (f) return +f[2] ? +f[1] / +f[2] : NaN;
  return /^-?\d+(?:\.\d+)?$/.test(t) ? +t : NaN;
};

function etapeReponse(z, c, i, e) {
  let essais = 0, aides = 0, fini = false;
  z.innerHTML = `<h1>${h(e.titre)}</h1><div class="prose enonce-pb">${e.enonce}</div>
    <form class="reponse-pb" autocomplete="off"><label for="rep">Ta réponse</label><div class="rep-ligne"><input id="rep" type="text" ${e.mot ? 'class="mot" autocapitalize="characters"' : 'inputmode="decimal"'} autocomplete="off" spellcheck="false"><button class="btn" type="submit">Valider</button>${e.indices && e.indices.length ? `<button class="btn secondaire" type="button" id="aide">Un indice</button>` : ""}</div></form>
    <div class="retour-qcm" aria-live="polite"></div><ol class="indices-pb"></ol>`;
  const champ = $("#rep", z), retour = $(".retour-qcm", z);
  if ($("#aide", z)) $("#aide", z).onclick = () => {
    if (aides >= e.indices.length) return;
    $(".indices-pb", z).insertAdjacentHTML("beforeend", `<li>${h(e.indices[aides])}</li>`); aides++;
    if (aides >= e.indices.length) $("#aide", z).disabled = true;
  };
  $("form", z).onsubmit = ev => {
    ev.preventDefault(); if (fini) return;
    let juste;
    if (e.mot) {
      const v = nettoyer(champ.value).replace(/[^A-Z]/g, "");
      if (!v) { retour.textContent = "Écris ta réponse en lettres."; return; }
      juste = v === e.mot;
    } else {
      const v = lireNombre(champ.value);
      if (Number.isNaN(v)) { retour.textContent = "Écris un nombre entier."; return; }
      juste = Math.abs(v - e.reponse) <= (e.tol || 1e-9);
    }
    essais++;
    if (juste) {
      fini = true; champ.disabled = true; champ.classList.add("bon"); retour.textContent = "";
      bandeauSucces(z, c, i, Math.max(1, 3 - (aides ? 1 : 0) - (essais > 3 ? 1 : 0)), e.expl);
      if (e.histoire) z.insertAdjacentHTML("beforeend", e.histoire);
    } else retour.textContent = essais >= 3 && e.indices && aides < e.indices.length ? "Ce n'est pas ça. Un indice peut t'aider à repartir." : "Ce n'est pas ça. Vérifie ton raisonnement et réessaie.";
  };
}

function vueProblemes() {
  const jour = DEFIS.etapes.length ? defiDuJour() : -1, faits = DEFIS.etapes.filter((e, i) => S.faits[idEtape(DEFIS, i)]).length;
  app().innerHTML = `<section class="page problemes">
    <header class="pb-tete"><h1>Messages interceptés</h1><p>Des cryptogrammes tombés entre tes mains. Pas de leçon ici : un message, ta tête, parfois Python. Chaque message décrypté rapporte 50 points.</p>
    <p class="pb-score"><strong>${faits}</strong> sur ${DEFIS.etapes.length} décryptés</p></header>
    <ol class="pb-liste">${DEFIS.etapes.map((e, i) => {
      const f = S.faits[idEtape(DEFIS, i)], duJour = i === jour && S.defiJour !== aujourdhui() && !f;
      return `<li class="ep-${e.ep} ${f ? "fait" : ""}"><a href="#/p/${i}">
        <span class="pb-date">${dateNb(e.date)}</span>
        <strong>${h(e.titre)}</strong>
        <span class="pb-acc">${h(e.accroche)}</span>
        <span class="pb-meta"><span class="pb-diff" aria-label="Difficulté ${e.d} sur 3">${"●".repeat(e.d)}<span class="vide">${"●".repeat(3 - e.d)}</span></span><span>${e.t === "code" ? "En Python" : "À la main"}</span>${f ? etoilesHtml(f.e) : duJour ? `<span class="pb-jour">Message du jour, points doublés</span>` : ""}</span>
      </a></li>`; }).join("")}</ol></section>`;
}

function vueProbleme(i) {
  const e = DEFIS.etapes[i], n = DEFIS.etapes.length;
  document.body.dataset.epoque = e.ep;
  app().innerHTML = `${bandeEpoque(e.ep, e.origine, e.date)}
  <div class="fil"><a href="#/problemes" class="retour">Interceptions</a><span class="fil-titre">Message ${i + 1} sur ${n}<span class="pb-diff" aria-label="Difficulté ${e.d} sur 3"> ${"●".repeat(e.d)}<span class="vide">${"●".repeat(3 - e.d)}</span></span></span></div>
  <article class="etape etape-${e.t}"></article>
  <nav class="etape-nav" aria-label="Navigation entre les messages">${i > 0 ? `<a href="#/p/${i - 1}">Message précédent</a>` : "<span></span>"}${i + 1 < n ? `<a href="#/p/${i + 1}">Message suivant</a>` : `<a href="#/problemes">Tous les messages</a>`}</nav>`;
  ({ reponse: etapeReponse, code: etapeCode, qcm: etapeQcm, quiz: etapeQuiz })[e.t]($(".etape"), DEFIS, i, e);
}

/* ============================================================
   Dossier 1 — la roue de César, la force brute, l'analyse des fréquences
   ============================================================ */
/* Alphabet clair au-dessus, alphabet chiffré en dessous : chaque colonne est une correspondance. */
const bandeAlphabets = cle => `<div class="alphas" aria-hidden="true">${[...ALPHABET].map(l => `<span class="paire"><b>${l}</b><i>${cz(l, cle)}</i></span>`).join("")}</div>`;

function widgetRoue(z) {
  z.innerHTML = `<div class="machine roue">
    <div class="reglage"><label for="roue-cle">Clé</label><input id="roue-cle" type="range" min="0" max="25" value="3"><output class="cle-val" for="roue-cle">3</output></div>
    <div class="roue-bande"></div>
    <label for="roue-msg">Message à chiffrer</label><input id="roue-msg" class="saisie" type="text" maxlength="40" value="ROME" autocomplete="off" spellcheck="false" autocapitalize="characters">
    <p class="sortie-label">Message chiffré</p><p class="chiffre sortie" aria-live="polite"></p></div>`;
  const maj = () => {
    const cle = +$("#roue-cle", z).value;
    $(".cle-val", z).textContent = cle; $(".roue-bande", z).innerHTML = bandeAlphabets(cle);
    $(".sortie", z).textContent = cz(nettoyer($("#roue-msg", z).value), cle) || " ";
  };
  $("#roue-cle", z).oninput = maj; $("#roue-msg", z).oninput = maj; maj();
  return { reveler() {} };
}

function manipBrute(z, ok) {
  const chiffre = cz(MESSAGE_BRUTE.clair, MESSAGE_BRUTE.cle); let cle = 0, rates = 0;
  z.innerHTML = `<div class="machine brute">
    <p class="sortie-label">Message intercepté</p><p class="chiffre intercepte">${chiffre}</p>
    <div class="reglage"><button class="btn secondaire" id="br-moins" aria-label="Clé précédente">−</button><span class="cle-bloc">Clé essayée : <output class="cle-val">0</output></span><button class="btn secondaire" id="br-plus" aria-label="Clé suivante">+</button></div>
    <p class="sortie-label">Ce que donne cette clé</p><p class="chiffre sortie" aria-live="polite"></p>
    <div class="actions"><button class="btn" id="br-ok">Ce texte est lisible</button></div><p class="retour-qcm" aria-live="polite"></p></div>`;
  const maj = () => { $(".cle-val", z).textContent = cle; $(".sortie", z).textContent = cz(chiffre, -cle); $(".retour-qcm", z).textContent = ""; };
  $("#br-moins", z).onclick = () => { cle = (cle + 25) % 26; maj(); };
  $("#br-plus", z).onclick = () => { cle = (cle + 1) % 26; maj(); };
  $("#br-ok", z).onclick = () => {
    if (cle === MESSAGE_BRUTE.cle) { $$("button", z).forEach(b => b.disabled = true); ok(Math.max(1, 3 - rates)); }
    else { rates++; $(".retour-qcm", z).textContent = "Ce texte ne veut rien dire en français. Essaie une autre clé."; }
  };
  maj();
}

const FREQ_FR = [["E", 14.7], ["S", 7.9], ["A", 7.6], ["I", 7.5], ["T", 7.2], ["N", 7.1], ["R", 6.6], ["U", 6.3]];
function manipFrequences(z, ok) {
  const chiffre = substituer(MESSAGE_FREQ), vrai = c => ALPHABET[ALPHA_MELANGE.indexOf(c)];
  const compte = {}; let total = 0;
  for (const c of chiffre) if (c >= "A" && c <= "Z") { compte[c] = (compte[c] || 0) + 1; total++; }
  const lettres = Object.keys(compte).sort((a, b) => compte[b] - compte[a] || a.localeCompare(b));
  const choix = {}, donnees = new Set(); let aides = 0, fini = false;
  const barres = (liste, max) => liste.map(([l, p]) => `<li><b>${l}</b><span class="c-barre"><i style="width:${100 * p / max}%"></i></span><span class="pc">${fr(p, 1)} %</span></li>`).join("");
  const duMessage = lettres.slice(0, 8).map(l => [l, 100 * compte[l] / total]);
  z.innerHTML = `<div class="machine freq">
    <div class="freq-diag">
      <div><h3>Dans ce message</h3><ol class="barres chiffrees">${barres(duMessage, 20)}</ol></div>
      <div><h3>En français</h3><ol class="barres claires">${barres(FREQ_FR, 20)}</ol></div>
    </div>
    <div class="freq-texte" aria-label="Message chiffré, avec tes propositions au-dessus de chaque lettre">${chiffre.split(" ").map(mot => `<span class="mot-c">${[...mot].map(c => c >= "A" && c <= "Z" ? `<span class="fl" data-c="${c}"><b></b><i>${c}</i></span>` : `<span class="fl ponct"><b>${c}</b><i></i></span>`).join("")}</span>`).join(" ")}</div>
    <h3>Tes propositions</h3>
    <div class="freq-cles">${lettres.map(c => `<label class="fq"><span class="fq-c">${c}</span><input maxlength="1" data-c="${c}" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Lettre claire proposée pour ${c}, présente ${compte[c]} fois"><span class="fq-n">${compte[c]}</span></label>`).join("")}</div>
    <p class="freq-etat" aria-live="polite"></p>
    <div class="actions"><button class="btn secondaire" id="fq-aide">Révéler une lettre</button></div></div>`;
  const maj = () => {
    const vues = {}; Object.values(choix).forEach(v => { if (v) vues[v] = (vues[v] || 0) + 1; });
    $$(".fl[data-c]", z).forEach(s => { const v = choix[s.dataset.c] || ""; s.firstChild.textContent = v; s.classList.toggle("pose", !!v); });
    $$(".fq input", z).forEach(inp => inp.parentNode.classList.toggle("doublon", !!inp.value && vues[inp.value] > 1));
    const justes = lettres.filter(c => choix[c] === vrai(c)).length, poses = lettres.filter(c => choix[c]).length;
    $(".freq-etat", z).textContent = poses ? `${justes} lettre${justes > 1 ? "s" : ""} juste${justes > 1 ? "s" : ""} sur ${poses} proposée${poses > 1 ? "s" : ""}. Il y a ${lettres.length} lettres à trouver.` : `Il y a ${lettres.length} lettres à trouver. Commence par la plus fréquente.`;
    if (!fini && justes === lettres.length) { fini = true; $$("input, button", z).forEach(x => x.disabled = true); ok(aides <= 2 ? 3 : aides <= 6 ? 2 : 1); }
  };
  $$(".fq input", z).forEach(inp => inp.oninput = () => {
    inp.value = nettoyer(inp.value).replace(/[^A-Z]/g, "").slice(-1); choix[inp.dataset.c] = inp.value; maj();
  });
  $("#fq-aide", z).onclick = () => {
    const c = lettres.find(x => choix[x] !== vrai(x)); if (!c) return;
    aides++; choix[c] = vrai(c); donnees.add(c);
    const inp = $(`.fq input[data-c="${c}"]`, z); inp.value = vrai(c); inp.readOnly = true; inp.parentNode.classList.add("donnee"); maj();
  };
  maj();
}

/* ============================================================
   Dossier 2 — Enigma I : rotors I, II, III (de gauche à droite), réflecteur B, sans tableau de connexions
   ============================================================ */
const ENIGMA = { rotors: ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "BDFHJLCPRTXVZNYEIMGAKUSQOW"], encoches: [16, 4, 21], reflecteur: "YRUHQSLDPXNGOKMIEBFZCWVJAT" };
/* Fait avancer les rotors (pos est modifié), puis renvoie la lettre chiffrée. */
function enigmaFrappe(pos, lettre) {
  const { rotors, encoches, reflecteur } = ENIGMA;
  if (pos[1] === encoches[1]) { pos[0] = (pos[0] + 1) % 26; pos[1] = (pos[1] + 1) % 26; } else if (pos[2] === encoches[2]) pos[1] = (pos[1] + 1) % 26;
  pos[2] = (pos[2] + 1) % 26;
  let c = lettre.charCodeAt(0) - 65;
  for (let r = 2; r >= 0; r--) c = (rotors[r].charCodeAt((c + pos[r]) % 26) - 65 - pos[r] + 26) % 26;
  c = reflecteur.charCodeAt(c) - 65;
  for (let r = 0; r <= 2; r++) c = (rotors[r].indexOf(ALPHABET[(c + pos[r]) % 26]) - pos[r] + 26) % 26;
  return ALPHABET[c];
}
const CLAVIER = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
function widgetEnigma(z) {
  const pos = [0, 0, 0], noms = ["gauche", "du milieu", "de droite"]; let tape = "", obtenu = "";
  z.innerHTML = `<div class="machine enigma" tabindex="0" role="group" aria-label="Machine Enigma. Les touches de ton clavier fonctionnent aussi.">
    <div class="en-rotors">${noms.map((n, r) => `<div class="en-rotor"><button data-r="${r}" data-d="1" aria-label="Rotor ${n}, lettre suivante">▲</button><output data-r="${r}" aria-label="Rotor ${n}">A</output><button data-r="${r}" data-d="-1" aria-label="Rotor ${n}, lettre précédente">▼</button></div>`).join("")}
      <button class="btn secondaire en-raz">Remettre sur A A A</button></div>
    <div class="en-lampes" aria-hidden="true">${CLAVIER.map(l => `<div>${[...l].map(c => `<span data-l="${c}">${c}</span>`).join("")}</div>`).join("")}</div>
    <div class="en-touches">${CLAVIER.map(l => `<div>${[...l].map(c => `<button data-t="${c}" aria-label="Touche ${c}">${c}</button>`).join("")}</div>`).join("")}</div>
    <dl class="en-bande"><dt>Tu as tapé</dt><dd class="en-tape"></dd><dt>La machine a répondu</dt><dd class="en-obtenu" aria-live="polite"></dd></dl></div>`;
  const maj = () => {
    $$(".en-rotor output", z).forEach(o => o.textContent = ALPHABET[pos[+o.dataset.r]]);
    $(".en-tape", z).textContent = tape || "…"; $(".en-obtenu", z).textContent = obtenu || "…";
  };
  const frapper = l => {
    const s = enigmaFrappe(pos, l); tape = (tape + l).slice(-24); obtenu = (obtenu + s).slice(-24);
    $$(".en-lampes span", z).forEach(x => x.classList.toggle("allumee", x.dataset.l === s)); maj();
  };
  $$(".en-rotor button", z).forEach(b => b.onclick = () => { const r = +b.dataset.r; pos[r] = (pos[r] + +b.dataset.d + 26) % 26; maj(); });
  $(".en-raz", z).onclick = () => { pos[0] = pos[1] = pos[2] = 0; tape = obtenu = ""; $$(".en-lampes span", z).forEach(x => x.classList.remove("allumee")); maj(); };
  $$(".en-touches button", z).forEach(b => b.onclick = () => frapper(b.dataset.t));
  $(".enigma", z).addEventListener("keydown", ev => {
    if (ev.ctrlKey || ev.metaKey || ev.altKey || !/^[a-zA-Z]$/.test(ev.key)) return;
    ev.preventDefault(); frapper(ev.key.toUpperCase());
  });
  maj();
  return { reveler() {} };
}

/* Le mot probable glisse sous le message : une lettre identique au-dessus et en dessous élimine la position. */
function widgetMot(z) {
  const { chiffre, mot } = MESSAGE_ENIGMA, N = chiffre.length - mot.length + 1; let k = 0; const vus = {};
  z.innerHTML = `<div class="machine crib">
    <div class="c-defile"><div class="c-grille" style="--n:${chiffre.length}">
      <div class="c-ligne c-chiffre">${[...chiffre].map(c => `<span>${c}</span>`).join("")}</div><div class="c-ligne c-mot"></div></div></div>
    <div class="reglage"><button class="btn secondaire" id="c-moins" aria-label="Position précédente">◀</button><span class="cle-bloc">Position <output class="cle-val">1</output> sur ${N}</span><button class="btn secondaire" id="c-plus" aria-label="Position suivante">▶</button></div>
    <p class="c-verdict" aria-live="polite"></p>
    <ol class="c-bilan" aria-label="Positions déjà testées">${Array.from({ length: N }, (_, j) => `<li data-j="${j}">${j + 1}</li>`).join("")}</ol></div>`;
  const maj = () => {
    const chocs = [...mot].map((c, j) => chiffre[k + j] === c);
    $(".c-mot", z).innerHTML = `${"<span></span>".repeat(k)}${[...mot].map((c, j) => `<span class="${chocs[j] ? "c-choc" : "c-lettre"}">${c}</span>`).join("")}`;
    $$(".c-chiffre span", z).forEach((s, j) => s.className = j >= k && j < k + mot.length ? (chocs[j - k] ? "c-choc" : "c-face") : "");
    const fautes = [...new Set(mot.split("").filter((c, j) => chocs[j]))];
    vus[k] = fautes.length ? "non" : "oui";
    $(".cle-val", z).textContent = k + 1;
    $(".c-verdict", z).textContent = fautes.length ? `Impossible : la lettre ${fautes.join(" et la lettre ")} se retrouve sous elle-même.` : "Possible : aucune lettre ne se retrouve sous elle-même.";
    $(".c-verdict", z).dataset.v = vus[k];
    $$(".c-bilan li", z).forEach(li => { li.dataset.v = vus[li.dataset.j] || ""; li.classList.toggle("ici", +li.dataset.j === k); });
    const nb = Object.values(vus).filter(v => v === "oui").length, faits = Object.keys(vus).length;
    $(".c-bilan", z).setAttribute("aria-label", `${faits} positions testées sur ${N}, dont ${nb} possibles`);
  };
  $("#c-moins", z).onclick = () => { k = (k + N - 1) % N; maj(); };
  $("#c-plus", z).onclick = () => { k = (k + 1) % N; maj(); };
  $$(".c-bilan li", z).forEach(li => li.onclick = () => { k = +li.dataset.j; maj(); });
  maj();
  return { reveler() {} };
}

/* ============================================================
   Dossier 3 — l'échange de clés, en peinture puis avec des nombres
   ============================================================ */
function teinteRVB(t) {
  const f = n => { const k = (n + t / 30) % 12; return Math.round(255 * (.5 - .42 * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return [f(0), f(8), f(4)];
}
const melange = (...parts) => parts[0].map((_, j) => Math.round(parts.reduce((a, p) => a + p[j], 0) / parts.length));
const rvb = c => `rgb(${c.join(",")})`;
function widgetCouleurs(z) {
  const COMMUNE = [240, 200, 60];
  const pot = (id, legende) => `<figure class="pot"><span class="pot-c" id="${id}"></span><figcaption>${legende}</figcaption></figure>`;
  z.innerHTML = `<div class="machine coul">
    <div class="coul-col"><h3>Alice</h3>${pot("p-a", "Sa couleur secrète")}<label for="t-a" class="sr">Couleur secrète d'Alice</label><input id="t-a" type="range" min="0" max="359" value="350">${pot("p-fa", "Elle ajoute son secret au mélange de Bob")}</div>
    <div class="coul-col coul-ligne"><h3>Ce qui circule, sous les yeux d'Ève</h3>${pot("p-c", "La couleur commune")}${pot("p-ma", "Le mélange envoyé par Alice")}${pot("p-mb", "Le mélange envoyé par Bob")}${pot("p-e", "Ce qu'Ève obtient en mélangeant ces deux pots")}</div>
    <div class="coul-col"><h3>Bob</h3>${pot("p-b", "Sa couleur secrète")}<label for="t-b" class="sr">Couleur secrète de Bob</label><input id="t-b" type="range" min="0" max="359" value="215">${pot("p-fb", "Il ajoute son secret au mélange d'Alice")}</div>
    <p class="coul-bilan">Alice et Bob obtiennent exactement la même couleur. Celle d'Ève est différente : elle contient deux doses de couleur commune.</p></div>`;
  const maj = () => {
    const a = teinteRVB(+$("#t-a", z).value), b = teinteRVB(+$("#t-b", z).value);
    const poser = (id, c) => $("#" + id, z).style.background = rvb(c);
    poser("p-c", COMMUNE); poser("p-a", a); poser("p-b", b);
    poser("p-ma", melange(COMMUNE, a)); poser("p-mb", melange(COMMUNE, b));
    poser("p-fa", melange(COMMUNE, a, b)); poser("p-fb", melange(COMMUNE, a, b)); poser("p-e", melange(COMMUNE, COMMUNE, a, b));
  };
  $("#t-a", z).oninput = maj; $("#t-b", z).oninput = maj; maj();
  return { reveler() {} };
}

function widgetEchange(z) {
  const P = 23, G = 5;
  z.innerHTML = `<div class="machine echange">
    <p class="ech-public">Connus de tous : <span class="m">p</span> = <b>${P}</b> et <span class="m">g</span> = <b>${G}</b></p>
    <div class="ech-cols">
      <div class="ech-col"><h3>Alice</h3><div class="reglage"><label for="e-a">Son secret <span class="m">a</span></label><input id="e-a" type="range" min="1" max="21" value="4"><output class="cle-val" id="v-a"></output></div>
        <p>Elle envoie <span class="calc" id="c-A"></span></p><p>Elle reçoit <b class="recu" id="r-A"></b> et calcule <span class="calc" id="s-A"></span></p></div>
      <div class="ech-col"><h3>Bob</h3><div class="reglage"><label for="e-b">Son secret <span class="m">b</span></label><input id="e-b" type="range" min="1" max="21" value="9"><output class="cle-val" id="v-b"></output></div>
        <p>Il envoie <span class="calc" id="c-B"></span></p><p>Il reçoit <b class="recu" id="r-B"></b> et calcule <span class="calc" id="s-B"></span></p></div>
    </div>
    <p class="ech-eve" aria-live="polite"></p></div>`;
  const maj = () => {
    const a = +$("#e-a", z).value, b = +$("#e-b", z).value, A = puissanceMod(G, a, P), B = puissanceMod(G, b, P);
    $("#v-a", z).textContent = a; $("#v-b", z).textContent = b;
    $("#c-A", z).innerHTML = `${G}<sup>${a}</sup> mod ${P} = <b>${A}</b>`; $("#c-B", z).innerHTML = `${G}<sup>${b}</sup> mod ${P} = <b>${B}</b>`;
    $("#r-A", z).textContent = B; $("#r-B", z).textContent = A;
    $("#s-A", z).innerHTML = `${B}<sup>${a}</sup> mod ${P} = <b class="secret">${puissanceMod(B, a, P)}</b>`;
    $("#s-B", z).innerHTML = `${A}<sup>${b}</sup> mod ${P} = <b class="secret">${puissanceMod(A, b, P)}</b>`;
    $(".ech-eve", z).textContent = `Ève a vu passer quatre nombres : ${P}, ${G}, ${A} et ${B}.`;
  };
  $("#e-a", z).oninput = maj; $("#e-b", z).oninput = maj; maj();
  return { reveler() {} };
}

/* Ève cherche l'exposant : aucun raccourci, il faut les essayer un par un. */
function manipLogarithme(z, ok) {
  const P = 467, G = 2, secret = 230 + Math.floor(Math.random() * 180), cible = puissanceMod(G, secret, P);
  let x = 0, essais = 0, manuels = 0, minuterie = null, fini = false;
  z.innerHTML = `<div class="machine logd">
    <p class="ech-public">Ève a vu passer : <span class="m">p</span> = <b>${P}</b>, <span class="m">g</span> = <b>${G}</b>, et le nombre d'Alice, <b class="cible">${cible}</b></p>
    <p class="logd-essai" aria-live="polite">Choisis un exposant à essayer.</p>
    <div class="actions"><button class="btn" id="l-1">Exposant suivant</button><button class="btn secondaire" id="l-10">Sauter de 10</button><button class="btn secondaire" id="l-auto" disabled>Laisser la machine chercher</button></div>
    <p class="logd-n"></p><p class="muet logd-note">Après douze essais à la main, tu pourras confier la corvée à la machine.</p></div>`;
  const tester = manuel => {
    essais++; if (manuel) manuels++;
    const r = puissanceMod(G, x, P), trouve = r === cible;
    $(".logd-essai", z).innerHTML = `${G}<sup>${x}</sup> mod ${P} = <b class="${trouve ? "secret" : ""}">${r}</b>${trouve ? ` : c'est le nombre d'Alice. Son exposant secret est ${x}.` : ""}`;
    $(".logd-n", z).textContent = `${essais} essai${essais > 1 ? "s" : ""}`;
    if (manuels >= 12 && !minuterie) { $("#l-auto", z).disabled = false; $(".logd-note", z).textContent = "Les restes sautent sans logique : en sautant des exposants, tu risques de passer à côté du bon. La machine, elle, les essaie tous."; }
    if (trouve) { fini = true; clearInterval(minuterie); $$("button", z).forEach(b => b.disabled = true); ok(3); }
    return trouve;
  };
  const avancer = pas => { if (fini) return; x += pas; if (x > P - 1) x -= P - 1; tester(true); };
  $("#l-1", z).onclick = () => avancer(1); $("#l-10", z).onclick = () => avancer(10);
  $("#l-auto", z).onclick = () => {
    $$("button", z).forEach(b => b.disabled = true); x = 0;
    if (calme()) { do x++; while (!tester(false)); return; }
    minuterie = setInterval(() => { if (!z.isConnected) return clearInterval(minuterie); for (let k = 0; k < 2 && !fini; k++) { x++; tester(false); } }, 16);
  };
}

const MANIPS = { brute: manipBrute, frequences: manipFrequences, logarithme: manipLogarithme };
const WIDGETS_QUIZ = { roue: widgetRoue, enigma: widgetEnigma, mot: widgetMot, couleurs: widgetCouleurs, echange: widgetEchange };

/* ============================================================
   Accueil
   ============================================================ */
const VIGNETTES = {
  cesar: `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><circle cx="60" cy="60" r="52" class="v0"/><circle cx="60" cy="60" r="36" class="v2"/><circle cx="60" cy="60" r="4" class="vn"/>${Array.from({ length: 26 }, (_, k) => { const a = k * 2 * Math.PI / 26, c = Math.cos(a), s = Math.sin(a); return `<path d="M${(60 + 36 * c).toFixed(1)} ${(60 + 36 * s).toFixed(1)}L${(60 + 52 * c).toFixed(1)} ${(60 + 52 * s).toFixed(1)}" class="v0"/>`; }).join("")}<path d="M60 60L60 30" class="v1"/></svg>`,
  enigma: `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><rect x="10" y="22" width="100" height="76" rx="8" class="v0"/>${[32, 60, 88].map(x => `<rect x="${x - 10}" y="34" width="20" height="30" rx="4" class="v2"/><path d="M${x - 10} 49h20" class="v1"/>`).join("")}${[26, 43, 60, 77, 94].map(x => `<circle cx="${x}" cy="82" r="5" class="v0"/>`).join("")}<circle cx="60" cy="82" r="5" class="vp"/></svg>`,
  diffie: `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><circle cx="32" cy="38" r="16" class="v2"/><circle cx="88" cy="38" r="16" class="v2"/><path d="M32 54C32 84 50 80 56 92M88 54C88 84 70 80 64 92" class="v1"/><circle cx="60" cy="96" r="12" class="vp"/><path d="M52 20l8 8 8-8" class="v0"/></svg>`,
};

function frise() {
  const partie = c => PARCOURS.find(p => p.chapitres.includes(c)).id;
  const pts = [...ESCALES().map(c => ({ an: c.an, date: c.date, nom: c.court || c.titre, c })), ...A_VENIR].sort((a, b) => a.an - b.an);
  const PAS = 68, X0 = 56, W = X0 * 2 + PAS * (pts.length - 1), Y = 96;
  return `<div class="chrono-defile" tabindex="0" role="group" aria-label="Frise chronologique des dossiers, de Sparte au quantique"><svg class="chrono" viewBox="0 0 ${W} 192" style="min-width:${W}px">
    <path d="M${X0 - 34} ${Y}H${W - X0 + 34}" class="axe"/><path d="M${W - X0 + 34} ${Y}l-9-5v10z" class="pointe"/>
    ${pts.map((p, k) => {
      const x = X0 + k * PAS, haut = k % 2 === 0, mots = p.nom.split(" "), lignes = [""], an = Math.floor(p.an);
      mots.forEach(m => { if ((lignes[lignes.length - 1] + " " + m).trim().length > 14) lignes.push(m); else lignes[lignes.length - 1] = (lignes[lignes.length - 1] + " " + m).trim(); });
      const y0 = haut ? Y - 34 - (lignes.length - 1) * 13 : Y + 44;
      const corps = `<path d="M${x} ${Y}V${haut ? Y - 22 : Y + 22}" class="tige"/><circle cx="${x}" cy="${Y}" r="${p.c ? 8 : 5}" class="pt ${p.c ? `ep-${partie(p.c)} ${avancement(p.c).fini ? "fait" : "ouvert"}` : "avenir"}"/>
        <text x="${x}" y="${haut ? Y + 24 : Y - 16}" class="an">${an < 0 ? "−" + (-an) : an}</text>
        <text x="${x}" y="${y0}" class="nom ${p.c ? "" : "avenir"}">${lignes.map((l, j) => `<tspan x="${x}" dy="${j ? 13 : 0}">${h(l)}</tspan>`).join("")}</text>`;
      return p.c ? `<a href="#/c/${p.c.id}/${premierAFaire(p.c)}" aria-label="${h(p.nom)}, ${h(p.date)}">${corps}</a>` : `<g aria-label="${h(p.nom)}, ${h(p.date)}, dossier à venir">${corps}</g>`;
    }).join("")}
  </svg></div>`;
}

const RUBAN = cz("BRAVO TU AS TROUVE LA CLE DU RUBAN ELLE VAUT TROIS COMME CELLE DE CESAR", 3);
function vueAccueil() {
  const suite = prochainChapitre(), commence = Object.keys(S.faits).length > 0, nb = ESCALES().length;
  const lien = suite ? `#/c/${suite.id}/${premierAFaire(suite)}` : "#/profil";
  app().innerHTML = `
  <section class="hero">
    <div class="hero-texte">
      <h1>Chiffre un message. Puis casse-le.</h1>
      <p>${nb === 3 ? "Trois dossiers pour commencer" : `${nb} dossiers`}, de Jules César aux clés publiques. Dans chacun, tu chiffres avec la technique de l'époque, puis tu la casses comme elle a été cassée.</p>
      <div class="hero-actions">
      <a class="btn gros" href="${lien}">${!suite ? "Voir mon profil" : commence ? `Reprendre : ${h(suite.titre)}` : "Ouvrir le premier dossier"}</a><a class="btn gros secondaire" href="#/problemes">Décrypter un message</a></div>
    </div>
    <div class="hero-machine">
      <label for="h-msg">Ton message</label><input id="h-msg" class="saisie" type="text" maxlength="28" value="SESAME OUVRE TOI" autocomplete="off" spellcheck="false" autocapitalize="characters">
      <div class="reglage"><label for="h-cle">Clé</label><input id="h-cle" type="range" min="0" max="25" value="3"><output class="cle-val" for="h-cle">3</output></div>
      <p class="sortie-label">Ce que voit l'espion</p><p class="chiffre sortie" aria-live="polite"></p>
      <p class="hero-leg">Le chiffre de Jules César : chaque lettre avance de quelques rangs dans l'alphabet.</p>
    </div>
  </section>
  <div class="ruban-pi" aria-hidden="true"><div><span>${RUBAN} · </span><span>${RUBAN} · </span></div></div>
  <section class="route" aria-labelledby="t-route">
    <h2 id="t-route">Vingt-cinq siècles de secrets</h2>
    <p class="route-intro">Chaque chiffre a tenu jusqu'à ce que quelqu'un trouve la faille, et chaque faille a fait naître un chiffre plus solide. Les dossiers ouverts sont en couleur.</p>
    ${frise()}
    <p class="chrono-legende"><span class="ouvert">Dossier ouvert</span><span class="avenir">À venir</span></p>
  </section>
  <section aria-labelledby="t-escales">
    <h2 id="t-escales" class="sr">Les dossiers</h2>
    ${PARCOURS.filter(ep => ep.chapitres.length).map(ep => `<h3 class="ep-titre ep-${ep.id}"><span>${h(ep.titre)}</span> ${h(ep.sous)}</h3>
    <ol class="escales">${ep.chapitres.map(c => {
      const a = avancement(c), s = etoilesChap(c);
      return `<li class="ep-${ep.id} ${a.fini ? "fait" : ""}"><a href="#/c/${c.id}/${premierAFaire(c)}">
        <span class="quand"><span class="epoque">Dossier ${c.num}</span><span class="date">${dateNb(c.date)}</span><span class="lieu">${h(c.lieu)}</span></span>
        <span class="quoi"><strong>${h(c.titre)}</strong><span class="accroche">${h(c.accroche)}</span>
          <span class="etat">${a.f > 0 ? `${a.f} étape${a.f > 1 ? "s" : ""} sur ${a.n} ${etoilesHtml(s.n ? Math.max(1, Math.round(3 * s.n / s.max)) : 0)}` : `${a.n} étapes`}<span class="niveau">${h(c.niveau)}</span></span></span>
        <span class="vignette">${VIGNETTES[c.id] || ""}</span></a></li>`;
    }).join("")}</ol>`).join("")}
  </section>`;
  const maj = () => { const cle = +$("#h-cle").value; $(".hero .cle-val").textContent = cle; $(".hero .sortie").textContent = cz(nettoyer($("#h-msg").value), cle) || " "; };
  $("#h-cle").oninput = maj; $("#h-msg").oninput = maj; maj();
}
