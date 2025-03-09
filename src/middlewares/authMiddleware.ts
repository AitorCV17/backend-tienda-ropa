// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface TokenPayload {
  id: number;
  correo: string;
  rol: 'ADMIN' | 'CLIENTE';
}

export const verificarToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definida en las variables de entorno');
  }

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;
    req.usuario = payload;
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  next();
};
