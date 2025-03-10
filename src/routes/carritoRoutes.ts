import { Router } from 'express';
import {
  obtenerCarrito,
  agregarItemCarrito,
  actualizarItemCarrito,
  eliminarItemCarrito,
  sincronizarCarrito
} from '../controllers/carritoController';
import { verificarToken } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import { body, param } from 'express-validator';

const router = Router();

router.use(verificarToken);

router.get('/', asyncHandler(obtenerCarrito));

router.post(
  '/item',
  [
    body('id_producto_variante')
      .notEmpty().withMessage('id_producto_variante es obligatorio')
      .isNumeric().withMessage('id_producto_variante debe ser numérico'),
    body('cantidad')
      .notEmpty().withMessage('La cantidad es obligatoria')
      .isNumeric().withMessage('La cantidad debe ser numérica')
  ],
  asyncHandler(agregarItemCarrito)
);

router.put(
  '/item/:itemId',
  [
    param('itemId')
      .isNumeric().withMessage('itemId debe ser un número'),
    body('cantidad')
      .notEmpty().withMessage('La cantidad es obligatoria')
      .isNumeric().withMessage('La cantidad debe ser numérica')
  ],
  asyncHandler(actualizarItemCarrito)
);

router.delete(
  '/item/:itemId',
  [
    param('itemId')
      .isNumeric().withMessage('itemId debe ser un número')
  ],
  asyncHandler(eliminarItemCarrito)
);

router.post(
  '/sincronizar',
  [
    body('items')
      .isArray().withMessage('items debe ser un arreglo'),
    body('items.*.id_producto_variante')
      .notEmpty().withMessage('Cada item debe tener id_producto_variante')
      .isNumeric().withMessage('id_producto_variante debe ser numérico'),
    body('items.*.cantidad')
      .notEmpty().withMessage('Cada item debe tener cantidad')
      .isNumeric().withMessage('cantidad debe ser numérica')
  ],
  asyncHandler(sincronizarCarrito)
);

export default router;
