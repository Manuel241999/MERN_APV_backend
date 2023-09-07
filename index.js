import  express  from "express";
import dotenv from "dotenv";
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRouters.js'


//Estas lineas son los middlewares:
const app = express();
app.use(express.json())//esto sirve para poder enviar datos desde postman

dotenv.config();//De esta forma va a escanear el archivo de .env

conectarDB();//Llamas a la funcion para conectarme a la DB
///////////////////////PERMISOS PARA EL FRONTEND/////////////////////
const dominiosPermitidos = [process.env.FRONTEND_URL];//Listado de urls permitidas para que consuman el backend, ya que cors no nos va dejar

const corsOptions = {
    origin: function (origin,callback){// lo que mandemos se almacena en origin y verifica si existe en el array
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //Origen del Request esta permitido
            callback(null,true)//si lo encuentra le mandas el callback en true a lo que es el mero cors
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));//aqui le envias exactamente al navegador  la respuesta para que deje pasar.
///////////////////////////////////FIN PERMISOS PARA EL FRONTEND///////////////////////
app.use('/api/veterinarios',veterinarioRoutes);//De esta manera: cuando vicitemos esta URL entonces va mandar a llamar el routing que tengamos en este archivo
app.use('/api/pacientes',pacienteRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT,() =>{//arrancamos el proyecto, tira este mensaje
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

