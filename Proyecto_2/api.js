// api.js - Motor de Comunicación
const BASE_URL = 'https://api.jikan.moe/v4';

// Guardamos el controlador actual para poder abortarlo si el usuario hace otra petición
let currentController = null;

/**
 * Función base para peticiones con esteroides (Timeout + Abort)
 */
async function jikanFetch(endpoint) {
    // 1. Cancelar petición previa si existe (Evita condiciones de carrera)
    if (currentController) {
        currentController.abort();
    }

    currentController = new AbortController();
    const signal = currentController.signal;

    // 2. Configurar Timeout de 10 segundos
    const timeoutId = setTimeout(() => currentController.abort(), 10000);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { signal });
        
        if (!response.ok) {
            if (response.status === 429) throw new Error("Demasiadas peticiones. Espera un momento.");
            throw new Error("Error al obtener datos del servidor.");
        }

        const data = await response.json();
        return data.data; // Jikan siempre envuelve la respuesta en un objeto 'data'

    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn("Petición cancelada o tiempo de espera agotado.");
            throw new Error("La conexión tardó demasiado o fue cancelada.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Servicios específicos
export const AnimeService = {
    getTop: () => jikanFetch('/top/anime?limit=12'),
    search: (query, genreId) => {
        let url = `/anime?q=${encodeURIComponent(query)}&limit=20&order_by=score&sort=desc`;
        if (genreId) url += `&genres=${genreId}`;
        return jikanFetch(url);
    },
    getById: (id) => jikanFetch(`/anime/${id}/full`),
    getGenres: () => jikanFetch('/genres/anime')
};