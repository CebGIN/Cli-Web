/**
 * ConfirmDialog.js
 * A reusable modal dialog for warnings and confirmations using Wii Fit styling.
 */

class ConfirmDialog extends HTMLElement {
    constructor() {
        super();
        this._title = "¿Confirmar?";
        this._message = "¿Estás seguro de que deseas realizar esta acción?";

        if (!document.getElementById("confirm-dialog-styles")) {
            const style = document.createElement("style");
            style.id = "confirm-dialog-styles";
            style.textContent = `
                confirm-dialog dialog {
                    padding: var(--spacing-lg);
                    border: none;
                    border-radius: var(--radius-card);
                    box-shadow: var(--shadow-hover);
                    background: var(--wii-white);
                    color: var(--wii-text-dark);
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                }
                
                confirm-dialog dialog::backdrop {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }

                confirm-dialog .dialog-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-lg);
                }
                
                confirm-dialog .dialog-actions button {
                    flex: 1;
                }
                
                confirm-dialog h3 {
                    color: var(--wii-danger);
                    margin-bottom: var(--spacing-sm);
                }
            `;
            document.head.appendChild(style);
        }
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Opens the dialog. Returns a Promise that resolves to true (confirmed) or false (cancelled).
     * This avoids callback hell while keeping the component detached.
     * @param {string} title 
     * @param {string} message 
     * @returns {Promise<boolean>}
     */
    async ask(title, message) {
        if(title) this._title = title;
        if(message) this._message = message;
        this.render();
        
        const dialog = this.querySelector('dialog');
        dialog.showModal();

        return new Promise((resolve) => {
            const onConfirm = () => { cleanup(); resolve(true); };
            const onCancel = () => { cleanup(); resolve(false); };
            
            const btnConfirm = this.querySelector('.btn-confirm');
            const btnCancel = this.querySelector('.btn-cancel');

            btnConfirm.addEventListener('click', onConfirm);
            btnCancel.addEventListener('click', onCancel);

            // If user clicks the backdrop or presses Esc
            dialog.addEventListener('cancel', onCancel);

            const cleanup = () => {
                btnConfirm.removeEventListener('click', onConfirm);
                btnCancel.removeEventListener('click', onCancel);
                dialog.removeEventListener('cancel', onCancel);
                dialog.close();
            };
        });
    }

    render() {
        this.innerHTML = `
            <dialog>
                <h3>⚠️ ${this._title}</h3>
                <p>${this._message}</p>
                <div class="dialog-actions">
                    <button class="wii-btn btn-cancel">Cancelar</button>
                    <button class="wii-btn wii-btn-danger btn-confirm">Aceptar</button>
                </div>
            </dialog>
        `;
    }
}

customElements.define('confirm-dialog', ConfirmDialog);
