const fs = require("fs");
const path = require("path");

// Fonction pour créer un dossier s'il n'existe pas
const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Dossier créé: ${dir}`);
  }
};

// Fonction pour déplacer un fichier
const moveFile = (src, dest) => {
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Déplacé: ${src} -> ${dest}`);
  } else {
    console.log(`Le fichier n'existe pas: ${src}`);
  }
};

// Définir les répertoires que nous allons créer
const dirs = {
  components: "./src/Components",
  assets: "./src/assets",
  img: "./src/assets/img",
  font: "./src/assets/img/font/starjedi",
  utils: "./src/utils",
  background: "./src/Components/Background",
  card: "./src/Components/Card",
  gameboard: "./src/Components/Gameboard",
  playerHand: "./src/Components/PlayerHand",
  rulesModal: "./src/Components/RulesModal",
  page: "./src/Components/page",
};

// Créer tous les dossiers nécessaires
Object.values(dirs).forEach(createDirectory);

// Déplacer les fichiers associés dans les dossiers appropriés
const filesToMove = [
  { src: "./src/Background.js", dest: `${dirs.background}/Background.js` },
  { src: "./src/Background.css", dest: `${dirs.background}/Background.css` },
  { src: "./src/Card.js", dest: `${dirs.card}/Card.js` },
  { src: "./src/Card.css", dest: `${dirs.card}/Card.css` },
  { src: "./src/GameBoard.js", dest: `${dirs.gameboard}/GameBoard.js` },
  { src: "./src/GameBoard.css", dest: `${dirs.gameboard}/GameBoard.css` },
  { src: "./src/PlayerHand.js", dest: `${dirs.playerHand}/PlayerHand.js` },
  { src: "./src/PlayerHand.css", dest: `${dirs.playerHand}/PlayerHand.css` },
  { src: "./src/RulesModal.js", dest: `${dirs.rulesModal}/RulesModal.js` },
  { src: "./src/RulesModal.css", dest: `${dirs.rulesModal}/RulesModal.css` },
  { src: "./src/App.js", dest: `${dirs.page}/App.js` },
  { src: "./src/App.css", dest: `${dirs.page}/App.css` },
  { src: "./src/reportWebVitals.js", dest: `${dirs.utils}/reportWebVitals.js` },
  { src: "./src/img", dest: `${dirs.img}` },
  { src: "./src/starjedi", dest: `${dirs.font}` },
];

// Exécuter le déplacement des fichiers
filesToMove.forEach((file) => moveFile(file.src, file.dest));

console.log("Réorganisation terminée.");
