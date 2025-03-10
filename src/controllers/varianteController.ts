import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { validationResult } from 'express-validator';

export const obtenerVariantes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id_producto } = req.query;
  try {
    const where = id_producto ? { id_producto: Number(id_producto) } : {};
    const variantes = await prisma.productoVariante.findMany({
      where,
      include: { producto: true }
    });
    res.json(variantes);
  } catch (error) {
    next(error);
  }
};

export const obtenerVariante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  try {
    const variante = await prisma.productoVariante.findUnique({
      where: { id },
      include: { producto: true }
    });
    if (!variante) {
      res.status(404).json({ error: 'Variante no encontrada' });
      return;
    }
    res.json(variante);
  } catch (error) {
    next(error);
  }
};

export const crearVariante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }

  const { id_producto, talla, color, precio, stock } = req.body;
  try {
    const nuevaVariante = await prisma.productoVariante.create({
      data: {
        id_producto: Number(id_producto),
        talla,
        color,
        precio: Number(precio),
        stock: Number(stock) || 0
      }
    });
    res.status(201).json(nuevaVariante);
  } catch (error) {
    next(error);
  }
};

export const actualizarVariante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  const { talla, color, precio, stock } = req.body;
  try {
    const varianteActualizada = await prisma.productoVariante.update({
      where: { id },
      data: {
        talla,
        color,
        precio: precio !== undefined ? Number(precio) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined
      }
    });
    res.json(varianteActualizada);
  } catch (error) {
    next(error);
  }
};

export const eliminarVariante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  try {
    await prisma.productoVariante.delete({ where: { id } });
    res.json({ message: 'Variante eliminada' });
  } catch (error) {
    next(error);
  }
};
