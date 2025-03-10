// src/routes/variantesRoutes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import {
  obtenerVariantes,
  obtenerVariante,
  crearVariante,
  actualizarVariante,
  eliminarVariante
} from '../controllers/varianteController';
import { verificarToken } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(verificarToken);

router.get('/', asyncHandler(obtenerVariantes));
router.get('/:id', asyncHandler(obtenerVariante));

router.post(
  '/',
  [
    body('id_producto').notEmpty().withMessage('id_producto es obligatorio'),
    body('talla').notEmpty().withMessage('La talla es obligatoria'),
    body('color').notEmpty().withMessage('El color es obligatorio'),
    body('precio').notEmpty().withMessage('El precio es obligatorio'),
    body('stock').optional()
  ],
  asyncHandler(crearVariante)
);

router.put('/:id', asyncHandler(actualizarVariante));
router.delete('/:id', asyncHandler(eliminarVariante));

export default router;
