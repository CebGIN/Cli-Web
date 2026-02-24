function agregarTarea() {
    let input = document.getElementById("tareaInput");
    let texto = input.value;
    const containerList = document.getElementById("listaTareas")
    if (texto === "") {
        alert("¡Escribe algo primero!");
        return;
    }

    let nuevaTarea = document.createElement("li");
    nuevaTarea.innerText = texto;

    let botonEliminar = document.createElement("button");
    botonEliminar.innerText = "X";
    botonEliminar.classList.add("removeButton");
    botonEliminar.onclick = function() {
        nuevaTarea.remove();
        // containerList.appendChild(nuevaTarea);
    };

    nuevaTarea.appendChild(botonEliminar);

    containerList.appendChild(nuevaTarea);

    input.value = "";
}