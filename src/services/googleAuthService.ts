// src/services/googleAuthService.ts
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import prisma from '../config/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

export const loginConGoogleService = async (tokenGoogle: string) => {
  const ticket = await client.verifyIdToken({
    idToken: tokenGoogle,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Token de Google inválido');
  }
  const correo = payload.email;
  const nombre = payload.name || 'Sin Nombre';
  let usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (!usuario) {
    const salt = await bcrypt.genSalt(10);
    const contrasena = await bcrypt.hash('GoogleAuthRandomPass', salt);
    usuario = await prisma.usuario.create({
      data: { nombre, correo, contrasena, rol: 'CLIENTE' },
    });
  } else {
    if (!usuario.activo) {
      throw new Error('Usuario desactivado. Contacta al soporte.');
    }
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definida en las variables de entorno');
  }
  const payloadJWT = { id: usuario.id, correo: usuario.correo, rol: usuario.rol };
  const accessToken = jwt.sign(payloadJWT, secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payloadJWT, secret, { expiresIn: '7d' });
  return { accessToken, refreshToken, usuario };
};
