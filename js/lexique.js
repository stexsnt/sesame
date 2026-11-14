/* Lexique de Sésame : un terme ou un nom, sa définition, l'identifiant du dossier où il apparaît.
   Sert à la page Lexique et aux fiches de révision. Ajouter une ligne suffit à créer une fiche. */
const LEXIQUE = [
  // César chiffre, al-Kindi casse
  { t: "Cryptologie", c: "cesar", d: "Science du secret. Elle réunit la cryptographie, qui fabrique les chiffres, et la cryptanalyse, qui cherche à les casser." },
  { t: "Message clair", c: "cesar", d: "Le texte lisible, avant chiffrement." },
  { t: "Message chiffré", c: "cesar", d: "Le texte transformé, celui qui circule. On dit aussi cryptogramme." },
  { t: "Clé", c: "cesar", d: "Le secret partagé qui permet de chiffrer et de déchiffrer. Chez César, c'est le nombre de rangs du décalage." },
  { t: "Déchiffrer", c: "cesar", d: "Retrouver le message clair quand on connaît la clé. C'est ce que fait le destinataire." },
  { t: "Décrypter", c: "cesar", d: "Retrouver le message clair sans connaître la clé. C'est ce que fait l'adversaire." },
  { t: "Chiffre de César", c: "cesar", d: "Chaque lettre est décalée d'un nombre fixe de rangs dans l'alphabet. Il n'existe que 25 clés utiles." },
  { t: "Force brute", c: "cesar", d: "Attaque qui consiste à essayer toutes les clés possibles, l'une après l'autre." },
  { t: "Substitution", c: "cesar", d: "Chiffre qui remplace chaque lettre par une autre, toujours la même, selon un alphabet mélangé. Environ 4 × 10²⁶ clés." },
  { t: "Analyse des fréquences", c: "cesar", d: "Compter les lettres du message chiffré et les comparer aux fréquences de la langue. En français, la lettre la plus fréquente est le E." },
  { t: "Al-Kindi", c: "cesar", d: "Savant de Bagdad (vers 801-873). Son traité, écrit vers 850, contient la plus ancienne description connue de l'analyse des fréquences." },
  // Enigma
  { t: "Enigma", c: "enigma", d: "Machine à chiffrer brevetée par Arthur Scherbius en 1918 et utilisée par l'armée allemande. L'alphabet de substitution change à chaque lettre frappée." },
  { t: "Rotor", c: "enigma", d: "Roue câblée d'Enigma qui remplace chaque lettre par une autre. Le rotor de droite avance d'un cran à chaque frappe." },
  { t: "Réflecteur", c: "enigma", d: "Pièce d'Enigma qui renvoie le courant à travers les rotors. Grâce à lui, la même machine chiffre et déchiffre ; à cause de lui, une lettre n'est jamais chiffrée en elle-même." },
  { t: "Tableau de connexions", c: "enigma", d: "Câbles qui échangent des lettres deux à deux à l'entrée et à la sortie d'Enigma. Avec dix câbles, plus de 150 000 milliards de branchements possibles." },
  { t: "Mot probable", c: "enigma", d: "Mot que l'on devine dans le message clair, comme WETTERBERICHT dans un bulletin météo. Il sert de point d'appui pour retrouver le réglage de la machine." },
  { t: "Marian Rejewski", c: "enigma", d: "Mathématicien polonais (1905-1980). En décembre 1932, il reconstitue le câblage d'Enigma, puis lit les messages allemands avec Różycki et Zygalski." },
  { t: "Bletchley Park", c: "enigma", d: "Centre britannique de décryptage pendant la Seconde Guerre mondiale. Alan Turing et Gordon Welchman y conçoivent les « bombes » qui cherchent les réglages d'Enigma." },
  // Diffie et Hellman
  { t: "Distribution des clés", c: "diffie", d: "Problème de tous les chiffres anciens : il faut s'être mis d'accord sur la clé, en secret, avant le premier message." },
  { t: "Alice, Bob et Ève", c: "diffie", d: "Personnages habituels de la cryptologie. Alice et Bob veulent communiquer ; Ève écoute tout ce qui passe." },
  { t: "Fonction à sens unique", c: "diffie", d: "Opération facile à faire et très difficile à défaire. Exemple : calculer une puissance modulaire est rapide, retrouver l'exposant ne l'est pas." },
  { t: "Modulo", c: "diffie", d: "« a mod p » est le reste de la division de a par p. Exemple : 15 625 mod 23 = 8." },
  { t: "Puissance modulaire", c: "diffie", d: "Le reste de g puissance a dans la division par p. On la calcule vite en prenant le reste après chaque multiplication." },
  { t: "Échange de Diffie et Hellman", c: "diffie", d: "Alice envoie g^a mod p, Bob envoie g^b mod p ; chacun élève le nombre reçu à la puissance de son secret. Tous deux obtiennent le même nombre, qu'Ève ne peut pas calculer. Publié en 1976." },
  { t: "Logarithme discret", c: "diffie", d: "Le problème d'Ève : retrouver l'exposant a quand on connaît g, p et g^a mod p. Aucune méthode rapide n'est connue quand les nombres sont grands." },
];
