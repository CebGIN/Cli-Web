/**
 * LevelUpDialog.js
 * A gamified modal that pops up when the user reaches a new level.
 */

class LevelUpDialog extends HTMLElement {
    constructor() {
        super();
        if (!document.getElementById("level-up-dialog-styles")) {
            const style = document.createElement("style");
            style.id = "level-up-dialog-styles";
            style.textContent = `
                level-up-dialog dialog {
                    padding: 0;
                    border: none;
                    border-radius: var(--radius-card);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    background: transparent;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    overflow: hidden;
                    margin: auto;
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                level-up-dialog dialog::backdrop {
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }

                .level-up-content {
                    background: var(--wii-white);
                    padding: var(--spacing-xl);
                    position: relative;
                }

                .level-up-header {
                    background: var(--wii-teal);
                    color: white;
                    padding: var(--spacing-lg);
                    font-size: 1.5rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .level-badge-large {
                    background: #FFB74D;
                    color: white;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 900;
                    margin: -50px auto var(--spacing-lg) auto;
                    border: 6px solid var(--wii-white);
                    box-shadow: var(--shadow-hover);
                }

                .level-up-body p {
                    color: var(--wii-text-dark);
                    font-size: 1.1rem;
                    margin-bottom: var(--spacing-lg);
                }

                .level-up-actions {
                    display: flex;
                    justify-content: center;
                }

                .btn-awesome {
                    background: var(--wii-teal);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: var(--radius-pill);
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .btn-awesome:hover {
                    background: #26A69A;
                    transform: scale(1.05);
                }

                @keyframes popIn {
                    0% { opacity: 0; transform: scale(0.5) translateY(50px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <dialog id="lvl-dialog">
                <div class="level-up-header">
                    ¡Subiste de Nivel!
                </div>
                <div class="level-up-content">
                    <div class="level-badge-large" id="lvl-display">?</div>
                    <div class="level-up-body">
                        <p>¡Buen trabajo! Tu constancia en el entrenamiento está rindiendo frutos. Sigue así y ganarás más fuerza.</p>
                    </div>
                    <div class="level-up-actions">
                        <button class="btn-awesome" id="btn-lvl-close">¡Genial!</button>
                    </div>
                </div>
            </dialog>
        `;

        this.querySelector('#btn-lvl-close').addEventListener('click', () => {
            this.querySelector('dialog').close();
        });
    }

    /**
     * Shows the level up modal with the specified new level.
     * @param {Number} newLevel 
     */
    show(newLevel) {
        this.querySelector('#lvl-display').textContent = newLevel;
        this.querySelector('dialog').showModal();
    }
}

customElements.define('level-up-dialog', LevelUpDialog);
