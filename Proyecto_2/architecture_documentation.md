# Neo Alejandría App: Arquitectura y Funcionamiento Técnico 📚

Esta documentación detalla el funcionamiento interno de la aplicación Neo Alejandría, un motor de búsqueda y visualización de anime basado en la **Jikan API (v4)**.

---

## 🏗️ Flujo de Trabajo y Arquitectura SPA

La aplicación funciona como una **Single Page Application (SPA)** personalizada sin frameworks externos (React/Vue). Utiliza un sistema centralizado de navegación reactiva en [app.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js).

### 1. Sistema de "Vistas"
Aunque todo ocurre en un solo [index.html](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/index.html), la lógica de [switchView](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js#21-38) en [app.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js) emula el enrutamiento:
- **`home`**: Renderiza el top anime inicial.
- **[search](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/api.js#52-59)**: Monta los controles de búsqueda y los resultados.
- **`detail`**: Muestra la ficha técnica completa de un anime específico.

### 2. Ciclo de Vida de los Datos
El sistema utiliza un patrón de **Servicio-Controlador-Componente**:
1. **Servicio ([api.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/api.js))**: Realiza peticiones `fetch`. Implementa `AbortController` para cancelar peticiones si el usuario cambia de vista o realiza una nueva búsqueda antes de que la anterior termine.
2. **Controlador ([app.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js))**: Recibe los datos de la API, gestiona el estado (como los resultados previos de búsqueda) y crea dinámicamente las instancias de los Web Components.
3. **Componente (Directorio [CGINComponents/](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/CGINComponents))**: Recibe los datos a través de propiedades `set data(val)` y se encarga de su propia renderización interna y estilos.

---

## 📡 Comunicación entre Componentes (Event Bus)

Para evitar el "Prop Drilling" (paso de datos excesivo entre niveles profundos), la aplicación utiliza el **Burbujeo de Eventos del DOM**:

| Evento | Origen | Destino ([app.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js)) | Acción Resultante |
| :--- | :--- | :--- | :--- |
| `navigate` | `NavBar` | `document` | Cambia entre la vista Home y Búsqueda. |
| `card-click` | [AnimeCard](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/CGINComponents/AnimeCard.js#1-118) | `document` | Carga y muestra la vista de detalle del anime seleccionado. |
| [search](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/api.js#52-59) | `SearchBar` | [renderSearchView](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js#62-147) | Ejecuta una nueva petición a la API con el texto ingresado. |
| `filter-change` | `GenreFilter` | [renderSearchView](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js#62-147) | Filtra los resultados por el ID del género seleccionado. |
| `genre-click` | `AnimeDetail` | `document` | Salta a la búsqueda pre-filtrada por ese género. |
| `back-click` | `NavBar` / `detail` | `document` | Extrae el último estado de `viewStack` y retrocede. |

---

## 🎨 Design System y Estilos

El proyecto utiliza un sistema de **"Estilos Inyectados"** en los Web Components que asegura consistencia y rendimiento:

```javascript
if (!document.getElementById("component-styles")) {
    const style = document.createElement("style");
    style.id = "component-styles";
    style.textContent = ` ... `; 
    document.head.appendChild(style);
}
```

Este patrón (visible en [AnimeCard.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/CGINComponents/AnimeCard.js), [AnimeDetail.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/CGINComponents/AnimeDetail.js), etc.) inyecta el CSS necesario una sola vez en el `<head>`, permitiendo que cientos de componentes compartan la misma definición de estilo sin sobrecargar el DOM.

---

## 🛡️ Robustez y UX

- **Gestión de Errores Dinámica**: Los componentes `<error-state>` capturan fallos de red o errores 429 (Too Many Requests de Jikan) y ofrecen un botón de reintento que reinicia automáticamente la última función de renderizado fallida.
- **Estados de Carga**: El componente `<loading-state>` proporciona feedback visual inmediato mientras se espera la resolución de promesas asíncronas.
- **Cancelación Inteligente**: Si buscas rápidamente "Naruto" y luego "One Piece", el sistema cancela la petición de "Naruto" inmediatamente para ahorrar ancho de banda y evitar que resultados antiguos sobrepasen a los nuevos.
