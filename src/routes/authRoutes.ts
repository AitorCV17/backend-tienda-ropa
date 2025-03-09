import { Router } from 'express';
import { body } from 'express-validator';
import { registrarUsuario, iniciarSesion, loginConGoogle } from '../controllers/authController';

const router = Router();

router.post(
  '/registrar',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Correo inválido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  registrarUsuario
);

router.post(
  '/iniciar',
  [
    body('correo').isEmail().withMessage('Correo inválido'),
    body('contrasena').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  iniciarSesion
);

router.post('/google', loginConGoogle);

export default router;
