class AnimeCard extends HTMLElement {
    constructor() {
        super();
        this.anime = null;

        // 1. PATRÓN SINGLETON: Inyectar CSS solo una vez en todo el documento
        if (!document.getElementById("anime-card-styles")) {
            const style = document.createElement("style");
            style.id = "anime-card-styles";
            style.textContent = `
                anime-card {
                    display: block; width: 100%; position: relative; cursor: pointer;
                    overflow: hidden; transition: transform 0.3s ease;
                    
                    /* VARIABLES CSS (Con valores por defecto si no se definen) */
                    border-radius: var(--card-radius, 12px);
                    aspect-ratio: var(--card-aspect-ratio, 2 / 3);
                    background: var(--card-bg, #1a1a1a);
                    border: var(--card-border, none);
                    box-shadow: var(--card-shadow, 0 4px 6px rgba(0,0,0,0.3));
                }
                anime-card:hover { transform: scale(1.03); }

                .main-img { width: 100%; height: 100%; object-fit: cover; display: block; }

                .title-overlay {
                    position: absolute; bottom: 0; left: 0; width: 100%;
                    background: var(--overlay-bg, linear-gradient(transparent, rgba(0,0,0,0.9)));
                    padding: 15px; box-sizing: border-box; z-index: 2;
                }
                .title-overlay h3 { 
                    margin: 0; 
                    color: var(--title-color, white); 
                    font-size: var(--title-size, 1rem); 
                }
                .main-score { color: var(--score-color, #ffcc00); font-weight: bold; font-size: 0.9rem; }

                .hover-info {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    /* Variable clave para cambiar el color del hover */
                    background: var(--hover-bg, rgba(108, 92, 231, 0.95));
                    display: flex; flex-direction: column; justify-content: center;
                    align-items: center; padding: 20px; box-sizing: border-box;
                    opacity: 0; transition: opacity 0.3s ease; z-index: 3; text-align: center;
                }
                anime-card:hover .hover-info { opacity: 1; }

                .info-top { 
                    display: flex; justify-content: space-between; 
                    width: 100%; margin-bottom: 10px; font-weight: bold; 
                    border-bottom: 1px solid var(--text-color, white);
                    color: var(--text-color, white);
                }
                .description { font-size: 0.85rem; line-height: 1.4; color: var(--text-color, white); }
            `;
            document.head.appendChild(style);
        }

        // --- 2. ESTRUCTURA HTML
        this.$container = document.createElement("div");
        this.$img = document.createElement("img");
        this.$titleOverlay = document.createElement("div");
        this.$title = document.createElement("h3");
        this.$mainScore = document.createElement("span");
        this.$hoverInfo = document.createElement("div");
        this.$infoTop = document.createElement("div");
        this.$date = document.createElement("span");
        this.$episodes = document.createElement("span");
        this.$description = document.createElement("p");

        // Clases
        this.$img.className = "main-img";
        this.$titleOverlay.className = "title-overlay";
        this.$mainScore.className = "main-score";
        this.$hoverInfo.className = "hover-info";
        this.$infoTop.className = "info-top";
        this.$description.className = "description";

        // Evento Clic
        this.addEventListener('click', () => {
            if (this.anime) {
                this.dispatchEvent(new CustomEvent('card-click', { detail: this.anime.mal_id, bubbles: true }));
            }
        });

        // Ensamblaje interno (sin añadir elementos a 'this' en el constructor)
        this.$titleOverlay.appendChild(this.$title);
        this.$titleOverlay.appendChild(this.$mainScore);
        
        this.$infoTop.appendChild(this.$date);
        this.$infoTop.appendChild(this.$episodes);
        
        this.$hoverInfo.appendChild(this.$infoTop);
        this.$hoverInfo.appendChild(this.$description);
    }

    connectedCallback() {
        if (!this.contains(this.$img)) {
            this.appendChild(this.$img);
            this.appendChild(this.$titleOverlay);
            this.appendChild(this.$hoverInfo);
        }
    }

    set data(anime) {
        this.anime = anime;
        this.$img.src = anime.images.jpg.large_image_url || anime.images.jpg.image_url;
        this.$img.alt = anime.title;
        this.$title.textContent = anime.title_english || anime.title;
        this.$mainScore.textContent = anime.score ? `⭐ ${anime.score}` : "⭐ N/A";
        this.$date.textContent = `Año: ${anime.year || anime.aired?.from?.split('-')[0] || 'N/A'}`;
        this.$episodes.textContent = anime.episodes ? `${anime.episodes} Eps` : "? Eps";

        const synopsis = anime.synopsis || "Sin sinopsis disponible.";
        this.$description.textContent = synopsis.length > 150 ? synopsis.substring(0, 150) + "..." : synopsis;
    }
}

customElements.define("anime-card", AnimeCard);