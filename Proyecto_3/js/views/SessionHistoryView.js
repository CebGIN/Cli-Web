/**
 * SessionHistoryView.js
 * Lists past workouts and allows viewing details.
 */

class SessionHistoryView extends HTMLElement {
    constructor() {
        super();
        this._sessions = [];
        this._routines = [];

        if (!document.getElementById("session-history-styles")) {
            const style = document.createElement("style");
            style.id = "session-history-styles";
            style.textContent = `
                session-history-view { display: block; animation: fadeIn 0.3s ease; }
                
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-lg);
                }

                .session-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .session-main-info h4 { margin: 0; color: var(--wii-teal); }
                .session-main-info p { margin: 0; font-size: 0.8rem; color: var(--wii-text-muted); }

                .session-badges {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                
                .badge {
                    background: var(--wii-bg);
                    padding: 4px 10px;
                    border-radius: var(--radius-pill);
                    font-size: 0.75rem;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async connectedCallback() {
        this.innerHTML = `<loading-state text="Cargando historial..."></loading-state>`;
        await this.loadData();
    }

    async loadData() {
        try {
            // Fetch sessions and sort descending by date
            const sessions = await window.dbService.getSessions();
            this._sessions = sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
            this._routines = await window.dbService.getRoutines();
            this.render();
        } catch (e) {
            this.innerHTML = `<error-state message="Error cargando historial: ${e.message}"></error-state>`;
        }
    }

    render() {
        this.innerHTML = `
            <div class="logger-header">
                <h1>Historial de Actividad</h1>
                <p>Tus entrenamientos pasados</p>
            </div>

            <div class="history-list">
                ${this._sessions.map(s => {
                    const routine = this._routines.find(r => r.id === s.routineId);
                    const date = new Date(s.date).toLocaleDateString();
                    const totalVolume = s.stats.reduce((acc, ex) => {
                        return acc + ex.sets.reduce((sAcc, set) => sAcc + (set.weight * set.reps), 0);
                    }, 0);

                    return `
                        <wii-card class="session-item wii-card-hoverable">
                            <div class="session-main-info">
                                <h4>${routine ? routine.name : "Rutina eliminada"}</h4>
                                <p>📅 ${date} • ⏱️ ${s.duration} mins</p>
                            </div>
                            <div class="session-badges">
                                <span class="badge" title="Calorías Estimadas">🔥 ${s.calories || 0} kcal</span>
                                <span class="badge" title="Volumen Total">💪 ${Math.round(totalVolume)} kg</span>
                                <button class="wii-btn btn-view-session" data-id="${s.id}">Ver</button>
                            </div>
                        </wii-card>
                    `;
                }).join('')}

                ${this._sessions.length === 0 ? `
                    <div style="text-align:center; padding: 40px; color: var(--wii-text-muted)">
                        <p>Aún no has registrado ningún entrenamiento.</p>
                    </div>
                ` : ''}
            </div>
        `;

        this.querySelectorAll('.btn-view-session').forEach(btn => {
            btn.addEventListener('click', () => {
                // In a perfect SPA we'd go to #session/:id
                alert("Detalle de sesión próximamente (Integración con Dashboard)");
            });
        });
    }
}

customElements.define('session-history-view', SessionHistoryView);
