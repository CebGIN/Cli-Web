class ErrorState extends HTMLElement {
    constructor() {
        super();

        // Crear elementos
        this.$container = document.createElement('div');
        this.$icon = document.createElement('div');
        this.$message = document.createElement('p');
        this.$retryBtn = document.createElement('button');
        this.$style = document.createElement('style');

        // Definir estilos
        this.$style.textContent = `
            .error-container {
                display: flex; 
                flex-direction: column;
                align-items: center;
                padding: 40px;
                font-family: sans-serif;
                text-align: center;
            }
            .icon { font-size: 3rem; margin-bottom: 10px; }
            .message { color: #d63031; margin-bottom: 20px; font-weight: bold; }
            .retry-btn {
                padding: 10px 20px;
                background-color: #6c5ce7;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
            }
            .retry-btn:hover { background-color: #5b4bc4; }
        `;

        // Configurar elementos
        this.$container.className = 'error-container';
        this.$icon.className = 'icon';
        this.$icon.textContent = '⚠️';
        this.$message.className = 'message';
        this.$message.textContent = 'Ha ocurrido un error al cargar los datos.';

        this.$retryBtn.className = 'retry-btn';
        this.$retryBtn.textContent = 'Reintentar';

        // Escuchar el clic y emitir el evento personalizado
        this.$retryBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('retry'));
        });

        // Ensamblar
        this.$container.appendChild(this.$icon);
        this.$container.appendChild(this.$message);
        this.$container.appendChild(this.$retryBtn);

        this.appendChild(this.$style);
        this.appendChild(this.$container);
    }

    // Método para cambiar el mensaje de error si es necesario
    set message(text) {
        this.$message.textContent = text;
    }
}

customElements.define('error-state', ErrorState);