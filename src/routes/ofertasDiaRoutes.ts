import { Router } from 'express';
import { obtenerOfertasDia } from '../controllers/ofertasDiaController';

const router = Router();

router.get('/dia', obtenerOfertasDia);

export default router;
