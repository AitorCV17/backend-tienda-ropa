import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoriaController';
import { verificarToken } from '../middlewares/authMiddleware';
import { autorizarRoles } from '../middlewares/roleMiddleware';

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

router.get('/', asyncHandler(obtenerCategorias));

router.post(
  '/',
  verificarToken,
  autorizarRoles('ADMIN'),
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
  ],
  asyncHandler(crearCategoria)
);

router.put(
  '/:id',
  verificarToken,
  autorizarRoles('ADMIN'),
  [
    param('id')
      .isNumeric().withMessage('El id debe ser numérico'),
    body('nombre')
      .optional()
      .notEmpty().withMessage('El nombre no puede estar vacío'),
    body('descripcion').optional()
  ],
  asyncHandler(actualizarCategoria)
);

router.delete(
  '/:id',
  verificarToken,
  autorizarRoles('ADMIN'),
  [
    param('id')
      .isNumeric().withMessage('El id debe ser numérico')
  ],
  asyncHandler(eliminarCategoria)
);

export default router;
