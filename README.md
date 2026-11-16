# Sésame

La cryptologie pour le lycée, de Jules César au quantique. Dans chaque dossier, l'élève chiffre avec la technique de l'époque, puis la casse comme elle a été cassée.

Site statique : aucun serveur, aucun compte, aucune donnée transmise. La progression est enregistrée dans le navigateur de l'élève. Python s'exécute dans le navigateur grâce à Pyodide (dossier `pyodide/`).

## Contenu

Dix-sept dossiers en cinq parties :

| Partie | Dossiers |
|---|---|
| Les premiers secrets | La scytale de Sparte · César et al-Kindi · Marie Stuart |
| Le chiffre indéchiffrable | Vigenère · Babbage et Kasiski · Kerckhoffs |
| Machines et guerres | Le télégramme Zimmermann · Le masque jetable · Enigma · Le code navajo |
| La révolution des clés publiques | Diffie et Hellman · RSA · Empreintes et signatures · Le cadenas du navigateur |
| Demain, le quantique | La clé quantique (BB84) · L'algorithme de Shor · Après le quantique |

S'y ajoutent onze messages interceptés (page « Interceptions »), un atelier pour chiffrer entre camarades et fabriquer une clé à deux, un lexique avec fiches de révision et un espace professeur (`prof.html`).

## Organisation

- `js/contenu.js`, `js/dossiers-anciens.js`, `js/dossiers-modernes.js` : les dossiers et les messages interceptés. Le format est décrit en tête de `contenu.js` ; l'ordre des parties est fixé à la fin de `dossiers-modernes.js`.
- `js/lexique.js` : le lexique.
- `js/sesame.js`, `js/machines.js` : l'accueil, les manipulations et l'atelier.
- `js/app.js`, `js/moteur.js`, `js/bilan.js`, `js/prof.js` : le moteur, commun à Mue, Synapse et Périple.
- Les signes du dossier Marie Stuart, les numéros du télégramme Zimmermann (sauf 97556) et les messages à décrypter sont inventés pour l'exercice ; c'est signalé dans les énoncés.
- `css/style.css` : la feuille de style ; l'identité de Sésame est dans le dernier bloc.
- `tests/verifier.js` : vérifie que chaque solution passe ses tests (`npm install pyodide`, puis `node tests/verifier.js`).

## Publication

GitHub Pages sert la branche `gh-pages`. Après une modification de `main` : `git push origin main:gh-pages`. Si des fichiers changent de nom, mettre à jour la liste et le numéro de version dans `sw.js`.

## Polices

Zilla Slab, IBM Plex Sans et IBM Plex Mono, sous licence SIL Open Font License, hébergées dans `polices/`.

## Confort d'usage

- `js/confort.js` (identique sur Mue, Synapse, Périple et Sésame) : message plus clair pendant le chargement de Python,
  bouton « Réessayer » en cas d'échec, et rappel de sauvegarde quand huit étapes ont été validées depuis la dernière sauvegarde.
- `manifest.webmanifest` et `icones/` : le site peut être installé sur l'écran d'accueil d'un téléphone ou d'une tablette.
- Toutes les polices sont dans `polices/` : le site n'appelle aucun service externe.
- Le pied de page renvoie vers le portail https://stexsnt.github.io/ et les trois autres sites.
- `js/prof-plus.js` et `js/qrcode.min.js` (espace professeur) : QR code du lien de classe, à projeter, et impression du tableau de classe.
- Sur téléphone, le profil propose « Envoyer mon code » par le menu de partage.
- Python (Pyodide) est chargé en priorité depuis `https://stexsnt.github.io/pyodide/`, copie partagée par les quatre sites et rangée dans un cache commun : un élève ne le télécharge qu'une fois. Le dossier `pyodide/` du dépôt reste la copie de secours.
- Chaque étape a un numéro stable (voir `numeros` dans `js/bilan.js`) : on peut insérer une étape au milieu d'un chapitre sans décaler la progression des élèves ni les codes déjà reçus par le professeur.
