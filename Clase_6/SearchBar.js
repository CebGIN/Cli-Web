class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.debounceTimer = null;
        this.$container = null;
        this.$input = null;
        this.$btn = null;
        this.$resignBtn = null;
    }

    connectedCallback() {
        if (this.$container) return;

        if (!document.getElementById("search-bar-styles")) {
            const style = document.createElement("style");
            style.id = "search-bar-styles";
            style.textContent = `
                search-bar { display: block; width: 100%; font-family: 'Segoe UI', sans-serif; }
                .search-container {
                    display: flex;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    gap: 10px; /* Separación para el botón de rendirse */
                }
                .search-input-group {
                    display: flex;
                    flex-grow: 1;
                }
                .search-input {
                    flex-grow: 1;
                    padding: 12px 20px;
                    font-size: 1rem;
                    border: 2px solid #ffffff44;
                    border-right: none;
                    border-radius: 8px 0 0 8px;
                    background-color: rgba(255, 255, 255, 0.85); /* Fondo más claro */
                    color: #2c3e50; /* Texto oscuro */
                    outline: none;
                    transition: border-color 0.3s, background-color 0.3s;
                }
                .search-input::placeholder {
                    color: #7f8fa6;
                }
                .search-input:focus { 
                    border-color: #6c5ce7; 
                    background-color: #ffffff;
                }
                .search-btn {
                    padding: 0 25px;
                    background-color: #6c5ce7;
                    color: white;
                    border: none;
                    border-radius: 0 8px 8px 0;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                .search-btn:hover { background-color: #5b4bc4; }
                
                .resign-btn {
                    padding: 0 20px;
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                .resign-btn:hover { background-color: #c0392b; }
            `;
            document.head.appendChild(style);
        }

        this.$container = document.createElement('div');
        this.$container.className = 'search-container';

        const inputGroup = document.createElement('div');
        inputGroup.className = 'search-input-group';

        this.$input = document.createElement('input');
        this.$input.type = 'text';
        this.$input.className = 'search-input';
        this.$input.placeholder = '¿Quién es ese Pokémon?...';

        this.$btn = document.createElement('button');
        this.$btn.className = 'search-btn';
        this.$btn.textContent = '¡Lo tengo!';

        this.$resignBtn = document.createElement('button');
        this.$resignBtn.className = 'resign-btn';
        this.$resignBtn.textContent = 'Me rindo';

        inputGroup.appendChild(this.$input);
        inputGroup.appendChild(this.$btn);
        
        this.$container.appendChild(inputGroup);
        this.$container.appendChild(this.$resignBtn);
        this.appendChild(this.$container);

        // Interacción
        const emitSearch = () => {
            const term = this.$input.value.trim();
            this.dispatchEvent(new CustomEvent('search', { detail: term, bubbles: true }));
        };

        this.$btn.addEventListener('click', emitSearch);

        this.$resignBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('resign', { bubbles: true }));
        });

        this.$input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(this.debounceTimer);
                emitSearch();
            }
        });

        this.$input.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                emitSearch();
            }, 500); 
        });
    }

    set value(val) {
        if (this.$input) {
            this.$input.value = val;
        }
    }

    get value() {
        return this.$input ? this.$input.value : "";
    }
}
customElements.define('search-bar', SearchBar);