import express from 'express';
const router = express.Router();
import  {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
        }  from '../controllers/veterinarioController.js'

import checkAuth from '../middleware/authMiddleware.js'

//AREA PUBLICA
router.post('/',registrar );//Esta es la manera mas ordena de como trabajar con controllers y Routers
//Login de veterinarios:
router.get('/confirmar/:token',confirmar);//forma dinamica para enviar parametros
router.post('/login',autenticar);
router.post('/olvide-password',olvidePassword);//Para validar el email del usuario.
router.get('/olvide-password/:token',comprobarToken)//Token que lo va leer desde la url.
router.post('/olvide-password/:token',nuevoPassword)//User define ya su password nuevo.
//router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);  OTRA FORMA DE HACERLO
//AREA PRIVADA
router.get('/perfil',checkAuth,perfil);//que es lo que hace esto: Cuando yo visito perfil, va a ir al Middleware y ejecuta esta funcion y luego se va a perfil, gracias al next().
router.put('/perfil/:id',checkAuth, actualizarPerfil);
router.put('/actualizar-password',checkAuth,actualizarPassword)
export default router;