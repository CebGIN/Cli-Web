function agregarTarea() {
    // 1. Obtener el valor del input
    let input = document.getElementById("tareaInput");
    let texto = input.value;

    if (texto === "") {
        alert("¡Escribe algo primero!");
        return;
    }

    // 2. Crear un nuevo elemento de lista (li)
    let nuevaTarea = document.createElement("li");
    nuevaTarea.innerText = texto;

    // 3. Agregar un botón de eliminar a esa tarea
    let botonEliminar = document.createElement("button");
    botonEliminar.innerText = "X";
    botonEliminar.onclick = function() {
        nuevaTarea.remove();
    };

    nuevaTarea.appendChild(botonEliminar);

    // 4. Meter la tarea en el <ul>
    document.getElementById("listaTareas").appendChild(nuevaTarea);

    // 5. Limpiar el input
    input.value = "";
}