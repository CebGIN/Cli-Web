class AnimeDetail extends HTMLElement {
    constructor() {
        super();
        this.anime = null;

        // Inicializamos los elementos pero NO los añadimos al DOM aquí
        this.$container = document.createElement('div');
        this.$container.className = 'detail-container';
    }

    // Regla de Oro: Manipulación del DOM aquí
    connectedCallback() {
        if (!document.getElementById("anime-detail-styles")) {
            const style = document.createElement("style");
            style.id = "anime-detail-styles";
            style.textContent = `
                anime-detail { display: block; color: white; font-family: sans-serif; }
                .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .btn-back { 
                    padding: 10px 20px; background: var(--primary, #6c5ce7); 
                    border: none; color: white; border-radius: 5px; cursor: pointer; 
                }
                .detail-content { display: grid; grid-template-columns: 300px 1fr; gap: 40px; }
                
                /* Badge de Estado Requerido */
                .status-badge {
                    display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;
                }
                .status-airing { background: #2ecc71; } /* Verde */
                .status-finished { background: #95a5a6; } /* Gris */
                
                .genres-list { display: flex; gap: 10px; flex-wrap: wrap; margin: 15px 0; }
                .genre-tag { background: #333; padding: 5px 15px; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--primary); }
                
                @media (max-width: 768px) {
                    .detail-content { grid-template-columns: 1fr; }
                }
            `;
            document.head.appendChild(style);
        }
        this.appendChild(this.$container);
        this.render();
    }

    set data(anime) {
        this.anime = anime;
        this.render();
    }

    render() {
        if (!this.anime) return;
        this.$container.innerHTML = ''; // Limpiamos con seguridad

        // 1. Header con Botón Volver
        const header = document.createElement('div');
        header.className = 'detail-header';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn-back';
        backBtn.textContent = '← Volver';
        backBtn.onclick = () => this.dispatchEvent(new CustomEvent('back-click', { bubbles: true }));

        const title = document.createElement('h1');
        title.textContent = this.anime.title_english || this.anime.title;

        header.appendChild(backBtn);
        header.appendChild(title);

        // 2. Contenido Principal
        const content = document.createElement('div');
        content.className = 'detail-content';

        // Lado Izquierdo (Imagen y Status)
        const aside = document.createElement('div');
        const img = document.createElement('img');
        img.src = this.anime.images.jpg.large_image_url;
        img.style.width = '100%';
        img.style.borderRadius = '10px';

        const status = document.createElement('div');
        status.className = `status-badge ${this.anime.status === 'Currently Airing' ? 'status-airing' : 'status-finished'}`;
        status.textContent = this.anime.status || 'Unknown';

        aside.appendChild(img);
        aside.appendChild(status);

        // Lado Derecho (Info)
        const info = document.createElement('div');

        const synopsisTitle = document.createElement('h2');
        synopsisTitle.textContent = 'Sinopsis';
        const synopsisText = document.createElement('p');
        synopsisText.textContent = this.anime.synopsis || 'No hay sinopsis disponible.';

        // Lista de Géneros
        const genresCont = document.createElement('div');
        genresCont.className = 'genres-list';
        this.anime.genres?.forEach(g => {
            const tag = document.createElement('span');
            tag.className = 'genre-tag';
            tag.textContent = g.name;
            genresCont.appendChild(tag);
        });

        info.appendChild(synopsisTitle);
        info.appendChild(synopsisText);
        info.appendChild(genresCont);

        content.appendChild(aside);
        content.appendChild(info);

        this.$container.appendChild(header);
        this.$container.appendChild(content);
    }
}
customElements.define('anime-detail', AnimeDetail);