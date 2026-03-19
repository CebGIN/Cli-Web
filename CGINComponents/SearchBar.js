class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.debounceTimer = null;

        if (!document.getElementById("search-bar-styles")) {
            const style = document.createElement("style");
            style.id = "search-bar-styles";
            style.textContent = `
                search-bar { display: block; width: 100%; font-family: sans-serif; }
                .search-container {
                    display: flex;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .search-input {
                    flex-grow: 1;
                    padding: 12px 20px;
                    font-size: 1rem;
                    border: 2px solid var(--search-border, #444);
                    border-right: none;
                    border-radius: 8px 0 0 8px;
                    background-color: var(--search-bg, #222);
                    color: var(--search-text, white);
                    outline: none;
                    transition: border-color 0.3s;
                }
                .search-input:focus { border-color: var(--search-focus, #6c5ce7); }
                .search-btn {
                    padding: 0 25px;
                    background-color: var(--search-btn-bg, #6c5ce7);
                    color: white;
                    border: none;
                    border-radius: 0 8px 8px 0;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                .search-btn:hover { background-color: var(--search-btn-hover, #5b4bc4); }
            `;
            document.head.appendChild(style);
        }

        this.$container = document.createElement('div');
        this.$container.className = 'search-container';

        this.$input = document.createElement('input');
        this.$input.type = 'text';
        this.$input.className = 'search-input';
        this.$input.placeholder = 'Busca un anime...'; //

        this.$btn = document.createElement('button');
        this.$btn.className = 'search-btn';
        this.$btn.textContent = 'Buscar';

        this.$container.appendChild(this.$input);
        this.$container.appendChild(this.$btn);
        this.appendChild(this.$container);

        // Interacción: Emisión de evento con Debounce
        const emitSearch = () => {
            const term = this.$input.value.trim();
            this.dispatchEvent(new CustomEvent('search', { detail: term, bubbles: true }));
        };

        // Evento click botón
        this.$btn.addEventListener('click', emitSearch);

        // Evento Enter
        this.$input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(this.debounceTimer);
                emitSearch();
            }
        });

        // Evento Input (Debounce 500ms)
        this.$input.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                emitSearch();
            }, 500); 
        });
    }

    // Permitir inyectar valor inicial (ej. al volver a la vista)
    set value(val) {
        this.$input.value = val;
    }
}
customElements.define('search-bar', SearchBar);