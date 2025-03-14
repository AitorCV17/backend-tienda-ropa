import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import prisma from '../config/db';
import { loginConGoogleService } from '../services/googleAuthService';

dotenv.config();

export const registrarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  const { nombre, correo, contrasena } = req.body;
  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { correo } });
    if (usuarioExistente) {
      res.status(400).json({ error: 'El usuario ya existe' });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(contrasena, salt);
    const usuario = await prisma.usuario.create({
      data: { nombre, correo, contrasena: hashContrasena, rol: 'CLIENTE' }
    });
    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario });
  } catch (error) {
    next(error);
  }
};

export const iniciarSesion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  const { correo, contrasena } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    if (!usuario) {
      res.status(400).json({ error: 'Credenciales inválidas' });
      return;
    }
    if (!usuario.activo) {
      res.status(400).json({ error: 'Usuario desactivado. Contacta al soporte.' });
      return;
    }
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      res.status(400).json({ error: 'Credenciales inválidas' });
      return;
    }
    const payload = { id: usuario.id, correo: usuario.correo, rol: usuario.rol };
    const secret = process.env.JWT_SECRET as string;
    const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const loginConGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tokenGoogle } = req.body;
  if (!tokenGoogle) {
    res.status(400).json({ error: 'tokenGoogle es requerido' });
    return;
  }
  try {
    const { accessToken, refreshToken, usuario } = await loginConGoogleService(tokenGoogle);
    res.json({ accessToken, refreshToken, usuario });
  } catch (error) {
    next(error);
  }
};
