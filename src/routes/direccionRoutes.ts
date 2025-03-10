import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion
} from '../controllers/direccionController';
import { verificarToken } from '../middlewares/authMiddleware';

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

router.use(verificarToken);

router.get('/', asyncHandler(obtenerDirecciones));

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

router.put(
  '/:id',
  [
    body('direccion')
      .optional()
      .notEmpty().withMessage('La dirección no puede estar vacía'),
    body('ciudad')
      .optional()
      .notEmpty().withMessage('La ciudad no puede estar vacía'),
    body('provincia')
      .optional()
      .notEmpty().withMessage('La provincia no puede estar vacía'),
    body('codigo_postal')
      .optional()
      .notEmpty().withMessage('El código postal no puede estar vacío')
  ],
  asyncHandler(actualizarDireccion)
);

router.delete('/:id', asyncHandler(eliminarDireccion));

export default router;
