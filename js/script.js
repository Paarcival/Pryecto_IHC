const contenedorElementos = document.getElementById("contenedor");


const graficasContainer = document.createElement("div")
graficasContainer.classList.add("graficas-container")
graficasContainer.id = "graficas-container"




//===================boton1 Informacion jornadas ========================
document.addEventListener("DOMContentLoaded", function() {
  // Realizar solicitud Fetch para obtener el archivo JSON
  fetch('personas.json')
    .then(response => response.json())
    .then(data => {
      personasx = data.personas;
    })
    .catch(error => console.error('Error:', error));

  const boton1 = document.getElementById("boton1");
  let personasx = [];  
  boton1.addEventListener("click", function() {
    contenedorElementos.innerHTML = ""
    const formulario = `
      <form id="formulario">
        <label for="nombreJornada">Nombre de la jornada:</label>
        <input type="text" id="nombreJornada" name="nombreJornada" required><br><br>
        <label for="fechaJornada">Fecha de la jornada:</label>
        <input type="date" id="fechaJornada" name="fechaJornada" required><br><br>
        <input type="submit" value="Buscar">
      </form>
    `

    const container = document.createElement("div");
    container.innerHTML = formulario;
    contenedorElementos.appendChild(container);

    tablaJornadas()
    

    // Procesar el formulario cuando se envía
    const formularioElement = document.getElementById("formulario");
    formularioElement.addEventListener("submit", function(event) {
      event.preventDefault(); // Evitar que se recargue la página
      const nombreJornada = document.getElementById("nombreJornada").value;
      const fechaJornada = document.getElementById("fechaJornada").value;
      buscarPersona(nombreJornada, fechaJornada, personasx);
    });
  });
});

function buscarPersona(nombreJornada, fechaJornada, personasx) {
  let encontrado = false;
  let mujeres = 0;
  let hombres = 0;
  let sumaEdadMujeres = 0;
  let sumaEdadHombres = 0;
  let sumaEdadTotal = 0;
  let personasEcontradas = []

  for (const persona of personasx) {
    for (const jornada of persona.jornada) {
      const fechaJornadaJSON = jornada.fecha.slice(0, 10); // Eliminar la parte de la hora
      if (jornada.tipo.toLowerCase() === nombreJornada.toLowerCase() && fechaJornadaJSON === fechaJornada) {
        personasEcontradas.push(persona)
        encontrado = true;

        // Contar mujeres y hombres
        if (persona.sexo === 'F') {
          mujeres++;
          sumaEdadMujeres += persona.edad;
        } else if (persona.sexo === 'M') {
          hombres++;
          sumaEdadHombres += persona.edad;
        }
        sumaEdadTotal += persona.edad;

      }
    }
  }


  if (encontrado) {
    contenedorElementos.innerHTML = ''
    graficasContainer.innerHTML = ''
    manejoGrafica(hombres, mujeres, sumaEdadHombres, sumaEdadMujeres)
    cabeceraTabla()
    personasEcontradas.forEach(personita => {
      cargarPersonas(
        `${personita.cedula}`,
        `${personita.nombre}`,
        `${personita.apellido}`,
        `${personita.edad}`,
        `${personita.sexo}`,
        `${personita.telefono}`,
        `${personita.jornada[0].tipo}`,
        `${personita.importante}`,
        `${personita.observacion}`)
    });
  } else {
    contenedorElementos.innerHTML = ''
    alert('No se ha encontrado la jornada')
  }
}

function manejoGrafica(chombres, cmujeres, sEdadHombres, sEdadMujeres){
  crearGraficaCantidades(chombres, cmujeres);
  crearGraficaEdades(sEdadHombres/chombres, sEdadMujeres/cmujeres, (sEdadHombres+sEdadMujeres)/2);
}

// Crear gráfica de cantidades
function crearGraficaCantidades(cantidadHombres, cantidadMujeres) {
  const cantGraph = document.createElement("canvas")
  cantGraph.id = "graficaCantidades"
  cantGraph.classList.add("grafica")
  cantGraph.getContext('2d');

  new Chart(cantGraph, {
    type: 'pie',
    data: {
      labels: ['Cantidad de hombres', 'Cantidad de mujeres'],
      datasets: [{
        data: [cantidadHombres, cantidadMujeres],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  });
  graficasContainer.appendChild(cantGraph)
  contenedorElementos.appendChild(graficasContainer)
}

// Crear gráfica de edades
function crearGraficaEdades(promedioEdadHombres, promedioEdadMujeres, promedioEdadAmbos) {
  const edadGraph = document.createElement("canvas")
  edadGraph.id = "graficaEdades"
  edadGraph.classList.add("grafica")
  edadGraph.getContext('2d');

  new Chart(edadGraph, {
    type: 'pie',
    data: {
      labels: ['Promedio de edad hombres', 'Promedio de edad mujeres', 'Promedio de edad ambos'],
      datasets: [{
        data: [promedioEdadHombres, promedioEdadMujeres, promedioEdadAmbos],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 205, 86, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  });
  graficasContainer.appendChild(edadGraph)
  contenedorElementos.appendChild(graficasContainer)
}

//=========================================

// ==========Inicializar arreglo bidimensional que se utliza en boton2 para nombre de la Jornada y facilitador se usará luego por eso se declara afuera

let datosJornada = JSON.parse(localStorage.getItem('datosJornada')) || [];

//================bton 2 agregar jornada===========
const boton2 = document.getElementById('boton2');

boton2.addEventListener("click", function() {
  contenedorElementos.innerHTML = ""

  // Crear contenedor para los botones
  const botonContainer = document.createElement("div");
  botonContainer.classList.add("botonContainer")

  // Crear botón Agregar
  const botonAgregar = document.createElement("button");
  botonAgregar.classList.add("boton1")
  botonAgregar.textContent = "Agregar";
  botonContainer.appendChild(botonAgregar);

  // Crear botón Eliminar
  const botonEliminar = document.createElement("button");
  botonEliminar.classList.add("boton1")
  botonEliminar.style.backgroundColor = "red"
  botonEliminar.textContent = "Eliminar";
  botonContainer.appendChild(botonEliminar);

  contenedorElementos.appendChild(botonContainer);

  tablaJornadas()

  // Agregar evento click al botón Agregar
  botonAgregar.addEventListener("click", function() {
    contenedorElementos.innerHTML = ""
    // Crear el contenedor div
    const formularioContainer = document.createElement("div");
    formularioContainer.id = "formulario-container";

    const formulario = `
      <form id="formulario">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required><br><br>
        <label for="facilitador">Facilitador:</label>
        <input type="text" id="facilitador" name="facilitador" required><br><br>
        <button type="submit" class="boton1">Enviar</button>
      </form>
    `;
    formularioContainer.innerHTML = formulario;
    contenedorElementos.appendChild(formularioContainer);

    tablaJornadas()
        

    // Agregar evento submit al formulario
    document.getElementById("formulario").addEventListener("submit", function(event) {
      event.preventDefault(); // Evitar que se recargue la página
    
      // Obtener los valores de los inputs
      const nombre = document.getElementById("nombre").value;
      const facilitador = document.getElementById("facilitador").value;
    
      // Agregar fila al arreglo bidimensional
      datosJornada.push({ nombre, facilitador });
    
      // Almacenar el arreglo datosJornada en localStorage
      localStorage.setItem('datosJornada', JSON.stringify(datosJornada));
    
      // Mostrar el arreglo en la consola
      console.log(datosJornada);
    
      // Mostrar mensaje de éxito
      const mensajeExito = document.createElement("div");
      mensajeExito.classList.add("mensajeExito")
      mensajeExito.innerHTML = "Jornada agregada con éxito!";
      document.getElementById("formulario-container").appendChild(mensajeExito);

      setTimeout(() => {
        document.getElementById("formulario-container").removeChild(mensajeExito);
      }, 2000);
    
      // Resetear el formulario
      document.getElementById("formulario").reset();
      contenedorElementos.removeChild(document.getElementById("tabla-jornadas"))
      tablaJornadas()

      
    });
  });

  // Agregar evento click al botón Eliminar
  botonEliminar.addEventListener("click", function() {
    contenedorElementos.innerHTML = ""
    // Crear el contenedor div
    const formularioContainer = document.createElement("div");
    formularioContainer.id = "formulario-container-eliminar";
    contenedorElementos.appendChild(formularioContainer);

    const formularioEliminar = `
      <form id="formulario-eliminar">
        <label for="nombre-eliminar">Nombre:</label>
        <input type="text" id="nombre-eliminar" name="nombre-eliminar" required><br><br>
        <button type="submit" class="boton1">Eliminar</button>
      </form>
    `;
    formularioContainer.innerHTML = formularioEliminar;

    tablaJornadas()
    

    // Agregar evento submit al formulario de eliminación
    document.getElementById("formulario-eliminar").addEventListener("submit", function(event) {
      event.preventDefault(); // Evitar que se recargue la página

      // Obtener el valor del input de eliminación
      const nombreEliminar = document.getElementById("nombre-eliminar").value;

      // Encontrar el índice del elemento que se quiere eliminar
      const indiceEliminar = datosJornada.findIndex(elemento => elemento.nombre === nombreEliminar);

      // Eliminar el elemento del arreglo
      if (indiceEliminar !== -1) {
        datosJornada.splice(indiceEliminar, 1);
        const mensajeExito = document.createElement("div");
        mensajeExito.classList.add("mensajeExito")
        mensajeExito.innerHTML = "Jornada eliminada con éxito!";
        document.getElementById("formulario-container-eliminar").appendChild(mensajeExito);

        setTimeout(() => {
          document.getElementById("formulario-container-eliminar").removeChild(mensajeExito);
        }, 2000);
    
        // Resetear el formulario
        document.getElementById("formulario-eliminar").reset();

        contenedorElementos.removeChild(document.getElementById("tabla-jornadas"))
        tablaJornadas()

      } else {
        alert('No se ha encontrado la jornada')
      }

      // Actualizar el arreglo en localStorage
      localStorage.setItem('datosJornada', JSON.stringify(datosJornada));

    });
  });
  
});
//============================


function tablaJornadas() {
  const container = document.createElement("div");
  container.className = "container";
  container.id = ("tabla-jornadas")

  const row = document.createElement("div");
  row.className = "row mt-3";
  container.appendChild(row);

  const col = document.createElement("div");
  col.className = "col";
  row.appendChild(col);

  const h2 = document.createElement("h2");
  h2.textContent = "Listado de jornadas activas";
  col.appendChild(h2);

  const tableContainer = document.createElement("div");
  tableContainer.className = "my-3";
  col.appendChild(tableContainer);

  const table = document.createElement("table");
  table.className = "table";
  table.id = "lista-jornadas";
  tableContainer.appendChild(table);

  const thead = document.createElement("thead");
  table.appendChild(thead);

  const trHead = document.createElement("tr");
  thead.appendChild(trHead);

  const thNombre = document.createElement("th");
  thNombre.scope = "col";
  thNombre.textContent = "Nombre";
  trHead.appendChild(thNombre);

  const thFacilitador = document.createElement("th");
  thFacilitador.scope = "col";
  thFacilitador.textContent = "Facilitador";
  trHead.appendChild(thFacilitador);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  datosJornada.forEach(jornada => {
    const trFila = document.createElement("tr");
    tbody.appendChild(trFila);

    const tdNombre = document.createElement("td");
    tdNombre.textContent = jornada.nombre;
    trFila.appendChild(tdNombre);

    const tdFacilitador = document.createElement("td");
    tdFacilitador.textContent = jornada.facilitador;
    trFila.appendChild(tdFacilitador);
  });

  contenedorElementos.appendChild(container);
}


let person = [];

//===============//boton 3 =======================================


document.getElementById('boton3').addEventListener('click', function() {
  contenedorElementos.innerHTML = ""
  const formulario = document.createElement("div")
  formulario.id = "formulario"
  // Crear la pregunta y los botones
  var pregunta = document.createElement('p');
  pregunta.textContent = '¿Desea buscar con cédula?';
  pregunta.classList.add("centrado"); // agregar clase CSS para centrar

  fetch('personas.json')
    .then(res => res.json())
    .then(data => {
      person = data.personas;
    })

  var botonSi = document.createElement('button');
  botonSi.textContent = 'Sí';
  botonSi.id = 'botonSi';
  botonSi.classList.add("boton1", "centrado1"); // agregar clase CSS para centrar
  botonSi.style.backgroundColor = "#4CAF50"
  botonSi.addEventListener('click', function() {
    crearFormularioCedula();
  });

  var botonNo = document.createElement('button');
  botonNo.textContent = 'No';
  botonNo.id = 'botonNo';
  botonNo.classList.add("boton1", "centrado1"); // agregar clase CSS para centrar
  botonNo.style.backgroundColor = "red"
  botonNo.addEventListener('click', function() {
    crearFormularioNombreEdadYmas();
  });
  const contBotones = document.createElement("div")
  contBotones.classList.add("centrado")
  contBotones.append(botonSi, botonNo)

  contenedorElementos.append(pregunta, contBotones)
});

function crearFormularioCedula() {
  contenedorElementos.innerHTML = ""
  var formulario = document.createElement('form');
  formulario.id = 'form-cedula'
  formulario.innerHTML = `
    <label>Cédula:</label>
    <input type="text" id="cedula" name="cedula">
    <br>
    <br>
    <button type="submit" class="boton1">Buscar</button>
  `;
  formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    var cedulaInput = document.getElementById('cedula');
    var cedula = cedulaInput.value.trim();
    buscarPersonaPorCedula(cedula);
    formulario.reset()
  });
  contenedorElementos.appendChild(formulario);
}

function buscarPersonaPorCedula(cedula) {
  let encontrada = false
  for (const pers of person) {
    if (pers.cedula === cedula) {
      contenedorElementos.innerHTML = ''
      cabeceraTabla()
      cargarPersonas(
        `${pers.cedula}`,
        `${pers.nombre}`,
        `${pers.apellido}`,
        `${pers.edad}`,
        `${pers.sexo}`,
        `${pers.telefono}`,
        `${pers.jornada[0].tipo}`,
        `${pers.importante}`,
        `${pers.observacion}`)
        encontrada = true
    } 
  }
  if (!encontrada){
    const mensajeError = document.createElement("div");
    mensajeError.classList.add("mensajeError")
    mensajeError.innerHTML = "No se ha conseguido a la persona";
    contenedorElementos.appendChild(mensajeError)

    setTimeout(() => {
      contenedorElementos.removeChild(mensajeError);
    }, 2000);
  }
}

function crearFormularioNombreEdadYmas() {
  contenedorElementos.innerHTML = ""
  var formulario = document.createElement('form');
  formulario.id = 'form-datos'
  formulario.innerHTML = `
    <label>Nombre:</label>
    <input type="text" id="nombre" name="nombre">
    <br>
    <label>Edad: (puede ser una aproximacion)</label>
    <input type="number" id="edad" name="edad">
    <br>
    <label>Descripción (ej: franela azul, lentes, dolor de cuello, fractura, entre otros)</label>
    <input type="text" id="descripcion" name="descripcion">
    <br>
    <br>
    <button type="submit" class="boton1">Buscar</button>
  `;
  formulario.addEventListener('submit', function buscarPersonas(event){
    event.preventDefault(); // evita que se recargue la página
    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const descripcion = document.getElementById('descripcion').value;
    formulario.reset()
    let encontrada = false
    contenedorElementos.innerHTML = ''
    cabeceraTabla()


    for (const per of person) {
      let condicion = true;
  
      if (nombre !== '') {
        condicion = condicion && per.nombre.toLowerCase().includes(nombre.toLowerCase());
      }
  
      if (edad !== '') {
        condicion = condicion && (per.edad > parseInt(edad) - 8 && per.edad < parseInt(edad) + 7);
      }
  
      if (descripcion !== '') {
        condicion = condicion && per.observacion.toLowerCase().includes(descripcion.toLowerCase());
      }
  
      if (condicion) {
        cargarPersonas(
          `${per.cedula}`,
          `${per.nombre}`,
          `${per.apellido}`,
          `${per.edad}`,
          `${per.sexo}`,
          `${per.telefono}`,
          `${per.jornada[0].tipo}`,
          `${per.importante}`,
          `${per.observacion}`)
        encontrada = true
      } 
    }

    if (!encontrada){
      contenedorElementos.innerHTML = ''
      alert('No se ha encontrado la persona')
    }

  });
  contenedorElementos.appendChild(formulario);
}

//================boton 4===================

let personas = JSON.parse(localStorage.getItem('personas')) || []
let selectedJornada = { nombre: '', facilitador: '' };

// Obtener referencia al botón y al contenedor del formulario
const createFormButton = document.getElementById('boton4');

// Manejar el evento de clic del botón para crear el formulario
createFormButton.addEventListener('click', () => {
  contenedorElementos.innerHTML = ""
  const formContainer = document.createElement("div")
  formContainer.innerHTML = `
      <form id="userForm">
  <div class="row">
    <div class="col-md-4">
      <label for="cedula">Cédula:</label>
      <input type="number" id="cedula" name="cedula" min="0"required>
    </div>
    <div class="col-md-4">
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" name="nombre" required>
    </div>
    <div class="col-md-4">
      <label for="apellido">Apellido:</label>
      <input type="text" id="apellido" name="apellido" required>
    </div>
  </div>
  
  <div class="row">
    <div class="col-md-4">
      <label for="edad">Edad:</label>
      <input type="number" id="edad" name="edad" min="0"required>
    </div>
    <div class="col-md-4">
      <label for="telefono">Contacto:</label>
      <input type="text" id="telefono" name="telefono" required>
    </div>
    <div class="col-md-4">
      <label for="observacion">Observación:</label>
      <input type="text" id="observacion" name="observacion">
    </div>
  </div>
  
  <div class="row">
    <div class="col-md-4">
      <label for="sexo">Sexo:</label>
      <select id="sexo" name="sexo" class="select-style" required>
      <option value="">Seleccionar</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>
    </div>
    <div class="col-md-4">
      <label for="jornada">Jornada:</label>
      <select id="jornada" name="jornada" class="select-style" required>
        <option value="">Seleccionar</option>
        ${datosJornada.map(({ nombre, facilitador }) => `
          <option value="${nombre}">${nombre}</option>
        `).join('')}
      </select>
    </div>
    <div class="col-md-4">
      <label for="importante">Importante:</label>
      <select id="importante" name="importante" class="select-style" required>
        <option value="No">No</option>
        <option value="Si">Si</option>
      </select>
    </div>
  </div>
  <br>
  <button type="submit" class="boton1">Enviar</button>
  <button id="update-json" class="boton" style="width: 120px;">Efectuar</button>
  <p>**Primero se deben enviar todas las personas y luego efectuar**</p>
</form>
    `
  contenedorElementos.appendChild(formContainer)
    // Obtener referencia al formulario
    const userForm = document.getElementById('userForm');

    // Manejar el evento de envío del formulario
    userForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario

        // Obtener valores de los campos del formulario
        const cedula = document.getElementById('cedula').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const edad = document.getElementById('edad').value;
        const telefono = document.getElementById('telefono').value;
        const observacion = document.getElementById('observacion').value;
        const sexo = document.getElementById('sexo').value;
        const importante = document.getElementById('importante').value;
        const jornada = document.getElementById('jornada').value;

        // Crear un objeto con los datos del usuario
        const usuario = {
          cedula: cedula,
          nombre: nombre,
          apellido: apellido,
          edad: parseInt(edad),
          telefono: telefono,
          observacion: observacion,
          sexo: sexo,
          importante: importante,
          jornada: [{
            fecha: new Date(),
            facilitador: datosJornada.find(j => j.nombre === jornada).facilitador,
            tipo: jornada
          }]
        };

        // Agregar el nuevo objeto al arreglo en JavaScript
        personas.push(usuario);

        localStorage.setItem('personas', JSON.stringify(personas))

        // Limpiar los campos del formulario
        userForm.reset();

        const mensajeExito = document.createElement("div");
        mensajeExito.classList.add("mensajeExito")
        mensajeExito.innerHTML = "Jornada agregada con éxito!";
        document.getElementById("userForm").appendChild(mensajeExito);

        setTimeout(() => {
          document.getElementById("userForm").removeChild(mensajeExito);
        }, 2000);

    });
    document.getElementById('update-json').addEventListener('click', async () => {
      try {
        if (personas.length === 0){
          alert('No se han enviado personas')
        } else {
          // Solicita al usuario que elija un archivo JSON
          const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'Archivos JSON',
                accept: { 'application/json': ['.json'] }
            }],
            multiple: false
          });
          localStorage.removeItem('personas')
          // Solicita permisos de escritura
          const writable = await fileHandle.createWritable();

          // Lee el contenido del archivo
          const file = await fileHandle.getFile();
          const content = await file.text();
          const data = JSON.parse(content);

          // Agrega los nuevos datos al final del arreglo "personas"
          data.personas.push(...personas);

          // Convierte el objeto JSON a string con JSON.stringify()
          const jsonString = JSON.stringify(data, null, 2);

          // Escribe el contenido modificado en el archivo
          await writable.write(jsonString);

          // Finaliza y cierra el archivo
          await writable.close();

          alert('El archivo JSON ha sido actualizado correctamente.');
        } 
      } catch (error) {
          console.error('Error al actualizar el archivo JSON:', error);
          alert('Hubo un error al actualizar el archivo JSON. Revisa la consola para más detalles.');
      }
  
      // Limpiar el arreglo de personas después de actualizar el JSON
      personas = [];
  });
});

//=========================================== (Boton 5 Personas Importantes)==================================================================
//=======================================================================================================
const boton5 = document.getElementById('boton5');
boton5.addEventListener('click', async () => {
  contenedorElementos.innerHTML = ""
  try {
    const response = await fetch('personas.json');
    const data = await response.json();
    const importantes = data.personas.filter(persona => persona.importante === 'Si');
    
    // Llamada a cabeceraTabla
    cabeceraTabla();
    
    importantes.forEach(persona => {
      // Llamada a cargarPersonas con los datos correspondientes
      cargarPersonas(
        persona.cedula,
        persona.nombre,
        persona.apellido,
        persona.edad,
        persona.sexo,
        persona.telefono,
        persona.jornada[0].tipo,
        persona.importante,
        persona.observacion
      );
    });
  } catch (error) {
    console.error(error);
  }
});


  //==================Funcion crear cabecera tabla=======================

function cabeceraTabla(){  
  const prueba = document.createElement("div")
  prueba.innerHTML = `
    <div class="container">
      <div class="row mt-3">
        <div class="col">
          <h2>Listado de personas</h2>
          <div class="my-3">
            <table class="table" id="lista-personas">
              <thead>
                <tr>
                <th scope="col">Cedula</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Edad</th>
                <th scope="col">Sexo</th>
                <th scope="col">Contacto</th>
                <th scope="col">Jornada</th>
                <th scope="col">Importante</th>
                <th scope="col">Observacion</th>
              </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
  contenedorElementos.appendChild(prueba)
}

//==============Cargar personas en la tabla==================
function cargarPersonas(cedula,nombre,apellido,edad,sexo,telefono,jornada,importante,observacion){
  const tabla = document.querySelector('#lista-personas > tbody')
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${cedula}</td>
      <td>${nombre}</td>
      <td>${apellido}</td>
      <td>${edad}</td>
      <td>${sexo}</td>
      <td>${telefono}</td>
      <td>${jornada}</td>
      <td>${importante}</td>
      <td>${observacion}</td>
      `
    tabla.appendChild(row)
}