# Especificaciones del Proyecto: "Memory Match"

**Curso:** Desarrollo de Lenguajes para Clientes Web  
**Tecnologías:** HTML5, CSS3, JavaScript (Vanilla)  
**Profesor:** Ing. Victor Kneider
---

## 1. Descripción General
El objetivo de este proyecto es desarrollar un juego de memoria ("Memory Match") interactivo. La aplicación debe generar dinámicamente un tablero de cartas basado en la dificultad seleccionada por el usuario. El juego consiste en encontrar pares de elementos idénticos mediante la lógica de selección, memoria y comparación.

## 2. Objetivos de Aprendizaje
Al finalizar este proyecto, el estudiante será capaz de:
* Utilizar **CSS Grid o Flexbox** para generar estructuras bidimensionales dinámicas y responsivas.
* Manipular el **DOM** (Crear, leer, actualizar y eliminar nodos) mediante JavaScript nativo.
* Manejar **Eventos** del navegador y la lógica del flujo de una aplicación (inicio, validación, fin).
* Implementar algoritmos de aleatoriedad y control de estado de la interfaz.

---

## 3. Requerimientos Funcionales

### 3.1. Pantalla de Inicio e Identificación
Al cargar la página, el usuario debe ver una interfaz de configuración que incluya:
* **Campo de texto:** Para ingresar el nombre o alias del jugador.
* **Selector de Dificultad:** Debe permitir elegir las dimensiones del tablero:
    * **Fácil:** 4x4 (16 cartas).
    * **Intermedio:** 6x6 (36 cartas).
    * **Difícil:** 8x8 (64 cartas).
* **Botón "Iniciar Juego":** Al activarse, debe ocultar el menú, generar el tablero correspondiente e iniciar la partida.

### 3.2. Dinámica del Tablero
* El tablero debe generarse **íntegramente desde JavaScript** tras la selección de dificultad.
* Las cartas deben iniciar "boca abajo". El contenido (emojis, iconos o imágenes locales) debe asignarse de forma aleatoria en cada partida.
* **Mecánica de juego:**
    1. El usuario voltea dos cartas consecutivamente.
    2. **Si coinciden:** Permanecen visibles y se marcan como "emparejadas".
    3. **Si no coinciden:** Se vuelven a ocultar.
* **Restricción de flujo:** Si se comparan dos cartas incorrectas se debe bloquear el tablero y darle una alerta al usuario indicando que su jugada fue errónea.

### 3.3. Interfaz de Seguimiento (HUD)
Durante la partida, debe ser visible en todo momento:
* El nombre del jugador actual.
* Un **contador de movimientos** (intentos realizados).
* Un botón de **Reiniciar** para volver a la pantalla de configuración inicial.

---

## 4. Requerimientos Técnicos

### 4.1. Maquetación y Estilos (HTML/CSS)
* **Estructura HTML:** Debe ser semántica y bien organizada, utilizando elementos apropiados para cada sección.
* **Diseño Responsivo:** Uso de **CSS Grid o Flexbox** para la disposición de las cartas y la estructura general. Las columnas y filas deben adaptarse dinámicamente según la dificultad elegida.
* **Estética Visual:** Diseño coherente con paleta de colores, tipografía consistente y espaciado apropiado.
* Se valorará el uso de transiciones y transformaciones CSS para el efecto visual de giro (flip) de las cartas. (Extra)

### 4.2. Lógica y Estructura (JavaScript)
* **Sin librerías externas:** No se permite el uso de jQuery, frameworks o utilidades externas. Todo el código debe ser JavaScript puro (Vanilla).
* **Manipulación del DOM:** Uso de métodos como `createElement`, `appendChild`, `classList` y manejo de eventos con `addEventListener`.
* **Prohibido:** El uso de `alert()` para anunciar el fin del juego. El mensaje de victoria debe mostrarse integrando elementos en el DOM (como un modal o una sección de mensaje en pantalla).

### 4.3. Originalidad y Personalización
* **Identidad del Juego:** El proyecto debe incluir un nombre original y creativo que le dé personalidad al juego (diferente a "Memory Match", que es solo el nombre genérico del proyecto).
* **Temática Visual:** El estudiante debe diseñar una temática coherente y original que unifique toda la aplicación (colores, tipografías, iconografía de las cartas, etc.).
* **Elementos Personalizados:** Se valorará la creatividad en:
    * El diseño visual de las cartas y sus animaciones.
    * La interfaz de usuario y su presentación.
    * Detalles adicionales que hagan única la experiencia (efectos de sonido, partículas, mensajes personalizados, etc.).

---

## 5. Criterios de Evaluación

| Criterio | Peso | Descripción |
| :--- | :---: | :--- |
| **Lógica de Juego** | 40% | El sistema mezcla cartas aleatoriamente, detecta pares correctamente y maneja el estado de victoria. |
| **HTML y CSS** | 30% | Estructura HTML semántica, implementación correcta de Grid/Flexbox, diseño responsivo y estética visual coherente. |
| **Originalidad y Diseño** | 20% | Creatividad en la temática, nombre del juego, diseño visual y elementos que aporten personalidad al proyecto. |
| **Uso de Git** | 10% | Commits frecuentes con mensajes descriptivos, estructura de branches coherente y evidencia de flujo de trabajo incremental. |

---

## 6. Entrega y Control de Versiones

### 6.1. Repositorio Git
* El proyecto debe estar alojado en un repositorio de Git (GitHub, GitLab, etc.).
* **Estructura recomendada:**
    * Commit inicial con estructura básica del proyecto.
    * Commits incrementales por funcionalidad (pantalla inicio, lógica del tablero, sistema de puntuación, etc.).
    * Commits finales con ajustes de diseño y correcciones.

### 6.2. README del Repositorio
El repositorio debe incluir un archivo `README.md` con:
* Nombre original del juego.
* Breve descripción de la temática elegida.
* Instrucciones de uso/instalación.
* Créditos (si se usaron recursos externos como imágenes o iconos).
---