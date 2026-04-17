# Proyecto 2: Guía de Prácticas de Codificación (Neo Alejandría) ⛩️

Este documento resume los patrones arquitectónicos, convenciones y estándares de desarrollo utilizados en el **Proyecto_2**, sirviendo como base para mantener la consistencia en el **Proyecto_3**.

---

## 🏗️ Arquitectura General: SPA & Serveless Components
El proyecto es una **Single Page Application (SPA)** construida íntegramente con **Vanilla JavaScript**, sin frameworks externos.

### 1. Descomposición de Archivos
- [index.html](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/index.html): Punto de entrada único. Solo contiene el esqueleto base y los contenedores de navegación y contenido (`#main-nav`, `#app-content`).
- [style.css](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/style.css): Design System. Contiene variables CSS (`:root`), resets y estilos globales.
- [api.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/api.js): Capa de servicio. Centraliza todas las llamadas a la API externa.
- [app.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js): El "Cerebro". Gestiona el estado de la aplicación, el enrutamiento interno ([switchView](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js#21-38)) y la instanciación de componentes.
- [CGINComponents/](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/CGINComponents): Directorio dedicado a Web Components reutilizables.

### 2. Capa de Datos ([api.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/api.js))
- **AbortController**: Todas las funciones de fetch deben implementar `AbortController`. Si se inicia una nueva petición antes de que termine la anterior, la anterior se cancela para evitar inconsistencias de UI.
- **Timeout**: Límite de 10 segundos por petición.
- **Manejo de Errores**: Especial atención al Error 429 (Rate Limit). El servicio debe propagar errores descriptivos.

---

## 🧩 Estándar de Web Components
Todos los componentes siguen la API nativa de `customElements`.

### 1. Patrón de Inyección de Estilos (Estilos "Singleton")
Para evitar declarar estilos en cada instancia, se utiliza un bloque condicional en el constructor que inyecta un solo `<style>` en el `<head>` del documento.
```javascript
if (!document.getElementById("component-name-styles")) {
    const style = document.createElement("style");
    style.id = "component-name-styles";
    style.textContent = ` ... `; 
    document.head.appendChild(style);
}
```

### 2. Comunicación (Event Bus via Bubbling)
Los componentes no conocen al padre. Se comunican lanzando eventos personalizados que burbujean (`bubbles: true`).
```javascript
this.dispatchEvent(new CustomEvent('action-name', { 
    detail: data, 
    bubbles: true 
}));
```

### 3. Paso de Datos
Se utiliza el setter `set data(value)` para actualizar el contenido del componente. Esto permite que el componente sea reactivo a cambios de datos externos.

---

## 🚦 Gestión de Estado y Navegación
- **`appState`**: Objeto central en [app.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js) que mantiene:
  - `currentView`: Vista actual.
  - `viewStack`: Historial para el botón "Volver".
  - [search](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/api.js#52-59): Resultados previos, query y géneros cacheados.
- **Navegación**: La función [switchView(viewName, params)](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/app.js#21-38) limpia el contenedor principal (`appContent.innerHTML = ''`) e instancia el componente necesario.

---

## 🎨 Design System y UX
- **Variables CSS**: Uso obligatorio de `--primary`, `--bg-dark`, `--card-radius`, etc.
- **Feedback Visual**: 
  - Todo proceso asíncrono debe mostrar un `<loading-state>`.
  - Todo fallo debe mostrar un `<error-state>` con un evento `retry`.
- **Aesthetics**: Glassmorphism (`backdrop-filter`), sombras suaves y micro-interacciones (hover transforms).

---

## 📝 Convenciones de Nomenclatura
- **Archivos de Componentes**: `PascalCase.js` (ej: [AnimeCard.js](file:///home/cebrian/Documentos/Code/URU/Cli-Web/Proyecto_2/CGINComponents/AnimeCard.js)).
- **Tags de Componentes**: `kebab-case` (ej: `<anime-card>`).
- **Variables/Funciones**: `camelCase`.
- **Variables de Referencia al DOM**: Prefijo `$` (ej: `this.$container`).

---

> [!TIP]
> Para el **Proyecto_3**, sigue el patrón de **Servicio-Controlador-Componente** para asegurar que la lógica de negocio (API) esté separada de la lógica de enrutamiento y la visualización.
