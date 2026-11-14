# Sésame

La cryptologie pour le lycée, de Jules César au quantique. Dans chaque dossier, l'élève chiffre avec la technique de l'époque, puis la casse comme elle a été cassée.

Site statique : aucun serveur, aucun compte, aucune donnée transmise. La progression est enregistrée dans le navigateur de l'élève. Python s'exécute dans le navigateur grâce à Pyodide (dossier `pyodide/`).

## Contenu actuel (pilote)

| Dossier | Manipulations |
|---|---|
| 1. César chiffre, al-Kindi casse | roue de César, force brute, analyse des fréquences |
| 2. Enigma, la machine à secrets | Enigma I simulée (rotors I-II-III, réflecteur B), mot probable |
| 3. Diffie, Hellman et la clé impossible | échange en peinture, échange avec des nombres, recherche de l'exposant |

S'y ajoutent cinq messages interceptés (page « Interceptions »), un lexique avec fiches de révision et un espace professeur (`prof.html`).

## Organisation

- `js/contenu.js` : les dossiers, les messages interceptés et la frise. C'est le fichier à modifier pour ajouter du contenu ; le format est décrit en tête de fichier.
- `js/lexique.js` : le lexique.
- `js/sesame.js` : l'accueil et les manipulations propres au site.
- `js/app.js`, `js/moteur.js`, `js/bilan.js`, `js/prof.js` : le moteur, commun à Mue, Synapse et Périple.
- `css/style.css` : la feuille de style ; l'identité de Sésame est dans le dernier bloc.
- `tests/verifier.js` : vérifie que chaque solution passe ses tests (`npm install pyodide`, puis `node tests/verifier.js`).

## Publication

GitHub Pages sert la branche `gh-pages`. Après une modification de `main` : `git push origin main:gh-pages`. Si des fichiers changent de nom, mettre à jour la liste et le numéro de version dans `sw.js`.

## Polices

Zilla Slab, IBM Plex Sans et IBM Plex Mono, sous licence SIL Open Font License, hébergées dans `polices/`.
