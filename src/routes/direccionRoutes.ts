import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { 
  obtenerDirecciones, 
  crearDireccion, 
  actualizarDireccion, 
  eliminarDireccion 
} from '../controllers/direccionController';
import { verificarToken } from '../middlewares/authMiddleware';

// Wrapper para manejar funciones asíncronas
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

// Aplica el middleware de autenticación a todas las rutas de direcciones
router.use(verificarToken);

// Ruta para obtener las direcciones del usuario
router.get('/', asyncHandler(obtenerDirecciones));

// Ruta para crear una nueva dirección
router.post(
  '/',
  [
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
    body('ciudad').notEmpty().withMessage('La ciudad es obligatoria'),
    body('provincia').notEmpty().withMessage('La provincia es obligatoria'),
    body('codigo_postal').notEmpty().withMessage('El código postal es obligatorio')
  ],
  asyncHandler(crearDireccion)
);

// Ruta para actualizar una dirección existente
router.put('/:id', asyncHandler(actualizarDireccion));

// Ruta para eliminar una dirección
router.delete('/:id', asyncHandler(eliminarDireccion));

export default router;
