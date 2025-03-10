import { Router } from 'express';
import { obtenerResumenCarrito } from '../controllers/carritoResumenController';
import { verificarToken } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/resumen', verificarToken, asyncHandler(obtenerResumenCarrito));

export default router;
