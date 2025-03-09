import { Router, Request, Response, NextFunction } from 'express';
import { 
  obtenerCarrito, 
  agregarItemCarrito, 
  actualizarItemCarrito, 
  eliminarItemCarrito, 
  sincronizarCarrito 
} from '../controllers/carritoController';
import { verificarToken } from '../middlewares/authMiddleware';

// Wrapper para manejar errores en funciones asíncronas
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

router.use(verificarToken);

router.get('/', asyncHandler(obtenerCarrito));
router.post('/item', asyncHandler(agregarItemCarrito));
router.put('/item/:itemId', asyncHandler(actualizarItemCarrito));
router.delete('/item/:itemId', asyncHandler(eliminarItemCarrito));
router.post('/sincronizar', asyncHandler(sincronizarCarrito));

export default router;
