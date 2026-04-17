# 📚 Documentación de Componentes - WebFit

Este documento indexa y describe todos los Custom Elements (Web Components) desarrollados para el proyecto **WebFit**, detallando sus propiedades, métodos y eventos.

---

## 🏗️ Átomos (Componentes Base)

### 1. `<wii-card>`
**Archivo:** `js/components/WiiCard.js`  
**Descripción:** Contenedor base con estética Wii Fit (bordes redondeados, sombra suave). Actúa como wrapper para la mayoría de los elementos visuales.

*   **Propiedades/JS:** N/A.
*   **Eventos:** N/A.
*   **CSS:** Aplica automáticamente la clase `.wii-card-base`.

### 2. `<loading-state>`
**Archivo:** `js/components/States.js`  
**Descripción:** Pantalla de carga con spinner animado estilo Wii Teal.

*   **Propiedades/Setters:**
    *   `text` (String): El mensaje a mostrar debajo del spinner. (Por defecto: "Cargando...")
*   **Eventos:** N/A.

### 3. `<error-state>`
**Archivo:** `js/components/States.js`  
**Descripción:** Banner visual para errores con un botón de reintento.

*   **Propiedades/Setters:**
    *   `message` (String): Descripción del error.
*   **Eventos:**
    *   `retry`: Se dispara cuando el usuario hace clic en el botón "Reintentar".

---

## 🛠️ Componentes de Acción

### 4. `<confirm-dialog>`
**Archivo:** `js/components/ConfirmDialog.js`  
**Descripción:** Diálogo modal nativo estilizado para confirmar acciones peligrosas (borrado).

*   **Métodos:**
    *   `ask(title, message)` (Async): Abre el diálogo y retorna una Promesa que resuelve a `true` (Confirmar) o `false` (Cancelar).
*   **Eventos:** N/A (Se maneja vía retorno de la promesa).

### 5. `<wii-chart>`
**Archivo:** `js/components/WiiChart.js`  
**Descripción:** Wrapper reutilizable de Chart.js. Configura automáticamente fuentes y colores globales para mantener la consistencia estética.

*   **Propiedades/Setters:**
    *   `config` (Object): Recibe un objeto `{type, title, data, options}` siguiendo la estructura estándar de Chart.js.
*   **Eventos:** N/A.

### 6. `<wii-avatar>`
**Archivo:** `js/components/WiiAvatar.js`  
**Descripción:** Representación visual del usuario que evoluciona con el progreso. Calcula automáticamente el Nivel y la barra de XP basada en el volumen total de entrenamiento.

*   **Propiedades/Setters:**
    *   `xp` (Number): Establece el volumen acumulado (XP) y recalcula nivel y progreso visual.
*   **Eventos:** N/A.

---

## 🏋️ Módulo de Ejercicios

### 5. `<exercise-card>`
**Archivo:** `js/components/ExerciseCard.js`  
**Descripción:** Tarjeta que representa un ejercicio en el catálogo.

*   **Propiedades/Setters:**
    *   `data` (Object): Objeto del ejercicio `{id, name, muscleGroup, type, image}`.
*   **Eventos:**
    *   `edit-exercise`: Burbujea el objeto `data` completo para ser editado.
    *   `delete-exercise`: Burbujea el objeto `data` completo para ser eliminado.

### 6. `<exercise-editor>`
**Archivo:** `js/components/ExerciseEditor.js`  
**Descripción:** Formulario modal para crear o editar ejercicios.

*   **Métodos:**
    *   `open(exerciseData = null)`: Abre el modal. Si recibe datos, entra en modo edición; si no, en modo creación.
    *   `close()`: Cierra el modal.
*   **Eventos:**
    *   `save-exercise`: Dispara el objeto `{name, muscleGroup, type...}` recolectado del formulario para ser guardado en base de datos.

---

## 📋 Módulo de Rutinas

### 7. `<routine-card>`
**Archivo:** `js/components/RoutineCard.js`  
**Descripción:** Resumen visual de una rutina guardada.

*   **Propiedades/Setters:**
    *   `data` (Object): Objeto de la rutina `{id, name, description, exercises: []}`.
*   **Eventos:**
    *   `edit-routine`: Solicita edición de la rutina.
    *   `delete-routine`: Solicita eliminación.
    *   `start-session`: Notifica que el usuario quiere entrenar con esa rutina.

### 8. `<routine-builder>`
**Archivo:** `js/components/RoutineBuilder.js`  
**Descripción:** El componente más complejo. Permite armar rutinas seleccionando ejercicios individuales y asignandoles series/reps.

*   **Propiedades/Setters:**
    *   `availableExercises` (Array): Lista de todos los ejercicios disponibles en el sistema (necesario para el selector).
*   **Métodos:**
    *   `open(routineData = null)`: Abre el builder con datos previos o vacío.
*   **Eventos:**
    *   `save-routine`: Dispara el objeto de rutina completo (incluyendo el array de ejercicios asociados).

---

## 🕒 Módulo de Seguimiento (Live Workout)

### 9. `<workout-logger>`
**Archivo:** `js/components/WorkoutLogger.js`  
**Descripción:** Interfaz activa para registrar series, repeticiones y pesos durante un entrenamiento. Incluye temporizador.

*   **Métodos:**
    *   `setup(routine, exercisesPool)`: Inicializa la sesión con los datos de rutina y el catálogo de ejercicios.
*   **Eventos:**
    *   `finish-session`: Envía la data recolectada `{stats, notes, duration, routineId}` para ser guardada.
    *   `cancel-session`: Notifica intención de abortar el entrenamiento.

---

## 📱 Vistas (Organismos)

### 10. `<exercises-view>`
**Archivo:** `js/views/ExercisesView.js`  
**Descripción:** Controlador de la vista `#exercises`. Orquestador de CRUD, filtros y búsqueda.
*   **Comunica:** IndexedDB con `<exercise-card>` y `<exercise-editor>`.

### 11. `<routines-view>`
**Archivo:** `js/views/RoutinesView.js`  
**Descripción:** Controlador de la vista `#routines`.
*   **Comunica:** IndexedDB con `<routine-card>` y `<routine-builder>`.

### 12. `<session-view>`
**Archivo:** `js/views/SessionView.js`  
**Descripción:** Orquestador de una nueva sesión (`#session/new`).
*   **Modos:** 
    *   Si no hay rutina activa, muestra selector.
    *   Si hay rutina activa, monta `<workout-logger>`.

### 13. `<session-history-view>`
**Archivo:** `js/views/SessionHistoryView.js`  
**Descripción:** Lista cronológica de entrenamientos realizados con cálculo dinámico de Volumen Total.

### 14. `<dashboard-view>`
**Archivo:** `js/views/DashboardView.js`  
**Descripción:** Vista principal del sistema. Realiza agregación de datos para renderizar 4 gráficos de Chart.js y tarjetas de resumen (Racha, Favoritos, Totales).

---

## 🧪 Utilidades

### 15. `<debug-view>`
**Archivo:** `js/debug.js`  
**Descripción:** Banco de pruebas interno para realizar tests de base de datos e inspección de logs en tiempo real.
