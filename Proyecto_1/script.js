// Referencias al DOM
const setupMenu = document.getElementById('setup-menu');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('game-board');
const btnStart = document.getElementById('btn-start');
const moveDisplay = document.getElementById('move-count');
const nameDisplay = document.getElementById('display-name');
const gameMessage = document.getElementById('game-message');
const btnHUDRestart = document.getElementById('btn-restart');
const btnPlayAgain = document.getElementById('btn-play-again');
const victoryModal = document.getElementById('victory-modal');

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


// Eventos de botones

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

btnHUDRestart.addEventListener('click', ReStart);
btnPlayAgain.addEventListener('click', ReStart);

// Logica de la partida

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

function ReStart() {
    // 1. Manejo de visibilidad (Asegúrate de que victoryModal esté definido arriba)
    victoryModal.classList.add('hidden');
    gameScreen.classList.add('hidden');
    setupMenu.classList.remove('hidden');
    
    // 2. Limpieza del DOM
    gameBoard.innerHTML = '';
    
    // 3. Reset total del estado lógico (Crucial para evitar bugs)
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    lockBoard = false; // Si se reinicia durante un error, esto libera el tablero
    
    // 4. Reset del HUD
    moveDisplay.textContent = moves;
    document.getElementById('player-name').value = '';
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

function checkMatch() {
    lockBoard = true;
    moves++;
    moveDisplay.textContent = moves;

    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;

    if (isMatch) {
        disableCards();
    } else {
        showErrorMessage();
    }
}

function unflipCards() {
    // Volteamos las cartas de vuelta
    flippedCards[0].classList.remove('flipped');
    flippedCards[1].classList.remove('flipped');
    
    // Resetear el estado del turno
    flippedCards = [];
    lockBoard = false; // Desbloqueamos el tablero tras el error
}

function disableCards() {
    matchedPairs++;
    flippedCards = [];
    lockBoard = false; // Desbloqueamos para el siguiente movimiento

    if (matchedPairs === totalPairs) {
        showVictory();
    }
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}

function showErrorMessage() {
    // Mostrar el aviso
    gameMessage.classList.remove('hidden');

    // 2. Programar la desaparición y el "unflip"
    // Usamos el mismo tiempo para que la fluidez sea constante
    setTimeout(() => {
        gameMessage.classList.add('hidden');
        unflipCards();
    }, 1200); // 1.2 segundos es suficiente para leer y procesar
}

function showVictory() {
    const msg = document.getElementById('victory-message');
    
    victoryModal.classList.remove('hidden');
    msg.textContent = `¡Lo lograste en ${moves} movimientos!`;
}