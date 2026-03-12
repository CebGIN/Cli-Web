// --- REFERENCIAS DOM ---
const setupMenu = document.getElementById('setup-menu');
const gameScreen = document.getElementById('game-screen');
const victoryModal = document.getElementById('victory-modal');
const historyLog = document.getElementById('history-log');
const gameMessage = document.getElementById('game-message');

// --- ESTADO DEL JUEGO ---
let queue = []; 
let buffer = null;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let isDragging = false;
let currentCard = null;
let startX, startY, initialX, initialY;

// --- INICIO Y GENERACIÓN ---
function startGameFromMenu() {
    const count = parseInt(document.getElementById('card-count').value);
    
    // Algoritmo: Generar ascendente y luego desordenar (Fisher-Yates)
    queue = [];
    let currentVal = Math.floor(Math.random() * 10) + 1;
    for(let i = 0; i < count; i++) {
        queue.push(currentVal);
        currentVal += Math.floor(Math.random() * 8) + 1; // Incremento aleatorio asegurando que no haya repetidos
    }
    
    // Mezclar array
    for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    buffer = null;
    moves = 0;
    seconds = 0;
    historyLog.innerHTML = '';
    document.getElementById('moves').textContent = moves;
    
    setupMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    startTimer();
    render();
    addLog(`Sistema iniciado con ${count} nodos`, 'neutral');
}

function ReStart() {
    clearInterval(timerInterval);
    victoryModal.classList.add('hidden');
    gameScreen.classList.add('hidden');
    setupMenu.classList.remove('hidden');
}

// --- SISTEMA DE ARRASTRE ---
function setupDraggable(card) {
    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        currentCard = card;
        const rect = card.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        card.style.position = 'fixed';
        card.style.width = rect.width + 'px';
        card.style.zIndex = '1000';
        card.classList.remove('returning');
    });
}

document.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentCard) return;
    currentCard.style.left = (e.clientX - startX) + 'px';
    currentCard.style.top = (e.clientY - startY) + 'px';
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging || !currentCard) return;
    isDragging = false;

    let snapped = false;
    const origin = currentCard.dataset.origin;
    const val = parseInt(currentCard.textContent);

    const zones = [
        { id: 'buffer', el: document.getElementById('buffer') },
        { id: 'queue-end', el: document.getElementById('queue-end') }
    ];

    for (const zone of zones) {
        if (isOverlapping(currentCard, zone.el)) {
            if (origin === 'front') {
                if (zone.id === 'buffer' && buffer === null) {
                    buffer = queue.shift();
                    addLog(`[${val}] movido al BUFFER`, 'extract');
                    recordMove();
                    snapped = true;
                } else if (zone.id === 'queue-end') {
                    queue.push(queue.shift());
                    addLog(`[${val}] re-encolado al FINAL`, 'insert');
                    recordMove();
                    snapped = true;
                } else if (zone.id === 'buffer' && buffer !== null) {
                    showError("Buffer lleno");
                }
            } else if (origin === 'buffer' && zone.id === 'queue-end') {
                queue.push(buffer);
                buffer = null;
                addLog(`[${val}] insertado desde buffer`, 'insert');
                recordMove();
                snapped = true;
            }
        }
    }

    if (!snapped) {
        currentCard.classList.add('returning');
        currentCard.style.left = initialX + 'px';
        currentCard.style.top = initialY + 'px';
        setTimeout(() => render(), 400); // Dar tiempo a la animación
    } else {
        render();
    }
});

// --- RENDERIZADO Y LÓGICA ---
function render() {
    const frontZone = document.getElementById('queue-front');
    const bufferZone = document.getElementById('buffer');
    const stackVisual = document.getElementById('hidden-stack');
    
    frontZone.innerHTML = '<p class="zone-label">FRENTE</p>';
    bufferZone.innerHTML = '<p class="zone-label">BUFFER</p>';

    if (queue.length > 0) {
        const cardFront = createCard(queue[0], 'front');
        frontZone.appendChild(cardFront);
    }

    if (buffer !== null) {
        const cardBuffer = createCard(buffer, 'buffer');
        bufferZone.appendChild(cardBuffer);
    }

    stackVisual.style.opacity = queue.length > 1 ? "1" : "0.2";
    checkVictory();
}

function createCard(val, origin) {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = val;
    div.dataset.origin = origin;
    setupDraggable(div);
    return div;
}

function addLog(msg, type) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${msg}`;
    historyLog.appendChild(entry);
    historyLog.scrollTop = historyLog.scrollHeight; // Auto-scroll
}

function recordMove() {
    moves++;
    document.getElementById('moves').textContent = moves;
}

// --- UTILIDADES ---
function isOverlapping(card, zone) {
    const r1 = card.getBoundingClientRect();
    const r2 = zone.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function showError(msg) {
    gameMessage.textContent = msg;
    gameMessage.classList.remove('hidden');
    setTimeout(() => gameMessage.classList.add('hidden'), 1500);
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds/60).toString().padStart(2,'0');
        const s = (seconds%60).toString().padStart(2,'0');
        document.getElementById('timer').textContent = `${m}:${s}`;
    }, 1000);
}

function checkVictory() {
    if (queue.length === 0 || buffer !== null) return;
    
    const sorted = queue.every((v, i) => i === 0 || v > queue[i-1]);
    
    if (sorted && moves > 0) {
        clearInterval(timerInterval);
        document.getElementById('victory-message').textContent = 
            `Nodos ordenados en ${moves} operaciones. Tiempo: ${document.getElementById('timer').textContent}`;
        victoryModal.classList.remove('hidden');
    }
}