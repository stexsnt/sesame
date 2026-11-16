/* ============================================================
   CONTENU DE SÉSAME — la cryptologie, de César au quantique.

   Chaque dossier fait jouer les deux rôles : on chiffre avec la technique de l'époque, puis on la casse
   comme elle a été cassée.

   Champs propres à un dossier : an (nombre, pour l'ordre), date (texte), lieu, niveau, court (nom sur la frise),
   accroche (une phrase pour l'accueil).

   Types d'étapes (moteur commun à Mue, Synapse et Périple) :
     lecon   : { t, titre, texte (HTML), code? (exemple exécutable), synthese? }
     qcm     : { t, titre?, q, doc? (HTML), choix:[...], bon, expl, retours?:[...] }
     tri     : { t, titre, q, categories:[...], items:[{ txt, cat, expl }] }
     ordre   : { t, titre?, q, lignes:[...dans le bon ordre], texte?: true, expl? }
     quiz    : { t, titre, intro?, doc?, widget? (nom d'une manipulation de sesame.js ou machines.js), questions:[{ q, choix, bon, expl }] }
     code    : { t, titre, enonce, depart, solution, d, tests, caches?, indices, requis?, interdit? }
     pari    : { t, titre, q, choix:[...] }   (l'élève s'engage ; aucune correction à ce moment-là)
     manip   : { t, titre, intro (HTML), widget (nom d'une manipulation), expl, verdict?: [une phrase par choix du pari] }

   Où ajouter une étape : à la fin d'un dossier, sans rien de plus. Pour l'insérer AU MILIEU, lui donner
   « numero: n », où n est le premier numéro libre (le nombre d'étapes du dossier avant l'ajout,
   si aucune n'a encore de numéro). Les autres étapes gardent ainsi leur numéro et la progression des
   élèves n'est pas décalée. Ne jamais supprimer ni réutiliser un numéro ; tests/verifier.js le contrôle.
   ============================================================ */

/* ----- Outils de chiffrement utilisés pour fabriquer les énoncés ----- */
const cz = (texte, cle) => texte.replace(/[A-Z]/g, c => String.fromCharCode(65 + (c.charCodeAt(0) - 65 + cle + 26) % 26));
const ALPHA_MELANGE = "QWERTZUIOPASDFGHJKLYXCVBNM";   // A devient Q, B devient W, etc.
const substituer = texte => texte.replace(/[A-Z]/g, c => ALPHA_MELANGE[c.charCodeAt(0) - 65]);
const atbash = texte => texte.replace(/[A-Z]/g, c => String.fromCharCode(155 - c.charCodeAt(0)));

const MESSAGE_BRUTE = { clair: "RENDEZ VOUS AU VIEUX PONT A MINUIT", cle: 7 };
const MESSAGE_FREQ = "LE SAVANT AL KINDI A COMPRIS QUE CHAQUE LANGUE A SES HABITUDES. EN FRANCAIS, LA LETTRE E REVIENT SANS CESSE, SUIVIE DE A, DE S ET DE I. IL SUFFIT DE COMPTER LES SIGNES DU MESSAGE SECRET : LE PLUS FREQUENT CACHE PRESQUE TOUJOURS LA LETTRE E. LES PETITS MOTS LE, LA, LES, DE, UN ET EST FONT LE RESTE. AUCUN ALPHABET MELANGE NE RESISTE A CETTE METHODE.";
/* Message Enigma du dossier 2 : rotors I, II, III, réflecteur B, positions de départ A M D. */
const MESSAGE_ENIGMA = { chiffre: "PPWRGMWIKRRVTKZFRIFUEOBMDDGL", mot: "WETTERBERICHT" };

const PARCOURS = [
{
  id: "sub", titre: "Le secret par substitution", sous: "Remplacer chaque lettre par une autre",
  chapitres: [
  {
    id: "cesar", num: 1, an: -50, date: "de 50 av. J.-C. à 850", lieu: "Rome, puis Bagdad", court: "César et al-Kindi", niveau: "Dès la Seconde",
    titre: "César chiffre, al-Kindi casse", resume: "Le premier chiffre célèbre, et la première méthode pour le briser",
    accroche: "Un général décale l'alphabet de trois lettres. Neuf siècles plus tard, un savant de Bagdad montre qu'aucun alphabet mélangé ne protège un secret.",
    etapes: [
      { t: "lecon", titre: "Le secret d'un général",
        texte: `<p>Jules César commande des légions éparpillées dans toute la Gaule. Ses ordres voyagent à cheval, et un messager peut être capturé. Si l'ennemi lit la lettre, il connaît le plan.</p>
<p>D'après l'historien Suétone, César écrit donc ses messages confidentiels en remplaçant chaque lettre par celle qui se trouve <strong>trois rangs plus loin</strong> dans l'alphabet : A devient D, B devient E, et ainsi de suite. Arrivé à la fin, on repart du début : X devient A.</p>
<p class="chiffre">ROME <span class="fleche">devient</span> URPH</p>
<p>Quatre mots à connaître avant d'aller plus loin :</p>
<ul><li>le <strong>message clair</strong> est le texte lisible ; le <strong>message chiffré</strong> est ce qui circule ;</li><li>la <strong>clé</strong> est le secret partagé : ici, le nombre 3 ;</li><li><strong>déchiffrer</strong>, c'est retrouver le clair quand on connaît la clé ;</li><li><strong>décrypter</strong>, c'est y parvenir <em>sans</em> la clé. C'est le travail de l'adversaire.</li></ul>` },
      { t: "quiz", titre: "La roue de César", widget: "roue",
        intro: "Règle la clé, écris un message, observe. La rangée du haut est l'alphabet clair, celle du bas l'alphabet chiffré.",
        questions: [
          { q: "Avec la clé 3, comment se chiffre le mot ROME ?", choix: ["URPH", "OLJB", "SPNF", "ROME"], bon: 0, expl: "R devient U, O devient R, M devient P, E devient H." },
          { q: "Tu reçois DYH, chiffré avec la clé 3. Quel est le message clair ?", choix: ["GBK", "AVE", "CXG", "EZI"], bon: 1, expl: "Pour déchiffrer, on recule de trois rangs : D redonne A, Y redonne V, H redonne E. AVE, « salut » en latin." },
          { q: "Combien de clés différentes transforment vraiment le message ?", choix: ["3", "25", "26", "Une infinité"], bon: 1, expl: "Les décalages de 1 à 25. La clé 26 ramène chaque lettre sur elle-même, comme la clé 0." },
          { q: "Chiffre un mot avec la clé 13, puis chiffre le résultat encore une fois avec la clé 13. Qu'obtiens-tu ?", choix: ["Un message deux fois plus secret", "Le mot de départ", "Le mot à l'envers"], bon: 1, expl: "13 + 13 = 26 : on a fait un tour complet. Avec la clé 13, chiffrer et déchiffrer sont la même opération." },
        ] },
      { t: "manip", titre: "Message intercepté", widget: "brute",
        intro: `<p>Changement de camp. Tu as intercepté ce message. Tu sais qu'il est chiffré à la manière de César, mais tu ignores la clé.</p><p>Essaie les clés jusqu'à ce que le texte devienne lisible.</p>`,
        expl: "Vingt-cinq essais au maximum : le chiffre de César ne résiste pas à quelqu'un qui connaît la méthode. Cette attaque, qui consiste à essayer toutes les clés, s'appelle la force brute. Pour s'en protéger, il faut beaucoup plus de clés." },
      { t: "lecon", titre: "Mélanger tout l'alphabet",
        texte: `<p>Au lieu de décaler l'alphabet, on peut le mélanger entièrement : A devient Q, B devient W, C devient E… La clé n'est plus un nombre, c'est l'alphabet mélangé tout entier.</p>
<p>Combien de clés possibles ? 26 choix pour la lettre qui remplace A, 25 pour celle qui remplace B, et ainsi de suite :</p>
<p class="formule">26 × 25 × 24 × … × 2 × 1 ≈ 4 × 10<sup>26</sup></p>
<p>Quatre cents millions de milliards de milliards. À un milliard d'essais par seconde, il faudrait plus de dix milliards d'années pour toutes les essayer. La force brute est hors de question.</p>
<p>Pendant près de mille ans, ce chiffre par <strong>substitution</strong> passe pour inviolable.</p>` },
      { t: "pari", titre: "Inviolable ?",
        q: "Un message est chiffré avec un alphabet entièrement mélangé. Il y a environ 4 × 10²⁶ clés possibles et tu n'en connais aucune. Peut-on quand même lire le message ?",
        choix: ["Non : sans la clé, c'est impossible.", "Oui, mais seulement avec un ordinateur très puissant.", "Oui, avec un crayon, du papier et de la patience."] },
      { t: "manip", titre: "Compter les lettres", widget: "frequences",
        intro: `<p>Ce message est chiffré par substitution. Le mélange de l'alphabet t'est inconnu. Mais une lettre chiffrée remplace <em>toujours</em> la même lettre claire : elle en garde donc les habitudes.</p><p>Le diagramme compare les lettres les plus fréquentes du message à celles du français. Propose une lettre claire pour chaque lettre chiffrée, et corrige au fur et à mesure que des mots apparaissent.</p>`,
        verdict: ["Tu avais parié que c'était impossible sans la clé : tu viens de prouver le contraire.", "Tu avais parié qu'il fallait un ordinateur très puissant : un diagramme et un peu de patience ont suffi.", "Tu avais parié sur le crayon et la patience : c'est exactement ce qu'il fallait."],
        expl: "Tu viens de décrypter un message protégé par des centaines de millions de milliards de milliards de clés, sans en essayer une seule. Le nombre de clés ne suffit pas à faire un bon chiffre : il faut aussi que le message chiffré ne laisse rien voir des habitudes de la langue." },
      { t: "lecon", titre: "Le savant de Bagdad",
        texte: `<p>Cette méthode a un auteur. <strong>Al-Kindi</strong> naît vers 801 dans l'actuel Irak. À Bagdad, alors capitale d'un empire qui s'étend de l'Espagne à l'Inde, il travaille auprès des califes, traduit et commente les savants grecs, et écrit sur la médecine, l'astronomie, les mathématiques, la musique.</p>
<p>Vers 850, il rédige un court traité sur le déchiffrement des messages secrets. On y trouve la plus ancienne description connue de ce que tu viens de faire : compter les signes du message, compter les lettres d'un long texte ordinaire dans la même langue, et faire correspondre les plus fréquents entre eux. C'est l'<strong>analyse des fréquences</strong>.</p>
<aside class="contexte"><strong>Pourquoi à Bagdad ?</strong> Les savants de l'époque étudient la langue arabe avec une précision nouvelle : ils comptent les mots et les lettres du Coran pour en dater et en authentifier les passages. Compter les lettres d'un texte n'a rien d'étrange pour eux. Il restait à avoir l'idée de s'en servir contre un message chiffré.</aside>
<aside class="legende"><strong>Histoire ou légende ?</strong> Nous ne connaissons le chiffre de César que par Suétone, qui écrit plus d'un siècle et demi après sa mort ; rien ne dit qu'il s'en servait souvent. Quant au traité d'al-Kindi, il était considéré comme perdu : un exemplaire a été retrouvé en 1987 dans des archives d'Istanbul. Il a donc fallu attendre la fin du XX<sup>e</sup> siècle pour savoir à qui attribuer la méthode.</aside>` },
      { t: "code", titre: "César en Python", d: 2,
        caches: ["cesar('ABC', 1)", "cesar('ZEBRE', 4)", "cesar('BONJOUR A TOUS', 13)"],
        enonce: `<p>Écris la fonction <code>cesar(texte, cle)</code> qui chiffre un texte en majuscules. Les lettres de A à Z sont décalées de <code>cle</code> rangs ; les autres caractères (espaces, ponctuation) restent tels quels.</p><p>Deux outils : <code>ord("A")</code> vaut 65 et <code>chr(65)</code> vaut <code>"A"</code>. L'opérateur <code>%</code> donne le reste d'une division : c'est lui qui fait repartir de A après Z.</p>`,
        depart: `def cesar(texte, cle):
    resultat = ""
    for lettre in texte:
        if "A" <= lettre <= "Z":
            rang = ord(lettre) - 65        # A a le rang 0, Z le rang 25
            # à compléter : calculer le nouveau rang, puis ajouter la nouvelle lettre
            resultat = resultat + lettre
        else:
            resultat = resultat + lettre
    return resultat
`,
        solution: `def cesar(texte, cle):
    resultat = ""
    for lettre in texte:
        if "A" <= lettre <= "Z":
            rang = ord(lettre) - 65        # A a le rang 0, Z le rang 25
            nouveau = (rang + cle) % 26
            resultat = resultat + chr(65 + nouveau)
        else:
            resultat = resultat + lettre
    return resultat
`,
        tests: [{ appels: [["cesar('ROME', 3)", "'URPH'"], ["cesar('AVE CESAR', 3)", "'DYH FHVDU'"], ["cesar('XYZ', 3)", "'ABC'"], ["cesar('URPH', -3)", "'ROME'"]] }],
        indices: ["Le nouveau rang est (rang + cle) % 26.", "La nouvelle lettre est chr(65 + nouveau).", "Pour déchiffrer, il suffit d'appeler la fonction avec la clé opposée : c'est le dernier test."] },
      { t: "code", titre: "La lettre la plus fréquente", d: 2,
        caches: ["lettre_frequente('BANANE')", "lettre_frequente('ZZ TOP')", "lettre_frequente('UN ELEVE REVEUR')"],
        enonce: `<p>Premier geste d'al-Kindi : compter. Écris la fonction <code>lettre_frequente(texte)</code> qui renvoie la lettre de A à Z la plus présente dans un texte en majuscules. Les tests n'utilisent que des textes où une lettre domine nettement.</p>`,
        depart: `def lettre_frequente(texte):
    meilleure = "A"
    record = 0
    for lettre in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        nombre = texte.count(lettre)
        # à compléter : garder la lettre si elle bat le record
    return meilleure
`,
        solution: `def lettre_frequente(texte):
    meilleure = "A"
    record = 0
    for lettre in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        nombre = texte.count(lettre)
        if nombre > record:
            record = nombre
            meilleure = lettre
    return meilleure
`,
        tests: [{ appels: [["lettre_frequente('LE GENERAL DEMANDE DES RENFORTS')", "'E'"], ["lettre_frequente('ABRACADABRA')", "'A'"], ["lettre_frequente('AT VTCTGPA STBPCST STH GTCUDGIH')", "'T'"]] }],
        indices: ["Si nombre est plus grand que record, on a trouvé mieux.", "Dans ce cas, il faut mettre à jour à la fois record et meilleure."] },
      { t: "lecon", synthese: true, titre: "Fiche du dossier",
        texte: `<p><strong>Chiffrer.</strong> César décale l'alphabet d'un nombre fixe de rangs : 25 clés seulement. La substitution mélange tout l'alphabet : environ 4 × 10<sup>26</sup> clés.</p>
<p><strong>Casser.</strong> César tombe à la force brute, en essayant toutes les clés. La substitution tombe à l'analyse des fréquences : la lettre chiffrée la plus fréquente cache très probablement le E.</p>
<p><strong>La leçon.</strong> Beaucoup de clés ne suffisent pas. Un bon chiffre doit aussi effacer les régularités de la langue.</p>
<p><strong>Le vocabulaire.</strong> Clair, chiffré, clé ; déchiffrer (avec la clé), décrypter (sans la clé).</p>
<p><strong>Le contexte.</strong> Jules César, I<sup>er</sup> siècle av. J.-C., d'après Suétone. Al-Kindi, Bagdad, vers 850.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>chiffrer et déchiffrer un message avec le chiffre de César</li><li>décrypter un chiffre de César par force brute</li><li>expliquer le principe de l'analyse des fréquences</li><li>dire pourquoi le nombre de clés ne garantit pas la sécurité</li></ul>` },
    ] },
  ]
},
{
  id: "mac", titre: "Machines et guerres", sous: "Quand le chiffrement devient mécanique",
  chapitres: [
  {
    id: "enigma", num: 2, an: 1932, date: "de 1932 à 1945", lieu: "Varsovie, puis Bletchley Park", court: "Enigma", niveau: "Dès la Seconde",
    titre: "Enigma, la machine à secrets", resume: "Cent cinquante-neuf milliards de milliards de réglages, et un défaut",
    accroche: "L'armée allemande la croit inviolable. Trois mathématiciens polonais la cassent dès 1932, et leurs héritiers britanniques liront les ordres des sous-marins.",
    etapes: [
      { t: "lecon", titre: "Un alphabet qui change à chaque lettre",
        texte: `<p>L'analyse des fréquences a une faiblesse : elle suppose qu'une lettre claire est toujours remplacée par la même lettre chiffrée. Il suffit donc de changer d'alphabet en cours de route. C'est l'idée des chiffres dits polyalphabétiques, connus depuis la Renaissance, mais pénibles à utiliser à la main.</p>
<p>En 1918, l'ingénieur allemand Arthur Scherbius dépose le brevet d'une machine qui fait ce travail toute seule. Il l'appelle <strong>Enigma</strong>. Elle ressemble à une machine à écrire, avec un clavier et, au-dessus, vingt-six petites lampes.</p>
<p>On appuie sur une touche : un courant électrique traverse trois <strong>rotors</strong>, des roues câblées qui remplacent chacune une lettre par une autre, puis un <strong>réflecteur</strong> qui le renvoie à travers les rotors par un autre chemin. Une lampe s'allume : c'est la lettre chiffrée.</p>
<p>Et à chaque frappe, le rotor de droite avance d'un cran. Le chemin du courant change : la même touche n'allume plus la même lampe. L'armée allemande adopte la machine à partir de 1926 et lui ajoute un <strong>tableau de connexions</strong>, des câbles qui échangent des lettres deux à deux avant l'entrée dans les rotors.</p>` },
      { t: "quiz", titre: "Prends les commandes", widget: "enigma",
        intro: "Voici une Enigma à trois rotors, câblée comme celle de l'armée allemande (rotors I, II et III, réflecteur B). Règle les rotors sur A A A, puis tape sur les touches.",
        questions: [
          { q: "Rotors sur A A A, tape cinq fois la lettre A. Qu'obtiens-tu ?", choix: ["AAAAA", "BBBBB", "BDZGO", "DDDDD"], bon: 2, expl: "Cinq lettres différentes pour cinq A : compter les fréquences ne sert plus à rien. C'est exactement ce que voulait Scherbius." },
          { q: "Remets les rotors sur A A A et tape BDZGO. Qu'obtiens-tu ?", choix: ["AAAAA", "BDZGO", "OGZDB", "Autre chose"], bon: 0, expl: "Avec le même réglage, la machine qui chiffre est aussi celle qui déchiffre. C'est le réflecteur qui produit cet effet : si A donne B, alors B donne A." },
          { q: "Que fait le rotor de droite quand on appuie sur une touche ?", choix: ["Rien", "Il avance d'un cran", "Il revient sur A"], bon: 1, expl: "Il avance à chaque frappe. Quand il a fait un tour, il entraîne le rotor du milieu, comme un compteur kilométrique." },
          { q: "Essaie autant que tu veux : une lettre peut-elle être chiffrée en elle-même, par exemple A qui donnerait A ?", choix: ["Oui, de temps en temps", "Non, jamais"], bon: 1, expl: "Jamais. Le réflecteur renvoie toujours le courant par un autre fil que celui par lequel il est arrivé. Retiens ce détail : c'est par là qu'Enigma sera attaquée." },
        ] },
      { t: "lecon", titre: "Combien de réglages ?",
        texte: `<p>Pour lire un message, il faut régler sa machine exactement comme celle de l'expéditeur. Le réglage du jour est la clé. À partir de la fin de 1938, il comporte trois choix :</p>
<ul>
<li><strong>Trois rotors parmi cinq, dans un certain ordre</strong> : 5 × 4 × 3 = 60 possibilités ;</li>
<li><strong>La position de départ de chaque rotor</strong> : 26 × 26 × 26 = 17 576 possibilités ;</li>
<li><strong>Dix câbles sur le tableau de connexions</strong> : 150 738 274 937 250 façons de les brancher.</li>
</ul>
<p>On multiplie :</p>
<p class="formule">60 × 17 576 × 150 738 274 937 250 = 158 962 555 217 826 360 000</p>
<p>Environ 159 milliards de milliards de réglages. Le commandement allemand en conclut qu'Enigma est inviolable. Il commet l'erreur que tu connais déjà : confondre le nombre de clés et la sécurité.</p>` },
      { t: "qcm", titre: "Le défaut",
        q: "Sur Enigma, une lettre n'est jamais chiffrée en elle-même. Pour la sécurité de la machine, est-ce une qualité ou un défaut ?",
        choix: ["Une qualité : le message chiffré ne ressemble jamais au message clair.", "Un défaut : cela donne à l'adversaire une information sur le message clair.", "Cela ne change rien."], bon: 1,
        retours: ["C'est ce que pensaient ses concepteurs. Mais demande-toi ce qu'apprend quelqu'un qui devine un mot du message.", null, "Toute règle que le chiffre respecte toujours est une prise pour l'adversaire."],
        expl: "Si tu vois un K dans le message chiffré, tu es certain que la lettre claire n'est pas un K. C'est peu, mais c'est sûr, et cela suffit pour éliminer des hypothèses par milliers." },
      { t: "quiz", titre: "Le mot probable", widget: "mot",
        intro: "Les messages militaires sont répétitifs. Chaque matin, des stations envoient un bulletin météo, et le mot WETTERBERICHT (« bulletin météo ») y figure presque toujours. Fais glisser ce mot sous le message chiffré : à chaque position, regarde si une lettre du mot se retrouve juste sous la même lettre du message.",
        questions: [
          { q: "En position 1, tout à gauche, le mot peut-il être à cet endroit dans le message clair ?", choix: ["Oui", "Non : une lettre du mot est identique à la lettre chiffrée au-dessus"], bon: 1, expl: "Le dernier T du mot tombe sous un T du message. Or une lettre n'est jamais chiffrée en elle-même : cette position est impossible." },
          { q: "Teste les seize positions. Combien restent possibles ?", choix: ["1", "5", "11", "16"], bon: 1, expl: "Cinq positions survivent ; onze sont éliminées sans avoir touché à la machine. Le mot se trouvait en réalité à la quatrième position." },
          { q: "Pour chaque position restante, que faut-il encore chercher ?", choix: ["Rien, le message est décrypté.", "Les réglages de la machine qui transforment le mot en ce morceau de message chiffré.", "La traduction du mot en anglais."], bon: 1, expl: "Il reste à trouver un réglage compatible. C'est le travail des « bombes », des machines électromécaniques qui essaient les positions des rotors à toute vitesse et s'arrêtent quand une hypothèse tient debout." },
        ] },
      { t: "lecon", titre: "Varsovie, puis Bletchley Park",
        texte: `<p>La première victoire est polonaise. En décembre 1932, <strong>Marian Rejewski</strong>, vingt-sept ans, reconstitue le câblage des rotors par un raisonnement mathématique sur les permutations, aidé par des documents qu'un employé allemand a vendus aux services français. Avec <strong>Jerzy Różycki</strong> et <strong>Henryk Zygalski</strong>, il lit les messages allemands pendant des années.</p>
<p>En juillet 1939, cinq semaines avant l'invasion de leur pays, les Polonais réunissent Français et Britanniques près de Varsovie et leur donnent tout : leurs méthodes, leurs machines, des copies d'Enigma.</p>
<p>Les Britanniques installent leur centre de décryptage à <strong>Bletchley Park</strong>, au nord de Londres. Alan Turing et Gordon Welchman y conçoivent une nouvelle « bombe », fondée sur les mots probables. À la fin de la guerre, près de dix mille personnes y travaillent, en majorité des femmes, et lisent chaque jour des milliers de messages.</p>
<aside class="contexte"><strong>Un secret de trente ans.</strong> Après 1945, tout est détruit ou classé. Les anciens de Bletchley Park ne disent rien, pas même à leur famille. Le public n'apprend l'affaire qu'en 1974.</aside>
<aside class="legende"><strong>Histoire ou légende ?</strong> « Turing a cassé Enigma » : la phrase oublie les Polonais, qui l'ont fait sept ans avant lui, et les milliers de personnes de Bletchley Park. On lit aussi que ce travail a raccourci la guerre de deux ans : c'est l'estimation d'un historien britannique, impossible à vérifier. Enfin, Enigma n'a pas été vaincue par ses seuls défauts : les opérateurs allemands ont beaucoup aidé, avec leurs messages stéréotypés et leurs réglages paresseux.</aside>` },
      { t: "code", titre: "Un chiffre qui tourne", d: 2,
        caches: ["cesar_tournant('AAAAAA', 0)", "cesar_tournant('SOS', 5)", "cesar_tournant('YYYY', 1)"],
        enonce: `<p>Pour sentir l'idée du rotor, modifie le chiffre de César : le décalage augmente de 1 après chaque lettre, comme un rotor qui avance d'un cran. La première lettre est décalée de <code>cle</code>, la deuxième de <code>cle + 1</code>, et ainsi de suite.</p><p>Écris la fonction <code>cesar_tournant(texte, cle)</code>. Le texte ne contient que des majuscules, sans espace.</p>`,
        depart: `def cesar_tournant(texte, cle):
    resultat = ""
    for lettre in texte:
        rang = (ord(lettre) - 65 + cle) % 26
        resultat = resultat + chr(65 + rang)
        # à compléter : faire avancer le rotor
    return resultat
`,
        solution: `def cesar_tournant(texte, cle):
    resultat = ""
    for lettre in texte:
        rang = (ord(lettre) - 65 + cle) % 26
        resultat = resultat + chr(65 + rang)
        cle = cle + 1
    return resultat
`,
        tests: [{ appels: [["cesar_tournant('AAAA', 1)", "'BCDE'"], ["cesar_tournant('ENIGMA', 0)", "'EOKJQF'"], ["cesar_tournant('ZZZ', 1)", "'ABC'"]] }],
        indices: ["Après chaque lettre, la clé doit augmenter de 1.", "cle = cle + 1, à l'intérieur de la boucle."] },
      { t: "lecon", synthese: true, titre: "Fiche du dossier",
        texte: `<p><strong>Chiffrer.</strong> Enigma change d'alphabet à chaque lettre grâce à des rotors qui tournent. Le réglage du jour (rotors, positions, câbles) est la clé : environ 159 milliards de milliards de possibilités.</p>
<p><strong>Casser.</strong> Une lettre n'est jamais chiffrée en elle-même. En devinant un mot du message, on élimine des positions, puis des machines essaient les réglages restants.</p>
<p><strong>La leçon.</strong> Une machine parfaite sur le papier reste fragile si ses utilisateurs sont prévisibles.</p>
<p><strong>Le contexte.</strong> Brevet de Scherbius, 1918. Rejewski, Różycki et Zygalski, Varsovie, 1932. Turing et Welchman, Bletchley Park, 1939-1945.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>expliquer pourquoi l'analyse des fréquences échoue contre Enigma</li><li>calculer le nombre de réglages</li><li>utiliser un mot probable pour éliminer des positions</li><li>dire ce que l'on doit aux mathématiciens polonais</li></ul>` },
    ] },
  ]
},
{
  id: "pub", titre: "La révolution des clés publiques", sous: "Partager un secret sans jamais se rencontrer",
  chapitres: [
  {
    id: "diffie", num: 3, an: 1976, date: "1976", lieu: "Stanford, Californie", court: "Diffie et Hellman", niveau: "Dès la Seconde, puissances et restes",
    titre: "Diffie, Hellman et la clé impossible", resume: "Se mettre d'accord sur un secret devant tout le monde",
    accroche: "Depuis César, il fallait se rencontrer pour partager une clé. Deux chercheurs montrent qu'on peut la fabriquer à distance, sous les yeux d'un espion.",
    etapes: [
      { t: "lecon", titre: "Le problème de la clé",
        texte: `<p>César, les utilisateurs de la substitution, les opérateurs d'Enigma : tous ont le même souci. Avant d'échanger un seul message, il faut s'être mis d'accord sur une clé, et l'avoir fait <strong>en secret</strong>.</p>
<p>L'armée allemande distribuait chaque mois des carnets de réglages par porteur. Les banques des années 1960 envoyaient des coursiers avec des mallettes cadenassées. Cela coûte cher, et cela ne fonctionne qu'entre gens qui se connaissent.</p>
<p>Or tu achètes un billet de train sur un site que tu n'as jamais visité. Ton téléphone et ce site ne se sont jamais rencontrés. Tout ce qu'ils se disent passe par des dizaines de machines qui peuvent écouter. Comment se mettent-ils d'accord sur une clé ?</p>
<p>Jusqu'en 1976, la plupart des spécialistes jugent le problème sans solution.</p>` },
      { t: "pari", titre: "Devant l'espionne",
        q: "Alice et Bob ne se sont jamais rencontrés. Ève entend absolument tout ce qu'ils se disent, du premier au dernier mot. Alice et Bob peuvent-ils quand même se mettre d'accord sur un secret qu'Ève ne connaîtra pas ?",
        choix: ["Non : si Ève entend tout, elle sait tout.", "Oui, mais seulement s'ils utilisent une langue qu'Ève ne comprend pas.", "Oui, même si Ève connaît leur méthode et entend tout."] },
      { t: "quiz", titre: "Un secret en peinture", widget: "couleurs",
        intro: "Première version, avec des pots de peinture. Alice et Bob choisissent une couleur commune, connue de tous. Chacun garde une couleur secrète, la mélange à la couleur commune et envoie le mélange. Chacun ajoute ensuite sa couleur secrète au mélange reçu. Change les couleurs secrètes et observe.",
        questions: [
          { q: "Que voit passer Ève ?", choix: ["Les deux couleurs secrètes", "La couleur commune et les deux mélanges", "La couleur finale"], bon: 1, expl: "Trois pots : la couleur commune, le mélange d'Alice, le mélange de Bob. Les couleurs secrètes ne quittent jamais leurs propriétaires." },
          { q: "Alice et Bob arrivent-ils à la même couleur finale ?", choix: ["Oui, toujours", "Seulement s'ils ont choisi la même couleur secrète", "Non"], bon: 0, expl: "Les deux pots contiennent les trois mêmes peintures : la commune, celle d'Alice, celle de Bob. L'ordre du mélange ne change pas le résultat." },
          { q: "Ève mélange les deux pots qu'elle a vus passer. Obtient-elle le secret ?", choix: ["Oui", "Non : son mélange contient deux doses de couleur commune"], bon: 1, expl: "Elle obtient la commune deux fois, plus les deux secrètes : une autre teinte. Pour trouver le secret, il lui faudrait retirer la couleur commune d'un mélange, et on ne sépare pas des peintures mélangées." },
        ] },
      { t: "lecon", titre: "Des pots de peinture aux nombres",
        texte: `<p>Tout repose sur une opération <strong>facile dans un sens, très difficile dans l'autre</strong> : mélanger est simple, séparer ne l'est pas. Diffie et Hellman trouvent l'équivalent avec des nombres.</p>
<p>On choisit un nombre premier <span class="m">p</span> et un nombre <span class="m">g</span>, connus de tous. Pour « mélanger » un secret <span class="m">a</span>, on calcule <span class="m">g</span> à la puissance <span class="m">a</span>, puis on ne garde que le <strong>reste</strong> de la division par <span class="m">p</span>. On note :</p>
<p class="formule"><span class="m">A</span> = <span class="m">g</span><sup><span class="m">a</span></sup> mod <span class="m">p</span></p>
<p>Avec <span class="m">p</span> = 23 et <span class="m">g</span> = 5 : pour <span class="m">a</span> = 6, on calcule 5<sup>6</sup> = 15 625, puis le reste de la division par 23, qui vaut 8.</p>
<p>Dans ce sens, le calcul est rapide, même avec des nombres de plusieurs centaines de chiffres. Dans l'autre sens, retrouver <span class="m">a</span> quand on connaît seulement 8, 5 et 23, il n'existe aucune méthode vraiment meilleure que d'essayer les exposants un par un. Les restes sautent d'une valeur à l'autre sans aucune régularité apparente.</p>
<p>Le programme ci-dessous affiche les premiers restes. Lance-le et cherche une logique.</p>`,
        code: `p = 23
g = 5
for a in range(1, 12):
    print("5 puissance", a, "donne le reste", g ** a % p)
` },
      { t: "quiz", titre: "L'échange, avec des nombres", widget: "echange",
        intro: "Alice choisit un secret a, Bob un secret b. Chacun envoie g puissance son secret, modulo p. Chacun élève ensuite le nombre reçu à la puissance de son propre secret. Règle a = 6 et b = 15 pour répondre.",
        questions: [
          { q: "Avec a = 6, quel nombre Alice envoie-t-elle à Bob ?", choix: ["6", "8", "19", "30"], bon: 1, expl: "5⁶ = 15 625, et le reste de la division de 15 625 par 23 est 8." },
          { q: "Avec b = 15, quel nombre Bob envoie-t-il à Alice ?", choix: ["2", "8", "15", "19"], bon: 3, expl: "5¹⁵ mod 23 = 19." },
          { q: "Alice calcule 19⁶ mod 23 et Bob calcule 8¹⁵ mod 23. Que constates-tu ?", choix: ["Ils trouvent tous les deux 2.", "Alice trouve 2 et Bob trouve 19.", "Ils trouvent 0."], bon: 0, expl: "Alice a calculé (5¹⁵)⁶ et Bob (5⁶)¹⁵ : dans les deux cas, 5 à la puissance 90. Ils ont le même nombre sans l'avoir jamais transmis." },
          { q: "Ève a vu passer p = 23, g = 5, 8 et 19. Que lui manque-t-il pour calculer le secret ?", choix: ["Rien : il suffit de multiplier 8 par 19.", "L'un des deux exposants secrets, a ou b.", "Le nombre p."], bon: 1, expl: "Sans a ni b, elle ne peut pas refaire le dernier calcul. Elle doit retrouver un exposant à partir d'un reste." },
        ] },
      { t: "manip", titre: "Dans la peau d'Ève", widget: "logarithme",
        intro: `<p>Tu es Ève. Cette fois, <span class="m">p</span> = 467 et <span class="m">g</span> = 2. Tu as vu passer le nombre d'Alice. Retrouve son exposant secret : tu n'as pas d'autre moyen que d'essayer les exposants l'un après l'autre.</p>`,
        verdict: ["Tu avais parié qu'Ève saurait tout : elle a tout entendu, et le secret lui échappe quand même dès que les nombres sont grands.", "Tu avais parié sur une langue secrète : inutile. Ève connaît la méthode, et cela ne lui suffit pas.", "Tu avais parié qu'Alice et Bob y arriveraient même si Ève connaît leur méthode : c'est le résultat de Diffie et Hellman."],
        expl: "Avec un nombre premier à trois chiffres, quelques centaines d'essais suffisent. Les nombres utilisés en pratique ont plus de six cents chiffres : il y a plus d'exposants à essayer que d'atomes dans l'univers. Alice et Bob font un calcul rapide ; Ève fait face à un calcul qui dépasse la durée de vie du Soleil." },
      { t: "code", titre: "La puissance modulaire", d: 2,
        caches: ["puissance_mod(2, 5, 7)", "puissance_mod(3, 200, 13)", "puissance_mod(7, 1, 5)"],
        enonce: `<p>Calculer 5<sup>15</sup> puis diviser par 23 fonctionne, mais avec de grands exposants le nombre intermédiaire devient gigantesque. L'astuce : prendre le reste <strong>après chaque multiplication</strong>. Le résultat final est le même, et les nombres restent petits.</p><p>Écris la fonction <code>puissance_mod(g, a, p)</code> qui calcule <span class="m">g</span><sup><span class="m">a</span></sup> mod <span class="m">p</span> de cette façon, sans utiliser la fonction <code>pow</code>.</p>`,
        depart: `def puissance_mod(g, a, p):
    resultat = 1
    for i in range(a):
        # à compléter : multiplier par g, puis garder le reste
        pass
    return resultat
`,
        solution: `def puissance_mod(g, a, p):
    resultat = 1
    for i in range(a):
        resultat = resultat * g % p
    return resultat
`,
        tests: [{ appels: [["puissance_mod(5, 6, 23)", "8"], ["puissance_mod(5, 15, 23)", "19"], ["puissance_mod(19, 6, 23)", "2"], ["puissance_mod(2, 10, 1000)", "24"]] }],
        interdit: ["pow"],
        indices: ["À chaque tour, resultat est multiplié par g.", "resultat = resultat * g % p"] },
      { t: "lecon", titre: "1976, et un secret de vingt ans",
        texte: `<p>En novembre 1976, <strong>Whitfield Diffie</strong> et <strong>Martin Hellman</strong>, de l'université Stanford, publient un article au titre sobre : « Nouvelles directions en cryptographie ». Ils y décrivent l'échange que tu viens de faire, et posent une idée plus large : une clé peut avoir une partie publique, que l'on affiche, et une partie privée, que l'on garde.</p>
<p>L'article fait l'effet d'une bombe. Pour la première fois, la recherche en cryptographie se fait au grand jour, dans les universités, et non plus seulement dans les services secrets. Aujourd'hui, une variante de cet échange a lieu chaque fois que ton navigateur affiche un cadenas.</p>
<aside class="contexte"><strong>Ce que l'échange ne fait pas.</strong> Il fabrique un secret commun, mais il ne dit pas avec <em>qui</em>. Si Ève ne se contente pas d'écouter et se glisse entre Alice et Bob, elle peut faire un échange avec chacun et lire tout ce qui passe. Il faut donc aussi prouver son identité : c'est le rôle des signatures, que l'on verra avec le chiffre RSA.</aside>
<aside class="legende"><strong>Histoire ou légende ?</strong> Diffie et Hellman n'étaient pas tout à fait les premiers. Au service britannique du chiffre, James Ellis avait eu l'idée dès 1969, Clifford Cocks et Malcolm Williamson l'avaient réalisée en 1973 et 1974. Tenus au secret, ils n'ont rien pu dire : leur travail n'a été rendu public qu'en décembre 1997, quelques semaines après la mort d'Ellis. Et Hellman lui-même a demandé que l'on ajoute au nom de l'échange celui de Ralph Merkle, un étudiant dont les idées avaient ouvert la voie.</aside>` },
      { t: "lecon", synthese: true, titre: "Fiche du dossier",
        texte: `<p><strong>Le problème.</strong> Tous les chiffres anciens exigent une clé partagée en secret avant le premier message.</p>
<p><strong>La solution.</strong> Alice envoie <span class="m">g</span><sup><span class="m">a</span></sup> mod <span class="m">p</span>, Bob envoie <span class="m">g</span><sup><span class="m">b</span></sup> mod <span class="m">p</span>. Chacun élève le nombre reçu à la puissance de son secret : tous deux obtiennent <span class="m">g</span><sup><span class="m">ab</span></sup> mod <span class="m">p</span>.</p>
<p><strong>Pourquoi cela tient.</strong> Calculer une puissance modulaire est rapide. Retrouver l'exposant à partir du résultat est hors de portée quand les nombres sont grands.</p>
<p><strong>La limite.</strong> L'échange ne prouve pas l'identité de celui avec qui on le fait.</p>
<p><strong>Le contexte.</strong> Diffie et Hellman, Stanford, 1976. Travaux antérieurs et secrets d'Ellis, Cocks et Williamson au Royaume-Uni.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>expliquer le problème de la distribution des clés</li><li>refaire l'échange avec de petits nombres</li><li>calculer une puissance modulaire</li><li>dire ce qu'Ève voit, et ce qui lui manque</li></ul>` },
    ] },
  ]
}];

/* Frise de l'accueil : les dossiers annoncés mais pas encore écrits, sous la forme { an, date, nom }. Vide aujourd'hui. */
const A_VENIR = [];

/* ============================================================
   MESSAGES INTERCEPTÉS — des cryptogrammes à casser, sans leçon.
   Champs communs : titre, ep (identifiant de partie, pour l'ambiance), date, origine, d (difficulté 1 à 3), accroche.
     reponse : { t, enonce (HTML), reponse (nombre) ou mot (texte attendu, comparé sans accents ni espaces), indices:[...], expl, histoire? }
     code    : comme dans les dossiers.
   Ajoutez les nouveaux messages à la fin, ou au milieu avec « numero: n » (même règle que pour les étapes).
   ============================================================ */
const DEFIS = { id: "defis", titre: "Messages interceptés", resume: "", etapes: [
  { t: "reponse", titre: "Trois mots de César", ep: "sub", date: "47 av. J.-C.", origine: "Asie Mineure", d: 1,
    accroche: "Une phrase célèbre, une clé inconnue.",
    enonce: `<p>Après une victoire éclair, César aurait envoyé au Sénat un message de trois mots. Le voici, chiffré à sa manière, mais pas avec sa clé habituelle :</p><p class="chiffre">${cz("VENI VIDI VICI", 11)}</p><p><strong>Quelle clé a servi à chiffrer ce message ?</strong></p>`,
    reponse: 11, indices: ["Les trois mots commencent par la même lettre, et deux d'entre eux se terminent par la même.", "Le message clair est en latin : VENI VIDI VICI.", "V est la 22e lettre de l'alphabet, G la 7e. De V à G, en repartant de A après Z, on avance de combien de rangs ?"],
    expl: "V devient G : on avance de 11 rangs (de 22 à 33, soit 7 après avoir retiré 26). Le message clair est VENI VIDI VICI, « je suis venu, j'ai vu, j'ai vaincu »." },
  { t: "reponse", titre: "Le convoi", ep: "sub", date: "exercice", origine: "Message intercepté", d: 1,
    accroche: "Un message de César, une question simple : où ?",
    enonce: `<p>Message intercepté, chiffré par décalage :</p><p class="chiffre">${cz("LE CONVOI QUITTERA LYON JEUDI A L AUBE", 19)}</p><p><strong>De quelle ville le convoi partira-t-il ?</strong></p>`,
    mot: "LYON", indices: ["Cherche les mots très courts : en français, un mot d'une seule lettre est presque toujours A, parfois Y.", "Le mot d'une lettre « T » est sans doute A : la clé vaudrait alors 19."],
    expl: "Avec la clé 19, on lit : LE CONVOI QUITTERA LYON JEUDI A L AUBE. Les mots d'une lettre sont le point faible de tout message où l'on a laissé les espaces." },
  { t: "reponse", titre: "L'alphabet à l'envers", ep: "sub", date: "vers 600 av. J.-C.", origine: "Proche-Orient", d: 2,
    accroche: "Un des plus vieux chiffres connus : il n'a même pas de clé.",
    enonce: `<p>Dans ce chiffre très ancien, l'alphabet est retourné : la première lettre est remplacée par la dernière, la deuxième par l'avant-dernière, et ainsi de suite.</p><p class="chiffre">${atbash("BABEL")}</p><p><strong>Quel nom de ville se cache derrière ces cinq lettres ?</strong></p>`,
    mot: "BABEL", indices: ["A est échangé avec Z, B avec Y, C avec X…", "Y redonne B. Z redonne A."],
    expl: "Y, Z, Y, V, O redonnent B, A, B, E, L : Babel, c'est-à-dire Babylone. Appliquer deux fois ce chiffre redonne le texte de départ.",
    histoire: `<aside class="contexte"><strong>Atbash.</strong> Ce chiffre porte un nom hébreu, formé de la première lettre de l'alphabet (aleph), de la dernière (tav), de la deuxième (beth) et de l'avant-dernière (shin). On en trouve la trace dans la Bible : dans le livre de Jérémie, le nom « Sheshak » désigne Babel, écrit à l'envers de l'alphabet.</aside>` },
  { t: "reponse", titre: "Le secret d'Alice et Bob", ep: "pub", date: "1976", origine: "Échange de Diffie et Hellman", d: 3,
    accroche: "Tu as tout entendu. Il ne te manque qu'un exposant.",
    enonce: `<p>Tu es Ève. Alice et Bob viennent de faire un échange de Diffie et Hellman, et tu as tout noté :</p><ul><li>le nombre premier : <span class="m">p</span> = 47 ;</li><li>la base : <span class="m">g</span> = 5 ;</li><li>le nombre envoyé par Alice : 43 ;</li><li>le nombre envoyé par Bob : 26.</li></ul><p><strong>Quel est leur secret commun ?</strong> Tu peux t'aider de Python dans n'importe quel exercice de code du dossier.</p>`,
    reponse: 40, indices: ["Cherche d'abord l'exposant secret d'Alice : pour quel a le reste de 5 puissance a, divisé par 47, vaut-il 43 ?", "L'exposant d'Alice est 13.", "Le secret commun est le nombre de Bob, 26, élevé à la puissance 13, modulo 47."],
    expl: "5¹³ mod 47 = 43 : l'exposant d'Alice est 13. Le secret vaut 26¹³ mod 47 = 40. Avec un nombre premier à deux chiffres, Ève gagne en quelques essais ; c'est la taille des nombres qui fait la sécurité." },
  { t: "code", titre: "Le décrypteur automatique", ep: "sub", date: "IXe siècle", origine: "D'après al-Kindi", d: 3,
    accroche: "Programme la méthode d'al-Kindi contre le chiffre de César.",
    caches: [`decrypte('${cz("LES RENFORTS ARRIVENT DEMAIN PAR LE COL DE L EST", 8)}')`, `decrypte('${cz("CETTE METHODE REPOSE SUR LA LETTRE E", 21)}')`],
    enonce: `<p>Un message a été chiffré par décalage, avec une clé inconnue. On suppose que la lettre la plus fréquente du message chiffré correspond à la lettre E du message clair.</p><p>Écris la fonction <code>decrypte(texte)</code> qui renvoie le message clair. Le texte est en majuscules ; les espaces restent des espaces.</p>`,
    depart: `def decrypte(texte):
    # 1. trouver la lettre la plus fréquente
    # 2. en déduire la clé (cette lettre remplace E)
    # 3. déchiffrer
    return texte
`,
    solution: `def decrypte(texte):
    meilleure = "A"
    for lettre in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        if texte.count(lettre) > texte.count(meilleure):
            meilleure = lettre
    cle = (ord(meilleure) - ord("E")) % 26
    clair = ""
    for lettre in texte:
        if "A" <= lettre <= "Z":
            clair = clair + chr(65 + (ord(lettre) - 65 - cle) % 26)
        else:
            clair = clair + lettre
    return clair
`,
    tests: [{ appels: [[`decrypte('${cz("LE GENERAL DEMANDE DES RENFORTS", 5)}')`, "'LE GENERAL DEMANDE DES RENFORTS'"], [`decrypte('${cz("RENDEZ VOUS DERRIERE LE THEATRE", 17)}')`, "'RENDEZ VOUS DERRIERE LE THEATRE'"], ["decrypte('ELEVE')", "'ELEVE'"]] }],
    indices: ["texte.count(lettre) compte les apparitions d'une lettre.", "Si la lettre la plus fréquente est J, la clé est le nombre de rangs entre E et J : (ord('J') - ord('E')) % 26.", "Pour déchiffrer, on recule de cle rangs : (rang - cle) % 26."] },
] };
