import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

import { obtenerProductos } from '../controllers/productoController';
import { obtenerProductosMasVendidos } from '../controllers/productoMasVendidosController';
import { obtenerProductosNuevos } from '../controllers/productoNuevosController';
import { obtenerProductosRecomendados } from '../controllers/productoRecomendadosController';

const router = Router();

router.get('/', asyncHandler(obtenerProductos));
router.get('/mas-vendidos', asyncHandler(obtenerProductosMasVendidos));
router.get('/nuevos', asyncHandler(obtenerProductosNuevos));
router.get('/recomendados', asyncHandler(obtenerProductosRecomendados));

export default router;
