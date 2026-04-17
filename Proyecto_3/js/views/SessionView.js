/**
 * SessionView.js
 * View manager for creating new workout sessions.
 */

class SessionView extends HTMLElement {
    constructor() {
        super();
        this._selectedRoutineId = null;
        this._routines = [];
        this._exercises = [];

        if (!document.getElementById("session-view-styles")) {
            const style = document.createElement("style");
            style.id = "session-view-styles";
            style.textContent = `
                session-view { display: block; animation: fadeIn 0.3s ease; }
                .routine-selector-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-lg);
                }
                .selector-card {
                    cursor: pointer;
                    text-align: center;
                }
                .selector-card:hover { border: 2px solid var(--wii-teal); }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * @param {Object} params Can contain routineId to skip selection
     */
    async setParams(params = {}) {
        if(params.routineId) {
            this._selectedRoutineId = params.routineId;
        }
    }

    async connectedCallback() {
        this.innerHTML = `<loading-state text="Preparando sesión..."></loading-state>`;
        await this.loadData();
    }

    async loadData() {
        try {
            this._routines = await window.dbService.getRoutines();
            this._exercises = await window.dbService.getExercises();
            this.render();
        } catch (e) {
            this.innerHTML = `<error-state message="Error iniciando sesión: ${e.message}"></error-state>`;
        }
    }

    render() {
        if (this._selectedRoutineId) {
            this.renderLogger();
        } else {
            this.renderSelector();
        }
    }

    renderSelector() {
        this.innerHTML = `
            <div class="logger-header">
                <h1>Nueva Sesión</h1>
                <p>Selecciona una rutina para comenzar</p>
            </div>
            
            <div class="routine-selector-grid">
                ${this._routines.map(r => `
                    <wii-card class="selector-card wii-card-hoverable" data-id="${r.id}">
                        <h3 style="color:var(--wii-teal)">${r.name}</h3>
                        <p style="font-size:0.8rem; color:var(--wii-text-muted)">${r.exercises.length} Ejercicios</p>
                    </wii-card>
                `).join('')}
                
                ${this._routines.length === 0 ? `
                    <div style="grid-column: 1/-1; text-align:center; padding: 40px;">
                        <p>No tienes rutinas creadas todavía.</p>
                        <button class="wii-btn wii-btn-primary" onclick="window.switchView('routines')">Ir a Rutinas</button>
                    </div>
                ` : ''}
            </div>
        `;

        this.querySelectorAll('.selector-card').forEach(card => {
            card.addEventListener('click', () => {
                this._selectedRoutineId = parseInt(card.dataset.id);
                this.render();
            });
        });
    }

    renderLogger() {
        const routine = this._routines.find(r => r.id === this._selectedRoutineId);
        if (!routine) {
            this._selectedRoutineId = null;
            this.render();
            return;
        }

        this.innerHTML = `
            <div id="logger-container"></div>
            <session-summary-dialog id="session-end-modal"></session-summary-dialog>
        `;
        const logger = document.createElement('workout-logger');
        this.querySelector('#logger-container').appendChild(logger);
        logger.setup(routine, this._exercises);

        this.addEventListener('cancel-session', async () => {
            // Use global confirm if possible or just navigate back
            window.navigateBack();
        });

        this.addEventListener('finish-session', async (e) => {
            const sessionData = e.detail;
            const loggerContainer = this.querySelector('#logger-container');
            loggerContainer.innerHTML = `<loading-state text="Guardando entrenamiento..."></loading-state>`;
            
            try {
                await window.dbService.addSession(sessionData);
                const history = await window.dbService.getSessions();
                
                loggerContainer.innerHTML = ''; // Hide loader
                
                const modal = this.querySelector('#session-end-modal');
                modal.show(sessionData, history);
                
                // Wait for it to close before redirecting
                modal.addEventListener('summary-closed', () => {
                    window.switchView('dashboard');
                }, { once: true });
                
            } catch (err) {
                alert("Error al guardar: " + err.message);
                this.render();
            }
        });
    }
}

customElements.define('session-view', SessionView);
