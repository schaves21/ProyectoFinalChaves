// ******************************************************************************* //
// *** APLICACION WEB PARA ALQUILER DE OFICINAS \ SALAS \ CASAS \ HABITACIONES *** //
// ******************************************************************************* //

// al recargar la pagina pregunto al localStorage: si tiene datos los muestro en pantalla
// si no, creo nuevos objetos de Propiedad y Alquiler vacios
unaPropiedad = new Propiedad(JSON.parse(localStorage.getItem("Propiedades")) || []); 
unAlquiler = new Alquiler(JSON.parse(localStorage.getItem("Alquileres")) || []);

// guardo en una variable el div contenedor padre del html
let divContenedorPadre = document.getElementById("contenedorPadre");
// guardo en una variable el section html de Propiedades
let sectionPropiedades = document.getElementById("sectionPropiedades");

// defino variables
let lon;
let lat;
const kelvin = 273.15;

// creo una variable DateTime
const luxonDateTime = luxon.DateTime;

// creo la funcion init para iniciar la aplicacion
function init()
{
    // llamo a funciones que dan formato general y contenido al html
    mostrarPromo();
    crearContenedorPadre();
    obtenerAPIClima();
    crearCabecera();
    obtenerRuta();
    mostrarPropiedades();
    crearFooter();
}

// creo la funcion mostrarPromo que muestra una ventana mediante la libreria SweetAlert
function mostrarPromo()
{
    Swal.fire({
        title: `Aprovechá esta Oferta !!!`, 
        text: 'Consulte por nuestro servicio de arrendamiento, ahorrándote un 20% del precio original. Complete el formulario y con gusto le responderemos !',
        width: "600px",
        imageUrl: './img/Promo.jpg',
        imageWidth: '500px',
        imageHeight: '250px',
        background: "#3584A7",
        color: "white",
        showCloseButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#29323c'
    });
}

// creo la funcion crearContenedorPadre de todo el contenido de la pagina 
function crearContenedorPadre()
{
    // creo el elemento div contenedor de toda la pagina
    divContenedorPadre = document.createElement("div");
    divContenedorPadre.setAttribute("id", "contenedorPadre");
    // agrego el contenedor al documento
    document.body.appendChild(divContenedorPadre);
}

// creo la funcion obtenerAPIClima que conecta con la API OpenWeather  
// para mostrar el clima a partir de la ubicacion del usuario
function obtenerAPIClima()
{
    // si el objeto existe
    if (navigator.geolocation)
    {
        // obtengo la posicion del dispositivo
        navigator.geolocation.getCurrentPosition((position) => {

            // obtengo en variables la longitud y latitud
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            // guardo en una constante la llave de la API
            const api = "3fdc124ce4e136ce573b0961510dd0a6";

            // guardo en una constante la url de la API con sus parametros dinamicos
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
            `lon=${lon}&appid=${api}`;

            // realizo la peticion a la url mediante el metodo fetch
            fetch(url)
            .then((response) =>{
                // devuleve los datos con el metodo json
                return response.json();
            })
            .then((data) => {
                // llamo a la funcion que muestra los valores del clima
                mostrarClima(data);
            })
        })
    }
}

// creo la funcion mostrarClima que muestra el estado del clima
function mostrarClima(data)
{
    // obtengo y creo los elementos html donde se mostrara la info del clima
    let sectionClima = document.getElementById("sectionClima");

    sectionClima = document.createElement("section");
    sectionClima.setAttribute("id", "sectionClima");

    // agrego el nodo hijo al padre
    divContenedorPadre.appendChild(sectionClima);

    let nodoTemp = document.getElementById("temperatura");
    
    nodoTemp = document.createElement("div");
    nodoTemp.setAttribute("id", "temperatura");

    // muestro temperatura convirtiendo el dato de la API en °C 
    nodoTemp.textContent = Math.floor(data.main.temp - kelvin) + "°C"

    // agrego el nodo hijo al padre
    sectionClima.appendChild(nodoTemp);

    let nodoResumen = document.getElementById("resumen");

    nodoResumen = document.createElement("div");
    nodoResumen.setAttribute("id", "resumen");

    let iconoClima = document.getElementById("iconoClima");
    iconoClima = document.createElement("img"); 
    iconoClima.setAttribute("id", "iconoClima");

    // de acuerdo al valor de la propiedad main del array, muestro el icono del tiempo
    // que corresponde al estado del clima
    switch (data.weather[0].main) {
        case 'Thunderstorm':
            //nodoResumen.textContent = data.weather[0].description;
            nodoResumen.textContent = 'Tormenta' 
            iconoClima.src='./img/thunder.svg'
            break;
        case 'Drizzle':
            nodoResumen.textContent = 'Llovizna' 
            iconoClima.src='./img/rainy-2.svg'
            break;
        case 'Rain':
            nodoResumen.textContent = 'Lluvia' 
            iconoClima.src='./img/rainy-7.svg'
            break;
        case 'Snow':
            nodoResumen.textContent = 'Nieve' 
            iconoClima.src='./img/snowy-6.svg'
            break;                        
        case 'Clear':
            nodoResumen.textContent = 'Despejado' 
            iconoClima.src='./img/day.svg'
            break;
        case 'Atmosphere':
            nodoResumen.textContent = 'Atmosfera'
            iconoClima.src='./img/weather.svg'
            break;  
        case 'Clouds':
            nodoResumen.textContent = 'Nubes'
            iconoClima.src='./img/cloudy-day-1.svg'
            break;  
        default:
            nodoResumen.textContent = 'Despejado'
            iconoClima.src='./img/day.svg'
    }

    // agrego el nodo hijo al padre  
    sectionClima.appendChild(nodoResumen);
    nodoResumen.appendChild(iconoClima);

    let nodoUbicacion = document.getElementById("ubicacion");

    nodoUbicacion = document.createElement("div");
    nodoUbicacion.setAttribute("id", "ubicacion");
    
    // muestro la ubicacion de los datos de la API
    nodoUbicacion.textContent = data.name + ", " + data.sys.country;

    // agrego el nodo hijo al padre
    sectionClima.appendChild(nodoUbicacion);
}

// creo la funcion crearCabecera para mostrar los titulos H1 y H2
function crearCabecera()
{
    // capturo y creo los elementos section, div, h1 y h2 donde se mostrara
    // la informacion de los titulos de la aplicacion
    let sectionCabecera = document.getElementById("sectionCabecera");

    sectionCabecera = document.createElement("section");
    sectionCabecera.setAttribute("id", "sectionCabecera");

    // agrego el nodo hijo al padre
    divContenedorPadre.appendChild(sectionCabecera);
  
    let nodoCabecera = document.getElementById("titulos");

    nodoCabecera = document.createElement("div");
    nodoCabecera.setAttribute("id", "titulos");

    // agrego el nodo hijo al padre
    sectionCabecera.appendChild(nodoCabecera);

    let h1 = document.getElementById("h1");
    let h2 = document.getElementById("h2");

    h1 = document.createElement("h1");
    h1.setAttribute("id", "h1");
    h2 = document.createElement("h2");
    h2.setAttribute("id", "h2");
    
    h1.innerHTML = "ALQUILER DE OFICINAS - SALA DE REUNIONES - CASAS - HABITACIONES";
    h2.innerHTML = "EL MEJOR SITIO DE ALQUILER DE SERVICIOS";

    // agrego el nodo hijo al padre
    nodoCabecera.appendChild(h1);
    nodoCabecera.appendChild(h2);
}

// creo la funcion obtenerRuta para capturar los datos del JSON 
function obtenerRuta()
{
    // capturo la ruta del JSON
    let ruta = './data/tipoPropiedad.json'

    // realizo la peticion al archivo json mediante el metodo fetch
    fetch(ruta)
        .then((r)=>r.json())
        .then((data)=>{
            // llamo a la funcion y le paso la data
            mostrarTipoPropiedades(data);
        });
}

// creo la funcion mostrarTipoPropiedades para recorrer los Tipos de Propiedad
// mostrando los resultados en botones
function mostrarTipoPropiedades(data)
{
    // capturo y creo los elementos del html
    let nodoBotones = document.getElementById("botones");

    nodoBotones = document.createElement("div");
    nodoBotones.setAttribute("id", "botones");
    sectionCabecera.appendChild(nodoBotones);

    // recorro el JSON de Tipo de Propiedades
    data.forEach((tipoP)=>{
        // defino las variables y voy creando los botones
        const divBotones = document.getElementById("botones");
        const botones = document.createElement("button");
        botones.setAttribute("id", "botonTipoPropiedad");
        // aplico el operador ? al objeto para evitar caida del sistema
        botones.innerHTML = tipoP?.nombre;
        divBotones.appendChild(botones);
        // agrego un escuchador de eventos al evento click
        // (llamando a la fucnion mostrarPropiedadesPorTipo)
        botones.addEventListener("click", ()=>mostrarPropiedadesPorTipo(tipoP));
    })
}

// creo la funcion mostrarPropiedades para listar todas las Propiedades
function mostrarPropiedades()
{ 
    // creo el nodo section de propiedades aplicando el operador ternario AND
    sectionPropiedades===null && (
        sectionPropiedades = document.createElement("section"), 
        sectionPropiedades.setAttribute("id", "sectionPropiedades"), 
        divContenedorPadre.appendChild(sectionPropiedades)
    );

    // obtengo en la variable el elemento html
    let nodoPropiedades = document.getElementById("propiedades");

    // creo el nodo de propiedades aplicando el operador ternario condicional
    nodoPropiedades===null ? (
        nodoPropiedades = document.createElement("div"),
        nodoPropiedades.setAttribute("id", "propiedades"),
        sectionPropiedades.appendChild(nodoPropiedades)
    ) : (
        nodoPropiedades.innerHTML=""
    );
 
    // ordena los precios de propiedades de menor a mayor
    propiedades.sort((a,b)=>a.precioFinal-b.precioFinal);
    
    let cadena ='';
    // recorro las propiedades y llamo a la funcion obtenerPropiedades
    // para listar en pantalla 
    propiedades.forEach((propiedad)=>{
        // voy acumulando la cadena con el operador +=
        cadena+=obtenerPropiedades(propiedad);
        nodoPropiedades.innerHTML=cadena;
    });  
}

// creo la funcion obtenerPropiedades recibiendo como parametro el objeto
// propiedad
function obtenerPropiedades(propiedad)
{
    // devuelvo en los elementos html los datos de las propiedades
    // haciendo uso del operdor ? sobre el objeto evitando caidas del programa
    return `<div class="listarPropiedades">  
                <div class="imgListarPropiedades">
                    <img src="${propiedad?.imagen}">
                </div>     
                <div class="listarPropiedadInfo">
                    Descripción: ${propiedad?.descripcion}<br><br>
                    Ciudad: ${propiedad?.ciudad}<br><br>
                    Precio: $ ${propiedad?.precioFinal}<br><br>
                    Descuento: ${propiedad?.descuento} %
                </div>  
            </div>`
}

// creo la funcion crearFooter para mostrar el conetenido del pie de pagina
function crearFooter()
{
    // capturo y creo los elementos section, div y h3 del footer
    let footer = document.getElementById("footer");
    footer = document.createElement("section");
    footer.setAttribute("id", "footer");

    // agrego el nodo hijo al padre
    divContenedorPadre.appendChild(footer);  
    
    let nodoFooter = document.getElementById("informacion");

    nodoFooter = document.createElement("div");
    nodoFooter.setAttribute("id", "informacion");

    // agrego el nodo hijo al padre
    footer.appendChild(nodoFooter);

    let h3 = document.getElementById("h3");
    h3 = document.createElement("h3");
    h3.setAttribute("id", "h3");
    h3.innerHTML = "Creado por Santiago Chaves - ASC";

    // agrego el nodo hijo al padre
    nodoFooter.appendChild(h3);

    let nodoRedes = document.getElementById("redes");
    nodoRedes = document.createElement("div");
    nodoRedes.innerHTML = 
        `<div class="redesSociales">
            <a href="#" class="iconoRedes">
                <i class='bx bxl-facebook'></i>
            </a>
            <a href="#" class="iconoRedes">
                <i class='bx bxl-twitter' ></i>
            </a>
            <a href="#" class="iconoRedes">
                <i class='bx bxl-instagram' ></i>
            </a>
        </div>`

    nodoRedes.setAttribute("id", "redes");

    // agrego el nodo hijo al padre 
    footer.appendChild(nodoRedes);
}

// creo la funcion mostrarPropiedadesPorTipo que recibe por parametro 
// un objeto con los Tipos de Propiedad
function mostrarPropiedadesPorTipo(tipoP)
{
    // al dar clic en un boton de Tipo Propiedad oculto el section de todas las propiedades
    document.getElementById("propiedades").style.display = 'none';

    // guardo en una variable las Propiedades filtradas mediante la funcion filtrarPropiedades 
    // aplicando el operador ? para evitar que el programa no se interrumpa
    const propiedadesFiltradas = filtrarPropieades(tipoP?.id);
    
    let nodoPropPorTipo = document.getElementById("propPorTipo");

    // creo el nodo de propiedades por tipo aplicando el operador ternario condicional
    nodoPropPorTipo===null ? (
        nodoPropPorTipo = document.createElement("div"),
        nodoPropPorTipo.setAttribute("id", "propPorTipo"),
        sectionPropiedades.appendChild(nodoPropPorTipo)
    ) : (
        nodoPropPorTipo.innerHTML=""
    );
    
    let cadena ='';
    // recorro las propiedades filtrados por Tipo y llamo a la funcion obtenerPropiedadesPorTipo
    // para mostrar en pantalla el filtro aplicado
    propiedadesFiltradas.forEach((propiedad)=>{
        // voy acumulando la cadena con el operador +=
        cadena+=obtenerPropiedadesPorTipo(propiedad);
        nodoPropPorTipo.innerHTML=cadena;
    });

    // llamo a la funcion mostrarPropiedadesEnAlquiler
    mostrarPropiedadesEnAlquiler();
}

// creo la funcion filtrarPropieades recibiendo como parametro el id de tipoPropiedad
function filtrarPropieades(idTipoPropiedad)
{
    // retorno los resultados mediante el metodo filter aplicando el operador
    // ? sobre el objeto para evitar que el programa no se interrumpa
    return propiedades?.filter(propiedad=>propiedad?.idTipoPropiedad===idTipoPropiedad);
}

// creo la funcion obtenerPropiedadesPorTipo recibiendo como parametro el objeto propiedad
function obtenerPropiedadesPorTipo(propiedad)
{
    // devuelvo en los elementos html los datos de las propiedades
    // haciendo uso del operdor ? sobre el objeto evitando caidas del programa
    return `<div class="propiedadPorTipo">  
                <div class="imgPropiedad">
                    <img src="${propiedad?.imagen}">
                </div>     
                <div class="propiedadInfo">
                    Descripción: ${propiedad?.descripcion}<br><br>
                    Ciudad: ${propiedad?.ciudad}<br><br>
                    Precio: $ ${propiedad?.precioFinal}<br><br>
                    Descuento: ${propiedad?.descuento} % <br><br>
                </div>  
                <div class="propiedadBtn">
                    ${obtenerEstadoBoton(propiedad)}
                </div>
            </div>`
}

// creo la funcion obtenerEstadoBoton y pregunto por el estado 
// de la propiedad: si esta disponible o no 
function obtenerEstadoBoton(propiedad)
{
    if(propiedad.disponible)
    {
        // retorna el boton de color verde (disponible) aplicando el operador ? sobre el objeto 
        return `<button class="botonVerde" onclick="agregarPropiedadEnAlquiler(event)" data-propID="${propiedad?.id}">Agregar Propiedad</button>`     
    }
    else{
        // retorna el boton de color rojo (no disponible)
        return `<button class="botonRojo">No Disponible</button>`;
    } 
}

// creo la funcion agregarPropiedadEnAlquiler recibiendo como parametro
// el evento para acceder por el Id desde el dataset.
function agregarPropiedadEnAlquiler(event)
{
    // asigno a la variable el evento Id del dataset
    let propiedadId = Number(event.target.dataset.propid);

    // deshabiito el boton
    event.target.toggleAttribute("disabled");

    let mappropiedades = propiedades.map((el) => el?.id);
    // busco la Propiedad por el Id
    let index = mappropiedades.findIndex((el) => el === propiedadId);
    let propiedad = propiedades[index];

    // llamo a la funcion addAlquilerPropiedad y le paso el objeto propiedad
    unaPropiedad.addAlquilerPropiedad(propiedad);
    // llamo a la funcion actualizarPropiedadesEnAlquiler para actualizar la lista
    actualizarPropiedadesEnAlquiler();  
}

// creo la funcion actualizarPropiedadesEnAlquiler para mostrar en pantalla
// las propiedades seleccionadas que se desean alquilar
function actualizarPropiedadesEnAlquiler()
{
    // capturo el elemento html del section;
    let contenedor = document.getElementById("propiedadesEnAlquiler");

    contenedor.innerHTML = "";
    let lasPropiedades = unaPropiedad.propiedades;

    contenedor.innerHTML="<h3>Propiedades Seleccionadas:</h3>";

    // creo el div para mostrar las Propiedades seleccionadas
    let nuevaLista = document.createElement("div");
    nuevaLista.setAttribute("id", "listaPropiedad");

    // creo el div para guardar el Total de Propiedades a Alquilar
    let divTotal = document.createElement("div");
    divTotal.setAttribute("id", "listaTotalPropiedad");

    // recorro las Propiedades y voy imprimiendo los resultados
    lasPropiedades.forEach(propiedad=>{
        let nodoLi = document.createElement("div");
        // escribo los resultados en pantalla aplicando el operador ? sobre el objeto propiedad,
        // creo el boton Delete y establezco el escuchador del evento click sobre el boton Delete
        nodoLi.innerHTML = `${propiedad?.descripcion} - ${propiedad?.precioFinal} <button id="btnDelete" title="Quitar" class="botonDelete" onclick="borrarPropiedadEnAlquiler(${propiedad?.id})"></button>`;
        // agrego el nodo hijo al padre
        nuevaLista.appendChild(nodoLi);
    })

    // agrego el nodo hijo al padre
    contenedor.appendChild(nuevaLista);

    // guardo en la variable total la suma de las Propiedades mediante el metodo reduce 
    // aplicando el operador ? sobre el objeto
    const total = (unaPropiedad.propiedades?.reduce((acc,element)=>acc+=element?.precioFinal,0));
    divTotal.innerHTML = `Total a pagar: ${total}`;

    // agrego el nodo hijo al padre
    contenedor.appendChild(divTotal);

    // llamo a la funcion guardarAlquilerPropiedadStorage de la clase Propiedad
    // para guardar la Propiedad que se desea alquilar
    unaPropiedad.guardarAlquilerPropiedadStorage();

    // guardo en una constante el boton de Consulta
    const btnConsulta = document.createElement("button");
    btnConsulta.setAttribute("id", "btnFormConsulta");
    btnConsulta.innerHTML = "Completar Formulario";

    // agrego el nodo hijo al padre
    divTotal.appendChild(btnConsulta);

    // aplico el operador ternario condicional
    total > 0 ? (
        // agrego un escuchador de eventos al evento click
        // (llamando a la funcion mostrarFormulario si total es mayor a 0)
        btnConsulta.addEventListener("click", ()=>mostrarFormulario(lasPropiedades))
    ) : (
        // muestro mensaje de error si el usuario
        // no selecciono una Propiedad
        btnConsulta.addEventListener("click", ()=>{
            Toastify({
                text: "No hay Propiedades seleccionadas !",
                duration: 3000,
                gravity: 'top',
                style: {
                    background: "linear-gradient(to right, #b06400, #c93d3d)"
                }
            }).showToast();
        })
    );
}

// creo la funcion mostrarPropiedadesEnAlquiler 
function mostrarPropiedadesEnAlquiler()
{
    // obtengo en variables elementos del html
    let nodoPropiedad = document.getElementById("propiedadesEnAlquiler");

    // creo el nodo section de propiedades aplicando el operador ternario AND
    nodoPropiedad===null && (
        nodoPropiedad = document.createElement("div"),
        nodoPropiedad.setAttribute("id", "propiedadesEnAlquiler"),
        // agrego el nodo hijo al padre
        sectionPropiedades.appendChild(nodoPropiedad)
    );

    // llamo a la funcion actualizarPropiedadesEnAlquiler para actualizar la lista 
    actualizarPropiedadesEnAlquiler();
}

// creo la funcion borrarPropiedadEnAlquiler que recibe como parametro
// el id de la Propiedad que se desa eliminar
function borrarPropiedadEnAlquiler(propiedadId)
{
    // obtengo el array de Propiedades del localStorage
    let propiedadesStorage = JSON.parse(localStorage.getItem("Propiedades"));

    // obtengo el indice en el arreglo del id a eliminar
    let index = propiedadesStorage.findIndex(element => element?.id === propiedadId);
    
    // llamo a la funcion deleteAlquilerPropiedad de la clase propiedad.class
    // y le paso el indice a eliminar
    unaPropiedad.deleteAlquilerPropiedad(index);

    // muestro mensaje de propiedad eliminada
    Toastify({
        text: "Propiedad eliminada !",
        duration: 3000,
        gravity: 'bottom',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
    
    // llamo a la funcion actualizarPropiedadesEnAlquiler para actualizar la lista 
    actualizarPropiedadesEnAlquiler();
}

// creo la funcion mostrarFormulario donde se guarda
// la consulta del usuario sobre las propiedades seleccionadas
function mostrarFormulario(lasPropiedades)
{
    // capturo y creo los elementos section y form
    // donde el usuario completa el formulario de consulta
    let sectionForm = document.getElementById("sectionFormulario");

    sectionForm = document.createElement("section");
    sectionForm.setAttribute("id", "sectionFormulario");

    // agrego el nodo hijo al padre
    divContenedorPadre.appendChild(sectionForm);

    let nodoForm = document.getElementById("formulario");
    nodoForm = document.createElement("form");
    nodoForm.innerHTML = 

        `<form id="formulario" action="" method="">
            <h1 class="formTitulo">Consultar</h1>

            <label class="formLabel" for="nombre">Nombre:</label>
            <input type="text" class="formInput" placeholder="Nombre" name="nombre">

            <label class="formLabel" for="apellido">Apellido:</label>
            <input type="text" class="formInput" placeholder="Apellido" name="apellido">

            <label class="formLabel" for="email">Email:</label>
            <input type="email" class="formInput" placeholder="Email" name="email">

            <label class="formLabel" for="fechaIni">Ingrese una Fecha de Comienzo:</label>
            <input type="date" id="fechaIni" class="formInput" name="fechaIni"/>

            <label class="formLabel" for="fechaFin">Ingrese una Fecha de Finalización:</label>
            <input type="date" id="fechaFin" class="formInput" name="fechaFin"/>

            <label class="formLabel" for="mensaje">Déjenos un Mensaje:</label>
            <textarea class="formInput" name="mensaje" placeholder="Déjenos un Mensaje:"></textarea>

            <input id="btnFormSubmit" type="submit" value="Enviar Consulta">
        </form>`

    nodoForm.setAttribute("id", "formulario");

    // agrego el nodo hijo al padre 
    sectionForm.appendChild(nodoForm);

    // escucho el evento click del boton submit
    nodoForm.addEventListener("submit", (e) => {
        // prevengo el comportamiento por defecto (recarga la página)
        e.preventDefault();

        // accedo a los valores de los input al momento de hacer submit
        const nombre = e.target[0].value.trim();
        const apellido = e.target[1].value.trim();
        const email = e.target[2].value.trim();

        let fechaIni = document.getElementById("fechaIni").value;
        fechaIni = luxonDateTime.fromISO(fechaIni);

        let fechaFin = document.getElementById("fechaFin").value;
        fechaFin = luxonDateTime.fromISO(fechaFin);

        const mensaje = e.target[5].value;

        // si los campos del formulario no estan todos completos
        // muestro mensaje por pantalla 
        if (!nombre || !apellido || !email || !fechaIni || !fechaFin || !mensaje) 
            return Toastify({
                        text: "Por favor comeplete todos los campos",
                        duration: 3000,
                        gravity: 'bottom',
                        style: {
                            background: "linear-gradient(to right, #b06400, #c93d3d)"
                        }
                    }).showToast();
        
            // ejecuto la funcion que guarda el Alquiler en el Storage
            unAlquiler.guardarAlquilerStorage({ lasPropiedades, nombre: nombre, apellido: apellido, email: email, fechaIni: fechaIni, fechaFin: fechaFin, mensaje: mensaje });

            // luego de guardarse los datos en el storage
            // muestro mensaje por pantalla 
            Toastify({
                text: "Consulta de Alquiler enviada correctamente !",
                duration: 3000,
                gravity: 'bottom',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();        

            // reinicio el formulario
            nodoForm.reset();
    }); 
}



































