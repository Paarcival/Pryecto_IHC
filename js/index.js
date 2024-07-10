document.addEventListener('DOMContentLoaded', function() {
    // Variables comunes
    const btnAgregarClase = document.getElementById('btn-agregar-clase');
    const btnAgregarCita = document.getElementById('btn-agregar-cita');
    const formClase = document.getElementById('form-clase');
    const formCita = document.getElementById('form-cita');

    // Mostrar formulario para agregar clase
    if (btnAgregarClase && formClase) {
        btnAgregarClase.addEventListener('click', function() {
            formClase.style.display = 'block';
            clearForm(formClase);
        });
    }

    // Mostrar formulario para agregar cita
    if (btnAgregarCita && formCita) {
        btnAgregarCita.addEventListener('click', function() {
            formCita.style.display = 'block';
            clearForm(formCita);
        });
    }

    // Función para limpiar formulario
    function clearForm(form) {
        if (form && typeof form.reset === 'function') {
            form.reset(); // Resetea el formulario si es un formulario válido
            form.querySelector('input[type="hidden"]').value = ''; // Limpia el campo oculto de ID
        }
    }

    // Cancelar agregar/modificar clase
    const btnCancelarClase = document.getElementById('btn-cancelar-clase');
    if (btnCancelarClase && formClase) {
        btnCancelarClase.addEventListener('click', function() {
            formClase.style.display = 'none';
        });
    }

    // Cancelar agregar/modificar cita
    const btnCancelarCita = document.getElementById('btn-cancelar-cita');
    if (btnCancelarCita && formCita) {
        btnCancelarCita.addEventListener('click', function() {
            formCita.style.display = 'none';
        });
    }

    // Simulación de edición de elemento
    function setupEditHandler(listaElementos, formElement, btnCancel) {
        if (listaElementos) {
            listaElementos.addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    const nombreElemento = e.target.textContent.trim();
                    const elementoId = e.target.dataset.id; // Obtener ID del elemento (en atributo data-id)
                    const inputs = formElement.querySelectorAll('input:not([type="hidden"]), textarea');

                    // Llenar formulario con datos del elemento seleccionado
                    if (inputs[0]) {
                        inputs[0].value = nombreElemento;
                    }
                    if (formElement.querySelector('input[type="hidden"]')) {
                        formElement.querySelector('input[type="hidden"]').value = elementoId || '';
                    }
                    formElement.style.display = 'block';

                    // Listener para cancelar
                    if (btnCancel) {
                        btnCancel.addEventListener('click', function() {
                            formElement.style.display = 'none';
                        });
                    }
                }
            });
        }
    }

    // Configuración de edición para clases
    const listaClases = document.getElementById('lista-clases');
    setupEditHandler(listaClases, formClase, btnCancelarClase);

    // Configuración de edición para citas
    const listaCitas = document.getElementById('lista-citas');
    setupEditHandler(listaCitas, formCita, btnCancelarCita);

    // Funciones adicionales para guardar y eliminar datos
    // Aquí deberías agregar funciones para manejar la lógica de guardar y eliminar clases y citas

});
