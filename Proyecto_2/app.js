const appState = {
    currentView: 'home', // 'home', 'search', 'detail'
    viewStack: [],       // Para manejar el botón "Volver" internamente
    lastSearch: { query: '', genre: '' }
};

const appContent = document.getElementById('app-content');

/**
 * Cambia la vista de forma interna.
 * @param {string} viewName - Nombre de la vista destino
 * @param {object} params - Datos necesarios (como el ID del anime)
 * @param {boolean} isBack - Si estamos retrocediendo
 */
function switchView(viewName, params = null, isBack = false) {
    // Si no es un retroceso, guardamos la vista actual en la pila antes de cambiar
    if (!isBack && appState.currentView !== viewName) {
        appState.viewStack.push({
            name: appState.currentView,
            params: null // Aquí podrías guardar el scroll o datos previos
        });
    }

    appState.currentView = viewName;

    // Sincronizar NavBar visualmente
    const navBar = document.getElementById('main-nav');
    if (navBar) navBar.setActiveRoute(viewName);

    // Limpiar y Renderizar
    appContent.innerHTML = '';

    switch (viewName) {
        case 'home':
            renderHomeView();
            break;
        case 'search':
            renderSearchView(params);
            break;
        case 'detail':
            renderDetailView(params.id);
            break;
    }
}

// MANEJO DE EVENTOs

// Clic en Logo o Inicio -> switchView('home')
document.addEventListener('navigate', (e) => {
    // Mapeamos los IDs del nav a nombres de vista internos
    const destination = e.detail === '#search' ? 'search' : 'home';
    switchView(destination);
});

// Clic en Tarjeta -> switchView('detail', {id: ...})
document.addEventListener('card-click', (e) => {
    switchView('detail', { id: e.detail });
});

// Botón Volver -> Usamos nuestra pila interna
document.addEventListener('back-click', () => {
    if (appState.viewStack.length > 0) {
        const previous = appState.viewStack.pop();
        switchView(previous.name, previous.params, true);
    } else {
        switchView('home');
    }
});

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    switchView('home');
});