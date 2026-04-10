/**
 * ExerciseEditor.js
 * Form to create or edit an exercise. Used via a Modal.
 */

class ExerciseEditor extends HTMLElement {
    constructor() {
        super();
        this._exerciseData = null; // if null, mode is 'create', else 'edit'

        if (!document.getElementById("exercise-editor-styles")) {
            const style = document.createElement("style");
            style.id = "exercise-editor-styles";
            style.textContent = `
                exercise-editor dialog {
                    padding: var(--spacing-lg);
                    border: none;
                    border-radius: var(--radius-card);
                    box-shadow: var(--shadow-hover);
                    background: var(--wii-white);
                    width: 90%;
                    max-width: 500px;
                }
                
                exercise-editor dialog::backdrop {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }

                .editor-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                    border-bottom: 2px solid var(--wii-bg);
                    padding-bottom: var(--spacing-sm);
                }

                .editor-header h3 { color: var(--wii-teal); margin: 0;}

                .editor-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }

                .form-group label {
                    font-weight: bold;
                    font-size: 0.9rem;
                    color: var(--wii-text-dark);
                }

                .form-group input, 
                .form-group select, 
                .form-group textarea {
                    padding: 10px;
                    border-radius: var(--radius-sm);
                    border: 1px solid #ccc;
                    font-family: var(--font-main);
                    background: #fafafa;
                }
                
                .form-group input:focus, 
                .form-group select:focus, 
                .form-group textarea:focus {
                    outline: 2px solid var(--wii-teal);
                    background: var(--wii-white);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-md);
                }
            `;
            document.head.appendChild(style);
        }
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Opens the editor modal.
     * @param {Object|null} exerciseData 
     */
    open(exerciseData = null) {
        this._exerciseData = exerciseData;
        this.render();
        const dialog = this.querySelector('dialog');
        dialog.showModal();
    }

    close() {
        const dialog = this.querySelector('dialog');
        if(dialog) dialog.close();
    }

    render() {
        const isEdit = !!this._exerciseData;
        const data = this._exerciseData || {
            name: '',
            muscleGroup: 'Pecho',
            type: 'Máquina',
            image: 'default',
            description: ''
        };

        this.innerHTML = `
            <dialog>
                <div class="editor-header">
                    <h3>${isEdit ? '✏️ Editar Ejercicio' : '➕ Nuevo Ejercicio'}</h3>
                </div>
                
                <form class="editor-form" id="exercise-form">
                    <div class="form-group">
                        <label for="ex-name">Nombre del Ejercicio *</label>
                        <input type="text" id="ex-name" name="name" required placeholder="Ej: Press de Banca" value="${data.name}">
                    </div>

                    <div class="form-group">
                        <label for="ex-muscle">Grupo Muscular</label>
                        <select id="ex-muscle" name="muscleGroup">
                            <option value="Pecho" ${data.muscleGroup === 'Pecho' ? 'selected' : ''}>Pecho</option>
                            <option value="Espalda" ${data.muscleGroup === 'Espalda' ? 'selected' : ''}>Espalda</option>
                            <option value="Piernas" ${data.muscleGroup === 'Piernas' ? 'selected' : ''}>Piernas</option>
                            <option value="Brazos" ${data.muscleGroup === 'Brazos' ? 'selected' : ''}>Brazos</option>
                            <option value="Hombros" ${data.muscleGroup === 'Hombros' ? 'selected' : ''}>Hombros</option>
                            <option value="Core" ${data.muscleGroup === 'Core' ? 'selected' : ''}>Core</option>
                            <option value="Cardio" ${data.muscleGroup === 'Cardio' ? 'selected' : ''}>Cardio</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="ex-type">Tipo</label>
                        <select id="ex-type" name="type">
                            <option value="Máquina" ${data.type === 'Máquina' ? 'selected' : ''}>Máquina</option>
                            <option value="Peso propio" ${data.type === 'Peso propio' ? 'selected' : ''}>Peso propio</option>
                            <option value="Libre" ${data.type === 'Libre' ? 'selected' : ''}>Peso Libre (Barras/Mancuernas)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="ex-image">Avatar / Imagen</label>
                        <select id="ex-image" name="image">
                            <option value="default" ${data.image === 'default' ? 'selected' : ''}>Icono Automático</option>
                            <!-- Future: Could allow uploading models or selecting from predefined assets -->
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="ex-desc">Instrucciones / Notas (Opcional)</label>
                        <textarea id="ex-desc" name="description" rows="2" placeholder="Técnica, tips, etc.">${data.description || ''}</textarea>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="wii-btn btn-cancel">Cancelar</button>
                        <button type="submit" class="wii-btn wii-btn-primary">Guardar</button>
                    </div>
                </form>
            </dialog>
        `;

        // Event Listeners
        const form = this.querySelector('#exercise-form');
        const btnCancel = this.querySelector('.btn-cancel');

        btnCancel.addEventListener('click', () => this.close());

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newData = {
                name: formData.get('name'),
                muscleGroup: formData.get('muscleGroup'),
                type: formData.get('type'),
                image: formData.get('image'),
                description: formData.get('description'),
            };

            if (isEdit) {
                newData.id = this._exerciseData.id; // Keep original ID
            }

            this.dispatchEvent(new CustomEvent('save-exercise', { 
                detail: newData, 
                bubbles: true 
            }));
            
            this.close();
        });
    }
}

customElements.define('exercise-editor', ExerciseEditor);
