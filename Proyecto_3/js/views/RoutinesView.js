/**
 * RoutinesView.js
 * Management UI for listing and organizing Routines.
 */

class RoutinesView extends HTMLElement {
    constructor() {
        super();
        this._routines = [];
        this._availableExercises = [];

        if (!document.getElementById("routines-view-styles")) {
            const style = document.createElement("style");
            style.id = "routines-view-styles";
            style.textContent = `
                routines-view {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }
                
                .routines-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                    gap: var(--spacing-md);
                }

                .routines-header h1 {
                    color: var(--wii-teal);
                    margin: 0;
                }

                .routine-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: var(--spacing-md);
                }
            `;
            document.head.appendChild(style);
        }
    }

    async connectedCallback() {
        this.innerHTML = `<loading-state text="Cargando rutinas..."></loading-state>`;
        await this.loadData();
    }

    async loadData() {
        try {
            // Need both routines (for the list) and exercises (to pass to the builder)
            this._routines = await window.dbService.getRoutines();
            this._availableExercises = await window.dbService.getExercises();
            this.render();
        } catch (error) {
            this.innerHTML = `<error-state message="Error al cargar: ${error.message}"></error-state>`;
        }
    }

    render() {
        let gridHtml = '';
        if (this._routines.length === 0) {
            gridHtml = `
            <div class="empty-catalog" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>No tienes rutinas</h3>
                <p>Arma tu primera rutina de entrenamiento.</p>
            </div>`;
        }

        this.innerHTML = `
            <div class="routines-header">
                <div>
                    <h1>Mis Rutinas</h1>
                    <p style="color: var(--wii-text-muted)">Programas de entrenamiento</p>
                </div>
                
                <div>
                    <button class="wii-btn wii-btn-primary" id="btn-new-rout">➕ Nueva Rutina</button>
                </div>
            </div>
            
            <div class="routine-grid" id="routine-grid-container">
                ${gridHtml}
            </div>
            
            <!-- Global modales for this view -->
            <routine-builder id="view-rout-builder"></routine-builder>
            <confirm-dialog id="view-rout-confirm"></confirm-dialog>
        `;

        if (this._routines.length > 0) {
            const container = this.querySelector('#routine-grid-container');
            this._routines.forEach(rot => {
                const card = document.createElement('routine-card');
                card.data = rot;
                container.appendChild(card);
            });
        }

        this.setupListeners();
    }

    setupListeners() {
        const builder = this.querySelector('#view-rout-builder');
        
        // Pass the exercises dictionary
        builder.availableExercises = this._availableExercises;

        // Add
        this.querySelector('#btn-new-rout').addEventListener('click', () => {
            builder.open(null);
        });

        // Edit
        this.addEventListener('edit-routine', (e) => {
            builder.open(e.detail);
        });

        // Delete
        this.addEventListener('delete-routine', async (e) => {
            const routine = e.detail;
            const confirmDialog = this.querySelector('#view-rout-confirm');
            
            const confirmed = await confirmDialog.ask(
                '¿Eliminar Rutina?',
                `¿Deseas eliminar <b>${routine.name}</b>?<br><br><i>Tus historiales seguirán intactos.</i>`
            );

            if (confirmed) {
                try {
                    await window.dbService.deleteRoutine(routine.id);
                    await this.loadData();
                } catch(err) {
                    console.error(err);
                    alert("Error eliminando rutina: " + err.message);
                }
            }
        });

        // Save
        this.addEventListener('save-routine', async (e) => {
            const data = e.detail;
            try {
                if (data.id) {
                    await window.dbService.updateRoutine(data);
                } else {
                    await window.dbService.addRoutine(data);
                }
                await this.loadData(); 
            } catch(err) {
                console.error(err);
                alert("Error guardando: " + err.message);
            }
        });
        
        // Start Session hook
        this.addEventListener('start-session', (e) => {
            const rot = e.detail;
            window.switchView('session/new', { routineId: rot.id });
        });
    }
}

customElements.define('routines-view', RoutinesView);
