// creo la clase Propiedad
class Propiedad{

    // creo el metodo constructor de la clase
    constructor(propiedades){
        this.propiedades = propiedades;
    }

    // funcion para agregar una Propiedad al Alquiler
    addAlquilerPropiedad(propiedad)
    { 
        //agrego la Propiedad con el metodo push
        this.propiedades.push(propiedad);
    }

    // funcion para eliminar una Propiedad de Alquiler
    deleteAlquilerPropiedad(index)
    {
        // elimino una Propiedad de Alquiler con el metodo splice 
        this.propiedades.splice(index, 1);
    }

    // guardo la Propiedad de Alquiler en el Storage
    guardarAlquilerPropiedadStorage()
    {
        // almaceno la informacion de la Propiedad Alquilada en el localStorage
        localStorage.setItem("Propiedades", JSON.stringify(this.propiedades));
    }
}