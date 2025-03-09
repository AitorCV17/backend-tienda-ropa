import { Router } from 'express';
import { obtenerProductos } from '../controllers/productoController';

const router = Router();

router.get('/', obtenerProductos);

export default router;
