/**
 * app.js
 * Core application state manager and router for WebFit SPA.
 */

const appState = {
    currentView: null,
    viewStack: [],
    settings: JSON.parse(localStorage.getItem('webfit_settings')) || {
        unit: 'kg',
        theme: 'light'
    }
};

let $appContent;
let $navButtons;

document.addEventListener('DOMContentLoaded', () => {
    $appContent = document.getElementById('app-content');
    $navButtons = document.querySelectorAll('.nav-btn');

    $navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const viewName = e.currentTarget.dataset.view;
            if (viewName) switchView(viewName);
        });
    });

    const brand = document.getElementById('nav-brand-dashboard');
    if(brand) brand.addEventListener('click', () => switchView('dashboard'));

    // Initialize Database
    window.dbService.init()
        .then(() => {
            console.log("WebFit App ready. DB Initialized.");
            // Initial view: dashboard (or debug for dev)
            const startingView = 'debug'; 
            switchView(startingView);
        })
        .catch(err => {
            $appContent.innerHTML = `
                <div class="wii-loading-container" style="color: var(--wii-danger)">
                    <h2>Error Crítico</h2>
                    <p>No se pudo iniciar la base de datos.</p>
                </div>
            `;
            console.error(err);
        });
});

function switchView(viewName, params = {}) {
    if (appState.currentView === viewName && Object.keys(params).length === 0) return;

    if (appState.currentView) appState.viewStack.push(appState.currentView);
    appState.currentView = viewName;

    $navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    $appContent.innerHTML = '';
    let nodeToMount = null;

    switch (viewName) {
        case 'dashboard':
            nodeToMount = document.createElement('div');
            nodeToMount.innerHTML = `<h1 class="wiifit-text">Dashboard</h1><p>Próximamente...</p>`;
            break;
        case 'exercises':
            nodeToMount = document.createElement('div');
            nodeToMount.innerHTML = `<h1 class="wiifit-text">Ejercicios</h1><p>Próximamente...</p>`;
            break;
        case 'routines':
            nodeToMount = document.createElement('div');
            nodeToMount.innerHTML = `<h1 class="wiifit-text">Rutinas</h1><p>Próximamente...</p>`;
            break;
        case 'sessions':
            nodeToMount = document.createElement('div');
            nodeToMount.innerHTML = `<h1 class="wiifit-text">Historial</h1><p>Próximamente...</p>`;
            break;
        case 'debug':
            // Since debug.js is loaded in index.html, it should be available.
            try {
                nodeToMount = document.createElement('debug-view');
            } catch (e) {
                console.error("Failed to create debug-view:", e);
                nodeToMount = document.createElement('div');
                nodeToMount.innerHTML = `<error-state message="Error cargando vista de depuración"></error-state>`;
            }
            break;
        default:
            nodeToMount = document.createElement('div');
            nodeToMount.innerHTML = `<h2>Vista no encontrada</h2>`;
    }

    if (nodeToMount) $appContent.appendChild(nodeToMount);
}

window.navigateBack = function() {
    if (appState.viewStack.length > 0) {
        const prev = appState.viewStack.pop();
        appState.viewStack.pop(); 
        switchView(prev);
    } else {
        switchView('dashboard');
    }
}
