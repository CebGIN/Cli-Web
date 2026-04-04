**PROYECTO - SISTEMA DE REGISTRO DE EJERCICIOS EN GIMNASIO (WEB)**

**UNIVERSIDAD RAFAEL URDANETA - INGENIERÍA DE COMPUTACIÓN**

---

## DESCRIPCIÓN GENERAL

Desarrollar una aplicación web completa para el seguimiento y control de entrenamientos en el gimnasio. La aplicación permitirá a los usuarios gestionar máquinas/ejercicios, crear rutinas de entrenamiento, registrar sesiones de ejercicio con peso, repeticiones y series, y visualizar su progreso a través de un dashboard interactivo con gráficos.

El sistema utilizará persistencia local en el navegador (IndexedDB y LocalStorage) para almacenar todos los datos sin necesidad de un servidor backend.

---

## FUNCIONALIDADES PRINCIPALES

### 1. GESTIÓN DE MÁQUINAS / EJERCICIOS

**Sección central para administrar todas las máquinas y ejercicios disponibles en el gimnasio.**

**Estructura de datos por máquina/ejercicio:**

| Campo | Descripción |
|-------|-------------|
| ID único | Identificador autogenerado |
| Nombre | Nombre de la máquina o ejercicio (ej: Press de banca, Sentadilla) |
| Grupo muscular | Grupo muscular principal que trabaja (ej: Pecho, Piernas, Espalda) |
| Tipo | Máquina o Peso propio |
| Imagen | Imagen seleccionada de un conjunto predefinido ubicado en `/assets/exercises/` (una por grupo muscular o tipo de ejercicio) |
| Descripción | Notas o instrucciones del ejercicio (opcional) |

**Funcionalidades requeridas:**

- Crear nuevas máquinas/ejercicios personalizados
- Editar máquinas/ejercicios existentes
- Eliminar máquinas/ejercicios (si se elimina una máquina asociada a rutinas, deberá eliminarse de las mismas o confirmarse la acción con advertencia de impacto)
- Visualizar lista completa con filtros por grupo muscular y tipo
- Búsqueda por nombre o grupo muscular

**Máquinas/ejercicios predefinidos:**

El sistema deberá incluir un catálogo base con ejercicios comunes organizados por grupo muscular: Press de banca, Sentadilla, Peso muerto, Press militar, Curl de bíceps, Extensión de tríceps, Jalones dorsales, Prensa de piernas, Elevaciones laterales, Remo con barra, entre otros.

**Interfaz:**

- Lista visual tipo tarjetas de todas las máquinas/ejercicios con opciones de edición y eliminación
- Formulario modal o dedicado para crear/editar máquinas
- Confirmación antes de eliminar con advertencia de impacto en rutinas
- Filtros y barra de búsqueda visibles

---

### 2. GESTIÓN DE RUTINAS

**Creación y administración de rutinas de entrenamiento que agrupan máquinas/ejercicios.**

**Estructura de datos por rutina:**

| Campo | Descripción |
|-------|-------------|
| ID único | Identificador autogenerado |
| Nombre | Nombre descriptivo de la rutina (ej: Día de Pecho y Tríceps) |
| Descripción | Descripción general de la rutina (opcional) |
| Ejercicios asociados | Lista ordenada de máquinas/ejercicios que componen la rutina |
| Orden de ejercicios | Posición de cada ejercicio dentro de la rutina |
| Series sugeridas | Número de series recomendadas por ejercicio |
| Repeticiones sugeridas | Número de repeticiones recomendadas por serie |
| Fecha de creación | Fecha en que se creó la rutina |

**Funcionalidades requeridas:**

- Crear nuevas rutinas seleccionando máquinas/ejercicios del catálogo
- Editar rutinas existentes (agregar, quitar o reordenar ejercicios)
- Eliminar rutinas (las sesiones históricas asociadas se conservan)
- Definir series y repeticiones sugeridas por cada ejercicio dentro de la rutina
- Visualizar lista completa de rutinas creadas
- Ver detalle de una rutina con todos sus ejercicios

**Interfaz:**

- Lista de rutinas con vista resumida (nombre, cantidad de ejercicios)
- Vista detalle de rutina mostrando ejercicios en orden con series/reps sugeridas
- Formulario de creación/edición con selector de ejercicios tipo lista interactiva
- Confirmación antes de eliminar

---

### 3. REGISTRO DE SESIONES DE ENTRENAMIENTO

**Registro detallado de cada sesión de ejercicio realizada, vinculada a una rutina.**

**Estructura de datos por sesión:**

| Campo | Descripción |
|-------|-------------|
| ID único | Identificador autogenerado de la sesión |
| Fecha | Fecha y hora en que se realizó la sesión |
| Rutina asociada | Referencia a la rutina ejecutada |
| Detalle por ejercicio | Para cada máquina/ejercicio de la rutina: |
| — Peso utilizado | Peso en kg o lb para cada serie |
| — Repeticiones | Repeticiones realizadas en cada serie |
| — Número de series | Cantidad de series completadas |
| Duración | Duración total de la sesión (opcional) |
| Notas | Observaciones generales de la sesión (opcional) |

**Funcionalidades requeridas:**

- Iniciar una nueva sesión seleccionando una rutina existente
- Registrar peso, repeticiones y series para cada ejercicio de la rutina
- Poder agregar ejercicios adicionales no contemplados en la rutina original
- Editar sesiones pasadas
- Eliminar sesiones
- Filtrar sesiones por fecha, rutina o ejercicio específico
- Búsqueda por rango de fechas
- Ver historial completo de sesiones ordenado cronológicamente

**Interfaz:**

- Vista de registro tipo formulario interactivo donde se cargan los ejercicios de la rutina seleccionada
- Campos dinámicos para agregar series (peso + repeticiones) por cada ejercicio
- Historial de sesiones en formato lista o calendario
- Vista detalle de cada sesión mostrando todos los ejercicios con sus datos registrados

---

### 4. DASHBOARD INTERACTIVO

**Vista principal con información del progreso de entrenamiento de forma visual y ordenada.**

**Información mostrada:**

- Resumen del mes actual: total de sesiones, días entrenados, tiempo total (si aplica)
- Sesiones recientes (últimas 5)
- Ejercicio con mayor progreso de peso en el mes
- Racha actual de entrenamiento (días consecutivos o semanales)

**Gráficos con Chart.js (mínimo 4):**

| Gráfico | Tipo | Descripción |
|---------|------|-------------|
| Frecuencia de entrenamiento | Barras | Cantidad de sesiones por semana o mes |
| Progreso de peso por ejercicio | Líneas | Evolución del peso máximo levantado a lo largo del tiempo para un ejercicio seleccionado |
| Distribución por grupo muscular | Dona / Pastel | Porcentaje de ejercicios realizados por grupo muscular en el mes |
| Volumen total de entrenamiento | Líneas | Evolución del volumen total (peso × reps × series) semana a semana |
| Comparativa de rutinas | Barras agrupadas | Frecuencia de uso de cada rutina en el mes |

**Funcionalidades:**

- Filtros de tiempo (mes seleccionado, semana, rango personalizado)
- Selector de ejercicio específico para ver su progreso individual
- Actualización en tiempo real al registrar sesiones

---

---

## REQUISITOS TÉCNICOS: PERSISTENCIA

### Persistencia con IndexedDB

Se deberá manejar **IndexedDB** como mecanismo principal de persistencia local en el navegador para almacenar:

- Catálogo de máquinas/ejercicios
- Rutinas creadas por el usuario
- Sesiones de entrenamiento con todo su detalle

**Stores sugeridos en IndexedDB:**

| Store | Clave | Índices sugeridos |
|-------|-------|-------------------|
| `exercises` | `id` | `muscleGroup`, `type`, `name` |
| `routines` | `id` | `name`, `createdAt` |
| `sessions` | `id` | `date`, `routineId` |

### Uso de LocalStorage

Se podrá utilizar **LocalStorage** de forma complementaria para almacenar:

- Preferencias del usuario (unidad de peso: kg/lb, tema claro/oscuro)
- Último mes/filtro seleccionado en el dashboard
- Configuración de la aplicación

---

## NAVEGACIÓN Y ESTRUCTURA SPA

### Definiciones

| Término | Definición |
|---------|------------|
| SPA | Single Page Application — aplicación de una sola página que cambia su contenido dinámicamente sin recargar el navegador |
| Vista | Sección de la interfaz que se muestra al usuario según su contexto de navegación |
| Componente | Pieza reutilizable de la interfaz implementada como Custom Element |
| Estado de carga | Indicador visual que se muestra mientras se espera una operación asíncrona (lectura/escritura en IndexedDB, renderizado de gráficos, etc.) |
| Estado de error | Indicador visual que se muestra cuando una operación falla |

### Vistas del sistema

La aplicación funciona como una SPA: existe un único archivo `index.html` que actúa como contenedor. Las vistas se intercambian dinámicamente mediante JavaScript.

| ID | Vista | Ruta | Descripción |
|----|-------|------|-------------|
| V-01 | Dashboard | `#dashboard` | Vista principal con resumen, gráficos y sesiones recientes |
| V-02 | Ejercicios | `#exercises` | Catálogo de máquinas/ejercicios con CRUD completo |
| V-03 | Rutinas | `#routines` | Gestión de rutinas y su detalle |
| V-04 | Detalle de Rutina | `#routine/:id` | Vista completa de una rutina con sus ejercicios |
| V-05 | Sesiones | `#sessions` | Historial de sesiones con filtros |
| V-06 | Nueva Sesión | `#session/new` | Registro de una sesión seleccionando rutina |
| V-07 | Detalle de Sesión | `#session/:id` | Vista completa de una sesión registrada |

### Flujo de navegación

```
┌─────────────────────────────────────────────────┐
│                  DASHBOARD                       │
│                 (#dashboard)                     │
│  [Resumen] [Gráficos] [Sesiones recientes]      │
└──────┬──────────────┬───────────────────────────┘
       │              │
       ▼              ▼
┌──────────────┐  ┌───────────────────────────────┐
│  SESIONES    │  │        NUEVA SESIÓN           │
│ (#sessions)  │  │     (#session/new)            │
│ [Historial]  │  │ [Seleccionar rutina → Pesos]  │
└──────┬───────┘  └───────────────────────────────┘
       │
       ▼
┌──────────────────┐
│ DETALLE SESIÓN   │
│ (#session/:id)   │
└──────────────────┘

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ EJERCICIOS   │      │    RUTINAS       │      │ DETALLE RUTINA   │
│ (#exercises) │      │   (#routines)    │─────►│ (#routine/:id)   │
│ [CRUD cards] │      │   [Lista]        │      │ [Ejercicios]     │
└──────────────┘      └──────────────────┘      └──────────────────┘
```

**Reglas de navegación:**

- La barra de navegación está siempre visible en todas las vistas
- El logo o nombre de la aplicación siempre retorna al Dashboard
- Indicador visual de la vista activa en la navegación
- La navegación se realiza intercambiando vistas dinámicamente sin recargar la página
- Botón "← Volver" en vistas de detalle regresa a la vista anterior

---

## ARQUITECTURA: COMPONENTES WEB (Custom Elements)

La aplicación debe construirse siguiendo el patrón de **componentes** basados en Web Components: clases JavaScript que extienden `HTMLElement` y se registran como Custom Elements con `customElements.define`. No se utilizarán los métodos de ciclo de vida propios de los Web Components (como `connectedCallback`, `disconnectedCallback` o `attributeChangedCallback`). En su lugar, la construcción del DOM debe realizarse en el `constructor` y las actualizaciones exponiéndose mediante propiedades o métodos públicos. La comunicación con el exterior se realizará mediante eventos personalizados o callbacks.

El estudiante debe identificar y diseñar los componentes que considere necesarios para cubrir todas las funcionalidades del sistema (vistas, tarjetas, formularios, listas, modales, estados de carga/error, etc.).

### Reglas del patrón

- Cada componente vive en su **propio archivo `.js`**.
- **Archivos separados, sin módulos ES obligatorios:** Se permite usar `import`/`export`, pero también es válido incluir los scripts en `index.html` en el orden correcto.
- Un componente **no manipula el DOM fuera de su propio nodo** — no hace `document.querySelector` de elementos que no creó él mismo.
- Si un componente necesita comunicarse hacia afuera (ej: notificar que el usuario hizo clic en una tarjeta), puede hacerlo como sugerencia mediante una **función callback** recibida por constructor o mediante **eventos personalizados (`CustomEvent`)**
---

## REQUERIMIENTOS NO FUNCIONALES

| ID | Requerimiento | Descripción |
|----|---------------|-------------|
| RNF-01 | Tecnología | Solo HTML, CSS y JavaScript vanilla. Sin frameworks ni librerías externas (Chart.js es la única excepción permitida para gráficos). |
| RNF-02 | Estructura de archivos | Mínimo: `index.html`, `/css/styles.css`, `/js/app.js`. Cada componente en su propio archivo JS. |
| RNF-03 | Operaciones asíncronas | Todas las operaciones con IndexedDB deben manejarse con async/await o .then(). |
| RNF-04 | Valores nulos | Todo campo que pueda estar vacío debe tener un valor de reemplazo visible en la interfaz ("Sin descripción", "N/A", etc.). |
| RNF-05 | Comentarios | El código debe tener comentarios que expliquen las secciones principales: operaciones de datos, renderizado de vistas y manejo de navegación. |
| RNF-06 | Sin recarga | La navegación entre vistas no debe recargar la página. El contenido se intercambia dinámicamente. |
| RNF-07 | Offline | La aplicación debe funcionar completamente offline una vez cargada, dado que toda la persistencia es local. |

---

## CRITERIOS DE EVALUACIÓN

Esta sección aclara qué se evaluará en la entrega, centrada en que el estudiante demuestre dominio de persistencia en el navegador y diseño de componentes.

- **Componentes implementados como Custom Elements:** Las piezas de la interfaz deben estar implementadas como clases que extienden `HTMLElement`, cada una en su propio archivo y registrada con `customElements.define`.
- **Persistencia correcta:** Uso adecuado de IndexedDB para operaciones CRUD con integridad de datos (eliminaciones en cascada, referencias consistentes).
- **Uso complementario de LocalStorage:** Preferencias y configuración almacenadas en LocalStorage de forma coherente.
- **Comunicación basada en eventos o callbacks:** Los componentes se comunican mediante `CustomEvent` o callbacks; no deben acceder ni manipular el DOM fuera de su propio nodo.
- **Estados visuales:** Mostrar indicadores claros para carga, error, estados vacíos y confirmaciones; usar `LoadingState` y `ErrorState` reutilizables.
- **Navegación SPA:** La navegación entre vistas no recarga la página; el contenido se intercambia dinámicamente.
- **Dashboard funcional:** Mínimo 4 gráficos con Chart.js que se actualicen al cambiar filtros o registrar nuevas sesiones.
- **Originalidad de la interfaz:** Diseño visual propio, cuidado y coherente.

### Escenarios de prueba manual (mínimos)

1. Abrir `#dashboard`: se cargan las estadísticas y gráficos; durante la carga se ve `LoadingState`; al completar se muestran los datos y sesiones recientes.
2. Ir a `#exercises`: se muestra el catálogo de ejercicios en tarjetas; crear uno nuevo, editarlo, eliminarlo y verificar que los cambios persisten al recargar la página.
3. Ir a `#routines`: crear una rutina seleccionando ejercicios del catálogo; verificar que al entrar al detalle se ven los ejercicios con series/reps sugeridas.
4. Iniciar una sesión (`#session/new`): seleccionar una rutina, registrar peso y reps para cada ejercicio, guardar y verificar que aparece en el historial.
5. Eliminar un ejercicio que está en una rutina: debe mostrarse `ConfirmDialog` con advertencia de impacto y proceder según la respuesta del usuario.
6. Cerrar y reabrir la aplicación: todos los datos (ejercicios, rutinas, sesiones) deben persistir gracias a IndexedDB.

---

## ENTREGABLES

1. **Código fuente completo** en repositorio GitHub
2. Aplicación desplegada en Vercel u otra plataforma
3. **README con documentación** que incluya:
   - Descripción del proyecto
   - Instrucciones de instalación y ejecución
   - Estructura del proyecto y lista de componentes
   - Tecnologías utilizadas
   - Capturas de pantalla de la aplicación

---

## METODOLOGÍA DE TRABAJO

El proyecto se trabajará de forma individual. Cada estudiante deberá mantener su propio repositorio en GitHub donde se reflejen commits frecuentes que evidencien el progreso y desarrollo del proyecto a lo largo del tiempo.

---

## CONSIDERACIONES ADICIONALES

- Será tomado en cuenta la originalidad de la interfaz gráfica y estilos del proyecto para la evaluación. Proyecto que se determine que no fue realizado por el estudiante sino por inteligencia artificial no tendrá oportunidad para ser evaluado.
- Se evaluará la organización del trabajo y la constancia del estudiante, esto se visualizará a través de los commits realizados.
- Se valorará el uso correcto y eficiente de IndexedDB para las operaciones CRUD y la integridad de los datos.
- La aplicación debe funcionar completamente offline una vez cargada, dado que toda la persistencia es local.