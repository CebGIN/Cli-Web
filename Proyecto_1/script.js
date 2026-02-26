// Referencias al DOM
const setupMenu = document.getElementById('setup-menu');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('game-board');
const btnStart = document.getElementById('btn-start');
const moveDisplay = document.getElementById('move-count');
const nameDisplay = document.getElementById('display-name');

// Estado del juego
let moves = 0;
let flippedCards = [];
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;

// Emojis para las cartas
const icons = ['🔥', '⭐', '🍀', '💎', '🍎', '🚀', '👻', '🌈', 
               '⚽', '🎸', '🍦', '👾', '🐱', '🍕', '🔔', '🎁',
               '⚡', '🌙', '🎨', '🎲', '🛸', '🎈', '🔑', '🍒',
               '🐳', '🍄', '☀', '🧩', '🍭', '🦄', '🥥', '🏆'];

btnStart.addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value;
    const difficulty = parseInt(document.getElementById('difficulty').value);

    if (!playerName) {
        alert("Por favor, ingresa tu nombre");
        return;
    }

    // Cambiar pantallas
    setupMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    // Inicializar HUD
    nameDisplay.textContent = playerName;
    moves = 0;
    moveDisplay.textContent = moves;

    startGame(difficulty);
});