import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from '../controllers/categoriaController';
import { verificarToken } from '../middlewares/authMiddleware';
import { autorizarRoles } from '../middlewares/roleMiddleware';

// Wrapper para manejar funciones asíncronas
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
  [body('nombre').notEmpty().withMessage('El nombre es obligatorio')],
  asyncHandler(crearCategoria)
);

router.put('/:id', verificarToken, autorizarRoles('ADMIN'), asyncHandler(actualizarCategoria));
router.delete('/:id', verificarToken, autorizarRoles('ADMIN'), asyncHandler(eliminarCategoria));

export default router;
