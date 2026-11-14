/* ============================================================
   SÉSAME — dossiers de l'Antiquité à 1945 (hors César et Enigma, qui sont dans contenu.js).
   Même format que contenu.js. L'assemblage des parties se fait à la fin de dossiers-modernes.js.
   ============================================================ */

/* ----- Outils ----- */
/* Vigenère : seules les lettres sont transformées, et seules elles font avancer la clé. sens = -1 pour déchiffrer. */
const vig = (texte, cle, sens = 1) => { let j = 0; return texte.replace(/[A-Z]/g, c => String.fromCharCode(65 + (c.charCodeAt(0) - 65 + sens * (cle.charCodeAt(j++ % cle.length) - 65) + 26) % 26)); };
/* Scytale à k lettres par tour : le message est écrit en k lignes, la bande se lit colonne par colonne. */
const scytale = (texte, k) => { const s = texte.replace(/[^A-Z]/g, ""), c = Math.ceil(s.length / k), p = s.padEnd(c * k, "X"); let o = ""; for (let i = 0; i < c; i++) for (let r = 0; r < k; r++) o += p[r * c + i]; return o; };
const descytale = (bande, k) => { const c = Math.ceil(bande.length / k); let o = ""; for (let r = 0; r < k; r++) for (let i = 0; i < c; i++) o += bande[i * k + r] || ""; return o; };

const MESSAGE_SCYTALE = { clair: "LESPERSESATTAQUERONTPARLAMERALAUBE", cle: 5 };
/* Texte inventé pour l'exercice, inspiré de la lettre de Marie Stuart du 17 juillet 1586. Les signes sont inventés eux aussi. */
const MESSAGE_STUART = {
  message: "A MES FIDELES AMIS. J APPROUVE VOTRE PROJET. QUE LES SIX GENTILSHOMMES SE TIENNENT PRETS. PREVENEZ MOI DES QUE TOUT SERA EN PLACE, AFIN QUE JE SOIS DELIVREE AVANT QUE LA NOUVELLE NE SE REPANDE. BRULEZ CETTE LETTRE APRES L AVOIR LUE.",
  glyphes: "φΔλΨπΣθαΩβξγΛδΞεΠζΓηΘμσΦωψ", connus: "EST" };
const MESSAGE_KASISKI = { cle: "NUIT",
  clair: "LE CHIFFRE DE VIGENERE RESISTE DEPUIS TROIS SIECLES. POURTANT LA CLE SE REPETE, ET CETTE REPETITION LAISSE DES TRACES. QUAND UN MEME MOT DU MESSAGE TOMBE SOUS LES MEMES LETTRES DE LA CLE, IL DONNE LES MEMES LETTRES CHIFFREES. LA DISTANCE ENTRE DEUX REPETITIONS EST UN MULTIPLE DE LA LONGUEUR DE LA CLE. IL NE RESTE PLUS QU A COMPTER LES LETTRES DE CHAQUE COLONNE POUR RETROUVER LA CLE LETTRE PAR LETTRE." };
/* Version très simplifiée du télégramme : seul le groupe 97556 (« Zimmermann ») est authentique, les autres numéros sont inventés. */
const TELEGRAMME = {
  groupes: ["21307", "64419", "08852", "53170", "53171", "40296", "77035", "91844", "30662", "15093", "62248", "97556"],
  carnet: { 21307: "Nous proposons", 64419: "au Mexique", "08852": "une alliance :", 53170: "faire la guerre ensemble,", 53171: "faire la paix ensemble.", 40296: "Soutien financier généreux.", 77035: "Le Mexique pourra reconquérir", 62248: "Signé :", 97556: "Zimmermann" } };
const MESSAGE_MASQUE = { chiffre: "QKZRMTA", cibles: ["ATTAQUE", "RETRAIT"] };
/* D'après le dictionnaire des code talkers publié par la marine américaine (révision de juin 1945). */
const NAVAJO = {
  mots: [["BESH-LO", "poisson de fer", "sous-marin"], ["LO-TSO", "baleine", "cuirassé"], ["DAH-HE-TIH-HI", "colibri", "avion de chasse"], ["JAY-SHO", "vautour", "bombardier"], ["CHAY-DA-GAHI", "tortue", "char"], ["NE-HE-MAH", "notre mère", "Amérique"]],
  lettres: [["WOL-LA-CHEE", "fourmi (ant)", "A"], ["BE-LA-SANA", "pomme (apple)", "A"], ["TSE-NILL", "hache (axe)", "A"], ["DZEH", "wapiti (elk)", "E"], ["AH-JAH", "oreille (ear)", "E"], ["TKIN", "glace (ice)", "I"], ["TSAH", "aiguille (needle)", "N"], ["NE-AHS-JAH", "hibou (owl)", "O"], ["DIBEH", "mouton (sheep)", "S"], ["GLOE-IH", "belette (weasel)", "W"]] };

const DOSSIERS_ANCIENS = {
scytale: {
  id: "scytale", an: -404, date: "vers 400 av. J.-C.", lieu: "Sparte", court: "La scytale", niveau: "Dès la Seconde",
  titre: "La scytale de Sparte", resume: "Mélanger l'ordre des lettres avec un simple bâton",
  accroche: "Une lanière de cuir couverte de lettres sans suite. Pour la lire, il faut l'enrouler sur un bâton du bon diamètre.",
  etapes: [
    { t: "lecon", titre: "Un bâton et une lanière",
      texte: `<p>En 404 av. J.-C., l'amiral spartiate Lysandre guerroie loin de sa cité. Un messager lui remet une lanière de cuir. Elle porte un ordre des magistrats de Sparte : rentrer immédiatement pour répondre de ses pillages.</p>
<p>D'après l'historien Plutarque, voici comment procédaient les Spartiates. Avant le départ d'un général, on taille deux bâtons identiques : l'un reste à Sparte, l'autre part avec lui. Pour écrire, on enroule une lanière en spirale autour du bâton, puis on écrit le message dans le sens de la longueur, une ligne par face. On déroule : les lettres se retrouvent dispersées le long de la bande.</p>
<p>Ce bâton s'appelle une <strong>scytale</strong>. Le destinataire enroule la bande sur le sien, et les lettres reprennent leur place.</p>
<p>Remarque ce qui se passe : aucune lettre n'est remplacée. Elles sont toutes là, mais dans le désordre. On appelle cela un chiffre par <strong>transposition</strong>. La clé, c'est le diamètre du bâton, c'est-à-dire le nombre de lettres par tour.</p>` },
    { t: "quiz", titre: "Enroule la bande", widget: "scytale",
      intro: "Écris un message, choisis la grosseur du bâton, et observe la bande une fois déroulée.",
      questions: [
        { q: "Message RENFORTS DEMAIN, bâton à 3 lettres par tour. Quelles sont les trois premières lettres de la bande ?", choix: ["REN", scytale("RENFORTSDEMAIN", 3).slice(0, 3), "RFT", "NER"], bon: 1, expl: "La bande passe d'une ligne à l'autre à chaque tour : elle prend la première lettre de chacune des trois lignes, puis la deuxième, et ainsi de suite." },
        { q: "Compare les lettres du message et celles de la bande. Que constates-tu ?", choix: ["Ce sont d'autres lettres.", "Ce sont les mêmes lettres, dans un autre ordre.", "Il y a moins de lettres sur la bande."], bon: 1, expl: "Rien n'est remplacé, tout est déplacé. Un X complète parfois la dernière ligne quand le message est trop court." },
        { q: "Garde le message et passe à 4 lettres par tour. La bande est-elle la même ?", choix: ["Oui", "Non"], bon: 1, expl: "Un autre bâton donne un autre mélange. Sans le bon diamètre, le destinataire ne lit rien." },
        { q: "Pour un message d'une trentaine de lettres, combien y a-t-il de grosseurs de bâton à essayer ?", choix: ["Une poignée", "Des milliers", "Des milliards"], bon: 0, expl: "De 2 à une dizaine de lettres par tour, guère plus. C'est très peu." },
      ] },
    { t: "manip", titre: "Bande interceptée", widget: "baton",
      intro: `<p>Tu as intercepté une bande spartiate. Tu n'as pas le bâton, mais tu peux en tailler de toutes les grosseurs. Cherche celle qui rend le message lisible : il se lit ligne après ligne.</p>`,
      expl: "Huit essais au maximum. Comme pour le chiffre de César, il y a trop peu de clés. Et un ennemi qui voit une lanière couverte de lettres devine tout de suite la méthode." },
    { t: "code", titre: "Une lettre sur k", d: 1,
      caches: ["une_sur('ABCDEF', 2)", "une_sur('BONJOUR', 3)", "une_sur('X', 5)"],
      enonce: `<p>Pour lire une bande sans bâton, il suffit de prendre une lettre sur <span class="m">k</span>. Écris la fonction <code>une_sur(bande, k)</code> qui renvoie la chaîne formée des lettres de rang 0, <span class="m">k</span>, 2<span class="m">k</span>, etc.</p>`,
      depart: `def une_sur(bande, k):
    resultat = ""
    for i in range(0, len(bande), k):
        # à compléter
        pass
    return resultat
`,
      solution: `def une_sur(bande, k):
    resultat = ""
    for i in range(0, len(bande), k):
        resultat = resultat + bande[i]
    return resultat
`,
      tests: [{ appels: [["une_sur('RRMETANSIFDNOEX', 3)", "'RENFO'"], ["une_sur('ABCDEFGH', 4)", "'AE'"], ["une_sur('SPARTE', 1)", "'SPARTE'"]] }],
      indices: ["range(0, len(bande), k) donne les rangs 0, k, 2k…", "bande[i] est la lettre de rang i."] },
    { t: "lecon", titre: "Une arme secrète, vraiment ?",
      texte: `<p>La scytale est souvent présentée comme le plus ancien appareil de chiffrement militaire. La réalité est moins nette.</p>
<aside class="legende"><strong>Histoire ou légende ?</strong> La description précise que tu viens de lire vient de Plutarque, qui écrit au I<sup>er</sup> siècle de notre ère, quatre à cinq cents ans après les faits. Les auteurs plus anciens parlent bien de scytales, mais pas toujours pour des messages secrets. Plusieurs historiens pensent que le bâton servait surtout à <em>authentifier</em> un ordre : seul un message écrit sur le bon bâton se remet en place sur celui du général. D'autres défendent l'idée d'un vrai chiffre. On n'a retrouvé aucune scytale.</aside>
<p>Quelle que soit la réponse, la scytale pose déjà les deux questions qui traversent toute la cryptologie : <strong>cacher</strong> le contenu d'un message, et <strong>prouver</strong> qui l'a écrit. Tu retrouveras la seconde avec les signatures, vingt-quatre siècles plus tard.</p>` },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Chiffrer.</strong> La scytale ne remplace pas les lettres, elle les déplace : c'est une transposition. La clé est le nombre de lettres par tour de bâton.</p>
<p><strong>Casser.</strong> On essaie les quelques grosseurs possibles.</p>
<p><strong>La leçon.</strong> Deux grandes familles de chiffres : la transposition, qui change l'ordre des lettres, et la substitution, qui change les lettres elles-mêmes.</p>
<p><strong>Le contexte.</strong> Sparte, V<sup>e</sup> siècle av. J.-C. Source principale : Plutarque, <em>Vie de Lysandre</em>, plusieurs siècles plus tard.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>chiffrer et déchiffrer un message à la scytale</li><li>distinguer transposition et substitution</li><li>dire pourquoi les historiens doutent du récit de Plutarque</li></ul>` },
  ] },

stuart: {
  id: "stuart", an: 1586, date: "1586", lieu: "Chartley, Angleterre", court: "Marie Stuart", niveau: "Dès la Seconde",
  titre: "Marie Stuart trahie par son chiffre", resume: "Un chiffre faible est plus dangereux que pas de chiffre du tout",
  accroche: "Prisonnière, la reine d'Écosse écrit à des conjurés en se croyant protégée par ses symboles. Chaque lettre est lue avant d'arriver.",
  etapes: [
    { t: "lecon", titre: "Des lettres dans un tonneau de bière",
      texte: `<p>En 1586, Marie Stuart, reine d'Écosse et catholique, est prisonnière depuis dix-huit ans de sa cousine Élisabeth I<sup>re</sup>, reine d'Angleterre et protestante. Elle est gardée au manoir de Chartley, et tout courrier lui est interdit.</p>
<p>Un jeune homme, Gilbert Gifford, lui propose un moyen de correspondre : les lettres voyageront dans la bonde creuse des tonneaux de bière livrés au manoir. Marie reprend espoir. Bientôt, un gentilhomme nommé Anthony Babington lui écrit par ce canal : il prépare l'assassinat d'Élisabeth et sa libération.</p>
<p>Par prudence, tout est chiffré. Le secrétaire de Marie utilise un <strong>nomenclateur</strong> : chaque lettre de l'alphabet est remplacée par un symbole, et quelques dizaines de symboles supplémentaires désignent directement des mots ou des noms fréquents.</p>
<p>Ce que Marie ignore : Gifford travaille pour Francis Walsingham, le chef des services secrets d'Élisabeth. Le brasseur aussi. Chaque lettre passe d'abord entre les mains de <strong>Thomas Phelippes</strong>, le meilleur déchiffreur du royaume.</p>` },
    { t: "qcm", titre: "Un chiffre amélioré ?",
      q: "Dans un nomenclateur, des mots courants comme « le roi » ou « et » sont remplacés par un seul symbole. Qu'est-ce que cela change pour l'analyse des fréquences ?",
      choix: ["Rien : elle marche exactement comme avant.", "Elle est gênée pour ces mots-là, mais les lettres de tous les autres mots gardent leurs fréquences.", "Elle devient impossible."], bon: 1,
      retours: ["Les mots codés échappent au comptage des lettres : il y a bien un changement.", null, "La plus grande partie du texte reste écrite lettre par lettre, avec un seul symbole par lettre."],
      expl: "Le nomenclateur est une substitution avec un petit carnet de mots en plus. Six cents ans après al-Kindi, il reste vulnérable au comptage." },
    { t: "manip", titre: "À la place de Phelippes", widget: "symboles",
      intro: `<p>Voici une lettre interceptée, écrite avec des symboles. Phelippes ne partait jamais de rien : grâce aux lettres précédentes, trois symboles te sont déjà donnés. Trouve les autres.</p><p class="muet">Le texte et les symboles sont inventés pour l'exercice, d'après la lettre que Marie Stuart envoya le 17 juillet 1586.</p>`,
      expl: "La lettre approuve le complot. Phelippes, en la recopiant pour Walsingham, dessina une potence sur l'enveloppe." },
    { t: "lecon", titre: "Le post-scriptum",
      texte: `<p>Le 17 juillet 1586, Marie répond à Babington et approuve son plan. Phelippes déchiffre la lettre. Walsingham tient sa preuve, mais il veut davantage : les noms de tous les conjurés.</p>
<p>Phelippes sait désormais écrire dans le chiffre de Marie aussi bien que son secrétaire. Avant de laisser repartir la lettre, il y ajoute un <strong>post-scriptum de sa main</strong>, dans le même chiffre : la reine y demande à Babington les noms des six gentilshommes chargés de l'attentat.</p>
<p>Babington n'a aucune raison de douter : le message est écrit dans le chiffre secret, donc il vient de la reine. Les conjurés sont arrêtés et exécutés en septembre. Marie est jugée en octobre ; ses lettres déchiffrées sont la pièce principale du procès. Elle est décapitée en février 1587.</p>
<aside class="contexte"><strong>Ce que le chiffre faisait croire.</strong> Sans chiffre, Marie aurait écrit avec prudence. Avec un chiffre qu'elle croyait sûr, elle a tout écrit. Et un chiffre cassé ne laisse pas seulement lire : il permet à l'adversaire d'écrire à votre place.</aside>
<aside class="legende"><strong>Histoire ou légende ?</strong> Marie Stuart est-elle tombée dans un piège ? Le canal des tonneaux a été monté de toutes pièces par Walsingham, et le post-scriptum est un faux. Mais le complot de Babington était réel, et la réponse de Marie aussi. Les historiens discutent encore de la part de provocation dans cette affaire.</aside>` },
    { t: "ordre", titre: "Le fil de l'affaire", texte: true,
      q: "Remets les événements dans l'ordre.",
      lignes: ["Gifford, arrêté par Walsingham, accepte de travailler pour lui.", "Les lettres de Marie circulent dans les tonneaux de bière.", "Babington écrit à Marie pour lui exposer son plan.", "Marie répond et approuve ; Phelippes déchiffre sa lettre.", "Phelippes ajoute un faux post-scriptum demandant des noms.", "Les conjurés sont arrêtés, puis Marie est jugée."],
      expl: "Le canal est sous contrôle dès le début : Walsingham n'a pas découvert la correspondance, il l'a organisée." },
    { t: "qcm", titre: "Pire que rien",
      q: "Pourquoi dit-on qu'un chiffre faible est plus dangereux que pas de chiffre du tout ?",
      choix: ["Parce qu'il coûte cher.", "Parce qu'il donne une fausse confiance : on écrit ce qu'on n'aurait jamais écrit en clair.", "Parce qu'il ralentit les messagers."], bon: 1,
      expl: "Marie et Babington ont tout confié à leur chiffre, et ils ont cru sans vérifier tout ce qui arrivait écrit dans ce chiffre." },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Chiffrer.</strong> Le nomenclateur : un symbole par lettre, plus des symboles pour quelques mots et noms.</p>
<p><strong>Casser.</strong> L'analyse des fréquences, aidée par les mots que l'on devine.</p>
<p><strong>La leçon.</strong> Un chiffre faible donne une fausse confiance. Et lire n'est pas le seul danger : celui qui a cassé le chiffre peut fabriquer de faux messages.</p>
<p><strong>Le contexte.</strong> Angleterre, 1586. Francis Walsingham, Thomas Phelippes, le complot de Babington. Marie Stuart est exécutée en février 1587.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>décrire un nomenclateur</li><li>expliquer pourquoi il cède à l'analyse des fréquences</li><li>raconter le rôle du faux post-scriptum</li><li>dire pourquoi un chiffre faible est dangereux</li></ul>` },
  ] },

vigenere: {
  id: "vigenere", an: 1586.5, date: "de 1553 à 1586", lieu: "Italie, puis Paris", court: "Vigenère", niveau: "Dès la Seconde",
  titre: "Vigenère, le chiffre indéchiffrable", resume: "Changer d'alphabet à chaque lettre grâce à un mot-clé",
  accroche: "Pour échapper au comptage des lettres, il suffit qu'un E ne soit jamais chiffré deux fois de la même façon. Ce chiffre tiendra trois siècles.",
  etapes: [
    { t: "lecon", titre: "Un mot pour clé",
      texte: `<p>L'analyse des fréquences repose sur une seule faiblesse : dans une substitution, une lettre claire est toujours remplacée par le même signe. Il suffit donc de changer de règle en cours de route.</p>
<p>L'idée mûrit en Italie à la Renaissance. Sa forme la plus simple tient en une phrase : on choisit un <strong>mot-clé</strong>, on l'écrit sous le message en le répétant, et chaque lettre du message est décalée, à la manière de César, du rang de la lettre de la clé placée dessous (A vaut 0, B vaut 1, C vaut 2…).</p>
<table class="donnees"><tbody><tr><th scope="row">Clair</th><td>P</td><td>A</td><td>R</td><td>I</td><td>S</td></tr><tr><th scope="row">Clé</th><td>R</td><td>O</td><td>I</td><td>R</td><td>O</td></tr><tr><th scope="row">Décalage</th><td>17</td><td>14</td><td>8</td><td>17</td><td>14</td></tr><tr><th scope="row">Chiffré</th><td>G</td><td>O</td><td>Z</td><td>Z</td><td>G</td></tr></tbody></table>
<p>Avec la clé ROI, le message est chiffré par trois chiffres de César qui se relaient. On parle de chiffre <strong>polyalphabétique</strong> : il utilise plusieurs alphabets.</p>` },
    { t: "quiz", titre: "Essaie le mot-clé", widget: "vigenere",
      intro: "Écris un message et un mot-clé. Le tableau montre, pour chaque lettre, la lettre de la clé et le décalage appliqué.",
      questions: [
        { q: "Message PARIS, clé ROI. Dans le résultat, la lettre Z apparaît deux fois. Remplace-t-elle la même lettre claire ?", choix: ["Oui, le I les deux fois", "Non : une fois le R, une fois le I"], bon: 1, expl: "Deux lettres différentes peuvent donner le même signe. Compter les Z ne dit plus rien." },
        { q: "Chiffre EEEEEE avec la clé ROI. De combien de façons différentes le E est-il chiffré ?", choix: ["1", "3", "6", "26"], bon: 1, expl: `On obtient ${vig("EEEEEE", "ROI")} : trois signes pour le E, autant que de lettres dans la clé. Sa fréquence est répartie sur trois signes.` },
        { q: "Que se passe-t-il si la clé ne compte qu'une lettre, par exemple D ?", choix: ["Le message n'est pas chiffré.", "On retrouve le chiffre de César, avec la clé 3.", "Le chiffre devient incassable."], bon: 1, expl: "Le chiffre de César est un Vigenère dont la clé a une seule lettre." },
        { q: "Combien existe-t-il de clés de cinq lettres ?", choix: ["130", "Environ 12 000", "Environ 12 millions"], bon: 2, expl: "26 × 26 × 26 × 26 × 26 = 11 881 376. Et rien n'oblige à s'arrêter à cinq lettres." },
      ] },
    { t: "qcm", titre: "Le comptage en échec",
      q: "Tu comptes les lettres d'un long message chiffré avec une clé de dix lettres. À quoi ressemble le diagramme des fréquences ?",
      choix: ["Une lettre domine nettement, comme le E en français.", "Les barres sont presque toutes de la même hauteur.", "Il n'y a que dix lettres différentes."], bon: 1,
      expl: "Chaque lettre claire est répartie sur dix signes : les différences s'aplanissent. La méthode d'al-Kindi ne trouve plus de prise." },
    { t: "lecon", titre: "Le chiffre qui n'était pas de Vigenère",
      texte: `<p>En 1553, l'Italien <strong>Giovan Battista Bellaso</strong> décrit dans un petit livre un chiffre à mot-clé. En 1586, le diplomate français <strong>Blaise de Vigenère</strong> publie à Paris un gros <em>Traicté des chiffres</em>, où il présente ces méthodes et en propose une variante plus solide, dans laquelle le message lui-même sert à prolonger la clé.</p>
<p>Pendant près de trois siècles, personne ne publie de méthode générale pour casser le chiffre à mot-clé. Il gagne un surnom : <strong>le chiffre indéchiffrable</strong>. En 1868 encore, l'écrivain Lewis Carroll le présente comme incassable dans un magazine pour enfants.</p>
<aside class="legende"><strong>Histoire ou légende ?</strong> Le « chiffre de Vigenère » porte le nom de quelqu'un qui ne l'a pas inventé. C'est au XIX<sup>e</sup> siècle qu'on lui a attribué par erreur le système de Bellaso, en oubliant au passage sa propre invention, pourtant meilleure. Quant à la réputation d'invincibilité, elle était exagérée : dès le XVI<sup>e</sup> siècle, des déchiffreurs habiles venaient parfois à bout de messages mal chiffrés.</aside>` },
    { t: "code", titre: "Vigenère en Python", d: 3,
      caches: ["vigenere('AAAA', 'BC')", "vigenere('ZEBRE', 'B')", "vigenere('CRYPTOLOGIE', 'SESAME')"],
      enonce: `<p>Écris la fonction <code>vigenere(texte, cle)</code>. Le texte et la clé ne contiennent que des majuscules, sans espace. La lettre de rang <code>i</code> du texte est décalée du rang de la lettre de la clé placée dessous : comme la clé se répète, c'est <code>cle[i % len(cle)]</code>.</p>`,
      depart: `def vigenere(texte, cle):
    resultat = ""
    for i in range(len(texte)):
        decalage = ord(cle[i % len(cle)]) - 65
        # à compléter : décaler texte[i] de decalage rangs
    return resultat
`,
      solution: `def vigenere(texte, cle):
    resultat = ""
    for i in range(len(texte)):
        decalage = ord(cle[i % len(cle)]) - 65
        rang = (ord(texte[i]) - 65 + decalage) % 26
        resultat = resultat + chr(65 + rang)
    return resultat
`,
      tests: [{ appels: [["vigenere('PARIS', 'ROI')", `'${vig("PARIS", "ROI")}'`], ["vigenere('EEEEEE', 'ROI')", `'${vig("EEEEEE", "ROI")}'`], ["vigenere('ROME', 'D')", "'URPH'"]] }],
      indices: ["Le rang de texte[i] est ord(texte[i]) - 65.", "Nouveau rang : (rang + decalage) % 26.", "Puis chr(65 + nouveau rang), comme pour César."] },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Chiffrer.</strong> On écrit un mot-clé sous le message, en le répétant. Chaque lettre est décalée du rang de la lettre de la clé placée dessous.</p>
<p><strong>Pourquoi cela résiste.</strong> Une même lettre claire est chiffrée de plusieurs façons : les fréquences s'aplanissent.</p>
<p><strong>La faille, à suivre.</strong> La clé se répète.</p>
<p><strong>Le contexte.</strong> Bellaso, 1553. Blaise de Vigenère, <em>Traicté des chiffres</em>, Paris, 1586. Réputé « indéchiffrable » jusqu'en 1863.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>chiffrer un message avec un mot-clé</li><li>expliquer pourquoi l'analyse des fréquences échoue</li><li>compter les clés d'une longueur donnée</li><li>dire qui a vraiment inventé ce chiffre</li></ul>` },
  ] },

kasiski: {
  id: "kasiski", an: 1863, date: "de 1854 à 1863", lieu: "Londres et Berlin", court: "Babbage et Kasiski", niveau: "Dès la Seconde, multiples et diviseurs",
  titre: "Babbage, Kasiski et la clé qui se répète", resume: "Trois siècles d'invincibilité, et une faille visible à l'œil nu",
  accroche: "Le chiffre indéchiffrable tombe deux fois : un Anglais le casse et se tait, un officier prussien le casse et publie.",
  etapes: [
    { t: "lecon", titre: "Ce que la clé laisse voir",
      texte: `<p>Le chiffre de Vigenère efface les fréquences. Mais il a une habitude : sa clé <strong>se répète</strong>, toujours au même rythme.</p>
<p>Imagine un message où le mot LES revient souvent, chiffré avec une clé de quatre lettres. Chaque LES tombe sous un morceau de la clé. S'il tombe deux fois sous le <em>même</em> morceau, il est chiffré deux fois de la <em>même</em> façon : les trois mêmes lettres réapparaissent dans le message chiffré.</p>
<p>Or deux occurrences ne tombent sous le même morceau de clé que si la clé a eu le temps de faire un nombre entier de tours entre les deux. L'écart entre les deux répétitions est donc un <strong>multiple de la longueur de la clé</strong>.</p>
<p>Il suffit alors de chercher les suites de lettres qui se répètent dans le message chiffré, de mesurer les écarts, et de chercher le nombre qui les divise tous.</p>` },
    { t: "qcm", titre: "Trois écarts",
      q: "Dans un message chiffré, tu repères des répétitions séparées par 12, 20 et 32 lettres. Quelle est la longueur de clé la plus probable ?",
      choix: ["3", "4", "5", "12"], bon: 1,
      retours: ["3 divise 12, mais ni 20 ni 32.", null, "5 divise 20, mais ni 12 ni 32.", "12 ne divise ni 20 ni 32."],
      expl: "4 est le plus grand nombre qui divise à la fois 12, 20 et 32 : c'est leur PGCD. Une clé de 2 lettres est possible aussi, mais moins probable." },
    { t: "manip", titre: "Casse le chiffre indéchiffrable", widget: "kasiski",
      intro: `<p>Ce message de 325 lettres est chiffré avec un mot-clé que tu ignores. Les répétitions sont déjà repérées pour toi. Trouve d'abord la longueur de la clé, puis la clé elle-même.</p>`,
      expl: "Une fois la longueur connue, le chiffre indéchiffrable n'est plus qu'une poignée de chiffres de César, et chacun tombe à l'analyse des fréquences. La leçon d'al-Kindi s'applique encore, colonne par colonne." },
    { t: "lecon", titre: "Celui qui se tait et celui qui publie",
      texte: `<p>En 1854, un certain Thwaites croit avoir inventé un nouveau chiffre et le soumet à une revue savante anglaise. <strong>Charles Babbage</strong>, mathématicien, inventeur de machines à calculer et grand amateur de chiffres, fait remarquer que c'est celui de Vigenère. Piqué, Thwaites le met au défi de le casser. Babbage y parvient : le texte était un poème de Tennyson, et la clé le prénom de la femme du poète, Emily.</p>
<p>Babbage ne publie rien. Sa méthode ne sera reconstituée que bien plus tard, à partir de ses notes.</p>
<p>En 1863, <strong>Friedrich Kasiski</strong>, officier prussien à la retraite, publie à Berlin un petit livre sur l'art de déchiffrer. La méthode des répétitions y est exposée en détail. C'est son nom qu'elle porte aujourd'hui.</p>
<aside class="legende"><strong>Histoire ou légende ?</strong> Pourquoi Babbage s'est-il tu ? On lit parfois que les services britanniques lui auraient demandé le silence pendant la guerre de Crimée, pour garder l'avantage. C'est une hypothèse séduisante, sans preuve. Babbage laissait aussi beaucoup de travaux inachevés. Ce qui est sûr : en science, la découverte revient à celui qui la rend publique.</aside>` },
    { t: "code", titre: "Repérer les répétitions", d: 2,
      caches: ["positions('AAAA', 'AA')", "positions('BONJOUR', 'Z')", "positions('LESMOTSLESPLUSCOURTSSONTLESMEILLEURS', 'LES')"],
      enonce: `<p>Écris la fonction <code>positions(texte, motif)</code> qui renvoie la liste des rangs où le motif apparaît dans le texte. Le premier caractère a le rang 0.</p><p>Rappel : <code>texte[i:i+3]</code> est le morceau de trois caractères qui commence au rang <code>i</code>.</p>`,
      depart: `def positions(texte, motif):
    resultat = []
    n = len(motif)
    for i in range(len(texte) - n + 1):
        # à compléter : si le morceau qui commence en i est le motif, ajouter i
        pass
    return resultat
`,
      solution: `def positions(texte, motif):
    resultat = []
    n = len(motif)
    for i in range(len(texte) - n + 1):
        if texte[i:i+n] == motif:
            resultat.append(i)
    return resultat
`,
      tests: [{ appels: [["positions('ABCABCAB', 'AB')", "[0, 3, 6]"], ["positions('XYZXYZ', 'YZ')", "[1, 4]"], ["positions('ENIGMA', 'A')", "[5]"]] }],
      indices: ["Le morceau à comparer est texte[i:i+n].", "resultat.append(i) ajoute le rang à la liste."] },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>La faille.</strong> La clé de Vigenère se répète. Un même mot chiffré deux fois sous le même morceau de clé donne les mêmes lettres.</p>
<p><strong>Casser, étape 1.</strong> Repérer les répétitions, mesurer les écarts : la longueur de la clé les divise tous.</p>
<p><strong>Casser, étape 2.</strong> Découper le message en colonnes. Chaque colonne est un chiffre de César : sa lettre la plus fréquente cache le E.</p>
<p><strong>Le contexte.</strong> Charles Babbage, 1854, sans publication. Friedrich Kasiski, Berlin, 1863.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>expliquer pourquoi les répétitions trahissent la longueur de la clé</li><li>déduire cette longueur à partir des écarts</li><li>retrouver une clé colonne par colonne</li></ul>` },
  ] },

kerckhoffs: {
  id: "kerckhoffs", an: 1883, date: "1883", lieu: "Paris", court: "Kerckhoffs", niveau: "Dès la Seconde",
  titre: "Kerckhoffs : l'ennemi connaît la méthode", resume: "Le principe qui gouverne encore toute la cryptographie",
  accroche: "Un professeur d'allemand pose une règle simple : un bon chiffre doit rester sûr même si l'adversaire sait exactement comment il fonctionne.",
  etapes: [
    { t: "lecon", titre: "Le télégraphe change tout",
      texte: `<p>Au XIX<sup>e</sup> siècle, les armées découvrent le télégraphe. Les ordres voyagent en quelques minutes, mais sur des fils que l'ennemi peut écouter. Il faut chiffrer vite, beaucoup, et sur le terrain.</p>
<p>La défaite de 1870 face à la Prusse convainc les militaires français que leurs méthodes sont dépassées. Beaucoup de systèmes reposent sur un secret de fabrication : un carnet, un appareil, une règle que l'on cache. Or un carnet se perd, un officier est capturé, un employé se laisse acheter.</p>
<p>En 1883, <strong>Auguste Kerckhoffs</strong>, né aux Pays-Bas et professeur d'allemand à Paris, publie dans le <em>Journal des sciences militaires</em> un long article, « La cryptographie militaire ». Il y fait le tour des chiffres de son temps et pose six règles qu'un bon système doit respecter.</p>` },
    { t: "pari", titre: "Quelle serrure ?",
      q: "Tu dois protéger un coffre. Que choisis-tu ?",
      choix: ["Une serrure dont personne ne connaît le mécanisme.", "Une serrure dont les plans sont publics, étudiée depuis vingt ans par tous les serruriers, et dont tu es seul à avoir la clé.", "Peu importe, les deux se valent."] },
    { t: "lecon", titre: "La deuxième règle",
      texte: `<p>La plus célèbre des six règles est la deuxième. Kerckhoffs demande que le système n'exige pas le secret, et qu'il puisse sans dommage « tomber entre les mains de l'ennemi ».</p>
<p>Autrement dit : <strong>toute la sécurité doit reposer sur la clé, et sur elle seule.</strong> La méthode, la machine, le programme peuvent être connus de l'adversaire.</p>
<p>Trois raisons, toujours valables :</p>
<ul><li>Une méthode finit toujours par fuir. Elle est connue de trop de gens, pendant trop longtemps.</li><li>Une clé volée se remplace en une minute. Une méthode volée oblige à tout reconstruire.</li><li>Une méthode publique est examinée par tous les spécialistes du monde. Si personne n'y trouve de faille pendant des années, on peut commencer à lui faire confiance. Une méthode secrète n'a été vérifiée que par ses auteurs.</li></ul>
<p>Si tu as parié sur la serrure au mécanisme secret, tu as fait le choix le plus répandu, et le moins sûr. On appelle cela la <strong>sécurité par l'obscurité</strong>.</p>
<aside class="contexte"><strong>Soixante ans plus tard.</strong> Le mathématicien américain Claude Shannon a résumé la règle en quatre mots : l'ennemi connaît le système. L'armée allemande l'a appris à ses dépens : les Polonais puis les Britanniques connaissaient Enigma dans ses moindres câbles, et il ne restait à trouver que le réglage du jour.</aside>` },
    { t: "tri", titre: "Secret ou public ?",
      q: "Dans un système bien conçu, qu'est-ce qui doit rester secret ?",
      categories: ["Doit rester secret", "Peut être connu de tous"],
      items: [
        { txt: "Le réglage du jour d'une machine Enigma", cat: 0, expl: "C'est la clé." },
        { txt: "Les plans de la machine Enigma", cat: 1, expl: "C'est la méthode. Un bon système doit supposer que l'ennemi les possède." },
        { txt: "Le mot-clé d'un chiffre de Vigenère", cat: 0, expl: "C'est la clé." },
        { txt: "Le fait qu'on utilise le chiffre de Vigenère", cat: 1, expl: "La méthode peut être connue. Celle-ci est d'ailleurs trop faible, mais c'est une autre question." },
        { txt: "Le programme qui chiffre les messages de ton téléphone", cat: 1, expl: "Les meilleures messageries publient leur code pour qu'il soit vérifié." },
        { txt: "Ton mot de passe", cat: 0, expl: "C'est une clé." },
      ] },
    { t: "quiz", titre: "Le principe à l'épreuve",
      questions: [
        { q: "Une entreprise vend une messagerie « protégée par un algorithme secret que personne ne peut connaître ». Qu'en penserait Kerckhoffs ?", choix: ["C'est rassurant.", "C'est inquiétant : personne d'extérieur n'a pu vérifier l'algorithme, et il finira par être connu.", "Cela n'a aucune importance."], bon: 1, expl: "Un algorithme secret n'a été examiné que par ceux qui le vendent. Le jour où il fuit, toute la sécurité tombe d'un coup." },
        { q: "En 2016, les États-Unis ont lancé un concours public pour choisir les chiffres de demain : 69 propositions, examinées pendant huit ans par des chercheurs du monde entier. Pourquoi procéder ainsi ?", choix: ["Pour faire de la publicité.", "Parce qu'un chiffre qui a résisté aux attaques de tous les spécialistes mérite davantage la confiance.", "Pour que les ennemis puissent le copier."], bon: 1, expl: "C'est le principe de Kerckhoffs appliqué à grande échelle. Tu retrouveras ce concours dans le dernier dossier." },
        { q: "Le principe de Kerckhoffs oblige-t-il à publier sa méthode ?", choix: ["Oui, toujours.", "Non : il demande seulement que la sécurité ne s'effondre pas si la méthode est découverte."], bon: 1, expl: "Kerckhoffs ne dit pas « publiez tout ». Il dit : concevez votre système comme si l'adversaire en avait déjà un exemplaire." },
      ] },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Le principe.</strong> La sécurité d'un chiffre doit reposer uniquement sur le secret de la clé. La méthode peut tomber entre les mains de l'adversaire.</p>
<p><strong>Pourquoi.</strong> Une méthode fuit tôt ou tard ; une clé se change facilement ; une méthode publique est vérifiée par tous.</p>
<p><strong>Le contraire.</strong> La sécurité par l'obscurité : compter sur le secret de la méthode.</p>
<p><strong>Le contexte.</strong> Auguste Kerckhoffs, « La cryptographie militaire », <em>Journal des sciences militaires</em>, 1883. Repris par Claude Shannon : « l'ennemi connaît le système ».</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>énoncer le principe de Kerckhoffs</li><li>distinguer la méthode et la clé</li><li>expliquer pourquoi un algorithme secret n'est pas un gage de sécurité</li></ul>` },
  ] },

zimmermann: {
  id: "zimmermann", an: 1917, date: "1917", lieu: "Berlin, Londres, Washington", court: "Le télégramme Zimmermann", niveau: "Dès la Seconde",
  titre: "Le télégramme Zimmermann", resume: "Un décryptage qui pèse sur l'entrée en guerre des États-Unis",
  accroche: "Janvier 1917. Un télégramme allemand traverse l'Atlantique en groupes de chiffres. À Londres, une pièce discrète de l'Amirauté en lit assez pour comprendre.",
  etapes: [
    { t: "lecon", titre: "Des mots contre des nombres",
      texte: `<p>Jusqu'ici, tu as rencontré des <strong>chiffres</strong> : des méthodes qui transforment un message lettre par lettre. Les diplomates de 1917 utilisent surtout des <strong>codes</strong>. Un code est un gros dictionnaire secret : à chaque mot, à chaque expression courante correspond un groupe de chiffres. Le carnet de code allemand compte des milliers d'entrées.</p>
<p>Un code est rapide, et un télégramme codé est plus court, donc moins cher. Mais il a une faiblesse : le carnet. S'il est volé, copié ou peu à peu reconstitué par l'adversaire, tout est perdu, et le remplacer prend des mois.</p>
<p>À Londres, dans la <strong>Room 40</strong> de l'Amirauté, des civils recrutés pour l'occasion, linguistes, éditeurs, universitaires, reconstituent depuis 1914 les carnets allemands, à partir d'exemplaires saisis et de milliers de messages interceptés. Les Britanniques écoutent tous les câbles qui traversent l'Atlantique.</p>` },
    { t: "quiz", titre: "Dans la Room 40", widget: "telegramme",
      intro: "Voici une version très raccourcie du télégramme. Le carnet reconstitué est incomplet. Cherche chaque groupe et lis ce que tu peux.",
      questions: [
        { q: "Qui signe ce télégramme ?", choix: ["Le président des États-Unis", "Zimmermann, ministre allemand des Affaires étrangères", "Le président du Mexique"], bon: 1, expl: "Le groupe 97556 est authentique : c'est en le voyant se transformer en « Zimmermann » que les décrypteurs ont compris à qui ils avaient affaire." },
        { q: "Que propose l'Allemagne au Mexique ?", choix: ["Un traité de commerce", "Une alliance militaire contre les États-Unis", "Un échange de prisonniers"], bon: 1, expl: "Si les États-Unis entrent en guerre, l'Allemagne offre au Mexique une alliance et de l'argent." },
        { q: "Trois groupes restent illisibles. Pourquoi ?", choix: ["Le télégramme est abîmé.", "Ces groupes ne figurent pas encore dans le carnet reconstitué.", "Ils sont chiffrés avec Enigma."], bon: 1, expl: "Un code se reconstitue entrée par entrée. Dans la première version lue à Londres, les noms des territoires promis au Mexique manquaient : le Texas, le Nouveau-Mexique et l'Arizona." },
        { q: "Quelle est la différence entre un code et un chiffre ?", choix: ["Aucune.", "Un code remplace des mots entiers à l'aide d'un dictionnaire ; un chiffre transforme les lettres selon une règle.", "Un code est toujours plus sûr."], bon: 1, expl: "Avec un chiffre, on peut écrire n'importe quoi. Avec un code, seulement ce que le dictionnaire a prévu." },
      ] },
    { t: "lecon", titre: "Le dilemme de l'amiral",
      texte: `<p>Le télégramme part de Berlin le 16 janvier 1917. Dès le lendemain, Nigel de Grey et William Montgomery en lisent l'essentiel. Leur chef, l'amiral Hall, comprend qu'il tient de quoi faire basculer les États-Unis, encore neutres.</p>
<p>Mais il a deux problèmes. S'il montre le télégramme aux Américains, les Allemands sauront que leur code est cassé et en changeront. Et il devra avouer comment il l'a obtenu : l'Allemagne l'avait fait passer par un câble diplomatique <em>américain</em>, que les Britanniques écoutaient aussi.</p>
<p>Hall attend, et trouve une parade. Le télégramme a été retransmis de Washington à Mexico dans un code plus ancien. Un agent britannique s'en procure une copie au bureau du télégraphe de Mexico. On pourra dire que la fuite vient de là.</p>
<p>Le texte est remis aux Américains et paraît dans la presse le 1<sup>er</sup> mars. Beaucoup crient au faux. Deux jours plus tard, Zimmermann lui-même reconnaît qu'il en est l'auteur.</p>` },
    { t: "ordre", titre: "Onze semaines", texte: true,
      q: "Remets les événements de 1917 dans l'ordre.",
      lignes: ["16 janvier : le télégramme quitte Berlin.", "17 janvier : la Room 40 en lit l'essentiel.", "1er mars : le texte paraît dans la presse américaine.", "3 mars : Zimmermann reconnaît en être l'auteur.", "6 avril : le Congrès des États-Unis déclare la guerre à l'Allemagne."],
      expl: "Six semaines séparent le décryptage de la publication : le temps de protéger le secret de la Room 40." },
    { t: "qcm", titre: "Savoir, et le cacher",
      q: "Pourquoi les Britanniques ont-ils attendu plus d'un mois avant de transmettre le télégramme ?",
      choix: ["Ils n'étaient pas sûrs de la traduction.", "Ils voulaient cacher qu'ils lisaient le code allemand, et qu'ils écoutaient les câbles américains.", "Ils espéraient que la guerre finirait avant."], bon: 1,
      expl: "Un décryptage n'a de valeur que tant que l'adversaire l'ignore. Ce problème reviendra avec Enigma : comment utiliser ce que l'on sait sans révéler qu'on le sait ?" },
    { t: "lecon", titre: "Un télégramme a-t-il changé la guerre ?",
      texte: `<aside class="legende"><strong>Histoire ou légende ?</strong> On lit souvent que le télégramme Zimmermann a fait entrer les États-Unis dans la guerre. Il a compté, et l'historien David Kahn y a vu le plus grand coup de l'histoire du renseignement. Mais il n'était pas seul : le 31 janvier 1917, l'Allemagne avait annoncé qu'elle torpillerait désormais sans avertissement tous les navires, y compris américains. Le télégramme a surtout fait basculer une opinion publique qui hésitait encore.</aside>
<p>L'épisode montre la fragilité des codes. Leur sécurité repose sur le secret d'un objet, le carnet, exactement ce que Kerckhoffs déconseillait trente-quatre ans plus tôt. Après la guerre, les grandes puissances se tournent vers les machines.</p>` },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Code et chiffre.</strong> Un code remplace des mots par des groupes, à l'aide d'un dictionnaire secret. Un chiffre transforme les lettres selon une règle et une clé.</p>
<p><strong>Casser un code.</strong> Reconstituer le carnet entrée par entrée, à partir de messages interceptés et d'exemplaires saisis.</p>
<p><strong>La leçon.</strong> Savoir ne suffit pas : il faut pouvoir agir sans révéler que l'on sait.</p>
<p><strong>Le contexte.</strong> Arthur Zimmermann, janvier 1917. Room 40, Londres : Nigel de Grey et William Montgomery. Entrée en guerre des États-Unis le 6 avril 1917.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>distinguer un code d'un chiffre</li><li>expliquer la faiblesse d'un carnet de code</li><li>raconter le dilemme des Britanniques</li><li>nuancer le rôle du télégramme dans l'entrée en guerre</li></ul>` },
  ] },

masque: {
  id: "masque", an: 1917.5, date: "de 1917 à 1949", lieu: "New York", court: "Le masque jetable", niveau: "Dès la Seconde",
  titre: "Le masque jetable, le chiffre parfait", resume: "Le seul chiffre dont on a démontré qu'il est incassable",
  accroche: "Une clé tirée au hasard, aussi longue que le message, utilisée une seule fois. Aucun calcul, aussi long soit-il, n'en viendra à bout.",
  etapes: [
    { t: "lecon", titre: "Une clé qui ne se répète jamais",
      texte: `<p>Babbage et Kasiski ont cassé Vigenère grâce à une seule faille : la clé se répète. Supprimons la faille. Prenons une clé <strong>aussi longue que le message</strong>.</p>
<p>En 1917, à New York, l'ingénieur <strong>Gilbert Vernam</strong> met au point pour la compagnie AT&amp;T un système qui chiffre automatiquement les messages des téléscripteurs. La clé est une longue bande de papier perforée, combinée au message caractère par caractère. Un officier de l'armée, <strong>Joseph Mauborgne</strong>, ajoute la condition qui change tout : la bande doit être parfaitement aléatoire, et ne jamais resservir.</p>
<p>Trois conditions, donc :</p>
<ul><li>la clé est aussi longue que le message ;</li><li>elle est tirée <strong>au hasard</strong>, lettre par lettre ;</li><li>elle ne sert qu'<strong>une seule fois</strong>, puis on la détruit.</li></ul>
<p>Les espions recevront plus tard leurs clés sous forme de petits carnets dont on arrache une page après chaque message. D'où le nom : <strong>masque jetable</strong>.</p>` },
    { t: "quiz", titre: "Tire une clé", widget: "masque",
      intro: "Le principe est celui de Vigenère, avec une clé tirée au hasard et aussi longue que le message.",
      questions: [
        { q: "Compare la longueur de la clé et celle du message.", choix: ["La clé est plus courte.", "Elles sont égales.", "La clé est plus longue."], bon: 1, expl: "Une lettre de clé par lettre de message : la clé ne se répète jamais." },
        { q: "Garde le même message et tire plusieurs clés. Que devient le message chiffré ?", choix: ["Il reste le même.", "Il change entièrement à chaque fois."], bon: 1, expl: "Le même message peut donner n'importe quelle suite de lettres. Le chiffré ne garde aucune trace du clair." },
        { q: "La méthode de Kasiski peut-elle fonctionner ici ?", choix: ["Oui", "Non : il n'y a aucune répétition de clé à exploiter."], bon: 1, expl: "Pas de période, pas de colonnes, pas de fréquences. Il n'y a plus de prise." },
      ] },
    { t: "pari", titre: "Avec un temps infini",
      q: "Un adversaire intercepte un message chiffré au masque jetable. Il dispose de tous les ordinateurs du monde et de tout le temps qu'il veut. Peut-il retrouver le message ?",
      choix: ["Oui : en essayant toutes les clés, il finira par tomber sur la bonne.", "Non, même en essayant toutes les clés.", "Seulement si le message est court."] },
    { t: "manip", titre: "Toutes les clés à la fois", widget: "alibi",
      intro: `<p>Tu as intercepté sept lettres chiffrées au masque jetable. Tu peux essayer toutes les clés que tu veux. Mieux : indique le message que tu aimerais lire, et la machine te donne la clé qui le produit.</p>`,
      verdict: ["Tu avais parié qu'en essayant toutes les clés on finirait par trouver : on trouve en effet le bon message, mais aussi tous les autres, sans pouvoir les départager.", "Tu avais parié que même toutes les clés ne suffiraient pas : c'est exact, et c'est démontré.", "Tu avais parié que cela dépendait de la longueur : non, court ou long, tous les messages de la bonne longueur restent possibles."],
      expl: "Pour chaque message de sept lettres, il existe une clé qui le fait apparaître. ATTAQUE et RETRAIT sont aussi vraisemblables l'un que l'autre : essayer toutes les clés revient à écrire tous les messages possibles. Le chiffré n'apprend rien." },
    { t: "lecon", titre: "Parfait, et presque inutilisable",
      texte: `<p>En 1945, dans un rapport secret publié en 1949, le mathématicien <strong>Claude Shannon</strong> démontre ce que tu viens d'observer : utilisé correctement, le masque jetable offre un <strong>secret parfait</strong>. Ce n'est pas une affaire de puissance de calcul. Le message chiffré ne contient aucune information sur le message clair.</p>
<p>Pourquoi ne pas l'utiliser partout ? Parce qu'il déplace le problème. Pour envoyer un gigaoctet en secret, il faut avoir d'abord transmis, en secret, un gigaoctet de clé. Le masque jetable sert donc là où l'on peut se rencontrer avant : diplomates, espions, lignes directes entre chefs d'État.</p>
<aside class="contexte"><strong>La faute des chiffreurs soviétiques.</strong> Pendant la Seconde Guerre mondiale, débordés, des services soviétiques ont réutilisé certaines pages de clés. Les Américains s'en sont aperçus : en comparant des messages chiffrés avec la même page, ils en ont lu une partie. Le programme s'appelait Venona. Une clé « jetable » utilisée deux fois n'est plus un masque jetable.</aside>
<aside class="legende"><strong>Histoire ou légende ?</strong> Vernam et Mauborgne ont longtemps passé pour les inventeurs. En 2011, le chercheur Steven Bellovin a retrouvé à la Bibliothèque du Congrès un livre de 1882 : un banquier californien, Frank Miller, y décrivait déjà le principe pour protéger des télégrammes, des nombres pris sur une liste irrégulière et rayés après usage. Personne ne l'avait remarqué pendant cent trente ans.</aside>` },
    { t: "qcm", titre: "Deux fois la même page",
      q: "Un agent pressé chiffre deux messages différents avec la même page de clé. Quel est le risque ?",
      choix: ["Aucun, tant que la clé reste secrète.", "En combinant les deux messages chiffrés, l'adversaire fait disparaître la clé et obtient un mélange des deux messages clairs, qu'il peut démêler.", "Le destinataire ne pourra pas déchiffrer."], bon: 1,
      expl: "La clé s'annule quand on soustrait un chiffré de l'autre. Il reste deux textes en français superposés, et la langue a assez d'habitudes pour les séparer." },
    { t: "code", titre: "Le masque en binaire", d: 2,
      caches: ["xor_bits('0', '1')", "xor_bits('1111', '1111')", "xor_bits('10011', '00000')"],
      enonce: `<p>Les ordinateurs appliquent le masque jetable sur des bits. La règle s'appelle le <strong>ou exclusif</strong> : le bit chiffré vaut 0 si le bit du message et le bit de la clé sont égaux, 1 s'ils sont différents.</p><p>Écris la fonction <code>xor_bits(message, cle)</code>. Les deux arguments sont des chaînes de 0 et de 1, de même longueur.</p>`,
      depart: `def xor_bits(message, cle):
    resultat = ""
    for i in range(len(message)):
        # à compléter : "0" si les deux bits sont égaux, "1" sinon
        pass
    return resultat
`,
      solution: `def xor_bits(message, cle):
    resultat = ""
    for i in range(len(message)):
        if message[i] == cle[i]:
            resultat = resultat + "0"
        else:
            resultat = resultat + "1"
    return resultat
`,
      tests: [{ appels: [["xor_bits('1100', '1010')", "'0110'"], ["xor_bits('0110', '1010')", "'1100'"], ["xor_bits('10110', '01110')", "'11000'"]] }],
      indices: ["Compare message[i] et cle[i].", "Regarde les deux premiers tests : appliquer deux fois la même clé redonne le message de départ."] },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Chiffrer.</strong> Une clé aléatoire, aussi longue que le message, utilisée une seule fois.</p>
<p><strong>Casser.</strong> Impossible : toutes les clés sont possibles, donc tous les messages aussi. Shannon l'a démontré.</p>
<p><strong>Le prix.</strong> Il faut transmettre à l'avance, en secret, autant de clé que de message. Et ne jamais réutiliser une clé.</p>
<p><strong>Le contexte.</strong> Gilbert Vernam et Joseph Mauborgne, 1917. Claude Shannon, 1949. Frank Miller, précurseur oublié, 1882.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>énoncer les trois conditions du masque jetable</li><li>expliquer pourquoi la force brute ne sert à rien</li><li>dire pourquoi il est si peu utilisé</li><li>calculer un ou exclusif</li></ul>` },
  ] },

navajo: {
  id: "navajo", an: 1942, date: "de 1942 à 1945", lieu: "Océan Pacifique", court: "Le code navajo", niveau: "Dès la Seconde",
  titre: "Le code navajo", resume: "Une langue comme secret, à la vitesse de la parole",
  accroche: "Dans le Pacifique, les machines à chiffrer sont trop lentes pour le combat. Les Marines confient leurs messages à des soldats navajos.",
  etapes: [
    { t: "lecon", titre: "Trop lent pour la bataille",
      texte: `<p>1942. Dans les îles du Pacifique, les Marines américains affrontent l'armée japonaise. Sur le terrain, un ordre doit partir tout de suite : demander un tir d'artillerie, signaler un mouvement. Chiffrer avec une machine, transmettre, déchiffrer prend de longues minutes. Parler en clair à la radio, c'est renseigner l'ennemi, dont beaucoup d'officiers comprennent l'anglais.</p>
<p>L'armée se tourne vers le <strong>navajo</strong>, la langue d'une nation amérindienne du sud-ouest des États-Unis. Elle ne s'écrit presque pas, sa grammaire et ses sons déroutent, et presque personne ne la parle en dehors des Navajos.</p>
<p>En mai 1942, vingt-neuf recrues navajos arrivent dans un camp de Californie. On leur demande d'inventer eux-mêmes un code. Ils font deux choses :</p>
<ul><li>pour les termes militaires qui n'existent pas dans leur langue, ils choisissent des images : un sous-marin devient un « poisson de fer » ;</li><li>pour épeler les noms propres, ils associent à chaque lettre un mot anglais qui commence par elle, traduit en navajo.</li></ul>
<p>Tout est appris par cœur. Il n'existe aucun carnet à capturer.</p>` },
    { t: "quiz", titre: "À la radio", widget: "navajo",
      intro: "Voici un extrait du dictionnaire des radios navajos. Sers-t'en pour répondre.",
      questions: [
        { q: "Tu entends LO-TSO. De quoi parle le message ?", choix: ["D'un sous-marin", "D'un cuirassé", "D'un char"], bon: 1, expl: "Lo-tso, la baleine : le plus gros navire de la flotte." },
        { q: "Tu entends, mot après mot : TKIN, GLOE-IH, NE-AHS-JAH. Qu'épelle le radio ?", choix: ["SOS", "IWO", "EAU", "OUI"], bon: 1, expl: "Glace, belette, hibou : en anglais ice, weasel, owl. I, W, O, le début d'Iwo Jima." },
        { q: "La lettre A peut se dire WOL-LA-CHEE, BE-LA-SANA ou TSE-NILL. Pourquoi prévoir plusieurs mots pour une même lettre ?", choix: ["Pour faire joli.", "Pour qu'un mot très fréquent ne trahisse pas une lettre très fréquente.", "Parce que les radios n'étaient pas d'accord."], bon: 1, expl: "C'est une défense contre l'analyse des fréquences. Les lettres les plus courantes ont trois mots, que le radio alterne." },
      ] },
    { t: "tri", titre: "Code ou chiffre ?",
      q: "Range chaque système dans sa famille.",
      categories: ["Code : remplace des mots", "Chiffre : transforme des lettres"],
      items: [
        { txt: "« Besh-lo » pour sous-marin", cat: 0, expl: "Un mot convenu pour un autre mot." },
        { txt: "Le chiffre de César", cat: 1, expl: "Chaque lettre est décalée." },
        { txt: "Le carnet du télégramme Zimmermann", cat: 0, expl: "Un groupe de chiffres par mot ou expression." },
        { txt: "Enigma", cat: 1, expl: "Chaque lettre frappée est transformée par les rotors." },
        { txt: "Le chiffre de Vigenère", cat: 1, expl: "Chaque lettre est décalée selon la clé." },
        { txt: "« Tkin » pour la lettre I", cat: 1, expl: "Ici, c'est bien une lettre que l'on remplace : l'alphabet navajo est une substitution à plusieurs choix." },
      ] },
    { t: "lecon", titre: "Vingt-trois ans de silence",
      texte: `<p>Les radios navajos débarquent à Guadalcanal en août 1942 et participent ensuite à toutes les grandes opérations des Marines dans le Pacifique. À Iwo Jima, en 1945, six d'entre eux se relaient jour et nuit pendant les deux premiers jours de la bataille. Environ quatre cents Navajos auront servi comme radios. Leur code n'a jamais été cassé.</p>
<p>Après la guerre, on leur demande de se taire : le code pourrait resservir. Il n'est rendu public qu'en <strong>1968</strong>. Les vingt-neuf premiers recevront la médaille d'or du Congrès en 2001 ; seuls quelques-uns étaient encore en vie.</p>
<aside class="contexte"><strong>Une langue que l'école voulait faire taire.</strong> Beaucoup de ces soldats avaient grandi dans des pensionnats où l'on punissait les enfants qui parlaient navajo. « Nous avons utilisé notre langue pour vaincre l'ennemi », dira plus tard l'un des vingt-neuf, Chester Nez.</aside>
<aside class="legende"><strong>Histoire ou légende ?</strong> Le code navajo contredit-il Kerckhoffs, puisque son secret reposait sur la méthode ? En partie. Il a tenu parce que la guerre a été courte, que la langue était presque inconnue hors de sa nation, et que tout était dans la tête des radios. Un adversaire qui aurait eu le temps de trouver un locuteur aurait tout compris. Ce qui le rendait précieux, c'était sa vitesse : celle de deux hommes qui se parlent.</aside>` },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Le système.</strong> Un vocabulaire d'images pour les termes militaires, et un alphabet de mots pour épeler, avec plusieurs mots pour les lettres fréquentes.</p>
<p><strong>Sa force.</strong> La vitesse de la parole, aucun document à capturer, une langue inconnue de l'adversaire.</p>
<p><strong>Sa limite.</strong> Le secret repose sur la méthode : il n'aurait pas tenu indéfiniment.</p>
<p><strong>Le contexte.</strong> Marines américains, Pacifique, 1942-1945. Vingt-neuf créateurs, environ quatre cents radios. Secret levé en 1968.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>décrire les deux parties du code navajo</li><li>expliquer pourquoi une lettre a plusieurs mots</li><li>distinguer un code d'un chiffre</li><li>discuter ce système au regard du principe de Kerckhoffs</li></ul>` },
  ] },
};

if (typeof LEXIQUE !== "undefined") LEXIQUE.push(
  { t: "Scytale", c: "scytale", d: "Bâton autour duquel les Spartiates enroulaient une lanière pour écrire un message. Déroulée, la lanière porte les lettres dans le désordre." },
  { t: "Transposition", c: "scytale", d: "Chiffre qui garde les lettres du message mais change leur ordre. S'oppose à la substitution, qui change les lettres." },
  { t: "Authentifier", c: "scytale", d: "Prouver qui est l'auteur d'un message. C'est un autre besoin que le secret." },
  { t: "Nomenclateur", c: "stuart", d: "Chiffre des XVe-XVIIIe siècles : un symbole par lettre, plus des symboles pour des mots et des noms fréquents." },
  { t: "Thomas Phelippes", c: "stuart", d: "Déchiffreur au service de Walsingham. En 1586, il lit les lettres de Marie Stuart et y ajoute un faux post-scriptum." },
  { t: "Fausse confiance", c: "stuart", d: "Danger d'un chiffre faible : on lui confie ce qu'on n'aurait jamais écrit en clair, et on croit tout ce qui arrive écrit dans ce chiffre." },
  { t: "Chiffre de Vigenère", c: "vigenere", d: "Chaque lettre du message est décalée du rang de la lettre d'un mot-clé répété. Décrit par Bellaso en 1553, attribué plus tard à Vigenère." },
  { t: "Polyalphabétique", c: "vigenere", d: "Se dit d'un chiffre qui utilise plusieurs alphabets de substitution : une même lettre claire est chiffrée de plusieurs façons." },
  { t: "Mot-clé", c: "vigenere", d: "Clé du chiffre de Vigenère. Sa longueur est le nombre d'alphabets utilisés." },
  { t: "Test de Kasiski", c: "kasiski", d: "Méthode pour trouver la longueur d'une clé de Vigenère : les écarts entre les répétitions du message chiffré en sont des multiples." },
  { t: "PGCD", c: "kasiski", d: "Plus grand diviseur commun à plusieurs nombres. Le PGCD de 12, 20 et 32 est 4." },
  { t: "Charles Babbage", c: "kasiski", d: "Mathématicien anglais (1791-1871). Il casse le chiffre de Vigenère vers 1854 sans rien publier." },
  { t: "Principe de Kerckhoffs", c: "kerckhoffs", d: "La sécurité d'un chiffre doit reposer sur le seul secret de la clé. La méthode peut être connue de l'adversaire. Énoncé en 1883." },
  { t: "Sécurité par l'obscurité", c: "kerckhoffs", d: "Compter sur le secret de la méthode pour se protéger. C'est ce que le principe de Kerckhoffs déconseille." },
  { t: "Code", c: "zimmermann", d: "Système qui remplace des mots ou des expressions par des groupes convenus, à l'aide d'un dictionnaire secret. À ne pas confondre avec un chiffre." },
  { t: "Room 40", c: "zimmermann", d: "Bureau de décryptage de l'Amirauté britannique pendant la Première Guerre mondiale. Il lit le télégramme Zimmermann en janvier 1917." },
  { t: "Masque jetable", c: "masque", d: "Chiffre dont la clé est aléatoire, aussi longue que le message et utilisée une seule fois. Le seul dont l'inviolabilité est démontrée." },
  { t: "Secret parfait", c: "masque", d: "Propriété démontrée par Shannon pour le masque jetable : le message chiffré n'apporte aucune information sur le message clair." },
  { t: "Ou exclusif", c: "masque", d: "Opération sur deux bits : 0 s'ils sont égaux, 1 s'ils sont différents. Appliquée deux fois avec la même clé, elle redonne le bit de départ." },
  { t: "Claude Shannon", c: "masque", d: "Mathématicien américain (1916-2001), fondateur de la théorie de l'information. Il démontre en 1949 la sécurité du masque jetable." },
  { t: "Code talkers", c: "navajo", d: "Radios amérindiens de l'armée américaine. Les Navajos des Marines ont transmis dans le Pacifique un code oral qui n'a jamais été cassé." },
);
