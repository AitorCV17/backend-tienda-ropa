import { Router } from 'express';
import { obtenerCategoriasConProductos } from '../controllers/categoriaConProductosController';

const router = Router();

router.get('/con-productos', obtenerCategoriasConProductos);

export default router;
