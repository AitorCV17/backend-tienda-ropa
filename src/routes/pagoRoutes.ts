import { Router } from 'express';
import { simularPago } from '../controllers/pagoController';
import { verificarToken } from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/simular',
  verificarToken,
  [
    body('monto')
      .notEmpty().withMessage('El monto es obligatorio')
      .isNumeric().withMessage('El monto debe ser numérico'),
    body('metodoPago')
      .notEmpty().withMessage('El método de pago es obligatorio')
  ],
  simularPago
);

export default router;
