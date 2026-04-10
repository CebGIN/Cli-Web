/**
 * RoutineBuilder.js
 * Complex Form/Modal component to construct a Routine.
 */

class RoutineBuilder extends HTMLElement {
    constructor() {
        super();
        this._routineData = null; 
        this._availableExercises = [];
        this._selectedExercises = []; // Internal draft of routine.exercises

        if (!document.getElementById("routine-builder-styles")) {
            const style = document.createElement("style");
            style.id = "routine-builder-styles";
            style.textContent = `
                routine-builder dialog {
                    padding: var(--spacing-lg);
                    border: none;
                    border-radius: var(--radius-card);
                    box-shadow: var(--shadow-hover);
                    background: var(--wii-white);
                    width: 95%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                routine-builder dialog::backdrop {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }

                .builder-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                    border-bottom: 2px solid var(--wii-bg);
                    padding-bottom: var(--spacing-sm);
                }

                .builder-header h3 { color: var(--wii-teal); margin: 0;}

                .builder-section {
                    margin-bottom: var(--spacing-md);
                }
                
                .builder-section h4 {
                    margin-bottom: var(--spacing-sm);
                    color: var(--wii-text-dark);
                }

                /* Exercise Row styling */
                .ex-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    background: var(--wii-bg);
                    padding: var(--spacing-sm);
                    border-radius: var(--radius-sm);
                    margin-bottom: var(--spacing-xs);
                }
                
                .ex-row-name {
                    flex-grow: 1;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                .ex-row-inputs {
                    display: flex;
                    gap: var(--spacing-xs);
                    align-items: center;
                }
                
                .ex-row-inputs input {
                    width: 60px;
                    padding: 5px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    text-align: center;
                }
                
                .btn-remove-ex {
                    background: none;
                    border: none;
                    color: var(--wii-danger);
                    cursor: pointer;
                    font-size: 1.2rem;
                }

                /* Add Area */
                .add-area {
                    display: flex;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-sm);
                }
                .add-area select {
                    flex-grow: 1;
                    padding: 8px;
                    border-radius: var(--radius-sm);
                    border: 1px solid #ccc;
                }
            `;
            document.head.appendChild(style);
        }
    }

    set availableExercises(list) {
        this._availableExercises = list;
    }

    /**
     * @param {Object|null} data routine object
     */
    open(data = null) {
        this._routineData = data;
        // Copy the exercises array so we don't mutate the original yet
        this._selectedExercises = data && data.exercises ? JSON.parse(JSON.stringify(data.exercises)) : [];
        this.render();
        const dialog = this.querySelector('dialog');
        dialog.showModal();
    }

    close() {
        const dialog = this.querySelector('dialog');
        if(dialog) dialog.close();
    }

    render() {
        const isEdit = !!this._routineData;
        const data = this._routineData || { name: '', description: '' };

        this.innerHTML = `
            <dialog>
                <div class="builder-header">
                    <h3>${isEdit ? '✏️ Editar Rutina' : '➕ Nueva Rutina'}</h3>
                </div>
                
                <form id="routine-form" onsubmit="event.preventDefault();">
                    <div class="builder-section">
                        <div class="form-group" style="margin-bottom: var(--spacing-sm)">
                            <label>Nombre de la Rutina *</label>
                            <input type="text" id="rout-name" name="name" required placeholder="Ej: Full Body A" value="${data.name}" style="width: 100%; padding: 8px;">
                        </div>
                        <div class="form-group">
                            <label>Descripción</label>
                            <input type="text" id="rout-desc" name="description" placeholder="Objetivo general..." value="${data.description||''}" style="width: 100%; padding: 8px;">
                        </div>
                    </div>

                    <div class="builder-section">
                        <h4>Ejercicios</h4>
                        <div id="selected-exercises-container">
                            <!-- Rows injected here -->
                        </div>
                        
                        <div class="add-area">
                            <select id="ex-selector">
                                <option value="">-- Seleccionar Ejercicio --</option>
                                ${this._availableExercises.map(ex => `<option value="${ex.id}">${ex.name} (${ex.muscleGroup})</option>`).join('')}
                            </select>
                            <button type="button" class="wii-btn" id="btn-add-ex">Añadir</button>
                        </div>
                    </div>

                    <div class="form-actions" style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
                        <button type="button" class="wii-btn btn-cancel">Cancelar</button>
                        <button type="button" class="wii-btn wii-btn-primary" id="btn-save-rout">Guardar Rutina</button>
                    </div>
                </form>
            </dialog>
        `;

        this.renderSelectedExercises();
        this.setupListeners();
    }

    getExerciseDetailsById(id) {
        // ID could be string or num depending on JSON parse, force int for IndexedDB auto-increments
        return this._availableExercises.find(ex => ex.id === parseInt(id));
    }

    renderSelectedExercises() {
        const container = this.querySelector('#selected-exercises-container');
        if (this._selectedExercises.length === 0) {
            container.innerHTML = '<p style="color:#aaa; font-size:0.9rem; font-style:italic">No hay ejercicios agregados.</p>';
            return;
        }

        container.innerHTML = '';
        this._selectedExercises.forEach((item, index) => {
            const exInfo = this.getExerciseDetailsById(item.exerciseId);
            const name = exInfo ? exInfo.name : 'Ejercicio Desconocido';
            
            const div = document.createElement('div');
            div.className = 'ex-row';
            div.innerHTML = `
                <div class="ex-row-name">${index + 1}. ${name}</div>
                <div class="ex-row-inputs">
                    <label style="font-size:0.8rem">Series</label>
                    <input type="number" min="1" class="inp-sets" data-idx="${index}" value="${item.sets}" placeholder="Sets">
                    <label style="font-size:0.8rem">Reps</label>
                    <input type="number" min="1" class="inp-reps" data-idx="${index}" value="${item.reps}" placeholder="Reps">
                    <button type="button" class="btn-remove-ex" data-idx="${index}">×</button>
                </div>
            `;
            container.appendChild(div);
        });

        // Add Listeners to inputs
        container.querySelectorAll('.inp-sets').forEach(el => {
            el.addEventListener('change', (e) => {
                this._selectedExercises[e.target.dataset.idx].sets = parseInt(e.target.value) || 0;
            });
        });
        container.querySelectorAll('.inp-reps').forEach(el => {
            el.addEventListener('change', (e) => {
                this._selectedExercises[e.target.dataset.idx].reps = parseInt(e.target.value) || 0;
            });
        });
        
        container.querySelectorAll('.btn-remove-ex').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = e.target.dataset.idx;
                this._selectedExercises.splice(idx, 1);
                this.renderSelectedExercises();
            });
        });
    }

    setupListeners() {
        // Cancel
        this.querySelector('.btn-cancel').addEventListener('click', () => {
             this.close();
        });

        // Add Exercise
        this.querySelector('#btn-add-ex').addEventListener('click', () => {
            const selector = this.querySelector('#ex-selector');
            const val = selector.value;
            if (!val) return;
            
            this._selectedExercises.push({
                exerciseId: parseInt(val),
                sets: 4, // Default suggested sets
                reps: 10 // Default suggested reps
            });
            selector.value = ""; // reset
            this.renderSelectedExercises();
        });

        // Save
        this.querySelector('#btn-save-rout').addEventListener('click', () => {
            const nameInput = this.querySelector('#rout-name').value.trim();
            if(!nameInput) {
                alert("El nombre de la rutina es obligatorio.");
                return;
            }
            if(this._selectedExercises.length === 0) {
                alert("Debes agregar al menos un ejercicio a la rutina.");
                return;
            }

            const newData = {
                name: nameInput,
                description: this.querySelector('#rout-desc').value.trim(),
                exercises: this._selectedExercises
            };

            if (this._routineData && this._routineData.id) {
                newData.id = this._routineData.id;
                newData.createdAt = this._routineData.createdAt; // keep original
            }

            this.dispatchEvent(new CustomEvent('save-routine', { detail: newData, bubbles: true }));
            this.close();
        });
    }
}

customElements.define('routine-builder', RoutineBuilder);
