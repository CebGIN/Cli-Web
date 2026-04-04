// ==========================================
// app.js - Controlador Principal (Router y Estado)
// ==========================================
import { AnimeService } from './api.js';

// 1. ESTADO INTERNO
const appState = {
    currentView: '',
    viewStack: [], // Pila para el botón "Volver"
    search: {
        query: '',
        genre: '',
        results: [],
        genresList: [] // Cacheamos los géneros para no pedirlos a la API cada vez
    }
};

const appContent = document.getElementById('app-content');
const navBar = document.getElementById('main-nav');

// 2. MOTOR DE NAVEGACIÓN INTERNA
function switchView(viewName, params = null, isBack = false) {
    if (!isBack && appState.currentView && appState.currentView !== viewName) {
        appState.viewStack.push({ name: appState.currentView, params: null });
    }

    appState.currentView = viewName;
    if (navBar) navBar.setActiveRoute(`#${viewName}`);

    appContent.innerHTML = ''; // Limpiamos el lienzo

    switch (viewName) {
        case 'home': renderHomeView(); break;
        case 'search': renderSearchView(params); break;
        case 'detail': renderDetailView(params.id); break;
    }
}

// 3. RENDERIZADO DE VISTAS

async function renderHomeView() {
    const loader = document.createElement('loading-state');
    loader.message = "Cargando Top Anime...";
    appContent.appendChild(loader);

    try {
        const topAnimes = await AnimeService.getTop();
        appContent.innerHTML = '<h2 style="padding: 0 20px;">Top Anime del Momento</h2>';
        const grid = document.createElement('anime-grid');
        appContent.appendChild(grid);
        grid.animes = topAnimes;
    } catch (error) {
        if (error.message.includes("cancelada")) return; // Ignorar si el usuario cambió de vista rápido
        appContent.innerHTML = '';
        const errState = document.createElement('error-state');
        errState.message = error.message;
        errState.addEventListener('retry', () => renderHomeView());
        appContent.appendChild(errState);
    }
}

async function renderSearchView(params = null) {
    appState.search.query = ''; // Limpiamos el texto al buscar por etiqueta
    // Si venimos de un clic en un género (desde detail), actualizamos el estado
    if (params && params.genreId) {
        appState.search.genre = params.genreId;
    }

    // Estructura base
    appContent.innerHTML = `
        <div class="search-controls" style="padding: 20px; display: flex; flex-direction: column; gap: 15px; align-items: center;">
            <div id="search-wrapper" style="width: 100%; max-width: 600px;"></div>
            <div id="filter-wrapper"></div>
        </div>
        <div id="results-wrapper"></div>
    `;

    const searchBar = document.createElement('search-bar');
    const genreFilter = document.createElement('genre-filter');
    const resultsWrapper = document.getElementById('results-wrapper');

    // Restaurar valores previos
    searchBar.value = appState.search.query;
    document.getElementById('search-wrapper').appendChild(searchBar);
    document.getElementById('filter-wrapper').appendChild(genreFilter);

    // Cargar géneros (usando caché si existe)
    if (appState.search.genresList.length === 0) {
        try {
            appState.search.genresList = await AnimeService.getGenres();
        } catch (e) {
            console.error("No se pudieron cargar los géneros");
        }
    }
    genreFilter.genres = appState.search.genresList;

    // Forzamos visualmente el select al género actual (si aplica)
    if (appState.search.genre) {
        setTimeout(() => genreFilter.querySelector('select').value = appState.search.genre, 0);
    }

    // Función interna para ejecutar la búsqueda
    const executeSearch = async (query, genre) => {
        appState.search.query = query;
        appState.search.genre = genre;

        resultsWrapper.innerHTML = '';
        const loader = document.createElement('loading-state');
        loader.message = "Buscando...";
        resultsWrapper.appendChild(loader);

        try {
            const results = await AnimeService.search(query, genre);
            appState.search.results = results;

            resultsWrapper.innerHTML = '';
            const grid = document.createElement('anime-grid');
            resultsWrapper.appendChild(grid);
            grid.animes = results;
        } catch (error) {
            if (error.message.includes("cancelada")) return;
            resultsWrapper.innerHTML = '';
            const errState = document.createElement('error-state');
            errState.message = error.message;
            errState.addEventListener('retry', () => executeSearch(query, genre));
            resultsWrapper.appendChild(errState);
        }
    };

    // Listeners locales de los componentes de búsqueda
    searchBar.addEventListener('search', (e) => executeSearch(e.detail, appState.search.genre));
    genreFilter.addEventListener('filter-change', (e) => executeSearch(appState.search.query, e.detail));

    // Mostrar resultados previos o hacer búsqueda inicial si venimos de un tag
    if (params && params.genreId) {
        executeSearch('', params.genreId);
    } else if (appState.search.results.length > 0) {
        // Restaurar grilla sin llamar a la API
        const grid = document.createElement('anime-grid');
        resultsWrapper.appendChild(grid);
        grid.animes = appState.search.results;
    } else {
        // Hacer una búsqueda general inicial para tener contenido visual
        executeSearch('', '');
    }
}

async function renderDetailView(id) {
    const loader = document.createElement('loading-state');
    loader.message = "Cargando información del anime...";
    appContent.appendChild(loader);

    try {
        const animeData = await AnimeService.getById(id);
        appContent.innerHTML = '';
        const detail = document.createElement('anime-detail');
        appContent.appendChild(detail);
        detail.data = animeData;
    } catch (error) {
        if (error.message.includes("cancelada")) return;
        appContent.innerHTML = '';
        const errState = document.createElement('error-state');
        errState.message = error.message;
        errState.addEventListener('retry', () => renderDetailView(id));
        appContent.appendChild(errState);
    }
}

// 4. ESCUCHA DE EVENTOS GLOBALES (Burbujeo)

document.addEventListener('navigate', (e) => {
    const target = e.detail === '#search' ? 'search' : 'home';
    switchView(target);
});

document.addEventListener('card-click', (e) => {
    switchView('detail', { id: e.detail });
});

document.addEventListener('back-click', () => {
    if (appState.viewStack.length > 0) {
        const prev = appState.viewStack.pop();
        switchView(prev.name, prev.params, true);
    } else {
        switchView('home');
    }
});

// Señal desde los tags de género en AnimeDetail
document.addEventListener('genre-click', (e) => {
    // Al hacer clic en un género, vamos a la vista de búsqueda con ese ID
    switchView('search', { genreId: e.detail.id });
});

// 5. INICIALIZACIÓN
window.addEventListener('DOMContentLoaded', () => {
    switchView('home');
});