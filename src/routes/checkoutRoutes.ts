import { Router, Request, Response, NextFunction } from 'express';
import { procesarCheckout } from '../controllers/checkoutController';
import { verificarToken } from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

router.post(
  '/',
  verificarToken,
  [
    body('id_direccion')
      .notEmpty().withMessage('id_direccion es obligatorio')
      .isNumeric().withMessage('id_direccion debe ser numérico'),
    body('metodoPago')
      .notEmpty().withMessage('metodoPago es obligatorio')
  ],
  asyncHandler(procesarCheckout)
);

export default router;
