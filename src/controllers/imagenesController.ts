import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { validationResult } from 'express-validator';

export const obtenerImagenes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id_producto } = req.query;
  try {
    const where = id_producto ? { id_producto: Number(id_producto) } : {};
    const imagenes = await prisma.imagenProducto.findMany({ where });
    res.json(imagenes);
    return;
  } catch (error) {
    next(error);
  }
};

export const obtenerImagen = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  try {
    const imagen = await prisma.imagenProducto.findUnique({ where: { id } });
    if (!imagen) {
      res.status(404).json({ error: 'Imagen no encontrada' });
      return;
    }
    res.json(imagen);
    return;
  } catch (error) {
    next(error);
  }
};

export const obtenerImagenPorPosicion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id_producto = Number(req.params.id_producto);
  const posicion = Number(req.params.posicion);
  try {
    const imagenes = await prisma.imagenProducto.findMany({
      where: { id_producto },
      orderBy: { id: 'asc' }
    });
    if (posicion < 1 || posicion > imagenes.length) {
      res.status(404).json({
        error: 'No se encontró una imagen en la posición solicitada'
      });
      return;
    }
    res.json(imagenes[posicion - 1]);
    return;
  } catch (error) {
    next(error);
  }
};

export const crearImagen = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  const { id_producto, url } = req.body;
  try {
    const nuevaImagen = await prisma.imagenProducto.create({
      data: { id_producto: Number(id_producto), url }
    });
    res.status(201).json(nuevaImagen);
    return;
  } catch (error) {
    next(error);
  }
};

export const actualizarImagen = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  const { url } = req.body;
  try {
    const imagenActualizada = await prisma.imagenProducto.update({
      where: { id },
      data: { url }
    });
    res.json(imagenActualizada);
    return;
  } catch (error) {
    next(error);
  }
};

export const eliminarImagen = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  try {
    await prisma.imagenProducto.delete({ where: { id } });
    res.json({ message: 'Imagen eliminada' });
    return;
  } catch (error) {
    next(error);
  }
};
