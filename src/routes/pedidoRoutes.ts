import { Router } from 'express';
import { obtenerPedidosCliente, obtenerTodosPedidos, actualizarEstadoPedido } from '../controllers/pedidoController';
import { verificarToken } from '../middlewares/authMiddleware';
import { autorizarRoles } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', verificarToken, obtenerPedidosCliente);
router.get('/todos', verificarToken, autorizarRoles('ADMIN'), obtenerTodosPedidos);
router.put('/:id', verificarToken, autorizarRoles('ADMIN'), actualizarEstadoPedido);

export default router;
