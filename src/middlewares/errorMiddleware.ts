// src/middlewares/errorMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const manejoErrores = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Se registra información detallada del error para facilitar la depuración (sin exponer datos sensibles al cliente)
  logger.error(`Error: ${err.message} - Ruta: ${req.originalUrl} - Método: ${req.method} - Stack: ${err.stack}`);
  res.status(500).json({ error: 'Error interno del servidor' });
};
