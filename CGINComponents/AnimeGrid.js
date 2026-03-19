class AnimeGrid extends HTMLElement {
    constructor() {
        super();

        if (!document.getElementById("anime-grid-styles")) {
            const style = document.createElement("style");
            style.id = "anime-grid-styles";
            style.textContent = `
                anime-grid {
                    display: block;
                    width: 100%;
                }
                .grid-container {
                    display: grid;
                    /* Responsive: Mínimo 200px por columna, autoajustable */
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: var(--grid-gap, 25px);
                    padding: var(--grid-padding, 20px 0);
                }
                .empty-message {
                    text-align: center;
                    padding: 50px;
                    color: #888;
                    font-size: 1.2rem;
                    font-family: sans-serif;
                    grid-column: 1 / -1; /* Ocupa todo el ancho */
                }
            `;
            document.head.appendChild(style);
        }

        this.$container = document.createElement('div');
        this.$container.className = 'grid-container';
        // Wait to append until element is connected to the DOM
    }

    connectedCallback() {
        if (!this.contains(this.$container)) {
            this.appendChild(this.$container);
        }
    }

    // Setter que recibe el array de animes
    set animes(animeList) {
        // Limpiar contenedor seguro
        this.$container.textContent = '';

        if (!animeList || animeList.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'empty-message';
            msg.textContent = 'No se encontraron animes para mostrar.';
            this.$container.appendChild(msg);
            return;
        }

        // Crear una tarjeta por cada anime del array
        animeList.forEach(animeData => {
            const card = document.createElement('anime-card');
            card.data = animeData;
            this.$container.appendChild(card);
        });
    }
}
customElements.define('anime-grid', AnimeGrid);