# Neo Alejandría | Tu Biblioteca de Anime ⛩️

**Neo Alejandría** es una aplicación web moderna y fluida diseñada para los amantes del anime. Permite explorar los títulos más populares, realizar búsquedas personalizadas y consultar detalles técnicos, sinopsis y géneros de miles de series y películas animadas japonesas.

Este proyecto ha sido desarrollado íntegramente con **Web Components (Vanilla JS)** bajo un paradigma de programación modular y reactiva.

---

## ✨ Características Principales

- **Exploración de Tendencias:** Descubre el "Top Anime" actualizado en tiempo real.
- **Búsqueda Avanzada:** Motor de búsqueda con filtros por palabras clave y géneros.
- **Detalle Profundo:** Consulta información técnica (año, episodios, puntuación), sinopsis completa y tags dinámicos.
- **Navegación Fluida:** SPA (Single Page Application) con rutas internas y historial de navegación (Botón "Volver").
- **Diseño Premium:** Interfaz oscura (Shadow Theme) con glassmorphism, animaciones suaves y adaptabilidad móvil.
- **Robustez de API:** Gestión inteligente de peticiones con cancelación de procesos (AbortController) para evitar colisiones de datos.

---

## 🛠️ Tecnologías y Arquitectura

La aplicación se basa en tres pilares fundamentales:

### 1. Web Components (Estructura)
Cada elemento de la interfaz es un componente autónomo reasignable (`<anime-card>`, `<search-bar>`, etc.). 
- **Encapsulación de Estilos:** Se utiliza un patrón de inyección de estilos por instancia para asegurar que el CSS sea ligero y centralizado sin necesidad de bibliotecas externas.
- **Event-Driven:** Los componentes se comunican con el controlador principal mediante eventos personalizados con burbujeo (`CustomEvent`).

### 2. Motor de Navegación y Estado (`app.js`)
El "cerebro" de la app gestiona un estado centralizado (`appState`) que controla la vista actual, la pila de navegación y los resultados de búsqueda previos. Esto permite una experiencia de usuario sin recargas de página.

### 3. Capa de Datos (`api.js`)
Configurada para interactuar con la **Jikan API (V4)**. 
- **Gestión de Sesión:** Implementa un `currentDataController` que aborta peticiones previas si el usuario realiza una nueva acción rápida.
- **Caché Local:** Los géneros se cargan una sola vez y se almacenan en el estado de la aplicación para optimizar el rendimiento.

---

## 📁 Estructura del Proyecto

```bash
Proyecto_2/
├── CGINComponents/       # Catálogo de Web Components (UI)
│   ├── AnimeCard.js      # Tarjeta individual con efecto hover
│   ├── AnimeDetail.js    # Vista detallada del anime
│   ├── AnimeGrid.js      # Grilla responsiva de resultados
│   ├── NavBar.js         # Navegación superior dinámica
│   ├── SearchBar.js      # Componente de búsqueda reactivo
│   ├── GenreFilter.js    # Filtro de categorías
│   └── Loading/Error/    # Estados de carga y error visuales
├── api.js                # Servicio de comunicación con la API
├── app.js                # Controlador principal (Router/Router)
├── style.css             # Design System (Variables y Reset)
└── index.html            # Punto de entrada de la aplicación
```

---

## 🚀 Cómo Ejecutar

Debido a que el proyecto utiliza módulos de JavaScript (`type="module"`), es necesario ejecutarlo en un servidor local para evitar bloqueos por políticas de seguridad (CORS):

1. **Opción Recomendada:** Si usas VS Code, utiliza la extensión **Live Server**. Haz click derecho en `index.html` y selecciona "Open with Live Server".
2. **Opción Alternativa (Python):** Ejecuta `python -m http.server 8000` en la terminal dentro de esta carpeta.

---

## 🎨 Design System

La aplicación utiliza un sistema de diseño basado en variables de CSS3 localizadas en `:root` para facilitar cambios de tema globales:

- `--primary`: Color acento (`#e79b5c`).
- `--bg-dark`: Fondo principal oscuro (`#0f0f0f`).
- `--transition`: Curva de animación estándar de 0.3s.

---

> **Nota:** Este proyecto utiliza datos proporcionados por [Jikan API](https://jikan.moe/), una API no oficial de MyAnimeList.
