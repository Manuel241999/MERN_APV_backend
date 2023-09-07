import mongoose from 'mongoose'

const pacientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        requiered: true
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas:{
        type: String,
        required: true
    },

    //Los veterinarios se pueden registrar y solo ellos pueden ver a los pacientes:
    veterinario: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Veterinario'
    }

},{
    timestamps: true,//Para que nos cree las columnas de editado y creado
});

const Paciente = mongoose.model("Paciente",pacientesSchema);

export default Paciente;