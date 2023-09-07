import Veterinario from "../models/Veterinario.js";
import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req,res) => {
    const paciente = new Paciente(req.body);//instancia de req.body
    paciente.veterinario = req.Veterinario._id;//Guardas en campo lo que te trajo
    try {
        //como detectar que veterinario es el que esta viendo dicho paciente:
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log("🚀 ~ file: pacienteController.js:12 ~ agregarPaciente ~ error:", error)
        console.log('ERROR MANUEL');
        console.log(error);
        console.log("🚀 ~ file: pacienteController.js:14 ~ agregarPaciente ~ error:", error)
    }
}
const obtenerPacientes = async (req,res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.Veterinario);
    res.json(pacientes)
};

const obtenerPaciente = async (req,res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id)
    if(!paciente){//Comprobacion de que exista el paciente
        return res.status(404).json({msg: 'No Encontrado'})
    }
    //Como saber si el paciente lo esta viendo el veterinario que lo metio?
    if(paciente.veterinario._id.toString() !== req.Veterinario._id.toString()){
      return res.json({msg: 'Accion no valida'});
    }
        res.json(paciente);//Imprime paciente si todo esta bien.
}

const actualizarPaciente = async (req,res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id)

    if(!paciente){//Comprobacion de que exista el paciente
        return res.status(404).json({msg: 'No Encontrado'})
    }
    //Como saber si el paciente lo esta viendo el veterinario que lo metio?
    if(paciente.veterinario._id.toString() !== req.Veterinario._id.toString()){
      return res.json({msg: 'Accion no valida'});
    }


    //Actualizar paciente  .. nota: A los campos actualizalos con lo nuevo que se digito, pero sino dijita nada, dejalos como esta, gracias al ||
      paciente.nombre = req.body.nombre || paciente.nombre;
      paciente.propietario = req.body.propietario || paciente.propietario;
      paciente.email = req.body.email || paciente.email;
      paciente.fecha = req.body.fecha || paciente.fecha;
      paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log("🚀 ~ file: pacienteController.js:59 ~ actualizarPaciente ~ error:", error)
        console.log("🚀 ~ file: pacienteController.js:50 ~ actualizarPaciente ~ error:", error)
        console.log("🚀 ~ file: pacienteController.js:61 ~ actualizarPaciente ~ error:", error)
        console.log("🚀 ~ file: pacienteController.js:61 ~ actualizarPaciente ~ error:", error)
    }  
}

const eliminarPaciente = async (req,res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id)

    if(!paciente){//Comprobacion de que exista el paciente
        return res.status(404).json({msg: 'No Encontrado'})
    }
    //Como saber si el paciente lo esta viendo el veterinario que lo metio?
    if(paciente.veterinario._id.toString() !== req.Veterinario._id.toString()){
      return res.json({msg: 'Accion no valida'});
    }

    try {//Aqui se elimina por medio del Id que te pide en los router
        await paciente.deleteOne();
        res.json({msg:"Paciente eliminado"})
    } catch (error) {
        console.log("🚀 ~ file: pacienteController.js:77 ~ eliminarPaciente ~ error:", error)
    }

}

export {
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};