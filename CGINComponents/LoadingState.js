class LoadingState extends HTMLElement {
    constructor() {
        super();

        // 1. Crear elementos
        this.$container = document.createElement('div');
        this.$spinner = document.createElement('div');
        this.$text = document.createElement('p');
        this.$style = document.createElement('style');

        // 2. Definir estilos (Spinner CSS)
        this.$style.textContent = `
            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                color: #888;
                font-family: sans-serif;
            }
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #6c5ce7;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        // 3. Configurar elementos
        this.$container.className = 'loading-container';
        this.$spinner.className = 'spinner';
        this.$text.textContent = 'Cargando...';

        // 4. Ensamblar
        this.$container.appendChild(this.$spinner);
        this.$container.appendChild(this.$text);

        this.appendChild(this.$style);
        this.appendChild(this.$container);
    }

    // Método público para actualizar el texto dinámicamente
    set message(text) {
        this.$text.textContent = text;
    }
}

customElements.define('loading-state', LoadingState);