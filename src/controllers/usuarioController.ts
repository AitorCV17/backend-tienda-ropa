import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/db';
import bcrypt from 'bcrypt';

export const actualizarPerfil = async (req: Request, res: Response): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }

  const userId = req.usuario?.id;
  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const { nombre, correo, contrasena } = req.body;
  try {
    const data: { [key: string]: any } = {};

    if (nombre) data.nombre = nombre;
    if (correo) data.correo = correo;

    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      data.contrasena = await bcrypt.hash(contrasena, salt);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: userId },
      data
    });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
  const userId = req.usuario?.id;
  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    const usuarioEliminado = await prisma.usuario.update({
      where: { id: userId },
      data: { activo: false }
    });
    res.json({
      message: 'Usuario desactivado (soft delete)',
      usuario: usuarioEliminado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
