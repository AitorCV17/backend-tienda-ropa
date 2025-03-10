import { Router } from 'express';
import { body } from 'express-validator';
import {
  obtenerImagenes,
  obtenerImagen,
  obtenerImagenPorPosicion,
  crearImagen,
  actualizarImagen,
  eliminarImagen
} from '../controllers/imagenesController';
import { verificarToken } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(verificarToken);

router.get('/', asyncHandler(obtenerImagenes));
router.get('/:id', asyncHandler(obtenerImagen));
router.get('/:id_producto/posicion/:posicion', asyncHandler(obtenerImagenPorPosicion));

router.post(
  '/',
  [
    body('id_producto').notEmpty().withMessage('id_producto es obligatorio'),
    body('url').notEmpty().withMessage('La URL es obligatoria')
  ],
  asyncHandler(crearImagen)
);

router.put('/:id', asyncHandler(actualizarImagen));
router.delete('/:id', asyncHandler(eliminarImagen));

export default router;
