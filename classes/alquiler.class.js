// creo la clase Alquier
class Alquiler{

    // creo el metodo constructor de la clase
    constructor(alquileres){
        this.alquileres = alquileres;
    }

    // guardo el Alquiler en el Storage
    guardarAlquilerStorage(alquiler)
    {
        // agrego el Alquiler al array con el metodo push
        this.alquileres.push(alquiler);
        // almaceno la informacion del alquiler en el localStorage
        localStorage.setItem("Alquileres", JSON.stringify(this.alquileres));
    }
}

