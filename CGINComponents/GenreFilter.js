class GenreFilter extends HTMLElement {
    constructor() {
        super();

        if (!document.getElementById("genre-filter-styles")) {
            const style = document.createElement("style");
            style.id = "genre-filter-styles";
            style.textContent = `
                genre-filter { display: inline-block; font-family: sans-serif; }
                .genre-select {
                    padding: 12px;
                    font-size: 1rem;
                    background-color: var(--filter-bg, #222);
                    color: var(--filter-text, white);
                    border: 2px solid var(--filter-border, #444);
                    border-radius: 8px;
                    cursor: pointer;
                    outline: none;
                }
                .genre-select:focus { border-color: var(--filter-focus, #6c5ce7); }
            `;
            document.head.appendChild(style);
        }

        this.$select = document.createElement('select');
        this.$select.className = 'genre-select';

        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Todos los géneros";
        this.$select.appendChild(defaultOption);

        // Emitir evento al cambiar
        this.$select.addEventListener('change', () => {
            this.dispatchEvent(new CustomEvent('filter-change', {
                detail: this.$select.value,
                bubbles: true
            }));
        });

        // DATOS DE BORRADOR (Se sobrescribirán con el setter luego)
        this.genres = [
            { mal_id: 1, name: "Action" },
            { mal_id: 4, name: "Comedy" },
            { mal_id: 8, name: "Drama" }
        ];
    }

    connectedCallback() {
        if (!this.contains(this.$select)) {
            this.appendChild(this.$select);
        }
    }

    // Setter para cuando tengamos los datos reales de la API
    set genres(genreList) {
        // Limpiamos (dejando solo el default)
        this.$select.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Todos los géneros";
        this.$select.appendChild(defaultOption);

        // Llenamos seguro
        genreList.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.mal_id;
            option.textContent = genre.name;
            this.$select.appendChild(option);
        });
    }
}
customElements.define('genre-filter', GenreFilter);