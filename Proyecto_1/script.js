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

function startGame(totalCards) {
    totalPairs = totalCards / 2;
    matchedPairs = 0;
    gameBoard.innerHTML = ''; // Limpiar tablero previo

    // 1. Ajustar el Grid de CSS dinámicamente
    const columns = Math.sqrt(totalCards);
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // 2. Preparar los pares y mezclarlos (Fisher-Yates)
    let gameIcons = icons.slice(0, totalPairs);
    let cardSet = [...gameIcons, ...gameIcons]; // Duplicamos para crear pares
    cardSet.sort(() => Math.random() - 0.5); // Mezcla rápida

    // 3. Crear las cartas en el DOM
    cardSet.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon; // Guardamos el valor en un atributo de datos
        
        // Estructura interna para el efecto flip (opcional luego)
        card.innerHTML = `<div class="card-content">${icon}</div>`;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return; // Bloqueo si hay una animación en curso
    if (this === flippedCards[0]) return; // Evitar doble click en la misma carta

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}