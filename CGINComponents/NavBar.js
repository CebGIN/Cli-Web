class NavBar extends HTMLElement {
    constructor() {
        super();

        // Estilos Singleton
        if (!document.getElementById("navbar-styles")) {
            const style = document.createElement("style");
            style.id = "navbar-styles";
            style.textContent = `
                nav-bar {
                    display: block;
                    width: 100%;
                    background-color: var(--nav-bg, #1a1a1a);
                    border-bottom: 2px solid var(--nav-border, #6c5ce7);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    font-family: 'Segoe UI', sans-serif;
                }
                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 15px 20px;
                }
                .nav-logo {
                    color: var(--nav-text, white);
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 0;
                }
                .nav-logo span { color: var(--nav-accent, #6c5ce7); }
                .nav-links { display: flex; gap: 20px; }
                .nav-link {
                    color: var(--nav-text, white);
                    text-decoration: none;
                    cursor: pointer;
                    padding: 8px 16px;
                    border-radius: 4px;
                    transition: background 0.3s;
                    font-weight: 500;
                }
                .nav-link:hover { background-color: rgba(255,255,255,0.1); }
                .nav-link.active {
                    background-color: var(--nav-accent, #6c5ce7);
                    color: white;
                }
            `;
            document.head.appendChild(style);
        }

        // Estructura
        this.$container = document.createElement('div');
        this.$container.className = 'nav-container';

        this.$logo = document.createElement('h1');
        this.$logo.className = 'nav-logo';
        // Construimos el logo "Neo Alejandria"
        const logoText1 = document.createTextNode(' Neo ');
        const logoSpan = document.createElement('span');
        logoSpan.textContent = 'Alejandría';
        this.$logo.appendChild(logoText1);
        this.$logo.appendChild(logoSpan);

        this.$linksContainer = document.createElement('div');
        this.$linksContainer.className = 'nav-links';

        this.$homeLink = document.createElement('a');
        this.$homeLink.className = 'nav-link active'; // Activo por defecto en el borrador
        this.$homeLink.textContent = 'Inicio';
        this.$homeLink.dataset.target = '#home';

        this.$searchLink = document.createElement('a');
        this.$searchLink.className = 'nav-link';
        this.$searchLink.textContent = 'Búsqueda';
        this.$searchLink.dataset.target = '#search';

        // Ensamblaje
        this.$linksContainer.appendChild(this.$homeLink);
        this.$linksContainer.appendChild(this.$searchLink);

        this.$container.appendChild(this.$logo);
        this.$container.appendChild(this.$linksContainer);

        // Interacción (Emitir eventos)
        const emitNav = (route) => {
            this.dispatchEvent(new CustomEvent('navigate', { detail: route, bubbles: true }));
            this.setActiveRoute(route);
        };

        this.$logo.addEventListener('click', () => emitNav('#home'));
        this.$homeLink.addEventListener('click', () => emitNav('#home'));
        this.$searchLink.addEventListener('click', () => emitNav('#search'));
    }

    connectedCallback() {
        if (!this.contains(this.$container)) {
            this.appendChild(this.$container);
        }
    }

    // Método para actualizar visualmente el link activo desde fuera
    setActiveRoute(route) {
        this.$homeLink.classList.toggle('active', route === '#home');
        this.$searchLink.classList.toggle('active', route === '#search');
    }
}
customElements.define('nav-bar', NavBar);