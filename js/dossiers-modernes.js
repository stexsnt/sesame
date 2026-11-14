/* ============================================================
   SÉSAME — dossiers de 1977 à demain, puis assemblage de toutes les parties et messages interceptés supplémentaires.
   Même format que contenu.js.
   ============================================================ */

/* Empreinte naïve : somme des rangs des lettres (A = 1) et des chiffres, dont on garde les deux derniers chiffres. */
const empreinteNaive = texte => String([...String(texte).normalize("NFD").toUpperCase()].reduce((a, c) => a + (c >= "A" && c <= "Z" ? c.charCodeAt(0) - 64 : c >= "0" && c <= "9" ? +c : 0), 0) % 100).padStart(2, "0");
const MESSAGE_EMPREINTE = "TOM DOIT 10 EUROS A LEA";
const ETAPES_HTTPS = [
  { nom: "Le bonjour", sens: "aller", passe: "« Bonjour, voici les méthodes de chiffrement que je connais »", outil: "aucun, tout est en clair",
    texte: "Ton navigateur contacte le site et annonce ce qu'il sait faire. Rien n'est encore secret : celui qui écoute voit à quel site tu t'adresses." },
  { nom: "Le certificat", sens: "retour", passe: "« Voici mon certificat »", outil: "une signature, donc une empreinte et une clé publique",
    texte: "Le site envoie sa carte d'identité : son nom, sa clé publique, et la signature d'une autorité de certification. Ton navigateur contient la liste des autorités reconnues et vérifie la signature. Si elle est fausse, il affiche une alerte." },
  { nom: "La clé de session", sens: "double", passe: "Les deux nombres d'un échange de Diffie et Hellman", outil: "l'échange de Diffie et Hellman",
    texte: "Navigateur et site fabriquent un secret commun sous les yeux de tous. Le site signe sa part de l'échange : impossible pour un intrus de se glisser entre les deux." },
  { nom: "La conversation", sens: "double", passe: "Des données chiffrées", outil: "un chiffre à clé secrète, très rapide, comme AES",
    texte: "Tout le reste, pages, mots de passe, numéros de carte, est chiffré avec la clé de session. Chaque morceau porte aussi une empreinte de contrôle : s'il est modifié en route, il est rejeté." },
];

const DOSSIERS_MODERNES = {
rsa: {
  id: "rsa", an: 1977, date: "1977", lieu: "Cambridge, Massachusetts", court: "RSA", niveau: "Dès la Seconde, nombres premiers",
  titre: "RSA, le cadenas ouvert", resume: "Une clé pour fermer, que tout le monde connaît ; une autre pour ouvrir, que l'on garde",
  accroche: "Trois chercheurs trouvent comment publier la clé qui chiffre sans dévoiler celle qui déchiffre. Leur secret : deux nombres premiers.",
  etapes: [
    { t: "lecon", titre: "Un cadenas pour tout le monde",
      texte: `<p>Diffie et Hellman avaient montré comment fabriquer un secret à distance. Dans le même article, ils rêvaient d'aller plus loin : un chiffre où la clé qui sert à <strong>chiffrer</strong> ne permettrait pas de <strong>déchiffrer</strong>.</p>
<p>Imagine que Bob fabrique des milliers de cadenas ouverts, tous identiques, et les distribue à qui en veut. N'importe qui peut glisser un message dans une boîte et la fermer avec un cadenas de Bob : il suffit de le claquer. Mais une fois fermé, seul Bob peut l'ouvrir, avec la clé qu'il n'a jamais donnée à personne.</p>
<p>Le cadenas, c'est la <strong>clé publique</strong>. La clé de Bob, c'est la <strong>clé privée</strong>. Diffie et Hellman ne savaient pas comment construire un tel système avec des nombres.</p>
<p>Au printemps 1977, au MIT, trois chercheurs s'y essaient depuis des mois : <strong>Ron Rivest</strong> et <strong>Adi Shamir</strong> proposent des systèmes, <strong>Leonard Adleman</strong> les casse. Début avril, Rivest en trouve un qui résiste. On l'appelle <strong>RSA</strong>, d'après leurs initiales.</p>` },
    { t: "pari", titre: "Une clé que tout le monde connaît",
      q: "Bob publie sa clé de chiffrement sur Internet, à la vue de tous, espions compris. Ses messages restent-ils secrets ?",
      choix: ["Non : celui qui sait chiffrer sait forcément déchiffrer.", "Oui, à condition que défaire le calcul soit hors de portée sans une information que Bob garde pour lui.", "Oui, mais seulement quelques heures."] },
    { t: "quiz", titre: "RSA en miniature", widget: "rsa",
      intro: "Les nombres sont minuscules pour que tu puisses suivre. Le message est un nombre m. Alice le chiffre avec la clé publique de Bob.",
      questions: [
        { q: "Alice veut envoyer m = 5. Quel nombre envoie-t-elle ?", choix: ["15", "26", "125", "5"], bon: 1, expl: "5³ = 125, et le reste de 125 dans la division par 33 est 26." },
        { q: "Bob reçoit 26 et l'élève à la puissance 7, modulo 33. Que retrouve-t-il ?", choix: ["5", "7", "26", "33"], bon: 0, expl: "Le message de départ. Les exposants 3 et 7 ont été choisis pour se défaire l'un l'autre." },
        { q: "Qui peut chiffrer un message pour Bob ?", choix: ["Seulement Alice", "Tous ceux qui connaissent n et e, c'est-à-dire tout le monde", "Seulement Bob"], bon: 1, expl: "C'est tout l'intérêt : Bob n'a besoin d'avoir rencontré personne." },
        { q: "Ève connaît n = 33 et e = 3. Que lui manque-t-il pour déchiffrer ?", choix: ["Rien", "L'exposant privé d", "Le message chiffré"], bon: 1, expl: "Sans d, elle ne peut pas refaire le calcul de Bob. Toute la question est : peut-elle retrouver d ?" },
      ] },
    { t: "lecon", titre: "Le secret est dans les facteurs",
      texte: `<p>D'où vient le 7 ? Bob a commencé par choisir deux nombres premiers, 3 et 11, et les a multipliés : <span class="m">n</span> = 33. Il a publié 33, mais pas 3 ni 11.</p>
<p>Avec ses deux nombres premiers, Bob calcule (3 − 1) × (11 − 1) = 20. Il choisit ensuite <span class="m">e</span> = 3, puis cherche <span class="m">d</span> tel que <span class="m">e</span> × <span class="m">d</span> ait pour reste 1 dans la division par 20. Comme 3 × 7 = 21, il prend <span class="m">d</span> = 7. Un théorème d'Euler, vieux de deux siècles, garantit alors que la puissance 7 défait la puissance 3.</p>
<p>Ève, elle, ne connaît que 33. Pour refaire ce calcul, il lui faut 3 et 11 : elle doit <strong>factoriser</strong> <span class="m">n</span>.</p>
<p class="formule">Multiplier deux nombres premiers : facile. Retrouver les deux facteurs à partir du produit : très long.</p>
<p>Avec 33, c'est immédiat. Avec un nombre de plusieurs centaines de chiffres, aucune méthode connue n'y parvient en un temps raisonnable sur un ordinateur ordinaire.</p>` },
    { t: "manip", titre: "Dans la peau d'Ève", widget: "facteurs",
      intro: `<p>Tu es Ève. Voici quatre clés publiques, de plus en plus grandes. Pour chacune, retrouve les deux nombres premiers. Tu as droit au brouillon et à la calculatrice.</p>`,
      verdict: ["Tu avais parié que savoir chiffrer suffisait pour déchiffrer : tu viens de voir qu'il faut d'abord factoriser, et que cela se complique vite.", "Tu avais parié que tout tenait à un calcul impossible à défaire sans une information gardée secrète : c'est exactement le principe de RSA.", "Tu avais parié sur quelques heures : avec des nombres de plusieurs centaines de chiffres, on parle de durées qui dépassent l'âge de l'Univers."],
      expl: "Pour 8633, il t'a fallu essayer une vingtaine de nombres premiers. Chaque chiffre ajouté allonge la recherche. Les clés RSA actuelles comptent 617 chiffres." },
    { t: "code", titre: "Le plus petit facteur", d: 2,
      caches: ["plus_petit_facteur(15)", "plus_petit_facteur(49)", "plus_petit_facteur(10403)"],
      enonce: `<p>Écris la fonction <code>plus_petit_facteur(n)</code> qui renvoie le plus petit nombre, à partir de 2, qui divise <span class="m">n</span>. C'est ce que tu viens de faire à la main.</p><p>Rappel : <code>n % d == 0</code> est vrai quand <span class="m">d</span> divise <span class="m">n</span>.</p>`,
      depart: `def plus_petit_facteur(n):
    d = 2
    # à compléter : tant que d ne divise pas n, passer au suivant
    return d
`,
      solution: `def plus_petit_facteur(n):
    d = 2
    while n % d != 0:
        d = d + 1
    return d
`,
      tests: [{ appels: [["plus_petit_facteur(33)", "3"], ["plus_petit_facteur(221)", "13"], ["plus_petit_facteur(8633)", "89"], ["plus_petit_facteur(97)", "97"]] }],
      requis: ["while"],
      indices: ["La boucle continue tant que n % d != 0.", "Dans la boucle : d = d + 1."] },
    { t: "code", titre: "La clé privée", d: 2,
      caches: ["cle_privee(3, 40)", "cle_privee(7, 60)", "cle_privee(17, 3120)"],
      enonce: `<p>Bob connaît <span class="m">e</span> et le nombre (<span class="m">p</span> − 1)(<span class="m">q</span> − 1), noté ici <code>phi</code>. Écris la fonction <code>cle_privee(e, phi)</code> qui renvoie le plus petit <span class="m">d</span> positif tel que <span class="m">e</span> × <span class="m">d</span> ait pour reste 1 dans la division par <code>phi</code>.</p>`,
      depart: `def cle_privee(e, phi):
    d = 1
    # à compléter
    return d
`,
      solution: `def cle_privee(e, phi):
    d = 1
    while e * d % phi != 1:
        d = d + 1
    return d
`,
      tests: [{ appels: [["cle_privee(3, 20)", "7"], ["cle_privee(7, 40)", "23"], ["cle_privee(5, 96)", "77"]] }],
      requis: ["while"],
      indices: ["On essaie d = 1, 2, 3… jusqu'à ce que e * d % phi vaille 1.", "while e * d % phi != 1:"] },
    { t: "lecon", titre: "Cent dollars et quarante millions de milliards d'années",
      texte: `<p>En août 1977, le journaliste Martin Gardner présente RSA dans la revue <em>Scientific American</em>. Les trois chercheurs y lancent un défi : un message chiffré avec une clé de 129 chiffres, et cent dollars pour qui le lira. Rivest estime qu'il faudrait quarante millions de milliards d'années pour factoriser un nombre de cette taille.</p>
<p>Il en a fallu dix-sept. En avril 1994, environ six cents volontaires de plus de vingt pays, reliés par Internet, viennent à bout du nombre après huit mois de calcul. Le message caché était une phrase absurde, où il était question de mots magiques et d'un gypaète délicat. En 2015, le même calcul a été refait en une journée, pour une trentaine de dollars de location d'ordinateurs.</p>
<p>RSA n'est pas cassé pour autant : il suffit d'allonger les clés. Mais l'histoire rappelle qu'un chiffre fondé sur la difficulté d'un calcul n'est sûr que tant que personne ne calcule mieux.</p>
<aside class="legende"><strong>Histoire ou légende ?</strong> Comme pour Diffie et Hellman, les services britanniques étaient passés par là. En 1973, le jeune mathématicien Clifford Cocks avait trouvé le même système, en une soirée dit-on, pour le service du chiffre. Son travail est resté secret jusqu'en 1997.</aside>
<aside class="contexte"><strong>Dans ton téléphone.</strong> RSA est lent : on ne s'en sert pas pour chiffrer une vidéo. On l'utilise pour deux tâches courtes et décisives : transmettre une clé, et signer.</aside>` },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Le principe.</strong> Deux clés : une publique pour chiffrer, une privée pour déchiffrer.</p>
<p><strong>Les calculs.</strong> Bob choisit deux nombres premiers <span class="m">p</span> et <span class="m">q</span>, publie <span class="m">n</span> = <span class="m">pq</span> et <span class="m">e</span>. Alice envoie <span class="m">m</span><sup><span class="m">e</span></sup> mod <span class="m">n</span>. Bob calcule la puissance <span class="m">d</span> du nombre reçu.</p>
<p><strong>Pourquoi cela tient.</strong> Pour trouver <span class="m">d</span>, il faut <span class="m">p</span> et <span class="m">q</span>, donc factoriser <span class="m">n</span>.</p>
<p><strong>Le contexte.</strong> Rivest, Shamir et Adleman, MIT, 1977. Clifford Cocks, 1973, en secret. Défi de 129 chiffres résolu en 1994.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>distinguer clé publique et clé privée</li><li>chiffrer et déchiffrer avec de petits nombres</li><li>expliquer le rôle de la factorisation</li><li>dire pourquoi la taille des clés augmente avec le temps</li></ul>` },
  ] },

hachage: {
  id: "hachage", an: 1991, date: "des années 1990 à 2017", lieu: "Partout", court: "Empreintes et signatures", niveau: "Dès la Seconde",
  titre: "Empreintes et signatures", resume: "Prouver qu'un message n'a pas changé, et qu'il vient bien de son auteur",
  accroche: "Chiffrer ne suffit pas. Il faut aussi savoir si le message a été modifié en route, et qui l'a vraiment écrit.",
  etapes: [
    { t: "lecon", titre: "Un résumé impossible à truquer",
      texte: `<p>Souviens-toi de Marie Stuart : son chiffre était cassé, et Phelippes a pu ajouter un faux post-scriptum. Le secret ne suffit pas. Il faut aussi garantir qu'un message est <strong>intact</strong> et qu'il vient bien de son <strong>auteur</strong>.</p>
<p>Le premier outil est la <strong>fonction de hachage</strong>. Elle prend un texte de n'importe quelle longueur, un mot ou un film entier, et en tire une <strong>empreinte</strong> de taille fixe, une courte suite de caractères. Une bonne fonction de hachage a quatre qualités :</p>
<ul><li>le même texte donne toujours la même empreinte ;</li><li>changer une seule lettre change toute l'empreinte ;</li><li>à partir de l'empreinte, on ne peut pas remonter au texte ;</li><li>on ne sait pas fabriquer deux textes différents qui ont la même empreinte. Deux textes dans ce cas forment une <strong>collision</strong>.</li></ul>
<p>Pour vérifier qu'un fichier n'a pas été modifié, il suffit alors de comparer deux empreintes.</p>` },
    { t: "quiz", titre: "Deux empreintes", widget: "empreinte",
      intro: "La machine calcule deux empreintes du même texte : une naïve, que tu peux vérifier de tête, et SHA-256, utilisée partout aujourd'hui.",
      questions: [
        { q: "Quelle est l'empreinte naïve de BAC ?", choix: ["06", "24", "63", "03"], bon: 0, expl: "B vaut 2, A vaut 1, C vaut 3 : la somme fait 6." },
        { q: "Écris maintenant CAB. Que constates-tu pour l'empreinte naïve ?", choix: ["Elle change.", "Elle est identique : c'est une collision."], bon: 1, expl: "Une somme ne dépend pas de l'ordre. Trouver des collisions est un jeu d'enfant : cette empreinte ne vaut rien." },
        { q: "Regarde SHA-256 pour BAC, puis pour BAD. Combien de caractères de l'empreinte ont changé ?", choix: ["Un seul, le dernier", "Presque tous"], bon: 1, expl: "Une lettre voisine, et l'empreinte n'a plus rien à voir. On appelle cela l'effet d'avalanche." },
        { q: "Écris un mot, puis une phrase entière. Que devient la longueur de l'empreinte SHA-256 ?", choix: ["Elle grandit avec le texte.", "Elle ne change pas : 64 caractères."], bon: 1, expl: "Toujours 256 bits, écrits ici avec 64 chiffres hexadécimaux, quel que soit le texte." },
      ] },
    { t: "manip", titre: "Le faussaire", widget: "collision",
      intro: `<p>Tom a signé une reconnaissance de dette. Pour aller vite, on n'a pas signé le texte, mais son empreinte, calculée avec la méthode naïve. Fabrique un <em>autre</em> texte qui a la même empreinte : la signature de Tom vaudra aussi pour lui.</p>`,
      expl: "Échanger deux prénoms ou deux chiffres suffit, puisque la somme ne change pas. Avec une vraie fonction de hachage, personne ne sait fabriquer un second texte de même empreinte. Tant que cela reste vrai, signer l'empreinte revient à signer le texte." },
    { t: "lecon", titre: "Les empreintes vieillissent aussi",
      texte: `<p>Une fonction de hachage est sûre tant que personne ne sait fabriquer de collision. L'histoire récente montre que cela ne dure pas toujours.</p>
<ul><li><strong>MD5</strong>, très utilisée dans les années 1990, tombe en 2004 : l'équipe de la chercheuse chinoise Wang Xiaoyun présente des collisions.</li><li><strong>SHA-1</strong>, norme américaine de 1995, est fragilisée dès 2005 par la même équipe. En février 2017, des chercheurs de Google et d'un institut d'Amsterdam publient deux fichiers PDF différents qui ont exactement la même empreinte SHA-1.</li><li><strong>SHA-256</strong> et ses cousines tiennent toujours.</li></ul>
<aside class="contexte"><strong>Ton mot de passe.</strong> Un site sérieux ne garde pas ton mot de passe. Il n'en garde que l'empreinte. Quand tu te connectes, il calcule l'empreinte de ce que tu tapes et compare. Si sa base est volée, le voleur n'obtient que des empreintes. Il peut encore essayer des millions de mots de passe courants et comparer : c'est pourquoi « 123456 » ne protège rien.</aside>` },
    { t: "lecon", titre: "Signer avec sa clé privée",
      texte: `<p>RSA a une propriété remarquable : les deux clés peuvent s'utiliser dans l'autre sens. Ce qui a été transformé avec la clé <strong>privée</strong> se défait avec la clé <strong>publique</strong>.</p>
<p>Cela ne cache rien, puisque tout le monde a la clé publique. Mais cela <strong>prouve</strong> quelque chose : seul le détenteur de la clé privée a pu produire ce résultat. C'est une <strong>signature</strong>.</p>
<ol><li>Alice calcule l'empreinte de son message.</li><li>Elle transforme cette empreinte avec sa clé privée : c'est la signature, qu'elle joint au message.</li><li>Bob calcule de son côté l'empreinte du message reçu.</li><li>Il ouvre la signature avec la clé publique d'Alice. S'il retrouve la même empreinte, le message vient d'Alice et n'a pas été modifié.</li></ol>` },
    { t: "quiz", titre: "Vrai ou faux message ?", widget: "signature",
      intro: "Signature miniature : l'empreinte est un nombre de 0 à 32, la clé privée d'Alice est d = 7, sa clé publique e = 3 et n = 33. À gauche, ce qu'Alice signe. À droite, ce que Bob reçoit : à toi de le modifier.",
      questions: [
        { q: "Bob reçoit le message tel qu'Alice l'a écrit. Que dit la vérification ?", choix: ["Signature valable", "Signature fausse"], bon: 0, expl: "L'empreinte du message reçu est égale à celle qu'Alice a signée." },
        { q: "Dans le message reçu, remplace MIDI par MINUIT. Que se passe-t-il ?", choix: ["Rien, la signature reste valable.", "La vérification échoue."], bon: 1, expl: "L'empreinte du message modifié n'est plus celle qu'Alice a signée. Le post-scriptum de Phelippes aurait été repéré." },
        { q: "Ève veut signer un message à la place d'Alice. Que lui faut-il ?", choix: ["La clé publique d'Alice", "La clé privée d'Alice", "L'empreinte du message"], bon: 1, expl: "Tout le monde peut vérifier, une seule personne peut signer." },
        { q: "La signature empêche-t-elle Ève de lire le message ?", choix: ["Oui", "Non : signer n'est pas chiffrer"], bon: 1, expl: "Une signature garantit l'auteur et l'intégrité, pas le secret. Pour avoir les deux, on signe et on chiffre." },
      ] },
    { t: "code", titre: "Une empreinte naïve", d: 2,
      caches: ["empreinte('A')", "empreinte('ZZZZ')", "empreinte('TOM DOIT DIX EUROS')"],
      enonce: `<p>Écris la fonction <code>empreinte(texte)</code> qui renvoie la somme des rangs des lettres majuscules du texte (A vaut 1, B vaut 2…), dont on ne garde que le reste dans la division par 100. Les autres caractères sont ignorés.</p>`,
      depart: `def empreinte(texte):
    somme = 0
    for lettre in texte:
        if "A" <= lettre <= "Z":
            # à compléter
            pass
    return somme % 100
`,
      solution: `def empreinte(texte):
    somme = 0
    for lettre in texte:
        if "A" <= lettre <= "Z":
            somme = somme + ord(lettre) - 64
    return somme % 100
`,
      tests: [{ appels: [["empreinte('BAC')", "6"], ["empreinte('CAB')", "6"], ["empreinte('SESAME OUVRE TOI')", "87"]] }],
      indices: ["Le rang d'une lettre est ord(lettre) - 64.", "somme = somme + ord(lettre) - 64"] },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>L'empreinte.</strong> Un résumé de taille fixe. Même texte, même empreinte ; une lettre changée, tout change ; pas de retour en arrière ; pas de collision connue.</p>
<p><strong>La signature.</strong> L'empreinte du message, transformée avec la clé privée. Tout le monde peut la vérifier avec la clé publique.</p>
<p><strong>Ce que cela garantit.</strong> L'intégrité (le message n'a pas changé) et l'authenticité (il vient bien de son auteur). Pas le secret.</p>
<p><strong>Le contexte.</strong> MD5 cassée en 2004, SHA-1 en 2017. SHA-256 est la référence actuelle.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>citer les qualités d'une fonction de hachage</li><li>expliquer ce qu'est une collision</li><li>décrire les étapes d'une signature</li><li>dire pourquoi un site ne doit garder que l'empreinte des mots de passe</li></ul>` },
  ] },

https: {
  id: "https", an: 1995, date: "de 1995 à aujourd'hui", lieu: "Dans ton navigateur", court: "Le cadenas du navigateur", niveau: "Dès la Seconde, SNT",
  titre: "Le cadenas du navigateur", resume: "Tout ce que tu as appris, assemblé en une demi-seconde",
  accroche: "Chaque fois qu'une adresse commence par https, ton navigateur rejoue Diffie et Hellman, vérifie une signature et choisit un chiffre. Tu ne vois qu'un cadenas.",
  etapes: [
    { t: "lecon", titre: "Trois besoins, trois outils",
      texte: `<p>Tu te connectes au site de ton lycée, à une boutique, à ta banque. Entre ton appareil et le site, tes données traversent la box, les câbles de ton fournisseur d'accès, des dizaines de routeurs. À chaque étape, quelqu'un pourrait écouter ou modifier ce qui passe.</p>
<p>Le protocole <strong>HTTPS</strong> répond à trois besoins. Tu connais déjà un outil pour chacun :</p>
<ul><li><strong>L'authenticité</strong> : est-ce bien le vrai site ? Réponse : une <em>signature</em>.</li><li><strong>La confidentialité</strong> : personne d'autre ne doit lire. Réponse : un <em>échange de clé</em>, puis un <em>chiffre</em>.</li><li><strong>L'intégrité</strong> : rien ne doit être modifié en route. Réponse : une <em>empreinte</em>.</li></ul>
<p>Le chiffre lui-même n'est ni RSA ni Diffie et Hellman, trop lents pour des pages entières. C'est un chiffre à <strong>clé secrète</strong>, lointain descendant d'Enigma : la même clé chiffre et déchiffre, et il traite des milliards de bits par seconde. Les outils à clé publique ne servent qu'au début, pour se présenter et se mettre d'accord sur cette clé.</p>` },
    { t: "quiz", titre: "Une connexion au ralenti", widget: "cadenas",
      intro: "Fais défiler les quatre temps d'une connexion.",
      questions: [
        { q: "À quoi sert le certificat ?", choix: ["À chiffrer les pages", "À prouver l'identité du site", "À accélérer la connexion"], bon: 1, expl: "Il relie le nom du site à sa clé publique, et une autorité reconnue par ton navigateur l'a signé." },
        { q: "Comment navigateur et site obtiennent-ils la clé de session ?", choix: ["Le site l'envoie en clair.", "Par un échange de Diffie et Hellman.", "Elle est écrite dans le certificat."], bon: 1, expl: "Elle est fabriquée des deux côtés et ne circule jamais." },
        { q: "Pourquoi le site signe-t-il sa part de l'échange ?", choix: ["Pour empêcher un intrus de se placer entre les deux et de faire un échange avec chacun.", "Pour gagner du temps.", "Pour chiffrer plus fort."], bon: 0, expl: "C'était la limite de Diffie et Hellman : l'échange ne dit pas avec qui on le fait. La signature comble ce manque." },
        { q: "Avec quoi les pages elles-mêmes sont-elles chiffrées ?", choix: ["Avec RSA", "Avec un chiffre à clé secrète, beaucoup plus rapide", "Avec le chiffre de Vigenère"], bon: 1, expl: "La cryptographie à clé publique ouvre la conversation ; un chiffre à clé secrète fait tout le reste." },
      ] },
    { t: "ordre", titre: "Les quatre temps", texte: true,
      q: "Remets les étapes d'une connexion HTTPS dans l'ordre.",
      lignes: ["Le navigateur dit bonjour et annonce les méthodes qu'il connaît.", "Le site envoie son certificat, que le navigateur vérifie.", "Les deux fabriquent une clé de session par un échange de Diffie et Hellman.", "Les pages circulent, chiffrées avec la clé de session."],
      expl: "Se présenter, prouver son identité, se mettre d'accord sur une clé, parler." },
    { t: "tri", titre: "Ce que voit celui qui écoute",
      q: "Tu es connecté en HTTPS sur le Wi-Fi d'un café. Quelqu'un écoute tout ce qui passe. Que voit-il ?",
      categories: ["Il le voit", "Il ne le voit pas"],
      items: [
        { txt: "Le nom du site que tu visites", cat: 0, expl: "Le bonjour n'est pas chiffré, et l'adresse du serveur est visible." },
        { txt: "Le mot de passe que tu tapes", cat: 1, expl: "Il circule chiffré avec la clé de session." },
        { txt: "Le texte des pages que tu lis", cat: 1, expl: "Chiffré lui aussi." },
        { txt: "L'heure et la durée de ta connexion", cat: 0, expl: "On ne peut pas cacher qu'un échange a lieu." },
        { txt: "La quantité de données échangées", cat: 0, expl: "La taille des messages reste visible, même si leur contenu ne l'est pas." },
      ] },
    { t: "qcm", titre: "Ce que le cadenas ne dit pas",
      q: "Un site affiche le cadenas. Que peux-tu en conclure ?",
      choix: ["Le site est honnête.", "La connexion avec ce site est chiffrée, et le site est bien celui dont le nom s'affiche. Rien de plus.", "Le site ne contient aucun virus."], bon: 1,
      retours: ["Un escroc peut très bien obtenir un certificat pour son propre site.", null, "Le cadenas ne dit rien du contenu."],
      expl: "Le cadenas garantit le tuyau, pas ce qu'il y a au bout. Un faux site de banque peut avoir un cadenas : c'est le nom dans la barre d'adresse qu'il faut lire." },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Trois garanties.</strong> Authenticité (signature et certificat), confidentialité (échange de clé puis chiffre à clé secrète), intégrité (empreinte).</p>
<p><strong>Quatre temps.</strong> Bonjour, certificat, clé de session, conversation chiffrée.</p>
<p><strong>Ce qui reste visible.</strong> Le nom du site, le moment, la quantité de données.</p>
<p><strong>La limite.</strong> Le cadenas garantit la connexion, pas l'honnêteté du site.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>nommer les trois garanties de HTTPS</li><li>dire quel outil sert à quoi</li><li>expliquer le rôle d'un certificat</li><li>dire ce que le cadenas ne garantit pas</li></ul>` },
  ] },

bb84: {
  id: "bb84", an: 1984, date: "1984", lieu: "New York et Montréal", court: "La clé quantique", niveau: "Dès la Seconde",
  titre: "La clé quantique", resume: "Une clé que l'on ne peut pas espionner sans laisser de traces",
  accroche: "Deux chercheurs proposent de transmettre une clé avec des grains de lumière. Celui qui écoute les abîme, et cela se voit.",
  etapes: [
    { t: "lecon", titre: "Des grains de lumière fragiles",
      texte: `<p>Tous les échanges de clé vus jusqu'ici reposent sur un calcul difficile. En 1984, <strong>Charles Bennett</strong>, chercheur chez IBM, et <strong>Gilles Brassard</strong>, de l'université de Montréal, proposent de s'appuyer sur autre chose : les lois de la physique.</p>
<p>La lumière est faite de grains, les <strong>photons</strong>. Un photon peut être <strong>polarisé</strong> : il vibre dans une direction. On peut choisir cette direction de deux façons, qu'on appelle des <strong>bases</strong> :</p>
<ul><li>la base droite, notée +, où le photon vibre verticalement (bit 0) ou horizontalement (bit 1) ;</li><li>la base oblique, notée ×, où il vibre selon l'une ou l'autre diagonale (bit 0 ou bit 1).</li></ul>
<p>Pour lire le bit, il faut mesurer le photon, et pour le mesurer il faut choisir une base. Deux lois de la physique quantique font tout l'intérêt de l'affaire :</p>
<ul><li>si l'on mesure dans <strong>la base utilisée à l'envoi</strong>, on obtient le bon bit, à coup sûr ;</li><li>si l'on mesure dans <strong>l'autre base</strong>, on obtient 0 ou 1 au hasard, une chance sur deux, et le photon ressort polarisé dans la base de la mesure. L'information d'origine est détruite.</li></ul>
<p>Et l'on ne peut pas tricher en fabriquant d'abord une copie du photon : la physique interdit de copier un état quantique inconnu.</p>` },
    { t: "lecon", titre: "Le protocole",
      texte: `<ol><li>Alice tire au hasard une suite de bits et, pour chacun, une base. Elle envoie les photons correspondants.</li><li>Bob ne connaît pas les bases d'Alice. Il mesure chaque photon dans une base tirée au hasard.</li><li>Ensuite, à voix haute, sur une ligne que tout le monde peut écouter, ils comparent leurs <strong>bases</strong>, mais pas leurs bits.</li><li>Ils jettent tous les bits où leurs bases diffèrent. Ceux qui restent sont identiques des deux côtés : c'est la clé.</li><li>Pour vérifier, ils sacrifient une partie de la clé en la comparant publiquement. Si tout concorde, personne n'a écouté.</li></ol>
<p>Le protocole s'appelle <strong>BB84</strong>, d'après leurs initiales et l'année.</p>` },
    { t: "quiz", titre: "Sur la ligne", widget: "bb84",
      intro: "Envoie des photons. Les colonnes en couleur sont celles où Alice et Bob ont choisi la même base. Fais d'abord quelques envois sans Ève, puis coche la case.",
      questions: [
        { q: "Sans Ève, quelle proportion des bits Alice et Bob gardent-ils environ ?", choix: ["Tous", "La moitié", "Un sur dix"], bon: 1, expl: "Bob choisit la bonne base une fois sur deux." },
        { q: "Toujours sans Ève : parmi les bits gardés, combien d'erreurs ?", choix: ["Aucune", "Environ un quart", "Environ la moitié"], bon: 0, expl: "Même base à l'envoi et à la mesure : le résultat est certain." },
        { q: "Coche « Ève intercepte » et envoie 1 000 photons, plusieurs fois. Quel est le taux d'erreur parmi les bits gardés ?", choix: ["0 %", "Environ 25 %", "Environ 75 %"], bon: 1, expl: "Ève doit mesurer pour lire, donc choisir une base. Une fois sur deux elle se trompe, et le photon qu'elle renvoie donne alors un résultat faux chez Bob une fois sur deux." },
        { q: "Alice et Bob comparent un échantillon de leur clé et trouvent un quart d'erreurs. Que font-ils ?", choix: ["Ils corrigent les erreurs et continuent.", "Ils jettent toute la clé : quelqu'un a écouté.", "Ils changent de mot de passe."], bon: 1, expl: "Rien de secret n'a encore été dit : seule une clé a été perdue. Ils recommencent, ou changent de ligne." },
      ] },
    { t: "qcm", titre: "D'où vient le quart ?",
      q: "Ève intercepte un photon. Dans quel cas provoque-t-elle une erreur chez Bob, sur un bit qu'il garde ?",
      choix: ["Chaque fois qu'elle mesure.", "Quand elle a choisi la mauvaise base (une fois sur deux) et que le photon abîmé donne le mauvais résultat chez Bob (une fois sur deux).", "Jamais, si elle est assez rapide."], bon: 1,
      expl: "Une chance sur deux, puis encore une chance sur deux : un quart. La rapidité d'Ève n'y change rien, c'est la mesure elle-même qui perturbe." },
    { t: "code", titre: "Garder les bons bits", d: 2,
      caches: ["tamiser('1', '+', 'x')", "tamiser('0000', 'xxxx', 'xxxx')", "tamiser('110010', '+x+x+x', 'xx++xx')"],
      enonce: `<p>Après l'envoi, Alice et Bob gardent seulement les bits pour lesquels leurs bases coïncident. Écris la fonction <code>tamiser(bits, bases_a, bases_b)</code>. Les trois arguments sont des chaînes de même longueur ; les bases sont notées <code>+</code> et <code>x</code>.</p>`,
      depart: `def tamiser(bits, bases_a, bases_b):
    cle = ""
    for i in range(len(bits)):
        # à compléter : garder bits[i] si les deux bases sont les mêmes
        pass
    return cle
`,
      solution: `def tamiser(bits, bases_a, bases_b):
    cle = ""
    for i in range(len(bits)):
        if bases_a[i] == bases_b[i]:
            cle = cle + bits[i]
    return cle
`,
      tests: [{ appels: [["tamiser('1011', '++xx', '+x+x')", "'11'"], ["tamiser('0110', '+x+x', '+x+x')", "'0110'"], ["tamiser('10', '+x', 'x+')", "''"]] }],
      indices: ["Compare bases_a[i] et bases_b[i].", "Si elles sont égales : cle = cle + bits[i]."] },
    { t: "lecon", titre: "Une promesse, et ses limites",
      texte: `<p>BB84 change la nature de la garantie. Diffie et Hellman tiennent tant que personne ne calcule assez vite. BB84 tient tant que la physique quantique est vraie, quelle que soit la puissance de l'adversaire. Et la clé obtenue peut servir de masque jetable.</p>
<p>La première démonstration, au tournant des années 1990, portait sur une trentaine de centimètres. On sait aujourd'hui transmettre des clés quantiques sur des dizaines de kilomètres de fibre optique, et des réseaux expérimentaux existent.</p>
<aside class="legende"><strong>Histoire ou légende ?</strong> « Inviolable grâce au quantique » : la formule demande trois nuances. La théorie est solide, mais les appareils réels ont des défauts que des chercheurs ont exploités. Il faut une ligne spéciale, fibre ou visée directe, et la portée est limitée. Enfin, BB84 ne dit pas <em>avec qui</em> l'on parle : il faut toujours authentifier l'autre par un moyen classique. La clé quantique ne remplacera pas le cadenas de ton navigateur.</aside>` },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>Le principe.</strong> Les bits voyagent sur des photons polarisés. Mesurer dans la mauvaise base donne un résultat au hasard et modifie le photon.</p>
<p><strong>Le protocole.</strong> Alice envoie, Bob mesure au hasard, ils comparent leurs bases et gardent les bits où elles coïncident.</p>
<p><strong>La détection.</strong> Une espionne qui intercepte tout provoque environ 25 % d'erreurs dans la clé.</p>
<p><strong>Les limites.</strong> Matériel spécial, distance, appareils imparfaits, et besoin d'authentifier l'interlocuteur.</p>
<p><strong>Le contexte.</strong> Charles Bennett et Gilles Brassard, 1984.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>expliquer ce qu'est une base de mesure</li><li>dérouler les étapes de BB84</li><li>dire pourquoi une espionne est repérée</li><li>citer les limites de la méthode</li></ul>` },
  ] },

shor: {
  id: "shor", an: 1994, date: "1994", lieu: "New Jersey", court: "L'algorithme de Shor", niveau: "Dès la Seconde, PGCD",
  titre: "Shor : la menace quantique", resume: "Un ordinateur qui n'existe pas encore, et qui casserait RSA",
  accroche: "En 1994, un mathématicien montre qu'un ordinateur quantique factoriserait les grands nombres. La machine reste à construire, mais le compte à rebours a commencé.",
  etapes: [
    { t: "lecon", titre: "Un autre genre de machine",
      texte: `<p>RSA repose sur la factorisation. Diffie et Hellman reposent sur la recherche d'un exposant. Dans les deux cas, un ordinateur ordinaire n'a rien de mieux à faire que des essais, en nombre astronomique.</p>
<p>Un <strong>ordinateur quantique</strong> ne calcule pas avec des bits, mais avec des <strong>qubits</strong>, qui obéissent aux mêmes lois que les photons du dossier précédent. Il n'est pas « plus rapide » en général. Mais il excelle pour une tâche précise : repérer un <strong>rythme</strong>, une période, dans une suite de nombres.</p>
<p>En 1994, <strong>Peter Shor</strong>, mathématicien dans les laboratoires de la compagnie AT&amp;T, remarque que cette tâche suffit : factoriser un nombre revient à trouver une période. Il en tire un algorithme. La machine capable de l'exécuter n'existe pas, mais sur le papier, RSA est condamné.</p>` },
    { t: "lecon", titre: "De la période aux facteurs",
      texte: `<p>Voici le détour de Shor, sur un exemple. On veut factoriser <span class="m">N</span> = 15.</p>
<ol><li>On choisit un nombre <span class="m">a</span>, par exemple 2, et on calcule ses puissances modulo 15 : 2, 4, 8, puis 16 qui donne 1. Ensuite tout recommence : 2, 4, 8, 1…</li><li>La suite se répète tous les 4 rangs : la <strong>période</strong> vaut 4.</li><li>On prend la moitié de la période : 2<sup>2</sup> = 4.</li><li>On calcule le PGCD de 15 avec 4 − 1, puis avec 4 + 1 : on trouve <strong>3</strong> et <strong>5</strong>.</li></ol>
<p>Pourquoi cela marche : dire que la période vaut 4, c'est dire que 2<sup>4</sup> − 1 est un multiple de 15. Or 2<sup>4</sup> − 1 = (2<sup>2</sup> − 1)(2<sup>2</sup> + 1). Les facteurs de 15 se répartissent entre ces deux parenthèses, et le PGCD les fait sortir.</p>
<p>Toute la difficulté est à l'étape 1. Pour un nombre de 617 chiffres, la période est gigantesque, et un ordinateur ordinaire ne peut pas la trouver. Un ordinateur quantique, si.</p>` },
    { t: "manip", titre: "Factorise par la période", widget: "periode",
      intro: `<p>Fais le travail de la machine quantique à la main, sur deux petits nombres. Certains choix de <span class="m">a</span> ne mènent à rien : dans ce cas, on en prend un autre. L'algorithme de Shor fait de même.</p>`,
      expl: "Tu as factorisé sans jamais essayer de diviseur : tu as cherché un rythme. Pour 15 ou 21, trouver la période prend quelques multiplications. Pour une clé RSA, c'est la seule étape hors de portée d'un ordinateur ordinaire, et précisément celle qu'un ordinateur quantique saurait faire vite." },
    { t: "code", titre: "Le PGCD d'Euclide", d: 2,
      caches: ["pgcd(7, 21)", "pgcd(100, 75)", "pgcd(17, 5)"],
      enonce: `<p>Écris la fonction <code>pgcd(a, b)</code> avec l'algorithme d'Euclide, vieux de vingt-trois siècles : tant que <span class="m">b</span> n'est pas nul, on remplace <span class="m">a</span> par <span class="m">b</span> et <span class="m">b</span> par le reste de la division de <span class="m">a</span> par <span class="m">b</span>. À la fin, le PGCD est dans <span class="m">a</span>.</p>`,
      depart: `def pgcd(a, b):
    # tant que b n'est pas nul :
    #     calculer le reste de la division de a par b
    #     a prend la valeur de b, puis b prend la valeur du reste
    return a
`,
      solution: `def pgcd(a, b):
    while b != 0:
        reste = a % b
        a = b
        b = reste
    return a
`,
      tests: [{ appels: [["pgcd(3, 15)", "3"], ["pgcd(5, 15)", "5"], ["pgcd(28, 35)", "7"], ["pgcd(12, 20)", "4"]] }],
      interdit: ["gcd"], requis: ["while"],
      indices: ["La boucle commence par : while b != 0:", "Dans la boucle : reste = a % b, puis a = b, puis b = reste."] },
    { t: "code", titre: "La période", d: 2,
      caches: ["periode(4, 15)", "periode(2, 21)", "periode(3, 7)"],
      enonce: `<p>Écris la fonction <code>periode(a, n)</code> qui renvoie le plus petit exposant <span class="m">r</span>, à partir de 1, tel que <span class="m">a</span><sup><span class="m">r</span></sup> ait pour reste 1 dans la division par <span class="m">n</span>. C'est le calcul qu'un ordinateur quantique ferait en un éclair.</p>`,
      depart: `def periode(a, n):
    r = 1
    valeur = a % n
    # tant que valeur est différent de 1 :
    #     multiplier valeur par a, garder le reste modulo n, ajouter 1 à r
    return r
`,
      solution: `def periode(a, n):
    r = 1
    valeur = a % n
    while valeur != 1:
        valeur = valeur * a % n
        r = r + 1
    return r
`,
      tests: [{ appels: [["periode(2, 15)", "4"], ["periode(7, 15)", "4"], ["periode(2, 35)", "12"], ["periode(8, 21)", "2"]] }],
      requis: ["while"],
      indices: ["La boucle commence par : while valeur != 1:", "Dans la boucle : valeur = valeur * a % n, puis r = r + 1."] },
    { t: "lecon", titre: "Où en est la machine ?",
      texte: `<p>En 2001, une équipe d'IBM exécute pour la première fois l'algorithme de Shor. L'ordinateur est une éprouvette : une molécule fabriquée sur mesure, dont sept noyaux atomiques servent de qubits. Le résultat : 15 = 3 × 5. Onze ans plus tard, d'autres chercheurs atteignent 21.</p>
<p>Et depuis ? Les machines ont beaucoup grandi, mais leurs qubits font trop d'erreurs. En 2026, les démonstrations de l'algorithme ne réussissent encore que sur de très petits nombres, et pas à chaque essai. Une étude de 2021 estimait qu'il faudrait de l'ordre de vingt millions de qubits imparfaits pour factoriser une clé RSA courante en huit heures.</p>
<aside class="legende"><strong>Histoire ou légende ?</strong> Chaque année ou presque, un titre annonce que « RSA est cassé par le quantique ». À ce jour, aucune clé réellement utilisée ne l'a été. Certaines démonstrations publiées simplifient même le calcul à l'avance, en se servant d'une réponse déjà connue. Personne ne sait dire quand une machine capable de casser RSA existera, ni même si ce sera dans dix ans ou dans trente. C'est justement cette incertitude qui oblige à agir sans attendre : c'est l'objet du dernier dossier.</aside>` },
    { t: "qcm", titre: "Qui est menacé ?",
      q: "Parmi ces systèmes, lequel ne craint pas l'algorithme de Shor ?",
      choix: ["RSA", "L'échange de Diffie et Hellman", "Le masque jetable"], bon: 2,
      retours: ["RSA repose sur la factorisation, que Shor résout.", "La recherche d'un exposant se ramène aussi à une recherche de période : Shor la résout.", null],
      expl: "Le masque jetable ne repose sur aucun calcul difficile : il n'y a rien à calculer plus vite. RSA et Diffie-Hellman, eux, tombent tous les deux." },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>L'idée.</strong> Factoriser <span class="m">N</span> revient à trouver la période de la suite des puissances de <span class="m">a</span> modulo <span class="m">N</span>.</p>
<p><strong>La méthode.</strong> Période <span class="m">r</span>, puis PGCD de <span class="m">N</span> avec <span class="m">a</span><sup><span class="m">r</span>/2</sup> − 1 et <span class="m">a</span><sup><span class="m">r</span>/2</sup> + 1.</p>
<p><strong>Le rôle du quantique.</strong> Trouver la période rapidement, ce qu'un ordinateur ordinaire ne sait pas faire pour de grands nombres.</p>
<p><strong>L'état des lieux.</strong> Peter Shor, 1994. Première exécution en 2001 : 15 = 3 × 5. En 2026, seuls de très petits nombres ont été factorisés ainsi.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>calculer la période d'une suite de puissances</li><li>en déduire les facteurs d'un petit nombre</li><li>dire quels chiffres sont menacés</li><li>distinguer l'annonce et la réalité</li></ul>` },
  ] },

pqc: {
  id: "pqc", an: 2024, date: "de 2016 à 2035", lieu: "Partout", court: "Après le quantique", niveau: "Dès la Seconde",
  titre: "Après le quantique", resume: "Changer de chiffres avant que la machine n'arrive",
  accroche: "L'ordinateur quantique n'existe pas encore, et pourtant il est déjà trop tard pour attendre. Voici pourquoi, et ce qui se prépare.",
  etapes: [
    { t: "lecon", titre: "Récolter maintenant, déchiffrer plus tard",
      texte: `<p>Un adversaire patient n'a pas besoin de casser tes messages aujourd'hui. Il lui suffit de les <strong>enregistrer</strong>, chiffrés, et d'attendre. Le jour où un ordinateur quantique existera, il rejouera l'échange de clé capté des années plus tôt, retrouvera la clé de session et lira tout.</p>
<p>Les spécialistes appellent cette stratégie « récolter maintenant, déchiffrer plus tard ». Elle ne menace pas un message qui n'a d'intérêt que pour quelques heures. Elle menace tout ce qui doit rester secret longtemps : dossiers médicaux, secrets industriels, archives diplomatiques.</p>
<p>La question n'est donc pas seulement « quand la machine arrivera-t-elle ? ». Trois durées comptent :</p>
<ul><li>combien de temps le secret doit tenir ;</li><li>combien de temps il faut pour remplacer les chiffres partout ;</li><li>dans combien de temps la machine existera.</li></ul>
<p>Si les deux premières, ajoutées, dépassent la troisième, il y a un problème. On appelle cela la règle de Mosca, du nom du chercheur qui l'a formulée.</p>` },
    { t: "quiz", titre: "Trois durées", widget: "mosca",
      intro: "Règle les trois durées et lis le verdict.",
      questions: [
        { q: "Un dossier médical doit rester secret 50 ans. Changer les systèmes de l'hôpital prendra 8 ans. On suppose que la machine arrivera dans 15 ans. Y a-t-il un problème ?", choix: ["Non", "Oui"], bon: 1, expl: "50 + 8 dépasse largement 15. Ce qui est chiffré aujourd'hui avec RSA sera lisible bien avant la fin des 50 ans." },
        { q: "Le lieu d'un rendez-vous de demain soir doit rester secret un an. Changer de messagerie prend un an. La machine arrivera dans 15 ans. Problème ?", choix: ["Non", "Oui"], bon: 0, expl: "1 + 1, c'est bien moins que 15. Ce secret-là aura expiré depuis longtemps." },
        { q: "Personne ne connaît vraiment la troisième durée. Que conseille la prudence ?", choix: ["Attendre d'en savoir plus.", "Changer de chiffres dès maintenant, en commençant par ce qui doit rester secret le plus longtemps."], bon: 1, expl: "On ne peut agir que sur la deuxième durée. Autant commencer tôt." },
      ] },
    { t: "tri", titre: "Qui tombe, qui tient ?",
      q: "Face à un grand ordinateur quantique, que deviennent ces outils ?",
      categories: ["Cassé par l'algorithme de Shor", "Tient toujours"],
      items: [
        { txt: "RSA", cat: 0, expl: "Repose sur la factorisation." },
        { txt: "L'échange de Diffie et Hellman", cat: 0, expl: "Repose sur la recherche d'un exposant, qui se ramène aussi à une période." },
        { txt: "Le chiffre à clé secrète AES, avec une clé de 256 bits", cat: 1, expl: "Aucune période à exploiter. Un autre algorithme quantique accélère la force brute, mais doubler la longueur de la clé suffit à l'annuler." },
        { txt: "L'empreinte SHA-256", cat: 1, expl: "Même raisonnement : affaiblie en théorie, pas cassée." },
        { txt: "Le masque jetable", cat: 1, expl: "Aucun calcul ne peut rien contre lui." },
        { txt: "Une signature RSA", cat: 0, expl: "Celui qui factorise retrouve la clé privée et peut signer à la place d'un autre." },
      ] },
    { t: "lecon", titre: "De nouveaux problèmes difficiles",
      texte: `<p>Ce sont les outils à clé publique qui tombent. Il faut donc en construire de nouveaux, fondés sur des problèmes où chercher une période n'aide pas. La <strong>cryptographie post-quantique</strong> fonctionne sur les ordinateurs ordinaires : elle n'a besoin d'aucun photon.</p>
<p>La piste principale s'appuie sur les <strong>réseaux</strong>. Imagine un quadrillage régulier de points. Sur une feuille, trouver le point du quadrillage le plus proche d'un endroit donné est facile. Dans un espace à plusieurs centaines de dimensions, avec un quadrillage décrit de façon tordue, plus personne ne sait le faire, pas même avec un ordinateur quantique. Du moins, personne n'a trouvé comment.</p>
<p>En 2016, l'institut américain des normes lance un concours public. Soixante-neuf propositions arrivent du monde entier, et les chercheurs passent huit ans à tenter de les casser. Plusieurs tombent en route. Le 13 août 2024, trois normes sont publiées : une pour l'échange de clé et une pour la signature, fondées sur les réseaux, et une signature de secours fondée uniquement sur des empreintes. En mars 2025, un quatrième système est retenu en réserve, bâti sur d'autres mathématiques, au cas où les réseaux céderaient un jour.</p>
<p>Aux États-Unis, le calendrier officiel prévoit de déconseiller RSA après 2030 et de l'interdire après 2035 dans les systèmes de l'État. Les grandes messageries et les navigateurs ont déjà commencé à combiner un échange classique et un échange post-quantique : il faudrait casser les deux.</p>` },
    { t: "qcm", titre: "Pourquoi une réserve ?",
      q: "Pourquoi avoir retenu des systèmes fondés sur des mathématiques différentes, au lieu d'un seul ?",
      choix: ["Pour faire plaisir à tous les candidats.", "Parce qu'aucun n'est prouvé incassable : si une famille tombe, les autres prendront le relais.", "Parce que les ordinateurs ne savent pas tous faire les mêmes calculs."], bon: 1,
      expl: "Le chiffre de Vigenère a tenu trois siècles avant de tomber. Personne ne peut promettre que les réseaux tiendront toujours. La seule réponse honnête est de ne pas tout miser sur un seul problème." },
    { t: "lecon", titre: "Ce que vingt-cinq siècles ont appris",
      texte: `<p>Tu es arrivé au bout des dossiers. De la lanière de Sparte aux réseaux à cinq cents dimensions, quelques leçons reviennent sans cesse.</p>
<ul><li><strong>Le nombre de clés ne fait pas la sécurité.</strong> La substitution en comptait des milliards de milliards de milliards, Enigma aussi. Les deux sont tombées par une régularité.</li><li><strong>L'ennemi connaît la méthode.</strong> Les chiffres qui ont tenu sont ceux que tout le monde a pu attaquer au grand jour, pendant des années.</li><li><strong>Le maillon faible est souvent humain.</strong> Un bulletin météo trop régulier, une page de clé réutilisée, une confiance aveugle dans ses symboles.</li><li><strong>Aucun chiffre pratique n'est éternel.</strong> Un seul est parfait, le masque jetable, et il est presque inutilisable. Tous les autres sont des paris sur la difficulté d'un problème, à réviser quand la science avance.</li><li><strong>Chiffrer ne suffit pas.</strong> Il faut aussi savoir à qui l'on parle et si le message est intact.</li></ul>
<aside class="contexte"><strong>Et toi ?</strong> Tu sais maintenant casser des chiffres. Ce savoir sert à comprendre, à protéger, à choisir de bons outils et de bons mots de passe. Il ne donne aucun droit sur les messages des autres : lire une correspondance ou entrer dans un système sans autorisation est interdit par la loi, quelle que soit la facilité de la chose.</aside>` },
    { t: "lecon", synthese: true, titre: "Fiche du dossier",
      texte: `<p><strong>La menace.</strong> « Récolter maintenant, déchiffrer plus tard » : ce qui est enregistré aujourd'hui sera lu quand la machine existera.</p>
<p><strong>La règle.</strong> Si la durée du secret plus la durée du changement dépasse le délai avant la machine, il faut agir maintenant.</p>
<p><strong>Ce qui tombe.</strong> RSA, Diffie et Hellman, et leurs signatures. Ce qui tient : les chiffres à clé secrète avec de longues clés, les empreintes, le masque jetable.</p>
<p><strong>La réponse.</strong> La cryptographie post-quantique, fondée notamment sur les réseaux. Concours public de 2016 à 2024, premières normes le 13 août 2024.</p>
<p><strong>Je sais…</strong></p><ul class="je-sais"><li>expliquer « récolter maintenant, déchiffrer plus tard »</li><li>appliquer la règle des trois durées</li><li>dire quels outils sont menacés et lesquels tiennent</li><li>expliquer pourquoi plusieurs familles de systèmes ont été retenues</li></ul>` },
  ] },
};

/* ============================================================
   Assemblage : cinq parties, dix-sept dossiers. Les numéros suivent l'ordre des parties.
   ============================================================ */
{
  const A = DOSSIERS_ANCIENS, M = DOSSIERS_MODERNES, deja = id => PARCOURS.flatMap(p => p.chapitres).find(c => c.id === id);
  const cesar = deja("cesar"), enigma = deja("enigma"), diffie = deja("diffie");
  PARCOURS.length = 0;
  PARCOURS.push(
    { id: "sub", titre: "Les premiers secrets", sous: "Déplacer les lettres, ou les remplacer", chapitres: [A.scytale, cesar, A.stuart] },
    { id: "poly", titre: "Le chiffre indéchiffrable", sous: "Changer d'alphabet à chaque lettre", chapitres: [A.vigenere, A.kasiski, A.kerckhoffs] },
    { id: "mac", titre: "Machines et guerres", sous: "Codes, bandes perforées et rotors", chapitres: [A.zimmermann, A.masque, enigma, A.navajo] },
    { id: "pub", titre: "La révolution des clés publiques", sous: "Partager un secret sans jamais se rencontrer", chapitres: [diffie, M.rsa, M.hachage, M.https] },
    { id: "dem", titre: "Demain, le quantique", sous: "La physique entre dans la partie", chapitres: [M.bb84, M.shor, M.pqc] },
  );
  PARCOURS.flatMap(p => p.chapitres).forEach((c, k) => c.num = k + 1);
  A_VENIR.length = 0;
}

/* ----- Messages interceptés supplémentaires (ajoutés à la fin : la progression est enregistrée par position) ----- */
DEFIS.etapes.push(
  { t: "reponse", titre: "La lanière", ep: "sub", date: "Ve siècle av. J.-C.", origine: "Sparte", d: 1,
    accroche: "Une bande de lettres, un bâton à retrouver.",
    enonce: `<p>Cette bande a été écrite sur une scytale :</p><p class="chiffre">${scytale("RETRAITEIMMEDIATEVERSLEPORT", 4)}</p><p><strong>Vers quel lieu faut-il se replier ?</strong></p>`,
    mot: ["PORT", "LEPORT"], indices: ["La bande compte 28 lettres. Essaie de lire une lettre sur 2, sur 3, sur 4…", "Avec 4 lettres par tour, lis une lettre sur quatre en partant de la première, puis en partant de la deuxième, et ainsi de suite."],
    expl: "Avec quatre lettres par tour, on lit : RETRAITE IMMEDIATE VERS LE PORT. Le X final ne sert qu'à compléter la dernière ligne." },
  { t: "reponse", titre: "Le coffre du capitaine", ep: "poly", date: "exercice", origine: "Message intercepté", d: 2,
    accroche: "Un Vigenère, et pour une fois tu as la clé.",
    enonce: `<p>Ce message est chiffré avec le chiffre de Vigenère. Un complice t'a soufflé le mot-clé : <strong>PIRATE</strong>.</p><p class="chiffre">${vig("LE TRESOR EST SOUS LE VIEUX CHENE", "PIRATE")}</p><p><strong>Sous quel arbre faut-il creuser ?</strong></p>`,
    mot: ["CHENE", "VIEUXCHENE", "LEVIEUXCHENE", "LECHENE"], indices: ["Pour déchiffrer, on recule au lieu d'avancer : la première lettre recule de 15 rangs (P), la deuxième de 8 (I), la troisième de 17 (R)…", "La clé ne tient compte que des lettres : les espaces ne la font pas avancer.", "L'atelier du site sait déchiffrer un Vigenère quand on connaît la clé."],
    expl: "Le message clair est : LE TRESOR EST SOUS LE VIEUX CHENE. Avec la clé, déchiffrer est une formalité. Tout le travail de Babbage et de Kasiski consistait à s'en passer." },
  { t: "reponse", titre: "Cinq bits", ep: "mac", date: "1917", origine: "D'après Vernam", d: 1,
    accroche: "Un masque jetable en binaire.",
    enonce: `<p>Sur la bande d'un téléscripteur, chaque caractère tient en cinq bits. Tu as intercepté le caractère chiffré <strong>11001</strong>, et tu as mis la main sur le morceau de clé correspondant : <strong>01110</strong>.</p><p>Règle du ou exclusif : deux bits égaux donnent 0, deux bits différents donnent 1.</p><p><strong>Quels sont les cinq bits du message clair ?</strong></p>`,
    reponse: 10111, indices: ["Compare les bits un par un, de gauche à droite.", "Premier bit : 1 et 0 sont différents, donc 1. Deuxième bit : 1 et 1 sont égaux, donc 0."],
    expl: "11001 et 01110 donnent 10111. La même opération sert à chiffrer et à déchiffrer." },
  { t: "reponse", titre: "La clé trop courte", ep: "pub", date: "1977", origine: "D'après Rivest, Shamir et Adleman", d: 3,
    accroche: "Une clé RSA de deux chiffres ne protège pas grand-chose.",
    enonce: `<p>Bob a publié une clé RSA imprudente : <span class="m">n</span> = 55 et <span class="m">e</span> = 3. Tu interceptes le message chiffré <strong>17</strong>.</p><p><strong>Quel était le message d'Alice ?</strong> Python peut t'aider pour le dernier calcul.</p>`,
    reponse: 8, indices: ["Factorise 55 : ce sont les deux nombres premiers de Bob.", "55 = 5 × 11, donc (5 − 1) × (11 − 1) = 40. Cherche d tel que 3 × d ait pour reste 1 dans la division par 40.", "d = 27, car 3 × 27 = 81. Le message est le reste de 17 puissance 27 dans la division par 55."],
    expl: "55 = 5 × 11, d'où d = 27, et 17²⁷ mod 55 = 8. Vérification : 8³ = 512, et 512 mod 55 = 17." },
  { t: "reponse", titre: "Le rythme caché", ep: "dem", date: "1994", origine: "D'après Peter Shor", d: 2,
    accroche: "Fais le travail d'un ordinateur quantique, à la main ou en Python.",
    enonce: `<p>On veut factoriser 35 par la méthode de Shor, avec <span class="m">a</span> = 2. On calcule les puissances de 2 modulo 35 : 2, 4, 8, 16, 32, 29…</p><p><strong>Quelle est la période, c'est-à-dire le plus petit exposant pour lequel on retombe sur 1 ?</strong></p>`,
    reponse: 12, indices: ["Continue la suite : chaque terme est le double du précédent, dont on garde le reste dans la division par 35.", "Après 29 viennent 23, 11, 22, 9, 18…"],
    expl: "La période vaut 12. On prend la moitié : 2⁶ mod 35 = 29. Puis pgcd(28, 35) = 7 et pgcd(30, 35) = 5 : on a bien 35 = 5 × 7." },
  { t: "code", titre: "Déchiffrer Vigenère", ep: "poly", date: "XVIe siècle", origine: "D'après Bellaso", d: 2,
    accroche: "Le destinataire aussi a besoin d'un programme.",
    caches: [`dechiffre_vigenere('${vig("BELLASO", "CIFRA")}', 'CIFRA')`, "dechiffre_vigenere('URPH', 'D')"],
    enonce: `<p>Écris la fonction <code>dechiffre_vigenere(texte, cle)</code>, qui fait le chemin inverse du chiffrement. Le texte et la clé ne contiennent que des majuscules, sans espace.</p>`,
    depart: `def dechiffre_vigenere(texte, cle):
    resultat = ""
    for i in range(len(texte)):
        decalage = ord(cle[i % len(cle)]) - 65
        # à compléter : reculer de decalage rangs
    return resultat
`,
    solution: `def dechiffre_vigenere(texte, cle):
    resultat = ""
    for i in range(len(texte)):
        decalage = ord(cle[i % len(cle)]) - 65
        rang = (ord(texte[i]) - 65 - decalage) % 26
        resultat = resultat + chr(65 + rang)
    return resultat
`,
    tests: [{ appels: [[`dechiffre_vigenere('${vig("PARIS", "ROI")}', 'ROI')`, "'PARIS'"], [`dechiffre_vigenere('${vig("CHIFFREINDECHIFFRABLE", "NUIT")}', 'NUIT')`, "'CHIFFREINDECHIFFRABLE'"]] }],
    indices: ["Pour déchiffrer, on soustrait le décalage au lieu de l'ajouter.", "En Python, (rang - decalage) % 26 reste positif, même quand la soustraction donne un nombre négatif."] },
);

if (typeof LEXIQUE !== "undefined") LEXIQUE.push(
  { t: "Clé publique", c: "rsa", d: "Clé que l'on affiche à la vue de tous. Elle sert à chiffrer un message pour son propriétaire, ou à vérifier sa signature." },
  { t: "Clé privée", c: "rsa", d: "Clé que l'on garde pour soi. Elle sert à déchiffrer ce qui a été chiffré avec la clé publique, ou à signer." },
  { t: "RSA", c: "rsa", d: "Chiffre à clé publique inventé en 1977 par Rivest, Shamir et Adleman. Sa sécurité repose sur la difficulté de factoriser le produit de deux grands nombres premiers." },
  { t: "Factoriser", c: "rsa", d: "Écrire un nombre comme produit de nombres premiers. Multiplier est facile, factoriser un très grand nombre ne l'est pas." },
  { t: "Fonction de hachage", c: "hachage", d: "Fonction qui tire d'un texte de longueur quelconque une empreinte de taille fixe, sans retour possible. Exemple : SHA-256." },
  { t: "Collision", c: "hachage", d: "Deux textes différents qui ont la même empreinte. Une fonction de hachage est cassée quand on sait en fabriquer." },
  { t: "Signature numérique", c: "hachage", d: "Empreinte d'un message transformée avec la clé privée de son auteur. Chacun peut la vérifier avec la clé publique." },
  { t: "Intégrité", c: "hachage", d: "Garantie qu'un message n'a pas été modifié depuis son envoi." },
  { t: "HTTPS", c: "https", d: "Version protégée du protocole du Web. Elle garantit l'identité du site, le secret de l'échange et son intégrité." },
  { t: "Certificat", c: "https", d: "Carte d'identité d'un site : son nom et sa clé publique, signés par une autorité que le navigateur reconnaît." },
  { t: "Clé de session", c: "https", d: "Clé secrète fabriquée pour une seule connexion, par un échange de Diffie et Hellman. Elle chiffre tout le reste de la conversation." },
  { t: "Chiffre à clé secrète", c: "https", d: "Chiffre où la même clé sert à chiffrer et à déchiffrer. Rapide, il chiffre le gros des données. Exemple : AES." },
  { t: "Photon", c: "bb84", d: "Grain de lumière. Sa polarisation peut porter un bit." },
  { t: "Base de mesure", c: "bb84", d: "Façon de mesurer la polarisation d'un photon : droite ou oblique. Mesurer dans la mauvaise base donne un résultat au hasard et modifie le photon." },
  { t: "BB84", c: "bb84", d: "Protocole de Bennett et Brassard (1984) pour transmettre une clé avec des photons. Une interception provoque des erreurs détectables." },
  { t: "Qubit", c: "shor", d: "Unité d'information d'un ordinateur quantique. Il obéit aux lois de la physique quantique, comme le photon de BB84." },
  { t: "Algorithme de Shor", c: "shor", d: "Algorithme quantique de 1994 qui factorise un nombre en cherchant la période d'une suite de puissances. Il casserait RSA et Diffie-Hellman." },
  { t: "Période", c: "shor", d: "Plus petit exposant r tel que a puissance r ait pour reste 1 dans la division par N. La suite des puissances se répète tous les r rangs." },
  { t: "Récolter maintenant, déchiffrer plus tard", c: "pqc", d: "Stratégie d'un adversaire qui enregistre aujourd'hui des messages chiffrés pour les lire quand un ordinateur quantique existera." },
  { t: "Cryptographie post-quantique", c: "pqc", d: "Chiffres à clé publique conçus pour résister à un ordinateur quantique, mais qui fonctionnent sur des ordinateurs ordinaires. Premières normes en 2024." },
  { t: "Réseau euclidien", c: "pqc", d: "Quadrillage régulier de points dans un espace à très nombreuses dimensions. Y trouver le point le plus proche d'un endroit donné est un problème réputé difficile." },
);
