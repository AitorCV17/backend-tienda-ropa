// src/routes/carritoRoutes.ts
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

const router = Router();

router.use(verificarToken);

router.get('/', asyncHandler(obtenerCarrito));
router.post('/item', asyncHandler(agregarItemCarrito));
router.put('/item/:itemId', asyncHandler(actualizarItemCarrito));
router.delete('/item/:itemId', asyncHandler(eliminarItemCarrito));
router.post('/sincronizar', asyncHandler(sincronizarCarrito));

export default router;
