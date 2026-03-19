class PokeCard extends HTMLElement {
    constructor() {
        super();
        this.pokemon = null;
        this.$img = null;
        this.$titleOverlay = null;
        this.$title = null;
        this.$hoverInfo = null;
        this.$types = null;
    }

    connectedCallback() {
        if (this.$img) return; // Evita reinicialización

        if (!document.getElementById("poke-card-styles")) {
            const style = document.createElement("style");
            style.id = "poke-card-styles";
            style.textContent = `
                poke-card {
                    display: block; width: 100%; height: 100%; position: relative;
                    overflow: hidden; border-radius: 12px; background: transparent;
                }
                .main-img { 
                    width: 100%; height: 100%; object-fit: contain; display: block; 
                    transition: filter 0.5s ease;
                }
                .silhouette {
                    filter: brightness(0);
                    pointer-events: none;
                    transition: none !important; /* Aparece negro instantáneamente */
                }
                
                .title-overlay {
                    position: absolute; bottom: 0; left: 0; width: 100%;
                    background: rgba(0,0,0,0.8); padding: 15px; box-sizing: border-box; z-index: 2;
                    text-align: center;
                }
                .title-overlay h3 { margin: 0; color: white; text-transform: uppercase; }
                
                .hover-info {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(231, 76, 60, 0.95);
                    display: flex; flex-direction: column; justify-content: center;
                    align-items: center; opacity: 0; transition: opacity 0.3s ease; z-index: 3;
                    color: white; padding: 15px; box-sizing: border-box; text-align: center;
                }
                poke-card:hover .hover-info:not(.hidden) { opacity: 1; }
            `;
            document.head.appendChild(style);
        }

        this.$img = document.createElement("img");
        this.$img.className = "main-img silhouette";

        this.$titleOverlay = document.createElement("div");
        this.$titleOverlay.className = "title-overlay hidden";
        this.$title = document.createElement("h3");
        this.$titleOverlay.appendChild(this.$title);

        this.$hoverInfo = document.createElement("div");
        this.$hoverInfo.className = "hover-info hidden";
        this.$types = document.createElement("p");
        this.$hoverInfo.appendChild(this.$types);

        this.appendChild(this.$img);
        this.appendChild(this.$titleOverlay);
        this.appendChild(this.$hoverInfo);

        // Si ya había datos, cargarlos
        if (this.pokemon) {
            this.render();
        }
    }

    set data(pokemon) {
        this.pokemon = pokemon;
        if (this.$img) {
            this.render();
        }
    }

    render() {
        // Ocultar la imagen inmediatamente para evitar "flashes" de la imagen anterior o en color
        this.$img.style.visibility = 'hidden';
        
        // Reiniciar estado visual a silueta
        this.setSilhouette(true);

        this.$img.src = this.pokemon.sprites.other['official-artwork'].front_default;
        this.$title.textContent = this.pokemon.name;

        // Cuando la nueva imagen cargue, la mostramos (ya con el filtro aplicado)
        this.$img.onload = () => {
            this.$img.style.visibility = 'visible';
        };

        const tipos = this.pokemon.types.map(t => t.type.name).join(', ');
        this.$types.innerHTML = `<strong>Tipos:</strong><br>${tipos.toUpperCase()}`;
    }

    setSilhouette(isSilhouette) {
        if (!this.$img) return;

        if (isSilhouette) {
            this.$img.classList.add('silhouette');
            this.$titleOverlay.classList.add('hidden');
            this.$hoverInfo.classList.add('hidden');
        } else {
            this.$img.classList.remove('silhouette');
            this.$titleOverlay.classList.remove('hidden');
            this.$hoverInfo.classList.remove('hidden');
        }
    }
}
customElements.define("poke-card", PokeCard);