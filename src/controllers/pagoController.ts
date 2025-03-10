import { Request, Response } from 'express';
import { logger } from '../config/logger';

export const simularPago = async (req: Request, res: Response) => {
  const { monto, metodoPago } = req.body;
  // El pago es ficticio; se simula un pago siempre exitoso.
  const pagoExitoso = true;

  if (pagoExitoso) {
    res.json({ mensaje: 'Pago ficticio exitoso', monto, metodoPago });
  } else {
    logger.error('Error en simulación de pago');
    res.status(400).json({ error: 'El pago falló, inténtalo de nuevo' });
  }
};
