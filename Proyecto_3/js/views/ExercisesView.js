/**
 * ExercisesView.js
 * The main CRUD view for the Exercises catalog.
 */

class ExercisesView extends HTMLElement {
    constructor() {
        super();
        this._exercises = [];
        this._searchTerm = '';
        this._filterMuscle = 'All';

        if (!document.getElementById("exercises-view-styles")) {
            const style = document.createElement("style");
            style.id = "exercises-view-styles";
            style.textContent = `
                exercises-view {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }
                
                .exercises-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                    gap: var(--spacing-md);
                }

                .exercises-header h1 {
                    color: var(--wii-teal);
                    margin: 0;
                }

                .exercises-controls {
                    display: flex;
                    gap: var(--spacing-sm);
                    background: var(--wii-white);
                    padding: var(--spacing-sm);
                    border-radius: var(--radius-pill);
                    box-shadow: var(--shadow-soft);
                    flex-wrap: wrap;
                }

                .exercises-controls input, .exercises-controls select {
                    border: none;
                    background: var(--wii-bg);
                    padding: 8px 16px;
                    border-radius: var(--radius-pill);
                    font-family: var(--font-main);
                    outline: none;
                }

                .exercises-controls input:focus {
                    box-shadow: 0 0 0 2px var(--wii-teal-light);
                }

                .exercise-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--spacing-md);
                }
                
                .empty-catalog {
                    text-align: center;
                    padding: var(--spacing-xl);
                    color: var(--wii-text-muted);
                    grid-column: 1 / -1;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async connectedCallback() {
        this.innerHTML = `<loading-state text="Cargando catálogo..."></loading-state>`;
        await this.loadData();
    }

    async loadData() {
        try {
            this._exercises = await window.dbService.getExercises();
            this.render();
        } catch (error) {
            this.innerHTML = `<error-state message="Error al cargar ejercicios: ${error.message}"></error-state>`;
        }
    }

    get filteredExercises() {
        return this._exercises.filter(ex => {
            const matchSearch = ex.name.toLowerCase().includes(this._searchTerm.toLowerCase());
            const matchMuscle = this._filterMuscle === 'All' || ex.muscleGroup === this._filterMuscle;
            return matchSearch && matchMuscle;
        });
    }

    render() {
        const list = this.filteredExercises;
        
        let gridHtml = '';
        if (list.length === 0) {
            if (this._exercises.length === 0) {
                gridHtml = `<div class="empty-catalog">
                    <h3>No hay ejercicios todavía</h3>
                    <p>Crea tu primer ejercicio para empezar.</p>
                </div>`;
            } else {
                 gridHtml = `<div class="empty-catalog">No se encontraron resultados.</div>`;
            }
        } else {
            // We'll create elements directly dynamically in Javascript mapped to components 
            // after setting innerHTML to avoid parsing complex strings.
        }

        this.innerHTML = `
            <div class="exercises-header">
                <div>
                    <h1>Catálogo de Ejercicios</h1>
                    <p style="color: var(--wii-text-muted)">Administra tus máquinas y actividades</p>
                </div>
                
                <div class="exercises-controls">
                    <input type="text" id="search-input" placeholder="Buscar..." value="${this._searchTerm}">
                    <select id="filter-muscle">
                        <option value="All">Todos los grupos</option>
                        <option value="Pecho">Pecho</option>
                        <option value="Espalda">Espalda</option>
                        <option value="Piernas">Piernas</option>
                        <option value="Brazos">Brazos</option>
                        <option value="Hombros">Hombros</option>
                        <option value="Core">Core</option>
                        <option value="Cardio">Cardio</option>
                    </select>
                    <button class="wii-btn wii-btn-primary" id="btn-new">➕ Nuevo</button>
                </div>
            </div>
            
            <div class="exercise-grid" id="exercise-grid-container">
                ${gridHtml}
            </div>
            
            <!-- Global modales for this view -->
            <exercise-editor id="view-editor"></exercise-editor>
            <confirm-dialog id="view-confirm"></confirm-dialog>
        `;

        // Render actual cards
        if (list.length > 0) {
            const container = this.querySelector('#exercise-grid-container');
            list.forEach(ex => {
                const card = document.createElement('exercise-card');
                card.data = ex;
                container.appendChild(card);
            });
        }

        this.setupListeners();
    }

    setupListeners() {
        // Search & Filter
        this.querySelector('#search-input').addEventListener('input', (e) => {
            this._searchTerm = e.target.value;
            this.render(); // Re-render grid on input (simple approach without re-fetching DB)
        });

        this.querySelector('#filter-muscle').addEventListener('change', (e) => {
            this._filterMuscle = e.target.value;
            // set value back to selector to maintain state
            const target = e.target;
            for(let i=0; i<target.options.length; i++) {
                if(target.options[i].value === this._filterMuscle) target.selectedIndex = i;
            }
            this.render();
        });

        // Add
        const editor = this.querySelector('#view-editor');
        this.querySelector('#btn-new').addEventListener('click', () => {
            editor.open(null); // open in create mode
        });

        // The View receives bubbled events from inner components (the cards and the editor)
        this.addEventListener('edit-exercise', (e) => {
            editor.open(e.detail);
        });

        this.addEventListener('delete-exercise', async (e) => {
            const exercise = e.detail;
            const confirmDialog = this.querySelector('#view-confirm');
            
            const confirmed = await confirmDialog.ask(
                '¿Eliminar Ejercicio?',
                `¿Deseas eliminar permanentemente <b>${exercise.name}</b>?<br><br><i>Si está asociado a alguna rutina, podría causar problemas (pendiente implementar cascada o advertencia).</i>`
            );

            if (confirmed) {
                try {
                    await window.dbService.deleteExercise(exercise.id);
                    await this.loadData();
                } catch(err) {
                    console.error(err);
                    alert("Error eliminando: " + err.message);
                }
            }
        });

        this.addEventListener('save-exercise', async (e) => {
            const data = e.detail;
            try {
                if (data.id) {
                    // Update
                    await window.dbService.updateExercise(data);
                } else {
                    // Create
                    await window.dbService.addExercise(data);
                }
                await this.loadData(); // Re-fetch all and refresh
            } catch(err) {
                console.error(err);
                alert("Error guardando: " + err.message);
            }
        });
    }
}

customElements.define('exercises-view', ExercisesView);
