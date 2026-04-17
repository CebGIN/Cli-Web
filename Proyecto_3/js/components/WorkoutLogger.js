/**
 * WorkoutLogger.js
 * The main interface for recording a live workout session.
 */

class WorkoutLogger extends HTMLElement {
    constructor() {
        super();
        this._routine = null;
        this._exercisesPool = []; // To resolve names/details
        this._sessionData = {
            stats: [], // Array of {exerciseId, sets: [{weight, reps}]}
            startTime: Date.now(),
            notes: ""
        };

        if (!document.getElementById("workout-logger-styles")) {
            const style = document.createElement("style");
            style.id = "workout-logger-styles";
            style.textContent = `
                workout-logger {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                    animation: fadeIn 0.3s ease;
                }

                .logger-header {
                    text-align: center;
                    margin-bottom: var(--spacing-md);
                }

                .logger-header h2 { color: var(--wii-teal); margin-bottom: 5px; }
                .logger-header p { color: var(--wii-text-muted); font-size: 0.9rem; }

                .exercise-log-card {
                    margin-bottom: var(--spacing-md);
                }

                .exercise-log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                    border-bottom: 1px solid var(--wii-bg);
                    padding-bottom: 5px;
                }

                .exercise-log-header h4 { margin: 0; color: var(--wii-text-dark); }
                
                .sets-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .sets-table th {
                    text-align: center;
                    font-size: 0.8rem;
                    color: var(--wii-text-muted);
                    padding: 5px;
                }

                .set-row {
                    display: grid;
                    grid-template-columns: 40px 1fr 1fr 40px;
                    gap: var(--spacing-sm);
                    align-items: center;
                    margin-bottom: var(--spacing-xs);
                }

                .set-num {
                    background: var(--wii-teal-light);
                    color: var(--wii-text-dark);
                    font-weight: bold;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                }

                .set-row input {
                    width: 100%;
                    padding: 8px;
                    border-radius: var(--radius-sm);
                    border: 1px solid #ccc;
                    text-align: center;
                    font-family: var(--font-main);
                }

                .btn-add-set {
                    width: 100%;
                    margin-top: var(--spacing-sm);
                    background: var(--wii-bg);
                    color: var(--wii-teal);
                    border: 1px dashed var(--wii-teal);
                    padding: 8px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-weight: bold;
                }
                
                .btn-remove-set {
                    background: none;
                    border: none;
                    color: var(--wii-danger);
                    cursor: pointer;
                    font-size: 1.2rem;
                }

                .logger-footer {
                    margin-top: var(--spacing-xl);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .logger-footer textarea {
                    width: 100%;
                    padding: var(--spacing-md);
                    border-radius: var(--radius-card);
                    border: 1px solid #ccc;
                    font-family: var(--font-main);
                    min-height: 80px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * @param {Object} routine 
     * @param {Array} exercises Full exercises list to resolve names
     */
    setup(routine, exercises) {
        this._routine = routine;
        this._exercisesPool = exercises;
        
        // Initialize stats based on the routine's suggested sets
        this._sessionData.stats = routine.exercises.map(ex => {
            const sets = [];
            // Create suggested number of sets
            for (let i = 0; i < (ex.sets || 3); i++) {
                sets.push({ weight: 0, reps: ex.reps || 10 });
            }
            return {
                exerciseId: ex.exerciseId,
                sets: sets
            };
        });

        this.render();
    }

    render() {
        if (!this._routine) return;

        this.innerHTML = `
            <div class="logger-header">
                <h2>${this._routine.name}</h2>
                <p>En sesión: <span id="session-timer">00:00</span></p>
            </div>

            <div id="exercises-list">
                <!-- Exercise blocks injected here -->
            </div>

            <div class="logger-footer">
                <wii-card>
                    <h4>Notas de la sesión</h4>
                    <textarea id="session-notes" placeholder="¿Cómo te sentiste hoy?"></textarea>
                </wii-card>
                
                <div style="display:flex; gap: var(--spacing-md);">
                    <button class="wii-btn btn-cancel-session" style="flex:1">Descartar</button>
                    <button class="wii-btn wii-btn-primary btn-finish-session" style="flex:2">Finalizar Entrenamiento</button>
                </div>
            </div>
        `;

        this.renderExercises();
        this.startTimer();
        this.setupListeners();
    }

    renderExercises() {
        const container = this.querySelector('#exercises-list');
        container.innerHTML = '';

        this._sessionData.stats.forEach((exStat, exIndex) => {
            const exInfo = this._exercisesPool.find(e => e.id === exStat.exerciseId);
            const name = exInfo ? exInfo.name : "Desconocido";

            const card = document.createElement('wii-card');
            card.className = "exercise-log-card";
            card.innerHTML = `
                <div class="exercise-log-header">
                    <h4>${name}</h4>
                </div>
                
                <div class="sets-header" style="display:grid; grid-template-columns: 40px 1fr 1fr 40px; gap:8px; margin-bottom: 5px; text-align:center; font-size:0.75rem; color:var(--wii-text-muted)">
                    <span>#</span>
                    <span>Peso (kg)</span>
                    <span>Reps</span>
                    <span></span>
                </div>

                <div class="sets-body" id="sets-container-${exIndex}">
                    <!-- Sets here -->
                </div>
                
                <button class="btn-add-set" data-ex-idx="${exIndex}">+ Añadir Serie</button>
            `;

            const setsContainer = card.querySelector(`#sets-container-${exIndex}`);
            this.renderSets(exStat.sets, setsContainer, exIndex);

            card.querySelector('.btn-add-set').addEventListener('click', () => {
                exStat.sets.push({ weight: exStat.sets[exStat.sets.length-1]?.weight || 0, reps: exStat.sets[exStat.sets.length-1]?.reps || 10 });
                this.renderSets(exStat.sets, setsContainer, exIndex);
            });

            container.appendChild(card);
        });
    }

    renderSets(sets, container, exIndex) {
        container.innerHTML = '';
        sets.forEach((set, setIndex) => {
            const row = document.createElement('div');
            row.className = 'set-row';
            row.innerHTML = `
                <div class="set-num">${setIndex + 1}</div>
                <input type="number" step="0.5" value="${set.weight}" class="inp-weight" data-ex="${exIndex}" data-set="${setIndex}" placeholder="0">
                <input type="number" value="${set.reps}" class="inp-reps" data-ex="${exIndex}" data-set="${setIndex}" placeholder="0">
                <button class="btn-remove-set" data-ex="${exIndex}" data-set="${setIndex}">×</button>
            `;

            row.querySelector('.inp-weight').addEventListener('input', (e) => {
                this._sessionData.stats[exIndex].sets[setIndex].weight = parseFloat(e.target.value) || 0;
            });
            row.querySelector('.inp-reps').addEventListener('input', (e) => {
                this._sessionData.stats[exIndex].sets[setIndex].reps = parseInt(e.target.value) || 0;
            });
            row.querySelector('.btn-remove-set').addEventListener('click', () => {
                this._sessionData.stats[exIndex].sets.splice(setIndex, 1);
                this.renderSets(this._sessionData.stats[exIndex].sets, container, exIndex);
            });

            container.appendChild(row);
        });
    }

    startTimer() {
        const timerEl = this.querySelector('#session-timer');
        this._timerInterval = setInterval(() => {
            const diff = Date.now() - this._sessionData.startTime;
            const mins = Math.floor(diff / 60000).toString().padStart(2, '0');
            const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
            timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    setupListeners() {
        this.querySelector('.btn-cancel-session').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('cancel-session', { bubbles: true }));
        });

        this.querySelector('.btn-finish-session').addEventListener('click', () => {
            this._sessionData.notes = this.querySelector('#session-notes').value;
            this._sessionData.duration = Math.floor((Date.now() - this._sessionData.startTime) / 60000);
            this._sessionData.routineId = this._routine.id;
            
            // --- Calorie Calculation (PF-02) ---
            // Simple formula: volume * 0.05 + duration * 3
            const totalVol = this._sessionData.stats.reduce((acc, ex) => acc + ex.sets.reduce((sak, set) => sak + (set.weight * set.reps), 0), 0);
            this._sessionData.calories = Math.round(totalVol * 0.05 + this._sessionData.duration * 3);
            
            this.dispatchEvent(new CustomEvent('finish-session', { 
                detail: this._sessionData, 
                bubbles: true 
            }));
        });
    }

    disconnectedCallback() {
        if (this._timerInterval) clearInterval(this._timerInterval);
    }
}

customElements.define('workout-logger', WorkoutLogger);
