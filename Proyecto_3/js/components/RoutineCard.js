/**
 * RoutineCard.js
 * Visual representation of a Routine in the catalog.
 */

class RoutineCard extends HTMLElement {
    constructor() {
        super();
        this._data = null;

        if (!document.getElementById("routine-card-styles")) {
            const style = document.createElement("style");
            style.id = "routine-card-styles";
            style.textContent = `
                routine-card {
                    display: block;
                }
                
                .routine-card-inner {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                    height: 100%;
                }
                
                .routine-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .routine-header h3 {
                    margin: 0;
                    color: var(--wii-teal);
                    font-size: 1.25rem;
                }
                
                .routine-desc {
                    color: var(--wii-text-muted);
                    font-size: 0.9rem;
                    margin: 0;
                    flex-grow: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                }

                .routine-meta {
                    display: flex;
                    gap: var(--spacing-md);
                    font-size: 0.85rem;
                    color: var(--wii-text-dark);
                    background: var(--wii-bg);
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--radius-sm);
                    font-weight: bold;
                    margin-top: auto;
                }

                .routine-actions {
                    display: flex;
                    gap: var(--spacing-xs);
                    margin-top: var(--spacing-sm);
                }
                
                .routine-actions button {
                    flex: 1;
                    padding: 8px;
                    font-size: 0.85rem;
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

        const { id, name, description, exercises = [], createdAt } = this._data;
        const totalExercises = exercises.length;
        
        let metaText = `${totalExercises} Ejercicio${totalExercises !== 1 ? 's' : ''}`;

        this.innerHTML = `
            <wii-card class="wii-card-hoverable">
                <div class="routine-card-inner">
                    <div class="routine-header">
                        <h3>${name}</h3>
                    </div>
                    <p class="routine-desc">${description || 'Sin descripción'}</p>
                    
                    <div class="routine-meta">
                        <span>📋 ${metaText}</span>
                    </div>

                    <div class="routine-actions">
                        <button class="wii-btn wii-btn-primary exercise-btn start-btn">▶️ Iniciar</button>
                        <button class="wii-btn exercise-btn edit-btn">✏️ Editar</button>
                        <button class="wii-btn wii-btn-danger exercise-btn delete-btn">🗑️</button>
                    </div>
                </div>
            </wii-card>
        `;

        // Action events
        this.querySelector('.edit-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('edit-routine', { detail: this._data, bubbles: true }));
        });

        this.querySelector('.delete-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-routine', { detail: this._data, bubbles: true }));
        });
        
        this.querySelector('.start-btn').addEventListener('click', () => {
            // Emits highly distinct event for routing
            this.dispatchEvent(new CustomEvent('start-session', { detail: this._data, bubbles: true }));
        });
    }
}

customElements.define('routine-card', RoutineCard);
