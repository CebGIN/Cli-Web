/**
 * ProfileView.js
 * Handles initial user setup and profile editing (Name, Weight, Height).
 */

class ProfileView extends HTMLElement {
    constructor() {
        super();
        this._profile = JSON.parse(localStorage.getItem('webfit_profile')) || null;

        if (!document.getElementById('profile-view-styles')) {
            const style = document.createElement('style');
            style.id = 'profile-view-styles';
            style.textContent = `
                profile-view {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    animation: fadeIn 0.3s ease;
                }
                .profile-container {
                    width: 100%;
                    max-width: 500px;
                    padding: var(--spacing-xl);
                }
                .profile-header {
                    text-align: center;
                    margin-bottom: var(--spacing-lg);
                }
                .profile-header h1 {
                    color: var(--wii-teal);
                    font-size: 2.2rem;
                    margin-bottom: 10px;
                }
                .profile-header p {
                    color: var(--wii-text-muted);
                }
                .form-group label {
                    display: block;
                    font-weight: bold;
                    color: var(--wii-text-dark);
                    margin-top: var(--spacing-md);
                    margin-bottom: 5px;
                }
                .form-group input {
                    width: 100%;
                    padding: 10px;
                    border: 2px solid var(--wii-bg);
                    border-radius: var(--radius-sm);
                    font-family: inherit;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                .form-group input:focus {
                    outline: none;
                    border-color: var(--wii-teal);
                }
                .form-actions {
                    margin-top: var(--spacing-xl);
                    display: flex;
                    gap: var(--spacing-md);
                }
                .wii-avatar-preview {
                    display: flex;
                    justify-content: center;
                    margin-bottom: var(--spacing-md);
                }
            `;
            document.head.appendChild(style);
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const isEdit = this._profile !== null;
        const p = this._profile || { name: '', weight: '', height: '' };

        this.innerHTML = `
            <wii-card class="profile-container">
                <div class="profile-header">
                    <h1>${isEdit ? 'Editar Perfil' : 'Bienvenido a WebFit'}</h1>
                    <p>${isEdit ? 'Actualiza tus datos corporales.' : 'Por favor, ingresa tus datos para comenzar.'}</p>
                </div>
                
                <form id="profile-form">
                    <div class="form-group">
                        <label for="prof-name">Nombre o Apodo</label>
                        <input type="text" id="prof-name" value="${p.name}" required placeholder="Ej: Link">
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <div class="form-group" style="flex: 1;">
                            <label for="prof-weight">Peso (kg)</label>
                            <input type="number" id="prof-weight" value="${p.weight}" step="0.1" required placeholder="Ej: 70.5">
                        </div>
                        
                        <div class="form-group" style="flex: 1;">
                            <label for="prof-height">Altura (cm)</label>
                            <input type="number" id="prof-height" value="${p.height}" required placeholder="Ej: 175">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        ${isEdit ? '<button type="button" class="wii-btn btn-cancel" style="flex: 1;">Cancelar</button>' : ''}
                        <button type="submit" class="wii-btn wii-btn-primary" style="flex: 2;">
                            ${isEdit ? 'Guardar Cambios' : 'Comenzar'}
                        </button>
                    </div>
                </form>
            </wii-card>
        `;

        this.querySelector('#profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        if (isEdit) {
            this.querySelector('.btn-cancel').addEventListener('click', () => {
                window.navigateBack();
            });
        }
    }

    saveProfile() {
        const name = this.querySelector('#prof-name').value.trim();
        const weight = parseFloat(this.querySelector('#prof-weight').value);
        const height = parseFloat(this.querySelector('#prof-height').value);

        if (!name || isNaN(weight) || isNaN(height)) {
            alert('Por favor completa todos los campos correctamente.');
            return;
        }

        const newProfile = { name, weight, height };
        localStorage.setItem('webfit_profile', JSON.stringify(newProfile));
        
        // Notify any listeners (like the header/dashboard)
        document.dispatchEvent(new CustomEvent('profile-updated', { detail: newProfile }));

        // Navigate to Dashboard
        window.switchView('dashboard');
    }
}

customElements.define('profile-view', ProfileView);
