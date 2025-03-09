import { Router } from 'express';
import { simularPago } from '../controllers/pagoController';
import { verificarToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/simular', verificarToken, simularPago);

export default router;
