/**
 * ExerciseCard.js
 * A card component depicting an exercise in the catalog.
 */

class ExerciseCard extends HTMLElement {
    constructor() {
        super();
        this._data = null;

        if (!document.getElementById("exercise-card-styles")) {
            const style = document.createElement("style");
            style.id = "exercise-card-styles";
            style.textContent = `
                exercise-card {
                    display: block;
                }
                
                .exercise-card-inner {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    height: 100%;
                }
                
                .exercise-media {
                    width: 80px;
                    height: 80px;
                    border-radius: var(--radius-sm);
                    background: var(--wii-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                    border: 2px solid var(--wii-teal-light);
                }
                
                .exercise-media img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                
                .exercise-media.placeholder {
                    color: var(--wii-teal);
                    font-size: 2rem;
                }
                
                .exercise-info {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }
                
                .exercise-info h4 {
                    margin: 0;
                    color: var(--wii-text-dark);
                    font-size: 1.1rem;
                }
                
                .exercise-tags {
                    display: flex;
                    gap: var(--spacing-xs);
                    flex-wrap: wrap;
                }
                
                .exercise-tag {
                    font-size: 0.75rem;
                    padding: 2px 8px;
                    border-radius: var(--radius-pill);
                    background: var(--wii-teal-light);
                    color: var(--wii-text-dark);
                    font-weight: bold;
                }
                
                .exercise-tag.type-tag {
                    background: var(--wii-warning);
                    color: white;
                }
                
                .exercise-actions {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }
                
                .exercise-btn {
                    padding: 4px 8px;
                    font-size: 0.8rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    set data(value) {
        this._data = value;
        this.render();
    }

    connectedCallback() {
        if (this._data) {
            this.render();
        }
    }

    render() {
        if (!this._data) return;

        const { id, name, muscleGroup, type, image } = this._data;
        
        // We will build the media contents dynamically. This allows us to inject
        // `<canvas>` or `<img>` logic easily in the future depending on 'image' format.
        let mediaHtml = '';
        if (image && image !== 'default') {
            mediaHtml = `<img src="${image}" alt="${name}" onerror="this.src='assets/exercises/placeholder.png'; this.onerror=null;">`;
        } else {
             // Fallback text icon based on muscle
             const iconMap = { 'Pecho': '💪', 'Piernas': '🦵', 'Espalda': '🦅', 'Brazos': '🦾', 'Hombros': '🏋️', 'Core': '🧘' };
             mediaHtml = `<div class="exercise-media placeholder">${iconMap[muscleGroup] || '🏋️'}</div>`;
        }

        this.innerHTML = `
            <wii-card class="wii-card-hoverable">
                <div class="exercise-card-inner">
                    ${image && image !== 'default' ? `<div class="exercise-media">${mediaHtml}</div>` : mediaHtml}
                    
                    <div class="exercise-info">
                        <h4>${name}</h4>
                        <div class="exercise-tags">
                            <span class="exercise-tag">${muscleGroup || 'General'}</span>
                            <span class="exercise-tag type-tag">${type || 'Máquina'}</span>
                        </div>
                    </div>
                    
                    <div class="exercise-actions">
                        <button class="wii-btn exercise-btn edit-btn">✏️ Editar</button>
                        <button class="wii-btn wii-btn-danger exercise-btn delete-btn">🗑️ Borrar</button>
                    </div>
                </div>
            </wii-card>
        `;

        // Event listeners for actions
        this.querySelector('.edit-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('edit-exercise', { detail: this._data, bubbles: true }));
        });

        this.querySelector('.delete-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-exercise', { detail: this._data, bubbles: true }));
        });
    }
}

customElements.define('exercise-card', ExerciseCard);
