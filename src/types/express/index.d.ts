// Extiende las definiciones de Express para incluir la propiedad "usuario" en Request.
import 'express';

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        correo: string;
        rol: 'ADMIN' | 'CLIENTE';
      };
    }
  }
}

export {};
