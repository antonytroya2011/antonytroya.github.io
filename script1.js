// Funcion para que las letras se hagan mayusculas
function letraNumero(inputElement) {
    inputElement.value = inputElement.value.toUpperCase();
}

// Funcion para calcular el valor total con la cantidad y el precio
function calcularValorTotal() {
    var cantidad = parseFloat(document.getElementById('cantidad').value) || 0;
    var precio = parseFloat(document.getElementById('precio').value) || 0;

    var valorTotal = cantidad * precio;
    document.getElementById('valorTotal').value = valorTotal.toFixed(2);

    var validFeedback = document.querySelector('#precio + .valid-feedback');
    validFeedback.textContent = 'Bien hecho!';
}

// Funcion que los campos se validen cuando estan bien llenados
function validarCampo(campo) {
    if (!campo.checkValidity()) {
        campo.classList.add('is-invalid');
        campo.classList.remove('is-valid');
        campo.nextElementSibling.style.display = 'block'; 
    } else {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        campo.nextElementSibling.style.display = 'none'; 
    }
}

//Funcion para mostrar la tabla
function toggleTabla() {
    const tablaContainer = document.getElementById("tablaContainer");
    tablaContainer.style.display = tablaContainer.style.display === "none" ? "block" : "none";
}




