class ErrorState extends HTMLElement {
    constructor() {
        super();

        if (!document.getElementById("error-state-styles")) {
            const style = document.createElement("style");
            style.id = "error-state-styles";
            style.textContent = `
                error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: var(--error-padding, 40px);
                    font-family: sans-serif;
                    text-align: center;
                }
                .error-icon { 
                    font-size: var(--error-icon-size, 3rem); 
                    margin-bottom: 10px; 
                }
                .error-message { 
                    color: var(--error-text-color, #d63031); 
                    margin-bottom: 20px; 
                    font-weight: bold; 
                }
                .retry-btn {
                    padding: 10px 20px;
                    background-color: var(--error-btn-bg, #6c5ce7);
                    color: var(--error-btn-color, white);
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: filter 0.2s;
                }
                .retry-btn:hover { filter: brightness(1.2); }
            `;
            document.head.appendChild(style);
        }

        this.$icon = document.createElement('div');
        this.$message = document.createElement('p');
        this.$retryBtn = document.createElement('button');

        this.$icon.className = 'error-icon';
        this.$icon.textContent = '⚠️';
        this.$message.className = 'error-message';
        this.$message.textContent = 'Ha ocurrido un error.';
        this.$retryBtn.className = 'retry-btn';
        this.$retryBtn.textContent = 'Reintentar';

        this.$retryBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('retry', { bubbles: true }));
        });

        this.appendChild(this.$icon);
        this.appendChild(this.$message);
        this.appendChild(this.$retryBtn);
    }

    set message(text) {
        this.$message.textContent = text;
    }
}
customElements.define('error-state', ErrorState);