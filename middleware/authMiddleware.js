import jwt from "jsonwebtoken"
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req,res,next) => {

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){//Si el request va con el JWT y ademas el Bearer
        try {
            token = req.headers.authorization.split(' ')[1];//Aqui le estamos metiendo el JWT y le quitas la variable de bearer ademas de que le decis que tome el valor que esta como 1 en el array, porque el 0 es el bearer.
            const decoded = jwt.verify(token,process.env.JWT_SECRET);//esta variable toma el token y el process
            //Ahi lo que hiciste es validar que el token y ademas volver a extraer lo que tenia el JWT, jalaste el id por lo que ya podes compararlo con la base de datos.
            req.Veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");//literalmente comparas si esta el "id" a excepto el password,token y confirmado. 
            return next();//Se va al siguiente middleware y ya no hace lo de aqui abajo.
        } catch (error) {//sino pudo crear el token va tirar este error
             //Nunca hubo un token 
            const e =  new Error('Token no valido ');
            res.status(403).json({msg:e.message});

        }
    } //Comprobamos que el user este enviando el JWT    
    //Nunca hubo un token 
    if(!token){
        const error =  new Error('Token no valido o inexistente');
        res.status(403).json({msg:error.message});    
    }
    next();
};

export default checkAuth;