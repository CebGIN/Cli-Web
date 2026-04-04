/**
 * debug.js
 * Testing Bed component for GymLog.
 * Used to verify DB actions and Component states without navigating the full app.
 */

class DebugView extends HTMLElement {
    constructor() {
        super();
        this.results = [];

        // Single style injection
        if (!document.getElementById("debug-view-styles")) {
            const style = document.createElement("style");
            style.id = "debug-view-styles";
            style.textContent = `
                .debug-container {
                    padding: var(--spacing-md);
                    background: var(--wii-white);
                    border-radius: var(--radius-card);
                    box-shadow: var(--shadow-soft);
                }
                .debug-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }
                .debug-console {
                    background: #1e1e1e;
                    color: #4CAF50;
                    font-family: monospace;
                    padding: var(--spacing-md);
                    border-radius: var(--radius-sm);
                    height: 300px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                }
                .log-error { color: #f44336; }
                .log-warn { color: #ffeb3b; }
                .log-info { color: #2196f3; }
            `;
            document.head.appendChild(style);
        }

        this.innerHTML = `
            <div class="debug-container">
                <h2>🛠️ Banco de Pruebas (Test Bed)</h2>
                <p style="color: var(--wii-text-muted); margin-bottom: var(--spacing-lg);">
                    Esta vista se usa para probar funciones core aisladas.
                </p>

                <div class="debug-actions">
                    <button class="wii-btn" id="btn-test-db">Testear Base de Datos</button>
                    <button class="wii-btn wii-btn-danger" id="btn-clear-db">Limpiar DB Completamente</button>
                </div>

                <div class="debug-console" id="debug-console">
                    > Debug console ready.
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.setupListeners();
    }

    setupListeners() {
        const consoleEl = this.querySelector('#debug-console');
        
        const log = (msg, type = 'normal') => {
            const line = document.createElement('div');
            line.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
            if(type !== 'normal') line.className = `log-${type}`;
            consoleEl.appendChild(line);
            consoleEl.scrollTop = consoleEl.scrollHeight;
        };

        this.querySelector('#btn-clear-db').addEventListener('click', async () => {
            try {
                log("Borrando stores...");
                await window.dbService.clearStore('exercises');
                await window.dbService.clearStore('routines');
                await window.dbService.clearStore('sessions');
                log("Limpieza exitosa.", 'info');
            } catch (e) {
                log(`Error limpiando: ${e}`, 'error');
            }
        });

        this.querySelector('#btn-test-db').addEventListener('click', async () => {
            log("Iniciando Test Secuencial de DB...", 'info');
            
            try {
                // 1. Fill DB
                log("1. Insertando ejercicios de prueba...");
                const exercisesToInsert = [
                    { name: "Press de Banca", muscleGroup: "Pecho", type: "Máquina" },
                    { name: "Sentadilla", muscleGroup: "Piernas", type: "Peso propio" },
                    { name: "Curl de Biceps", muscleGroup: "Brazos", type: "Máquina" }
                ];
                
                let addedCount = 0;
                for (const ex of exercisesToInsert) {
                    await window.dbService.addExercise(ex);
                    addedCount++;
                }
                log(`✓ Insertados ${addedCount} ejercicios.`);

                // 2. Read DB
                log("2. Recuperando ejercicios...");
                const savedExercises = await window.dbService.getExercises();
                log(`✓ Recuperados ${savedExercises.length} ejercicios. Dumps:`);
                savedExercises.forEach(e => log(` - ID: ${e.id} | ${e.name} (${e.muscleGroup})`));

                log("--- Test DB Completado con Éxito ---", 'info');

            } catch (error) {
                log(`❌ Falla en la prueba DB: ${error}`, 'error');
                console.error(error);
            }
        });
    }
}

customElements.define('debug-view', DebugView);
