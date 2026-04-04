// ==========================================
// api.js - Motor de Comunicación con Jikan API
// ==========================================

const BASE_URL = 'https://api.jikan.moe/v4';

// Controlador global para cancelar peticiones de datos superpuestas
let currentDataController = null;

/**
 * Función base para peticiones con Timeout (10s) y Cancelación
 * @param {string} endpoint - Ruta de la API
 * @param {boolean} cancelPrevious - Si debe cancelar la petición anterior en curso
 */
async function jikanFetch(endpoint, cancelPrevious = true) {
    if (cancelPrevious && currentDataController) {
        currentDataController.abort(); // Cancelamos la anterior
    }

    const controller = new AbortController();
    if (cancelPrevious) currentDataController = controller;

    // Timeout estricto de 10 segundos
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { signal: controller.signal });

        if (!response.ok) {
            if (response.status === 429) throw new Error("Demasiadas peticiones. Jikan API está saturada. Intenta en un momento.");
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        return data.data;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn(`Petición abortada: ${endpoint}`);
            throw new Error("La petición tardó demasiado o fue cancelada por una nueva acción.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const AnimeService = {
    // Trae los animes más populares
    getTop: () => jikanFetch('/top/anime?limit=12', true),

    // Búsqueda combinada (texto + género)
    search: (query, genreId) => {
        let url = `/anime?limit=20&order_by=score&sort=desc`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (genreId) url += `&genres=${genreId}`;
        return jikanFetch(url, true);
    },

    // Detalle completo de un anime
    getById: (id) => jikanFetch(`/anime/${id}/full`, true),

    // Lista de géneros (No cancela otras peticiones principales porque es de configuración)
    getGenres: () => jikanFetch('/genres/anime', false)
};