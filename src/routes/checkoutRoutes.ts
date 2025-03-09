import { Router, Request, Response, NextFunction } from 'express';
import { procesarCheckout } from '../controllers/checkoutController';
import { verificarToken } from '../middlewares/authMiddleware';

// Wrapper para manejar funciones asíncronas
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

router.post('/', verificarToken, asyncHandler(procesarCheckout));

export default router;
