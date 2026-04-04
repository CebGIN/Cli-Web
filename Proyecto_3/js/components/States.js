/**
 * States.js
 * Contains simple atomic components for loading and error UI states.
 */

class LoadingState extends HTMLElement {
    constructor() {
        super();
        this._text = "Cargando...";

        if (!document.getElementById("loading-state-styles")) {
            const style = document.createElement("style");
            style.id = "loading-state-styles";
            style.textContent = `
                loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    width: 100%;
                    gap: var(--spacing-md);
                    color: var(--wii-text-muted);
                    animation: fadeIn 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }

    set text(val) {
        this._text = val;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="wii-spinner"></div>
            <p>${this._text}</p>
        `;
    }
}

class ErrorState extends HTMLElement {
    constructor() {
        super();
        this._message = "Ocurrió un error inesperado.";
        
        if (!document.getElementById("error-state-styles")) {
            const style = document.createElement("style");
            style.id = "error-state-styles";
            style.textContent = `
                error-state {
                    display: block;
                    background: #ffcdd2;
                    color: #b71c1c;
                    padding: var(--spacing-md);
                    border-radius: var(--radius-sm);
                    margin: var(--spacing-md) 0;
                    text-align: center;
                    animation: fadeIn 0.3s ease;
                    border: 1px solid #ef9a9a;
                }
            `;
            document.head.appendChild(style);
        }
    }

    set message(val) {
        this._message = val;
        this.render();
    }

    connectedCallback() {
        this.render();
        
        const btn = this.querySelector('button');
        if(btn) {
           btn.addEventListener('click', () => {
              this.dispatchEvent(new CustomEvent('retry', { bubbles: true }));
           });
        }
    }

    render() {
        this.innerHTML = `
            <h3 style="margin-bottom: var(--spacing-sm);">⚠️ Error</h3>
            <p style="margin-bottom: var(--spacing-md);">${this._message}</p>
            <button class="wii-btn wii-btn-danger">Reintentar</button>
        `;
    }
}

customElements.define('loading-state', LoadingState);
customElements.define('error-state', ErrorState);
