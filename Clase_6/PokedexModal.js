class PokedexModal extends HTMLElement {
    constructor() {
        super();
        this.$container = null;
        this.$overlay = null;
        this.$title = null;
        this.$image = null;
        this.$description = null;
        this.$button = null;
    }

    connectedCallback() {
        if (this.$container) return; // Evita reinicialización

        if (!document.getElementById("pokedex-modal-styles")) {
            const style = document.createElement("style");
            style.id = "pokedex-modal-styles";
            style.textContent = `
                pokedex-modal {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    display: none; /* Oculto por defecto */
                    justify-content: center; align-items: center;
                    z-index: 1000;
                }
                pokedex-modal.active {
                    display: flex;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    z-index: 1;
                }
                .modal-content {
                    position: relative;
                    z-index: 2;
                    background: linear-gradient(135deg, #f1f2f6, #ffffff);
                    border-radius: 20px;
                    padding: 30px;
                    width: 90%;
                    max-width: 500px; /* Ancho ampliado para más detalles */
                    text-align: center;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    border: 4px solid #ff4757;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .modal-content h2 { margin-bottom: 5px; font-size: 1.8rem; color: #2f3542; text-transform: uppercase; }
                .modal-content h3 { margin-bottom: 15px; color: #57606f; }
                
                .modal-layout {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 20px;
                    text-align: left;
                }
                
                .modal-left { flex: 1; min-width: 150px; text-align: center; }
                .modal-right { flex: 2; min-width: 200px; display: flex; flex-direction: column; gap: 10px; }

                .modal-image-container {
                    background: rgba(0,0,0,0.05);
                    border-radius: 15px;
                    padding: 10px;
                    display: inline-block;
                }
                .modal-img { width: 140px; height: 140px; object-fit: contain; }
                
                .info-badge-container { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; justify-content: center; }
                .info-badge { background: #34495e; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; text-transform: capitalize; }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    background: rgba(0,0,0,0.03);
                    padding: 10px;
                    border-radius: 10px;
                }
                .stat-item { font-size: 0.85rem; color: #2f3542;}
                .stat-item strong { display: block; color: #57606f; font-size: 0.75rem; text-transform: uppercase;}

                .evo-chain {
                    font-size: 0.85rem;
                    background: rgba(0,0,0,0.03);
                    padding: 10px;
                    border-radius: 10px;
                    text-transform: capitalize;
                }
                
                .modal-desc {
                    background: #2f3542; color: white; padding: 15px; border-radius: 10px;
                    font-size: 0.95rem; line-height: 1.4; margin-bottom: 25px; text-align: left;
                    font-family: 'Courier New', Courier, monospace;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
                }
                .modal-btn {
                    background: #ff4757;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.3s, transform 0.1s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .modal-btn:hover { background: #ff6b81; }
                .modal-btn:active { transform: translateY(2px); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
                
                /* Temas de resultado */
                .result-correct { color: #2ecc71 !important; }
                .result-incorrect { color: #e74c3c !important; }
            `;
            document.head.appendChild(style);
        }

        // Overlay
        this.$overlay = document.createElement('div');
        this.$overlay.className = 'modal-overlay';
        
        // Content container
        this.$container = document.createElement('div');
        this.$container.className = 'modal-content';

        this.$title = document.createElement('h2');
        this.$subtitle = document.createElement('h3');
        
        // Layout para info ampliada
        const modalLayout = document.createElement('div');
        modalLayout.className = 'modal-layout';

        // Lado Izquierdo (Imagen y Tipos)
        const leftCol = document.createElement('div');
        leftCol.className = 'modal-left';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'modal-image-container';
        this.$image = document.createElement('img');
        this.$image.className = 'modal-img';
        imgContainer.appendChild(this.$image);
        
        this.$typesContainer = document.createElement('div');
        this.$typesContainer.className = 'info-badge-container';

        leftCol.appendChild(imgContainer);
        leftCol.appendChild(this.$typesContainer);

        // Lado Derecho (Stats y Evoluciones)
        const rightCol = document.createElement('div');
        rightCol.className = 'modal-right';

        this.$statsGrid = document.createElement('div');
        this.$statsGrid.className = 'stats-grid';
        
        this.$evoChain = document.createElement('div');
        this.$evoChain.className = 'evo-chain';

        rightCol.appendChild(this.$statsGrid);
        rightCol.appendChild(this.$evoChain);

        modalLayout.appendChild(leftCol);
        modalLayout.appendChild(rightCol);

        this.$description = document.createElement('div');
        this.$description.className = 'modal-desc';

        this.$button = document.createElement('button');
        this.$button.className = 'modal-btn';
        this.$button.textContent = 'Continuar jugando';

        // Estructura
        this.$container.appendChild(this.$title);
        this.$container.appendChild(this.$subtitle);
        this.$container.appendChild(modalLayout);
        this.$container.appendChild(this.$description);
        this.$container.appendChild(this.$button);

        this.appendChild(this.$overlay);
        this.appendChild(this.$container);

        // Eventos
        this.$button.addEventListener('click', () => {
            this.hide();
            this.dispatchEvent(new CustomEvent('continue', { bubbles: true }));
        });
    }

    /**
     * Muestra el modal con la información del Pokémon
     * @param {Object} data Datos ampliados
     */
    show({ isCorrect, pokemonName, imageSrc, dexEntry, types, height, weight, abilities, evolutions }) {
        if (!this.$container) return;

        if (isCorrect) {
            this.$title.textContent = '¡Correcto!';
            this.$title.className = 'result-correct';
        } else {
            this.$title.textContent = '¡Fallaste!';
            this.$title.className = 'result-incorrect';
        }

        this.$subtitle.textContent = `Era ${pokemonName.toUpperCase()}`;
        this.$image.src = imageSrc;
        
        // Pokedex Data
        this.$typesContainer.innerHTML = types.map(t => `<span class="info-badge">${t}</span>`).join('');
        
        this.$statsGrid.innerHTML = `
            <div class="stat-item"><strong>Altura</strong> ${height / 10} m</div>
            <div class="stat-item"><strong>Peso</strong> ${weight / 10} kg</div>
            <div class="stat-item" style="grid-column: span 2;"><strong>Habilidades</strong> ${abilities.join(', ')}</div>
        `;

        this.$evoChain.innerHTML = `<strong>Línea Evolutiva:</strong><br>${evolutions.join(' ➔ ')}`;

        const cleanText = dexEntry.replace(//g, ' ').replace(/\n/g, ' ');
        this.$description.textContent = cleanText || "Entrada de la Pokédex no encontrada.";

        this.classList.add('active');
    }

    hide() {
        this.classList.remove('active');
    }
}

customElements.define('pokedex-modal', PokedexModal);
