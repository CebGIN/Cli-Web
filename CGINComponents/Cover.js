class Cover extends HTMLElement {
    constructor() {
        super();

        // CAPTURAMOS LOS ATRIBUTOS (con valores por defecto por si se olvidan)
        this.title = this.getAttribute("title") || "Título no disponible";
        this.description = this.getAttribute("description") || "Sin descripción";
        this.score = this.getAttribute("score") || "0.0";
        this.releaseDate = this.getAttribute("date") || "N/A";
        this.imageSrc = this.getAttribute("src") || "https://via.placeholder.com/200x300";

        this.render();
    }

    render() {
        // --- ESTILOS ---
        this.$style = document.createElement("style");
        this.$style.textContent = `
            cover-card {
                display: inline-block;
                width: 220px;
                background: #1a1a1a;
                color: white;
                border-radius: 12px;
                overflow: hidden;
                font-family: sans-serif;
                position: relative;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            }
            .cover img { width: 100%; height: 300px; object-fit: cover; }
            .title { font-size: 1.1rem; padding: 10px; margin: 0; text-align: center; }
            .hover-info {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(138, 43, 226, 0.9); /* Un tono púrpura */
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; opacity: 0; transition: 0.3s; padding: 15px;
                text-align: center; box-sizing: border-box;
            }
            cover-card:hover .hover-info { opacity: 1; }
            .info-top { display: flex; gap: 20px; font-weight: bold; margin-bottom: 10px; }
        `;

        // --- ESTRUCTURA (Igual a como te gusta a ti) ---
        this.$cover = document.createElement("div");
        this.$cover.classList.add("cover");

        this.$img = document.createElement("img");
        this.$img.src = this.imageSrc;

        this.$title = document.createElement("h1");
        this.$title.classList.add("title");
        this.$title.textContent = this.title;

        this.$hoverInfo = document.createElement("div");
        this.$hoverInfo.classList.add("hover-info");

        this.$infoTop = document.createElement("div");
        this.$infoTop.classList.add("info-top");

        this.$date = document.createElement("span");
        this.$date.innerText = this.releaseDate;

        this.$score = document.createElement("span");
        this.$score.innerText = `⭐ ${this.score}`;

        this.$description = document.createElement("p");
        this.$description.textContent = this.description;

        // ENSAMBLAJE
        this.appendChild(this.$style);
        this.appendChild(this.$cover);
        this.$cover.appendChild(this.$img);
        this.$cover.appendChild(this.$title);

        this.appendChild(this.$hoverInfo);
        this.$hoverInfo.appendChild(this.$infoTop);
        this.$infoTop.appendChild(this.$date);
        this.$infoTop.appendChild(this.$score);
        this.$hoverInfo.appendChild(this.$description);
    }
}

customElements.define("cover-card", Cover);