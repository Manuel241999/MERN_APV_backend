import { Error } from "mongoose";
import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

//Nota: req.params es la informacion que viene de la url     y req.body  es la informacion que viene directamente de los formularios
const registrar = async (req, res) => {
  //Este es como el render de la pagina principal

  console.log(req.body);
   const {email,nombre} = req.body;
  // console.log("🚀 ~ file: veterinarioController.js:8 ~ registrar ~ nombre:", nombre)
  // console.log("🚀 ~ file: veterinarioController.js:8 ~ registrar ~ password:", password)
  // console.log("🚀 ~ file: veterinarioController.js:8 ~ registrar ~ email:", email)

  ///////Prevenir o revisar si un user ya esta registrado:(primero consultamos a la DB si existe el usuario y despues la consultamos para almacenarlo)
  const existeUsuario = await Veterinario.findOne({email}); 
  if(existeUsuario){
    const error = new Error('Usuario ya registrado');
    return res.status(400).json({msg: error.message});//Mensaje de error que previene el crasheo de la aplicacion
  }
/////////////
  try {
    //Guardar un nuevo veterinario:
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();  //no sabesmos cuanto tiempo se va tardar en guardar el registro, por lo que el proceso se va deteniendo aqui.

    //Enviar el gmail:
    emailRegistro({//Le mandas un objeto para que no crees una variable por cada cosa a la  funcion.
      email,
      nombre,
      token: veterinarioGuardado.token//Acordate que veterinarioGuardado trae todo lo que digitaste en el formulario. por eso lo vamos a guardar aqui, porque el user necesita saber sobre el token.
    });//Aqui escanea los parametros del email.

    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error);
  }
  //res.send({msg:"Registrando Usuario"});                                           
};

//PERFIL:

const perfil =  (req,res) =>{
    const {Veterinario} = req;
    res.json(Veterinario);
 }


 //CONFIRMAR CUENTA:
 const confirmar = async (req,res) => {
  // console.log(req.params.token);//como leer los parametros que creo con express
  const {token} =  req.params;

  const usuarioConfirmar = await Veterinario.findOne({token});

 if(!usuarioConfirmar){//Si no se encuentra el token quiere decir que no es valido
  const error = new Error('Token no valido');
  return res.status(404).json({msg: error.message});
 }

//pero si lo es, quiere decir que si esta y hay que cambiar los valores del campo para tronarse el token 
 try {
  usuarioConfirmar.token = null;//Cambias el valor a null
  usuarioConfirmar.confirmado = true;// y el campo de confirmado lo pones en true para que lo deje pasar.
  await usuarioConfirmar.save();//Guardamos cambios, solo que lo hacemos con un await porque saber cuanto se va a tardar
  
  res.json({msg:"Usuario confirmado Correctamente"})
 } catch (error) {
  console.log("🚀 ~ file: veterinarioController.js:51 ~ confirmar ~ error:", error)
 }
 // res.json({msg:"Confirmando Cuenta..."});
 };
 
 //Autenticación:
 const autenticar = async (req,res) => {
  const {email, password} = req.body;

  //Comprobar si el usuario existe:
  const usuario = await Veterinario.findOne({email});
    //Forma de comprobar manualmente:
  // if(usuario){
  //   console.log('Si existe...')
  //   res.json({msg: "El Usuario no existe"});
  // }else{
  //   res.status(403).json({msg:'El Usuario no existe'});
  // }
  if(!usuario){//Si no se encuentra el token quiere decir que no es valido
    const error = new Error('El usuario no existe');
    return res.status(404).json({msg: error.message});
   }

   //Comprobar si el usuario esta  confirmado:
   if(!usuario.confirmado){
    const error =  new Error('Tu Cuenta no ha sido confirmada')
    return res.status(403).json({msg: error.message});
   }

   //Revisar el password:
   if(await usuario.comprobarPassword(password)){
   // console.log(usuario);
      //Autenticar
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id),
      });
   }else{
    const error =  new Error('El password es incorrecto!')
    return res.status(403).json({msg: error.message});
   }

};

//Olvide mi contraseña
const olvidePassword = async (req,res) => {
  const {email} = req.body;//acordate que cuando uno lo olvida, recibe un gmail
 const existeVeterinario = await Veterinario.findOne({email});
 if(!existeVeterinario){//sino existe el email, nunca fuer registrado
   const error = new Error("El usuario no existe");
   return res.status(400).json({msg: error.message});
 }//de lo contrario
 try {
  existeVeterinario.token = generarId();//Le creas un nuevo token al usuario
  await existeVeterinario.save();//Guardas cambios

//Enviar el gmail:
emailOlvidePassword({//Le mandas un objeto para que no crees una variable por cada cosa a la  funcion.
  email,
  nombre: existeVeterinario.nombre,
  token: existeVeterinario.token
});


  res.json({msg: "Hemos enviado un email con las instrucciones"});
 } catch (error) {
  console.log(error);
 }
}
const comprobarToken = async (req,res) => {//el token que se mando cuando olvide la contraseña se valida aqui
  const {token} = req.params;
  const tokenValido =  await Veterinario.findOne({token})
  if(tokenValido){
    //El token es valido el usuario existe
    res.json({msg:"Token valido y el usuario existe"})
  }else{
    const error = new Error('Token no valido');
    return res.status(400).json({msg: error.message});
  }
}
const nuevoPassword = async (req,res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){//Volvemos a validar el token por seguridad adicional
      const error = new Error("Hubo un error");
      return res.status(400).json({msg:error.message})
    }
    //Cambio del password:
    try {
      veterinario.token = null;///borras el token anterior porque solo es de un uso
      veterinario.password = password; //vamos a rescribir lo que el usuario metio en el form
      await veterinario.save();//guardas cambios
      res.json({msg:'Password modificado correctamente'});
    } catch (error) {
      console.log(error);
    }
}

const actualizarPerfil = async (req,res) => {
   const veterinario = await Veterinario.findById(req.params.id)
   if(!veterinario){
    const error = new Error('Hubo un error')
    return res.status(400).json({msg: error.message});
   }

   const {email} = req.body
   if(veterinario.email !== req.body.email){//cambio de email
      const existeEmail =  await Veterinario.findOne({email});
      if(existeEmail){
        const error = new Error('Ese email ya esta en uso');
        return res.status(400).json({msg: error.message})
      }
   }

   //Si todo esta bien, ya le agregamos los datos a la base de datos
   try {
    veterinario.nombre = req.body.nombre 
    veterinario.email = req.body.email
    veterinario.web = req.body.web 
    veterinario.telefono = req.body.telefono 

    const veterinarioActualizado = await veterinario.save()
    res.json(veterinarioActualizado)
   } catch (error) {
    console.log(error)
   }
}

const actualizarPassword = async (req,res) => {
 //Leer los datos
  const {id} = req.Veterinario
  const {pwd_actual, pwd_nuevo} = req.body

 //Comprobar que el veterinario exista
 const veterinario = await Veterinario.findById(id)
  if(!veterinario){
    const error = new Error('Hubo un error')
    return res.status(400).json({msg: error.message});
   }
 //Comprobar su password
   if(await veterinario.comprobarPassword(pwd_actual)){
    veterinario.password = pwd_actual
    await veterinario.save()
    res.json({msg: "Password Almacenado Correctamente"})
    
   }else{
    const error = new Error('El password Actual es Incorrecto')
    return res.status(400).json({msg: error.message});
   }
 //Almacenar el nuevo password
}

export { 
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
};
