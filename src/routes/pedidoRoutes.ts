import { Router } from 'express';
import {
  obtenerPedidosCliente,
  obtenerTodosPedidos,
  actualizarEstadoPedido
} from '../controllers/pedidoController';
import { verificarToken } from '../middlewares/authMiddleware';
import { autorizarRoles } from '../middlewares/roleMiddleware';
import { body, param } from 'express-validator';

const router = Router();

router.get('/', verificarToken, obtenerPedidosCliente);
router.get('/todos', verificarToken, autorizarRoles('ADMIN'), obtenerTodosPedidos);

router.put(
  '/:id',
  verificarToken,
  autorizarRoles('ADMIN'),
  [
    param('id')
      .isNumeric().withMessage('El id debe ser numérico'),
    body('estado')
      .notEmpty().withMessage('El estado es obligatorio')
  ],
  actualizarEstadoPedido
);

export default router;
