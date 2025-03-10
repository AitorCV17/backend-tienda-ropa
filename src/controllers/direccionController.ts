import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/db';

export const obtenerDirecciones = async (req: Request, res: Response) => {
  const userId = req.usuario?.id;
  try {
    const direcciones = await prisma.direccion.findMany({ where: { id_usuario: userId } });
    res.json(direcciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

export const crearDireccion = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const userId = req.usuario?.id;
  const { direccion, ciudad, provincia, codigo_postal } = req.body;
  try {
    const nuevaDireccion = await prisma.direccion.create({
      data: {
        id_usuario: userId!,
        direccion,
        ciudad,
        provincia,
        codigo_postal
      }
    });
    res.status(201).json(nuevaDireccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear dirección' });
  }
};

export const actualizarDireccion = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const direccionId = parseInt(req.params.id, 10);
  const { direccion, ciudad, provincia, codigo_postal } = req.body;

  try {
    const direccionActualizada = await prisma.direccion.update({
      where: { id: direccionId },
      data: { direccion, ciudad, provincia, codigo_postal }
    });
    res.json(direccionActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la dirección' });
  }
};

export const eliminarDireccion = async (req: Request, res: Response) => {
  const direccionId = parseInt(req.params.id, 10);
  try {
    await prisma.direccion.delete({ where: { id: direccionId } });
    res.json({ message: 'Dirección eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la dirección' });
  }
};
