// Tu código JavaScript aquí
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


const firebaseConfig = {

    apiKey: "AIzaSyBMJsVpnbOwVOiVNbTZScZdet9qlGigDL0",
    authDomain: "conexion-8ec0d.firebaseapp.com",
    databaseURL: "https://conexion-8ec0d-default-rtdb.firebaseio.com",
    projectId: "conexion-8ec0d",
    storageBucket: "conexion-8ec0d.appspot.com",
    messagingSenderId: "679910299749",
    appId: "1:679910299749:web:9800b464879628b4850e8c"
};/*
const firebaseConfig = {

    apiKey: "AIzaSyAucknqaA_nnDnJa1XWnB17ySKJkUvOWO4",
    authDomain: "villartell.firebaseapp.com",
    databaseURL: "https://villartell-default-rtdb.firebaseio.com",
    projectId: "villartell",
    storageBucket: "villartell.appspot.com",
    messagingSenderId: "265763773399",
    appId: "1:265763773399:web:f1b8c70bf4e2c198b54992"
    };;*/

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Funcion para validar que los campos esten completos
function validarCampos() {
const codigo = document.getElementById("codigo").value;
const descripcion = document.getElementById("descripcion").value;
const cantidad = document.getElementById("cantidad").value;
const precio = document.getElementById("precio").value;

if (codigo.trim() === '' || descripcion.trim() === '' || cantidad.trim() === '' || precio.trim() === '') {
    return false;
}

return true;
}

// Funcion para crear el registro
window.crearRegistro = function () {
const codigo = document.getElementById("codigo");
const descripcion = document.getElementById("descripcion");
const cantidad = document.getElementById("cantidad");
const precio = document.getElementById("precio");
const valorTotal = document.getElementById("valorTotal");

const codigoValue = codigo.value;
const descripcionValue = descripcion.value;
const cantidadValue = cantidad.value;
const precioValue = precio.value;
const valorTotalValue = valorTotal.value;

const codigoIsValid = codigo.checkValidity();
const descripcionIsValid = descripcion.checkValidity();
const cantidadIsValid = cantidad.checkValidity();
const precioIsValid = precio.checkValidity();


// Muestra la alerta si la cantidad o el precio son negativos

if (cantidadValue < 0 || precioValue < 0) {
    Swal.fire({
        icon: 'error',
        title: 'Fallo en el registro',
        text: 'La cantidad y el precio deben ser valores no negativos.',
    });
    return;
}
// Muestra la alerta si los campos no están llenos

if (!validarCampos()) {
    Swal.fire({
        icon: 'error',
        title: 'Fallo en el registro',
        text: 'Por favor, llene todos los campos.',
    });
    return;
}

// Mostrar mensaje de confirmación
Swal.fire({
    title: '¿Está seguro?',
    text: '¿Desea guardar el registro?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
}).then((result) => {
    // Si el usuario confirma, proceder con la acción de guardar
    if (result.isConfirmed) {
        push(
            ref(database, 'Troya'),
            {
                id: codigoValue,
                description: descripcionValue,
                amount: cantidadValue,
                price: precioValue,
                total_value: valorTotalValue
            }
        );

        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Registro creado!',
            showConfirmButton: false,
            timer: 1500
        });

        // Limpiar los campos después de crear el registro
        codigo.value = "";
        descripcion.value = "";
        cantidad.value = "";
        precio.value = "";
        valorTotal.value = "";
        codigo.classList.remove('is-valid');
        descripcion.classList.remove('is-valid');
        cantidad.classList.remove('is-valid');
        precio.classList.remove('is-valid');
        buscarProductos();

    } else {
        // Si el usuario elige no guardar, restaurar valores y mensajes de validación
        codigo.value = codigoValue;
        descripcion.value = descripcionValue;
        cantidad.value = cantidadValue;
        precio.value = precioValue;
        valorTotal.value = valorTotalValue;

        if (!codigoIsValid) {
            codigo.classList.add('is-invalid');
            codigo.nextElementSibling.style.display = 'block';
        }

        if (!descripcionIsValid) {
            descripcion.classList.add('is-invalid');
            descripcion.nextElementSibling.style.display = 'block';
        }

        if (!cantidadIsValid) {
            cantidad.classList.add('is-invalid');
            cantidad.nextElementSibling.style.display = 'block';
        }

        if (!precioIsValid) {
            precio.classList.add('is-invalid');
            precio.nextElementSibling.style.display = 'block';
        }
    }
    buscarProductos();
    
});
}

// Funcion para buscar productos
window.buscarProductos = function () {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const productosTablaBody = document.getElementById("productosTablaBody");
    productosTablaBody.innerHTML = ""; 

    onValue(ref(database, 'Troya'), (snapshot) => {
        const registros = snapshot.val();

        for (const key in registros) {
            const producto = registros[key];

            // Convertir tanto la entrada del usuario como los datos a minúsculas
            const codigoLower = producto.id.toLowerCase();
            const descripcionLower = producto.description.toLowerCase();
            const amountLower = producto.amount.toString().toLowerCase();
            const priceLower = producto.price.toString().toLowerCase();
            const totalValueLower = producto.total_value.toString().toLowerCase();
            const searchInputLower = searchInput.toLowerCase();

            // Verificar si la búsqueda coincide con cualquier campo
            if (
                codigoLower.includes(searchInputLower) ||
                descripcionLower.includes(searchInputLower) ||
                amountLower.includes(searchInputLower) ||
                priceLower.includes(searchInputLower) ||
                totalValueLower.includes(searchInputLower)
            ) {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.description}</td>
                    <td  class="text-center">${producto.amount}</td>
                    <td  class="text-center">${producto.price}</td>
                    <td  class="text-center">${producto.total_value}</td>
                    <td  class="text-center">
                        <button type="button" class="btn btn-warning btn-sm" onclick="modificarRegistro('${key}')">
                            Modificar
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="eliminarRegistro('${key}')">
                            Eliminar
                        </button>
                    </td>
                `;

                productosTablaBody.appendChild(fila);
            }
        }
    });
}




// Funcion para limpiar datos
window.confirmarLimpiarCampos = function () {
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Desea limpiar los campos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // Si el usuario confirma, limpiar los campos

        if (result.isConfirmed) {
            document.getElementById("codigo").value = "";
            document.getElementById("descripcion").value = "";
            document.getElementById("cantidad").value = "";
            document.getElementById("precio").value = "";
            document.getElementById("valorTotal").value = "";
            codigo.classList.remove('is-valid');
            descripcion.classList.remove('is-valid');
            cantidad.classList.remove('is-valid');
            precio.classList.remove('is-valid');
        }
    });
}
window.onload = function () {
    buscarProductos();
};


// Funcion para eliminar un registro
window.eliminarRegistro = function (registroKey) {
    // Mostrar mensaje de confirmación antes de eliminar el registro

    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Desea eliminar el registro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, proceder con la acción de eliminar
            remove(ref(database, `Troya/${registroKey}`));

            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Registro eliminado!',
                showConfirmButton: false,
                timer: 1500
            });

            // Actualizar la tabla después de eliminar el registro
            buscarProductos();
        }
    });
}




window.modificarRegistro = function (registroKey) {
    // Obtener el registro actual
    const registro = get(ref(database, `Troya/${registroKey}`)).then((snapshot) => {
        const producto = snapshot.val();

        // Hacer una copia del producto antes de realizar cambios
        const productoOriginal = { ...producto };

        // Llenar los campos del formulario modal con los datos actuales
        document.getElementById("mcodigo").value = producto.id;
        document.getElementById("mdescripcion").value = producto.description;
        document.getElementById("mcantidad").value = producto.amount;
        document.getElementById("mprecio").value = producto.price;

        const valorTotal = producto.amount * producto.price;
        document.getElementById("mvalorTotal").value = valorTotal;

        // Mostrar mensaje informativo
        Swal.fire({
            icon: 'info',
            title: 'Modificación',
            text: 'Puede realizar los cambios en el formulario y guardar.',
            showConfirmButton: false,
            timer: 2500
        });

        // Mostrar el formulario modal
        const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();

        // Escuchar cambios en la cantidad y el precio para actualizar el valor total
        document.getElementById("mcantidad").addEventListener("input", actualizarValorTotal);
        document.getElementById("mprecio").addEventListener("input", actualizarValorTotal);

        function actualizarValorTotal() {
            const cantidad = parseFloat(document.getElementById("mcantidad").value);
            const precio = parseFloat(document.getElementById("mprecio").value);
            const nuevoValorTotal = isNaN(cantidad) || isNaN(precio) ? 0 : cantidad * precio;
            document.getElementById("mvalorTotal").value = nuevoValorTotal;
        }

        // Agregar lógica para actualizar la base de datos cuando se guarda
        document.getElementById("guardarCambiosBtn").addEventListener("click", function () {
            const codigoValue = document.getElementById("mcodigo").value;
            const descripcionValue = document.getElementById("mdescripcion").value;
            const cantidadValue = document.getElementById("mcantidad").value;
            const precioValue = document.getElementById("mprecio").value;
            const valorTotalValue = document.getElementById("mvalorTotal").value;

            // Muestra la alerta si la cantidad o el precio son negativos
            if (cantidadValue < 0 || precioValue < 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fallo en el registro',
                    text: 'La cantidad y el precio deben ser valores no negativos.',
                });
                return;
            }

            // Validar campos antes de actualizar
            if (codigoValue.trim() === '' || descripcionValue.trim() === '' || cantidadValue.trim() === '' || precioValue.trim() === '' || valorTotalValue.trim() === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Fallo en la actualización',
                    text: 'Por favor, llene todos los campos.',
                });
                return;
            }

            console.log("Antes de la actualización:", productoOriginal);

            // Actualizar en la base de datos
            update(ref(database, `Troya/${registroKey}`), {
                id: codigoValue,
                description: descripcionValue,
                amount: cantidadValue,
                price: precioValue,
                total_value: valorTotalValue
            }).then(() => {
                console.log("Después de la actualización:", {
                    id: codigoValue,
                    description: descripcionValue,
                    amount: cantidadValue,
                    price: precioValue,
                    total_value: valorTotalValue
                });
            });

            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Registro actualizado!',
                showConfirmButton: false,
                timer: 1500
            });

            // Cerrar el modal después de la actualización
            myModal.hide();
            setTimeout(function () {
                location.reload();
            }, 1500);       
        });
    });
}





