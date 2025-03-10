// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Envuelve una función asíncrona (controlador) para que
 * retorne un RequestHandler válido para Express, evitando
 * problemas de tipado y capturando errores automáticamente.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
