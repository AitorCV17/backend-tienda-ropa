// Middleware para autorizar el acceso a rutas basado en roles de usuario.
import { Request, Response, NextFunction } from 'express';

export const autorizarRoles = (...roles: Array<'ADMIN' | 'CLIENTE'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    if (!roles.includes(req.usuario.rol)) {
      res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
      return;
    }
    next();
  };
};
