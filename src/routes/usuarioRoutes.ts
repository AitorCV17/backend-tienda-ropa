import { Router } from 'express';
import { body } from 'express-validator';
import { actualizarPerfil, eliminarUsuario } from '../controllers/usuarioController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(verificarToken);

router.put(
  '/perfil',
  [
    body('nombre')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre no puede estar vacío'),
    body('correo')
      .optional()
      .isEmail()
      .withMessage('Correo inválido'),
    body('contrasena')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Mínimo 6 caracteres')
  ],
  actualizarPerfil
);

router.delete('/eliminar', eliminarUsuario);

export default router;
