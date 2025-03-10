// Middleware global para el manejo de errores: registra el error y responde con un mensaje genérico.
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const manejoErrores = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message} - Ruta: ${req.originalUrl} - Método: ${req.method} - Stack: ${err.stack}`);
  res.status(500).json({ error: 'Error interno del servidor' });
};
