"use strict";
/* Sésame — les manipulations des dossiers ajoutés après le pilote (scytale, Vigenère, Kasiski, masque jetable,
   RSA, empreintes, BB84, Shor…) et l'atelier d'échange entre élèves.
   Chargé après sesame.js : chaque manipulation s'inscrit dans MANIPS ou dans WIDGETS_QUIZ. */

const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const lettresSeules = s => nettoyer(s).replace(/[^A-Z]/g, "");
const reglerCurseur = (z, id, v) => { const x = $("#" + id, z); x.value = v; x.dispatchEvent(new Event("input")); };

/* ============================================================
   Scytale : le message est écrit en lignes le long du bâton, la bande déroulée se lit colonne par colonne
   ============================================================ */
const grilleScytale = (bande, k) => {
  const c = Math.ceil(bande.length / k);
  return `<table class="scy-grille"><tbody>${Array.from({ length: k }, (_, r) => `<tr>${Array.from({ length: c }, (_, i) => `<td>${bande[i * k + r] || ""}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
};
function widgetScytale(z) {
  z.innerHTML = `<div class="machine scy">
    <label for="scy-msg">Message à écrire sur le bâton</label><input id="scy-msg" class="saisie" type="text" maxlength="36" value="RENFORTS DEMAIN" autocomplete="off" spellcheck="false">
    <div class="reglage"><label for="scy-k">Lettres par tour de bâton</label><input id="scy-k" type="range" min="2" max="6" value="3"><output class="cle-val">3</output></div>
    <p class="sortie-label">Le message écrit sur le bâton, une ligne par face</p><div class="scy-vue"></div>
    <p class="sortie-label">La bande une fois déroulée</p><p class="chiffre sortie" aria-live="polite"></p></div>`;
  const maj = () => {
    const k = +$("#scy-k", z).value, bande = scytale(lettresSeules($("#scy-msg", z).value) || "A", k);
    $(".cle-val", z).textContent = k; $(".scy-vue", z).innerHTML = grilleScytale(bande, k); $(".sortie", z).textContent = bande;
  };
  $("#scy-k", z).oninput = maj; $("#scy-msg", z).oninput = maj; maj();
  return { reveler() {} };
}
function manipBaton(z, ok) {
  const bande = scytale(MESSAGE_SCYTALE.clair, MESSAGE_SCYTALE.cle); let rates = 0;
  z.innerHTML = `<div class="machine scy">
    <p class="sortie-label">Bande interceptée</p><p class="chiffre intercepte">${bande}</p>
    <div class="reglage"><label for="bat-k">Lettres par tour de bâton</label><input id="bat-k" type="range" min="2" max="9" value="2"><output class="cle-val">2</output></div>
    <p class="sortie-label">Ce qu'on lit sur un bâton de cette taille</p><div class="scy-vue" aria-live="polite"></div>
    <div class="actions"><button class="btn" id="bat-ok">Ce texte est lisible</button></div><p class="retour-qcm" aria-live="polite"></p></div>`;
  const maj = () => { const k = +$("#bat-k", z).value; $(".cle-val", z).textContent = k; $(".scy-vue", z).innerHTML = grilleScytale(bande, k); $(".retour-qcm", z).textContent = ""; };
  $("#bat-k", z).oninput = maj;
  $("#bat-ok", z).onclick = () => {
    if (+$("#bat-k", z).value === MESSAGE_SCYTALE.cle) { $$("button, input", z).forEach(b => b.disabled = true); ok(Math.max(1, 3 - rates)); }
    else { rates++; $(".retour-qcm", z).textContent = "Lis les lignes de gauche à droite, l'une après l'autre : cela ne donne pas encore une phrase."; }
  };
  maj();
}

/* ============================================================
   Vigenère : une lettre de la clé par lettre du message
   ============================================================ */
function widgetVigenere(z) {
  z.innerHTML = `<div class="machine vig">
    <label for="vig-msg">Message</label><input id="vig-msg" class="saisie" type="text" maxlength="26" value="PARIS" autocomplete="off" spellcheck="false">
    <label for="vig-cle">Mot-clé</label><input id="vig-cle" class="saisie" type="text" maxlength="10" value="ROI" autocomplete="off" spellcheck="false">
    <div class="c-defile"><table class="vig-table"><tbody></tbody></table></div>
    <p class="sortie-label">Message chiffré</p><p class="chiffre sortie" aria-live="polite"></p></div>`;
  const maj = () => {
    const m = lettresSeules($("#vig-msg", z).value), k = lettresSeules($("#vig-cle", z).value) || "A", c = vig(m, k);
    const ligne = (nom, f, cl) => `<tr class="${cl}"><th scope="row">${nom}</th>${[...m].map((x, j) => `<td>${f(x, j)}</td>`).join("")}</tr>`;
    $("tbody", z).innerHTML = ligne("Clair", x => x, "") + ligne("Clé", (x, j) => k[j % k.length], "v-cle") + ligne("Décalage", (x, j) => k.charCodeAt(j % k.length) - 65, "v-dec") + ligne("Chiffré", (x, j) => c[j], "v-chi");
    $(".sortie", z).textContent = c || " ";
  };
  $("#vig-msg", z).oninput = maj; $("#vig-cle", z).oninput = maj; maj();
  return { reveler() {} };
}

/* Kasiski : les répétitions donnent la longueur de la clé, puis chaque colonne se casse comme un César. */
function manipKasiski(z, ok) {
  const cle = MESSAGE_KASISKI.cle, L = cle.length, chiffre = lettresSeules(vig(MESSAGE_KASISKI.clair, cle));
  const pos = {};
  for (let i = 0; i + 3 <= chiffre.length; i++) (pos[chiffre.substr(i, 3)] = pos[chiffre.substr(i, 3)] || []).push(i);
  const repetes = Object.entries(pos).filter(([, p]) => p.length > 1).sort((a, b) => b[1].length - a[1].length || a[1][0] - b[1][0]).slice(0, 4);
  const vedette = repetes[0], marque = new Set(vedette[1].flatMap(p => [p, p + 1, p + 2]));
  const essai = Array(L).fill(0); let rates = 0;
  z.innerHTML = `<div class="machine kas">
    <p class="sortie-label">Message intercepté (${chiffre.length} lettres, regroupées par cinq)</p>
    <p class="kas-texte">${[...chiffre].map((c, i) => `${i && i % 5 === 0 ? " " : ""}${marque.has(i) ? `<mark>${c}</mark>` : c}`).join("")}</p>
    <h3>Les répétitions</h3>
    <ul class="kas-rep">${repetes.map(([s, p]) => `<li><b>${s}</b> revient aux positions ${p.map(x => x + 1).join(", ")} : écart${p.length > 2 ? "s" : ""} de ${p.slice(1).map((x, j) => x - p[j]).join(" et ")}</li>`).join("")}</ul>
    <div class="kas-q1"><p><strong>Étape 1.</strong> Tous ces écarts sont des multiples d'un même nombre. Quelle est la longueur probable de la clé ?</p>
      <div class="kas-long">${[2, 3, 4, 5, 6, 7, 8].map(n => `<button class="btn secondaire" data-n="${n}">${n}</button>`).join("")}</div><p class="retour-qcm" aria-live="polite"></p></div>
    <div class="kas-q2" hidden><p><strong>Étape 2.</strong> La clé a ${L} lettres : le message est donc ${L} chiffres de César entrelacés. Pour chaque lettre de la clé, voici la lettre la plus fréquente de sa colonne. Elle cache sans doute un E. Règle chaque lettre de la clé.</p>
      <div class="kas-cols"></div>
      <p class="sortie-label">Début du message avec cette clé</p><p class="chiffre sortie kas-clair" aria-live="polite"></p>
      <div class="actions"><button class="btn" id="kas-ok">Ce texte est lisible</button></div><p class="retour-qcm" aria-live="polite"></p></div></div>`;
  $$(".kas-long button", z).forEach(b => b.onclick = () => {
    if (+b.dataset.n === L) { $$(".kas-long button", z).forEach(x => x.disabled = true); b.classList.add("choisi"); $(".kas-q1 .retour-qcm", z).textContent = ""; $(".kas-q2", z).hidden = false; maj(); }
    else { rates++; b.disabled = true; $(".kas-q1 .retour-qcm", z).textContent = `Les écarts ne sont pas tous des multiples de ${b.dataset.n}. Cherche le plus grand nombre qui les divise tous.`; }
  });
  const frequente = j => { const m = {}; for (let i = j; i < chiffre.length; i += L) m[chiffre[i]] = (m[chiffre[i]] || 0) + 1; return Object.keys(m).sort((a, b) => m[b] - m[a])[0]; };
  const maj = () => {
    $(".kas-cols", z).innerHTML = essai.map((d, j) => `<div class="kas-col"><span class="kas-n">Lettre ${j + 1} de la clé</span><span class="kas-f">Plus fréquente : <b>${frequente(j)}</b></span>
      <span class="kas-regl"><button data-j="${j}" data-d="-1" aria-label="Lettre ${j + 1} de la clé, précédente">−</button><output>${ALPHABET[d]}</output><button data-j="${j}" data-d="1" aria-label="Lettre ${j + 1} de la clé, suivante">+</button></span>
      <span class="kas-e">${frequente(j)} donnerait ${cz(frequente(j), -d)}</span></div>`).join("");
    $$(".kas-regl button", z).forEach(b => b.onclick = () => { const j = +b.dataset.j; essai[j] = (essai[j] + +b.dataset.d + 26) % 26; maj(); $(`.kas-regl button[data-j="${j}"][data-d="${b.dataset.d}"]`, z).focus(); });
    $(".kas-clair", z).textContent = vig(chiffre.slice(0, 60), essai.map(d => ALPHABET[d]).join(""), -1).replace(/(.{5})/g, "$1 ");
    $(".kas-q2 .retour-qcm", z).textContent = "";
  };
  $("#kas-ok", z).onclick = () => {
    if (essai.map(d => ALPHABET[d]).join("") === cle) { $$("button", z).forEach(b => b.disabled = true); $(".kas-clair", z).textContent = MESSAGE_KASISKI.clair.slice(0, 96) + "…"; ok(Math.max(1, 3 - rates)); }
    else { rates++; $(".kas-q2 .retour-qcm", z).textContent = "Pas encore : on ne lit pas du français. Dans chaque colonne, fais en sorte que la lettre la plus fréquente donne un E."; }
  };
}

/* ============================================================
   Télégramme Zimmermann : un code remplace des mots entiers par des groupes de chiffres
   ============================================================ */
function widgetTelegramme(z) {
  const T = TELEGRAMME;
  z.innerHTML = `<div class="machine tele">
    <p class="sortie-label">Télégramme intercepté. Clique sur un groupe pour le chercher dans le carnet.</p>
    <div class="tele-groupes">${T.groupes.map((g, k) => `<button data-k="${k}">${g}</button>`).join("")}</div>
    <p class="tele-sens" aria-live="polite">Choisis un groupe.</p>
    <p class="sortie-label">Ce que tu as décodé</p><p class="tele-clair"></p></div>`;
  const vus = new Set();
  const maj = () => $(".tele-clair", z).innerHTML = T.groupes.map((g, k) => vus.has(k) ? (T.carnet[g] ? `<b>${h(T.carnet[g])}</b>` : `<span class="inconnu">[${g} ?]</span>`) : `<span class="vide">·····</span>`).join(" ");
  $$(".tele-groupes button", z).forEach(b => b.onclick = () => {
    const k = +b.dataset.k, g = T.groupes[k]; vus.add(k); b.classList.add(T.carnet[g] ? "lu" : "inconnu");
    $(".tele-sens", z).textContent = T.carnet[g] ? `${g} : « ${T.carnet[g]} »` : `${g} : ce groupe ne figure pas encore dans le carnet reconstitué.`; maj();
  });
  maj();
  return { reveler() {} };
}

/* ============================================================
   Masque jetable : une clé aussi longue que le message, tirée au hasard, utilisée une seule fois
   ============================================================ */
const cleHasard = n => Array.from({ length: n }, () => ALPHABET[Math.floor(Math.random() * 26)]).join("");
function widgetMasque(z) {
  let cle = "";
  z.innerHTML = `<div class="machine vig">
    <label for="mq-msg">Message</label><input id="mq-msg" class="saisie" type="text" maxlength="20" value="RENDEZ VOUS" autocomplete="off" spellcheck="false">
    <div class="actions"><button class="btn secondaire" id="mq-cle">Tirer une nouvelle clé au hasard</button></div>
    <div class="c-defile"><table class="vig-table"><tbody></tbody></table></div>
    <p class="sortie-label">Message chiffré</p><p class="chiffre sortie" aria-live="polite"></p></div>`;
  const maj = neuf => {
    const m = lettresSeules($("#mq-msg", z).value); if (neuf || cle.length !== m.length) cle = cleHasard(m.length);
    const c = vig(m, cle || "A"), ligne = (nom, s, cl) => `<tr class="${cl}"><th scope="row">${nom}</th>${[...s].map(x => `<td>${x}</td>`).join("")}</tr>`;
    $("tbody", z).innerHTML = ligne("Clair", m, "") + ligne("Clé", cle, "v-cle") + ligne("Chiffré", c, "v-chi"); $(".sortie", z).textContent = c || " ";
  };
  $("#mq-msg", z).oninput = () => maj(false); $("#mq-cle", z).onclick = () => maj(true); maj(true);
  return { reveler() {} };
}
/* Avec un masque jetable, n'importe quel message de la bonne longueur est une solution possible. */
function manipAlibi(z, ok) {
  const chiffre = MESSAGE_MASQUE.chiffre, cibles = MESSAGE_MASQUE.cibles, faits = new Set();
  z.innerHTML = `<div class="machine vig">
    <p class="sortie-label">Message intercepté</p><p class="chiffre intercepte">${chiffre}</p>
    <label for="al-msg">Le message clair que tu veux obtenir (${chiffre.length} lettres)</label><input id="al-msg" class="saisie" type="text" maxlength="${chiffre.length}" autocomplete="off" spellcheck="false">
    <p class="sortie-label">La clé qui donne ce message</p><p class="chiffre sortie" aria-live="polite"> </p>
    <ul class="al-cibles">${cibles.map(c => `<li data-c="${c}">Fais dire au message : <b>${c}</b></li>`).join("")}</ul></div>`;
  $("#al-msg", z).oninput = () => {
    const m = lettresSeules($("#al-msg", z).value);
    $(".sortie", z).textContent = m.length === chiffre.length ? [...chiffre].map((c, j) => ALPHABET[(c.charCodeAt(0) - m.charCodeAt(j) + 26) % 26]).join("") : `Il faut ${chiffre.length} lettres.`;
    if (cibles.includes(m)) { faits.add(m); $(`.al-cibles li[data-c="${m}"]`, z).classList.add("fait"); }
    if (faits.size === cibles.length) { $("#al-msg", z).disabled = true; ok(3); }
  };
}

/* ============================================================
   Code navajo : un lexique, pas un calcul
   ============================================================ */
function widgetNavajo(z) {
  const N = NAVAJO, table = (titre, lignes) => `<div><h3>${titre}</h3><table class="donnees nav-table"><tbody>${lignes.map(([a, b, c]) => `<tr><th scope="row">${h(a)}</th><td>${h(b)}</td><td>${h(c)}</td></tr>`).join("")}</tbody></table></div>`;
  z.innerHTML = `<div class="machine nav"><div class="nav-cols">${table("Vocabulaire militaire", N.mots)}${table("Alphabet, pour épeler", N.lettres)}</div></div>`;
  return { reveler() {} };
}

/* ============================================================
   RSA jouet : n = 33, e = 3 (clé publique), d = 7 (clé privée)
   ============================================================ */
function widgetRsa(z) {
  const N = 33, E = 3, D = 7;
  z.innerHTML = `<div class="machine echange">
    <p class="ech-public">Clé publique de Bob, affichée à la vue de tous : <span class="m">n</span> = <b>${N}</b> et <span class="m">e</span> = <b>${E}</b></p>
    <div class="ech-cols">
      <div class="ech-col"><h3>Alice chiffre</h3><div class="reglage"><label for="rsa-m">Son message <span class="m">m</span></label><input id="rsa-m" type="range" min="2" max="31" value="5"><output class="cle-val" id="rsa-vm"></output></div>
        <p>Elle envoie <span class="calc" id="rsa-c"></span></p></div>
      <div class="ech-col"><h3>Bob déchiffre</h3><p>Sa clé privée, connue de lui seul : <span class="m">d</span> = <b>${D}</b></p><p>Il calcule <span class="calc" id="rsa-r"></span></p></div>
    </div><p class="ech-eve" aria-live="polite"></p></div>`;
  const maj = () => {
    const m = +$("#rsa-m", z).value, c = puissanceMod(m, E, N);
    $("#rsa-vm", z).textContent = m; $("#rsa-c", z).innerHTML = `${m}<sup>${E}</sup> mod ${N} = <b>${c}</b>`;
    $("#rsa-r", z).innerHTML = `${c}<sup>${D}</sup> mod ${N} = <b class="secret">${puissanceMod(c, D, N)}</b>`;
    $(".ech-eve", z).textContent = `Ève voit passer ${c}. Elle connaît ${N} et ${E}, mais pas ${D}.`;
  };
  $("#rsa-m", z).oninput = maj; maj();
  return { reveler() {} };
}
function manipFacteurs(z, ok) {
  const liste = [77, 221, 2021, 8633]; let k = 0, rates = 0;
  z.innerHTML = `<div class="machine fact"><p class="fact-n"></p>
    <form class="rep-ligne" autocomplete="off"><label for="f-p" class="sr">Premier facteur</label><input id="f-p" class="saisie court" inputmode="numeric"><span aria-hidden="true">×</span><label for="f-q" class="sr">Second facteur</label><input id="f-q" class="saisie court" inputmode="numeric"><button class="btn" type="submit">Valider</button></form>
    <p class="retour-qcm" aria-live="polite"></p><ol class="fact-faits"></ol></div>`;
  const poser = () => { $(".fact-n", z).innerHTML = `Nombre ${k + 1} sur ${liste.length} : retrouve les deux nombres premiers dont le produit vaut <b class="cible">${liste[k]}</b>`; $("#f-p", z).value = $("#f-q", z).value = ""; $("#f-p", z).focus({ preventScroll: true }); };
  $("form", z).onsubmit = ev => {
    ev.preventDefault(); const p = +$("#f-p", z).value, q = +$("#f-q", z).value, n = liste[k];
    if (p > 1 && q > 1 && p * q === n) {
      $(".fact-faits", z).insertAdjacentHTML("beforeend", `<li>${n} = ${Math.min(p, q)} × ${Math.max(p, q)}</li>`); $(".retour-qcm", z).textContent = ""; k++;
      if (k === liste.length) { $$("input, button", z).forEach(x => x.disabled = true); $(".fact-n", z).textContent = "Quatre clés cassées. Tu as senti que chaque nombre demandait plus d'essais que le précédent."; ok(Math.max(1, 3 - Math.floor(rates / 3))); } else poser();
    } else { rates++; $(".retour-qcm", z).textContent = p * q === n ? "Il faut deux nombres plus grands que 1." : `${p || "?"} × ${q || "?"} ne fait pas ${n}. Essaie de diviser ${n} par les nombres premiers, l'un après l'autre.`; }
  };
  poser();
}

/* ============================================================
   Empreintes : une empreinte naïve (somme des rangs) à côté de SHA-256
   ============================================================ */
async function sha256(texte) {
  if (!(window.crypto && crypto.subtle)) return null;
  const o = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texte));
  return [...new Uint8Array(o)].map(b => b.toString(16).padStart(2, "0")).join("");
}
const afficherSha = async (texte, cible) => { const s = await sha256(texte); cible.textContent = s ? s.replace(/(.{16})/g, "$1 ").trim() : "SHA-256 n'est pas disponible dans ce navigateur."; };
function widgetEmpreinte(z) {
  z.innerHTML = `<div class="machine emp">
    <label for="emp-msg">Message</label><input id="emp-msg" class="saisie libre" type="text" maxlength="60" value="BAC" autocomplete="off" spellcheck="false">
    <p class="sortie-label">Empreinte naïve : somme des rangs des lettres, dont on garde les deux derniers chiffres</p><p class="chiffre sortie emp-naive" aria-live="polite"></p>
    <p class="sortie-label">Empreinte SHA-256, celle qu'utilisent les navigateurs</p><p class="emp-sha" aria-live="polite"></p></div>`;
  const maj = () => { const t = $("#emp-msg", z).value; $(".emp-naive", z).textContent = empreinteNaive(t); afficherSha(t, $(".emp-sha", z)); };
  $("#emp-msg", z).oninput = maj; maj();
  return { reveler() {} };
}
function manipCollision(z, ok) {
  const origine = MESSAGE_EMPREINTE;
  z.innerHTML = `<div class="machine emp">
    <p class="sortie-label">Reconnaissance de dette signée par Tom</p><p class="chiffre intercepte">${origine}</p>
    <p>Empreinte naïve : <b class="cible">${empreinteNaive(origine)}</b></p>
    <label for="col-msg">Ton faux message</label><input id="col-msg" class="saisie" type="text" maxlength="40" autocomplete="off" spellcheck="false">
    <p>Son empreinte : <b class="cible col-e"></b></p><p class="retour-qcm" aria-live="polite"></p></div>`;
  $("#col-msg", z).oninput = () => {
    const t = nettoyer($("#col-msg", z).value).trim(), e = empreinteNaive(t); $(".col-e", z).textContent = t ? e : "";
    if (t && t !== origine && lettresSeules(t).length >= 8 && e === empreinteNaive(origine)) { $("#col-msg", z).disabled = true; $(".retour-qcm", z).textContent = "Même empreinte, autre message : la signature de Tom vaut aussi pour ton faux."; ok(3); }
    else $(".retour-qcm", z).textContent = t === origine ? "C'est le message d'origine. Il en faut un autre." : "";
  };
}
/* Signature jouet : empreinte réduite modulo 33, signée avec d = 7, vérifiée avec e = 3. */
function widgetSignature(z) {
  const N = 33, E = 3, D = 7, emp = t => [...lettresSeules(t)].reduce((a, c) => a + c.charCodeAt(0) - 64, 0) % N;
  z.innerHTML = `<div class="machine echange"><div class="ech-cols">
    <div class="ech-col"><h3>Alice signe</h3><label for="sig-m">Son message</label><input id="sig-m" class="saisie" type="text" maxlength="24" value="RDV A MIDI" autocomplete="off" spellcheck="false">
      <p>Empreinte : <b id="sig-h"></b></p><p>Signature, avec sa clé privée : <span class="calc" id="sig-s"></span></p></div>
    <div class="ech-col"><h3>Bob vérifie</h3><label for="sig-r">Le message qu'il reçoit</label><input id="sig-r" class="saisie" type="text" maxlength="24" value="RDV A MIDI" autocomplete="off" spellcheck="false">
      <p>Empreinte de ce qu'il a reçu : <b id="sig-hr"></b></p><p>Signature ouverte avec la clé publique d'Alice : <span class="calc" id="sig-v"></span></p><p class="sig-verdict" aria-live="polite"></p></div></div></div>`;
  const maj = () => {
    const hA = emp($("#sig-m", z).value), s = puissanceMod(hA, D, N), hB = emp($("#sig-r", z).value), v = puissanceMod(s, E, N);
    $("#sig-h", z).textContent = hA; $("#sig-s", z).innerHTML = `${hA}<sup>${D}</sup> mod ${N} = <b>${s}</b>`;
    $("#sig-hr", z).textContent = hB; $("#sig-v", z).innerHTML = `${s}<sup>${E}</sup> mod ${N} = <b>${v}</b>`;
    $(".sig-verdict", z).textContent = v === hB ? "Les deux nombres sont égaux : signature valable." : "Les deux nombres diffèrent : le message a été modifié, ou il ne vient pas d'Alice."; $(".sig-verdict", z).dataset.v = v === hB ? "oui" : "non";
  };
  $("#sig-m", z).oninput = maj; $("#sig-r", z).oninput = maj; maj();
  return { reveler() {} };
}

/* ============================================================
   Le cadenas du navigateur : les quatre temps d'une connexion HTTPS
   ============================================================ */
function widgetCadenas(z) {
  const E = ETAPES_HTTPS; let k = 0;
  z.innerHTML = `<div class="machine cad">
    <ol class="cad-pas">${E.map((e, j) => `<li data-j="${j}"><span>${j + 1}</span>${h(e.nom)}</li>`).join("")}</ol>
    <div class="cad-scene" aria-live="polite"></div>
    <div class="reglage"><button class="btn secondaire" id="cad-moins">Étape précédente</button><button class="btn" id="cad-plus">Étape suivante</button></div></div>`;
  const maj = () => {
    const e = E[k];
    $$(".cad-pas li", z).forEach(li => li.classList.toggle("ici", +li.dataset.j === k));
    $(".cad-scene", z).innerHTML = `<div class="cad-ligne"><span class="cad-qui">Ton navigateur</span><span class="cad-fleche ${e.sens}">${h(e.passe)}</span><span class="cad-qui">Le site</span></div>
      <p>${h(e.texte)}</p><p class="cad-outil">Outil utilisé : <b>${h(e.outil)}</b></p>`;
    $("#cad-moins", z).disabled = k === 0; $("#cad-plus", z).disabled = k === E.length - 1;
  };
  $("#cad-moins", z).onclick = () => { k--; maj(); }; $("#cad-plus", z).onclick = () => { k++; maj(); };
  maj();
  return { reveler() {} };
}

/* ============================================================
   BB84 : des photons polarisés, deux bases, et une espionne qui laisse des traces
   ============================================================ */
function tirerBB84(n, eve) {
  const pile = () => Math.random() < .5 ? 1 : 0, lignes = [];
  for (let i = 0; i < n; i++) {
    const bit = pile(), bA = pile(), bB = pile(); let etat = bit, base = bA, bE = null;
    if (eve) { bE = pile(); if (bE !== base) etat = pile(); base = bE; }
    const mesure = bB === base ? etat : pile();
    lignes.push({ bit, bA, bE, bB, mesure, garde: bA === bB, erreur: bA === bB && mesure !== bit });
  }
  return lignes;
}
function widgetBB84(z) {
  const B = ["+", "×"];
  z.innerHTML = `<div class="machine bb">
    <div class="reglage"><label class="en-ligne"><input type="checkbox" id="bb-eve"> Ève intercepte les photons</label><button class="btn" id="bb-16">Envoyer 16 photons</button><button class="btn secondaire" id="bb-400">Envoyer 1 000 photons</button></div>
    <div class="c-defile"><table class="bb-table"><tbody></tbody></table></div>
    <p class="bb-bilan" aria-live="polite"></p></div>`;
  const envoyer = n => {
    const eve = $("#bb-eve", z).checked, L = tirerBB84(n, eve), gardes = L.filter(x => x.garde), err = gardes.filter(x => x.erreur).length;
    const ligne = (nom, f, cl = "") => `<tr class="${cl}"><th scope="row">${nom}</th>${L.map(x => `<td class="${x.garde ? "garde" : ""} ${x.erreur ? "erreur" : ""}">${f(x)}</td>`).join("")}</tr>`;
    $("tbody", z).innerHTML = n > 16 ? "" : ligne("Bit d'Alice", x => x.bit) + ligne("Base d'Alice", x => B[x.bA]) + (eve ? ligne("Base d'Ève", x => B[x.bE], "bb-eve") : "") + ligne("Base de Bob", x => B[x.bB]) + ligne("Mesure de Bob", x => x.mesure) + ligne("Bit gardé", x => x.garde ? (x.erreur ? "✗" : "✓") : "", "bb-garde");
    $(".bb-bilan", z).textContent = `${n} photons envoyés${eve ? ", Ève à l'écoute" : ", personne sur la ligne"}. Bases identiques : ${gardes.length} bits gardés. Parmi eux, ${err} erreur${err > 1 ? "s" : ""}${gardes.length ? `, soit ${Math.round(100 * err / gardes.length)} %` : ""}.`;
  };
  $("#bb-16", z).onclick = () => envoyer(16); $("#bb-400", z).onclick = () => envoyer(1000); envoyer(16);
  return { reveler() {} };
}

/* ============================================================
   Shor : la période de a^x mod N donne les facteurs de N
   ============================================================ */
function manipPeriode(z, ok) {
  const cas = [15, 21]; let k = 0, a = 0, x = 0, v = 1;
  z.innerHTML = `<div class="machine shor"><p class="shor-n"></p><div class="shor-a"></div>
    <p class="shor-suite" aria-live="polite"></p>
    <div class="actions"><button class="btn" id="sh-plus" disabled>Puissance suivante</button></div>
    <p class="shor-bilan" aria-live="polite"></p><ol class="fact-faits"></ol></div>`;
  const poser = () => {
    const N = cas[k]; a = 0;
    $(".shor-n", z).innerHTML = `Nombre ${k + 1} sur ${cas.length} : factorise <b class="cible">${N}</b>. Choisis un nombre <span class="m">a</span>, puis calcule ses puissances modulo ${N} jusqu'à retomber sur 1.`;
    $(".shor-a", z).innerHTML = Array.from({ length: N - 3 }, (_, j) => j + 2).filter(c => pgcd(c, N) === 1).map(c => `<button class="btn secondaire" data-a="${c}">${c}</button>`).join("");
    $(".shor-suite", z).textContent = ""; $(".shor-bilan", z).textContent = ""; $("#sh-plus", z).disabled = true;
    $$(".shor-a button", z).forEach(b => b.onclick = () => { a = +b.dataset.a; x = 0; v = 1; $$(".shor-a button", z).forEach(y => y.classList.toggle("choisi", y === b)); $(".shor-suite", z).textContent = ""; $(".shor-bilan", z).textContent = ""; $("#sh-plus", z).disabled = false; $("#sh-plus", z).focus({ preventScroll: true }); });
  };
  $("#sh-plus", z).onclick = () => {
    const N = cas[k]; x++; v = v * a % N;
    $(".shor-suite", z).insertAdjacentHTML("beforeend", `<span class="${v === 1 ? "un" : ""}">${a}<sup>${x}</sup> → ${v}</span> `);
    if (v !== 1) return;
    $("#sh-plus", z).disabled = true;
    const moitie = x % 2 === 0 ? puissanceMod(a, x / 2, N) : 0;
    if (x % 2) $(".shor-bilan", z).textContent = `La période vaut ${x}. Elle est impaire : ce nombre a ne donne rien. Choisis-en un autre.`;
    else if (moitie === N - 1) $(".shor-bilan", z).textContent = `La période vaut ${x}, mais ${a} puissance ${x / 2} donne ${N - 1}, c'est-à-dire −1 modulo ${N} : ce nombre a ne donne rien. Choisis-en un autre.`;
    else {
      const p = pgcd(moitie - 1, N), q = pgcd(moitie + 1, N);
      $(".shor-bilan", z).innerHTML = `La période vaut <b>${x}</b>. On prend la moitié : ${a}<sup>${x / 2}</sup> mod ${N} = <b>${moitie}</b>. Puis pgcd(${moitie} − 1, ${N}) = <b class="secret">${p}</b> et pgcd(${moitie} + 1, ${N}) = <b class="secret">${q}</b>.`;
      $(".fact-faits", z).insertAdjacentHTML("beforeend", `<li>${N} = ${Math.min(p, q)} × ${Math.max(p, q)}, trouvé avec a = ${a} et une période de ${x}</li>`);
      k++; if (k === cas.length) { $$(".shor-a button", z).forEach(b => b.disabled = true); ok(3); } else setTimeout(poser, calme() ? 0 : 1800);
    }
  };
  poser();
}

/* Faut-il s'inquiéter dès maintenant ? La règle de Mosca compare trois durées. */
function widgetMosca(z) {
  z.innerHTML = `<div class="machine mosca">
    ${[["x", "Durée pendant laquelle le secret doit tenir", 1, 60, 20], ["y", "Durée nécessaire pour changer de chiffrement", 1, 20, 8], ["z", "Délai avant un ordinateur quantique capable de casser RSA", 3, 40, 15]].map(([id, nom, min, max, val]) => `<div class="reglage"><label for="mo-${id}">${nom}</label><input id="mo-${id}" type="range" min="${min}" max="${max}" value="${val}"><output class="cle-val" id="mo-v${id}"></output><span>ans</span></div>`).join("")}
    <div class="mo-barres" aria-hidden="true"><div class="mo-xy"><i class="mo-y"></i><i class="mo-x"></i></div><div class="mo-z"><i></i></div></div>
    <p class="mo-verdict" aria-live="polite"></p></div>`;
  const maj = () => {
    const [x, y, q] = ["x", "y", "z"].map(id => { const v = +$("#mo-" + id, z).value; $("#mo-v" + id, z).textContent = v; return v; }), M = 80;
    $(".mo-y", z).style.width = 100 * y / M + "%"; $(".mo-x", z).style.width = 100 * x / M + "%"; $(".mo-z i", z).style.width = 100 * q / M + "%";
    $(".mo-verdict", z).textContent = x + y > q ? `${y} + ${x} = ${x + y} ans, c'est plus que ${q} ans : des données chiffrées aujourd'hui seront lisibles alors qu'elles devraient encore être secrètes. Il faut changer dès maintenant.` : `${y} + ${x} = ${x + y} ans, c'est moins que ${q} ans : le secret aura expiré avant que la machine n'existe.`;
    $(".mo-verdict", z).dataset.v = x + y > q ? "non" : "oui";
  };
  $$("input", z).forEach(i => i.oninput = maj); maj();
  return { reveler() {} };
}

Object.assign(MANIPS, { baton: manipBaton, symboles: (z, ok) => manipFrequences(z, ok, MESSAGE_STUART), kasiski: manipKasiski, alibi: manipAlibi, facteurs: manipFacteurs, collision: manipCollision, periode: manipPeriode });
Object.assign(WIDGETS_QUIZ, { scytale: widgetScytale, vigenere: widgetVigenere, telegramme: widgetTelegramme, masque: widgetMasque, navajo: widgetNavajo, rsa: widgetRsa, empreinte: widgetEmpreinte, signature: widgetSignature, cadenas: widgetCadenas, bb84: widgetBB84, mosca: widgetMosca });

/* ============================================================
   Atelier : chiffrer pour un camarade, fabriquer une clé à deux
   ============================================================ */
const METHODES = {
  cesar: { nom: "César", cle: "Un nombre de 1 à 25", ok: k => /^\d+$/.test(k) && +k >= 1 && +k <= 25, chiffrer: (t, k) => cz(t, +k), dechiffrer: (t, k) => cz(t, -k) },
  vigenere: { nom: "Vigenère", cle: "Un mot", ok: k => lettresSeules(k).length >= 2, chiffrer: (t, k) => vig(t, lettresSeules(k)), dechiffrer: (t, k) => vig(t, lettresSeules(k), -1) },
  scytale: { nom: "Scytale", cle: "Lettres par tour, de 2 à 9", ok: k => /^\d+$/.test(k) && +k >= 2 && +k <= 9, chiffrer: (t, k) => scytale(t, +k), dechiffrer: (t, k) => descytale(lettresSeules(t), +k) },
};
function vueAtelier() {
  const P = 467, G = 2;
  app().innerHTML = `<section class="page atelier">
    <header class="pb-tete"><h1>Atelier</h1><p>Ici, tu passes à la pratique avec quelqu'un d'autre. Mets-toi d'accord sur une méthode et sur une clé avec un camarade, chiffre ton message, envoie-le-lui comme tu veux. Rien ne quitte ton navigateur : le site ne transmet aucun message.</p></header>
    <div class="machine at-chiffre">
      <h2>Chiffrer ou déchiffrer</h2>
      <div class="at-ligne"><div><label for="at-meth">Méthode</label><select id="at-meth">${Object.entries(METHODES).map(([id, m]) => `<option value="${id}">${m.nom}</option>`).join("")}</select></div>
        <div><label for="at-cle">Clé</label><input id="at-cle" class="saisie" type="text" maxlength="16" autocomplete="off" spellcheck="false"><span class="muet at-aide"></span></div></div>
      <label for="at-txt">Ton texte</label><textarea id="at-txt" class="reponse large" rows="3" maxlength="400" spellcheck="false"></textarea>
      <div class="actions"><button class="btn" id="at-ch">Chiffrer</button><button class="btn secondaire" id="at-de">Déchiffrer</button><button class="btn secondaire" id="at-copie" disabled>Copier le résultat</button></div>
      <p class="sortie-label">Résultat</p><p class="chiffre sortie at-sortie" aria-live="polite"> </p><p class="retour-qcm" aria-live="polite"></p>
    </div>
    <div class="machine at-cle">
      <h2>Fabriquer une clé à deux, à voix haute</h2>
      <p>C'est l'échange de Diffie et Hellman, avec <span class="m">p</span> = ${P} et <span class="m">g</span> = ${G}. Toute la classe peut écouter : seuls vous deux connaîtrez la clé.</p>
      <ol class="at-pas">
        <li><label for="at-s">Choisis un nombre secret entre 2 et 465. Ne le dis à personne.</label><input id="at-s" class="saisie court" inputmode="numeric" autocomplete="off"></li>
        <li>Annonce ce nombre à ton camarade : <b class="cible" id="at-pub">…</b></li>
        <li><label for="at-r">Écris le nombre qu'il t'annonce.</label><input id="at-r" class="saisie court" inputmode="numeric" autocomplete="off"></li>
        <li>Votre secret commun : <b class="secret" id="at-com">…</b> <span id="at-mot"></span></li>
      </ol>
    </div>
    <aside class="contexte"><strong>La règle du jeu.</strong> Casser le message d'un camarade qui te lance un défi, c'est de la cryptanalyse. Lire les messages de quelqu'un qui ne t'a rien demandé, ou entrer dans un système sans autorisation, c'est un délit, quelle que soit la méthode.</aside>
  </section>`;
  const meth = () => METHODES[$("#at-meth").value];
  const majAide = () => $(".at-aide").textContent = meth().cle;
  const lancer = sens => {
    const m = meth(), k = $("#at-cle").value.trim(), t = nettoyer($("#at-txt").value);
    if (!m.ok(k)) { $(".atelier .retour-qcm").textContent = `Clé attendue pour ${m.nom} : ${m.cle.toLowerCase()}.`; return; }
    if (!lettresSeules(t)) { $(".atelier .retour-qcm").textContent = "Écris d'abord un texte."; return; }
    $(".atelier .retour-qcm").textContent = ""; $(".at-sortie").textContent = m[sens](t, k); $("#at-copie").disabled = false;
  };
  $("#at-meth").onchange = majAide; majAide();
  $("#at-ch").onclick = () => lancer("chiffrer"); $("#at-de").onclick = () => lancer("dechiffrer");
  $("#at-copie").onclick = () => { const t = $(".at-sortie").textContent; if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast("Résultat copié"), () => toast("Copie impossible : sélectionne le texte à la main.", "erreur")); else toast("Copie impossible : sélectionne le texte à la main.", "erreur"); };
  const majCle = () => {
    const s = +$("#at-s").value, r = +$("#at-r").value, sOk = Number.isInteger(s) && s >= 2 && s <= P - 2, rOk = Number.isInteger(r) && r >= 1 && r <= P - 1;
    $("#at-pub").textContent = sOk ? puissanceMod(G, s, P) : "…";
    if (sOk && rOk) { const c = puissanceMod(r, s, P), mot = [Math.floor(c / 26) % 26, c % 26, (c * 7 + 3) % 26].map(x => ALPHABET[x]).join(""); $("#at-com").textContent = c; $("#at-mot").textContent = `Comme clé de César, prenez ${c % 25 + 1}. Comme mot-clé de Vigenère, prenez ${mot}.`; }
    else { $("#at-com").textContent = "…"; $("#at-mot").textContent = ""; }
  };
  $("#at-s").oninput = majCle; $("#at-r").oninput = majCle;
}

/* Vignettes de l'accueil pour les dossiers ajoutés après le pilote. */
{
  const svg = corps => `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true">${corps}</svg>`;
  Object.assign(VIGNETTES, {
    scytale: svg(`<rect x="12" y="46" width="96" height="28" rx="14" class="v2"/>${[28, 46, 64, 82].map(x => `<path d="M${x} 46l12 28" class="v1"/>`).join("")}<path d="M12 60h-6M108 60h6" class="v0"/>`),
    stuart: svg(`<path d="M30 92V44l14 14 16-24 16 24 14-14v48z" class="v2"/><path d="M30 92h60" class="v1"/><circle cx="60" cy="74" r="6" class="vp"/>`),
    vigenere: svg(`${[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<rect x="${24 + c * 19}" y="${24 + r * 19}" width="15" height="15" rx="2" class="${(r + c) % 4 === 0 ? "v2" : "v0"}"/>`).join("")).join("")}`),
    kasiski: svg(`<path d="M12 60h96" class="v0"/>${[24, 60, 96].map(x => `<rect x="${x - 9}" y="50" width="18" height="20" rx="3" class="v2"/>`).join("")}<path d="M24 44V30h36v14M60 44V30h36v14" class="v1"/>`),
    kerckhoffs: svg(`<rect x="30" y="54" width="60" height="44" rx="6" class="v2"/><path d="M42 54V40a18 18 0 0 1 36 0v14" class="v1"/><circle cx="60" cy="74" r="6" class="vp"/><path d="M60 78v10" class="v1"/>`),
    zimmermann: svg(`<rect x="16" y="30" width="88" height="60" rx="4" class="v0"/>${[44, 58, 72].map(y => `<path d="M28 ${y}h14M48 ${y}h14M68 ${y}h14M88 ${y}h6" class="v1"/>`).join("")}`),
    masque: svg(`<rect x="10" y="44" width="100" height="32" rx="3" class="v2"/>${[22, 36, 50, 64, 78, 92].map((x, k) => `<circle cx="${x}" cy="${k % 2 ? 54 : 66}" r="4" class="vn"/>`).join("")}<path d="M10 60h100" class="v0"/>`),
    navajo: svg(`<path d="M60 96V52" class="v1"/><path d="M40 52a20 20 0 0 1 40 0z" class="v2"/>${[18, 30, 42].map(r => `<path d="M${60 - r} ${34 - r / 3}a${r} ${r} 0 0 1 ${2 * r} 0" class="v0"/>`).join("")}`),
    rsa: svg(`<rect x="34" y="58" width="52" height="40" rx="6" class="v2"/><path d="M44 58V42a16 16 0 0 1 32 0" class="v1"/><circle cx="60" cy="78" r="6" class="vp"/>`),
    hachage: svg(`${[20, 32, 44, 56, 68].map((r, k) => `<path d="M${60 - r / 2} ${96 - k * 2}a${r / 2} ${r * .7} 0 0 1 ${r} 0" class="${k % 2 ? "v0" : "v1"}"/>`).join("")}`),
    https: svg(`<rect x="12" y="26" width="96" height="68" rx="8" class="v0"/><path d="M12 44h96" class="v0"/><rect x="50" y="62" width="20" height="16" rx="3" class="vp"/><path d="M54 62v-5a6 6 0 0 1 12 0v5" class="v1"/>`),
    bb84: svg(`<path d="M10 60h100" class="v0"/><circle cx="34" cy="60" r="12" class="v2"/><path d="M34 46v28" class="v1"/><circle cx="86" cy="60" r="12" class="v2"/><path d="M76 50l20 20" class="v1"/>`),
    shor: svg(`<path d="M10 60c8-30 17-30 25 0s17 30 25 0 17-30 25 0 17 30 25 0" class="v1"/><path d="M35 28v64M85 28v64" class="v0"/><circle cx="35" cy="60" r="4" class="vp"/><circle cx="85" cy="60" r="4" class="vp"/>`),
    pqc: svg(`${[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<circle cx="${22 + c * 24 + r * 6}" cy="${28 + r * 22}" r="3.5" class="vn"/>`).join("")).join("")}<circle cx="64" cy="62" r="5" class="vp"/><path d="M64 62L58 72" class="v1"/>`),
  });
}
