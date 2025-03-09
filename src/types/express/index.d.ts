// src/types/express/index.d.ts
import 'express'; // Asegura que se carguen las definiciones base de Express

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
