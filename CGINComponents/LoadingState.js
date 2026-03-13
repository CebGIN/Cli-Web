class LoadingState extends HTMLElement {
    constructor() {
        super();

        if (!document.getElementById("loading-state-styles")) {
            const style = document.createElement("style");
            style.id = "loading-state-styles";
            style.textContent = `
                loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--loading-padding, 40px);
                    color: var(--loading-text-color, #888);
                    font-family: sans-serif;
                }
                .spinner {
                    width: var(--spinner-size, 40px);
                    height: var(--spinner-size, 40px);
                    border: 4px solid var(--spinner-bg, #f3f3f3);
                    border-top: 4px solid var(--spinner-color, #6c5ce7);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        this.$container = document.createElement('div'); // Contenedor interno si fuera necesario, o directo al host
        this.$spinner = document.createElement('div');
        this.$text = document.createElement('p');

        this.$spinner.className = 'spinner';
        this.$text.textContent = 'Cargando...';

        this.appendChild(this.$spinner);
        this.appendChild(this.$text);
    }

    set message(text) {
        this.$text.textContent = text;
    }
}
customElements.define('loading-state', LoadingState);