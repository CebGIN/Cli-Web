# 📝 Plan de Implementación: GymLog (Inspiración Wii Fit)

## 1. Arquitectura de Datos (Persistencia)
El núcleo de la app será `db.js`. Utilizaremos **IndexedDB** para los datos pesados y **LocalStorage** para la configuración.

### Esquema de IndexedDB (Stores):
* **`exercises`**: `id` (pk), `name`, `muscleGroup`, `type` (Máquina/Peso), `image`, `description`.
* **`routines`**: `id` (pk), `name`, `description`, `exercises` (Array de IDs), `targets` (series/reps sugeridas).
* **`sessions`**: `id` (pk), `date` (index), `routineId`, `stats` (Array de objetos: `exerciseId`, `sets: [{weight, reps}]`), `duration`.

### Lógica de LocalStorage:
* `settings`: `{ unit: 'kg'|'lb', theme: 'light', lastFilter: 'all' }`.



---

## 2. Categorización de Componentes (UI)
Dividiremos los componentes en piezas reutilizables (Átomos) y estructuras complejas (Moléculas/Organismos).

### Reutilizados de AnimeHub:
* **`LoadingState`**: Pantalla blanca con el spinner circular estilo Wii.
* **`ErrorState`**: Banner con el color de acento "naranja advertencia" o "rojo suave".
* **`SearchBar`**: Input minimalista redondeado.

### Nuevos Componentes Específicos:
* **`WiiCard` (Base)**: Contenedor con bordes muy redondeados y sombra suave (*drop-shadow*).
* **`ExerciseEditor`**: Formulario dinámico para el CRUD de ejercicios.
* **`WorkoutLogger`**: El componente más complejo. Debe generar filas de inputs dinámicamente según la rutina seleccionada.
* **`WiiChart`**: Wrapper de Chart.js configurado con los colores del sistema.

---

## 3. Diseño y Estética (Wii Fit Style)
La interfaz debe sentirse "ligera" y espaciosa.

* **Paleta de Colores**:
    * **Fondo**: Blanco hueso (`#F8F9FA`) y gris muy claro.
    * **Acento (Wii Teal)**: Verde-Azul suave (`#80CBC4` o `#4DB6AC`).
    * **Texto**: Gris oscuro suave (`#424242`).
* **Tipografía**: Sans-serif redondeada (como *Nunito* o *Varela Round*).
* **Elementos Visuales**: 
    * Botones con efecto "píldora" (border-radius: 50px).
    * Uso de iconos simples y amigables.
    * **Efecto Wii**: Al pasar el mouse (hover), los elementos pueden crecer ligeramente (`transform: scale(1.02)`) con una transición suave.

---

## 4. Orquestación y Navegación (SPA)
El archivo `app.js` gestionará el estado de la vista mediante fragmentos de URL (`#dashboard`, `#exercises`, etc.).

* **Router**: Un `switch` que escucha el evento `hashchange`.
* **Event Bus**: Seguiremos usando `CustomEvents` para la comunicación:
    * `db-ready`: Cuando IndexedDB termina de abrirse.
    * `session-completed`: Dispara la actualización de los gráficos del Dashboard.
    * `exercise-updated`: Refresca la lista de ejercicios.



---

## 5. Banco de Pruebas (Test Bed)
Para asegurar que todo funciona antes de unirlo, crearemos una página secreta de depuración o una categoría de logs en la misma app.

### A. Test de Base de Datos (`db-test.js`):
Un script que ejecute una secuencia automática y devuelva resultados en consola:
1.  Limpiar base de datos.
2.  Insertar 5 ejercicios predefinidos.
3.  Crear una rutina de "Pecho".
4.  Consultar si la rutina existe.
5.  **Resultado esperado**: "DB Test: SUCCESS (5 exercises, 1 routine)".

### B. Test de Componentes (Sandboxing):
Crear una vista temporal `#debug` donde renderices todos los estados de un componente a la vez:
* Muestra el `LoadingState`.
* Muestra el `ErrorState`.
* Muestra una `WiiCard` vacía y una llena.
* Esto permite ajustar el CSS sin tener que navegar por toda la app.

### C. Monitor de Eventos:
Mantener el **"Event Log"** que usaste en AnimeHub (la caja negra con texto verde) pero con un botón para minimizarlo. Es vital para ver si los eventos de IndexedDB (que son asíncronos) se están disparando en el orden correcto.

---

## 6. Características "Estilo Juego" (Propuestas)
Ya que quieres el toque Wii Fit, podrías considerar:
* **Daily Check-in**: Un sello visual en el calendario cada día que registres una sesión.
* **Barra de "Energía"**: Un gráfico que se llene según cuántos grupos musculares has trabajado en la semana (Distribución por grupo muscular).
* **Puntos de Esfuerzo**: Calcular el **Volumen Total** ($Peso \times Reps \times Series$) y mostrarlo como una "puntuación" al terminar la sesión.
