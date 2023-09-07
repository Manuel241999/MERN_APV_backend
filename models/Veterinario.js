import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from '../helpers/generarId.js'
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true
    },
    web:{
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type:Boolean,
        default:false
    }
    
});

veterinarioSchema.pre('save', async function(next) {//Gracias al pre, vamos a modificar el password antes de que se almacene.
    if(!this.isModified("password")){//Esto es para que verifique si un password ya fue Hasheado, ya no lo vuelva a hacer.
        next();//Ya acabo aqui, asi que vete al sigiente middlewares  que esta en index.js ... es como un return en los middlewares (masomenos)
    }
    const salt = await bcrypt.genSalt(10);//Un salt una serie de rondas de hasheo y el 10 son el numero de rondas.
    this.password = await bcrypt.hash(this.password,salt);//Hasheas exactamente el password que el user metio.(Por lo que comprendo, ahi encryptas el password y de una le decis las rondas)
});//El pre significa antes de almacenarlo en la base de datos

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario,this.password);
}

const Veterinario = mongoose.model("Veterinario",veterinarioSchema);//Esto lo que hace es registrarlo en mongoose, osea como algo que tiene que interactuar con la base de datos
export default Veterinario;

//Hashear el password!
//primero instalamos npm i bcrypt  que es una dependencia que me encripta el password.
