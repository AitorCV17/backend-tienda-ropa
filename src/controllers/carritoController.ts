import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { validationResult } from 'express-validator';

export const obtenerCarrito = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.usuario?.id;
  if (!userId) {
    res.status(401).json({ error: 'Autenticación requerida para obtener el carrito' });
    return;
  }
  try {
    const carrito = await prisma.carrito.findUnique({
      where: { id_usuario: userId },
      include: {
        items: {
          include: {
            variante: {
              include: {
                producto: { include: { imagenes: true } }
              }
            }
          }
        }
      }
    });
    res.json(carrito);
    return;
  } catch (error) {
    next(error);
  }
};

export const agregarItemCarrito = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  const userId = req.usuario?.id;
  if (!userId) {
    res.status(401).json({ error: 'Autenticación requerida para agregar items al carrito' });
    return;
  }
  const { id_producto_variante, cantidad } = req.body;
  try {
    let carrito = await prisma.carrito.findUnique({ where: { id_usuario: userId } });
    if (!carrito) {
      carrito = await prisma.carrito.create({ data: { id_usuario: userId } });
    }
    const itemExistente = await prisma.carritoItem.findFirst({
      where: { id_carrito: carrito.id, id_producto_variante }
    });
    if (itemExistente) {
      await prisma.carritoItem.update({
        where: { id: itemExistente.id },
        data: { cantidad: itemExistente.cantidad + cantidad }
      });
    } else {
      await prisma.carritoItem.create({
        data: { id_carrito: carrito.id, id_producto_variante, cantidad }
      });
    }
    res.json({ message: 'Item agregado/actualizado en el carrito' });
    return;
  } catch (error) {
    next(error);
  }
};

export const actualizarItemCarrito = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  const itemId = parseInt(req.params.itemId, 10);
  const { cantidad } = req.body;
  try {
    await prisma.carritoItem.update({
      where: { id: itemId },
      data: { cantidad }
    });
    res.json({ message: 'Item actualizado' });
    return;
  } catch (error) {
    next(error);
  }
};

export const eliminarItemCarrito = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  const itemId = parseInt(req.params.itemId, 10);
  try {
    await prisma.carritoItem.delete({ where: { id: itemId } });
    res.json({ message: 'Item eliminado del carrito' });
    return;
  } catch (error) {
    next(error);
  }
};

export const sincronizarCarrito = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  const userId = req.usuario?.id;
  if (!userId) {
    res.status(401).json({ error: 'Autenticación requerida para sincronizar el carrito' });
    return;
  }
  const { items } = req.body;
  try {
    let carrito = await prisma.carrito.findUnique({ where: { id_usuario: userId } });
    if (!carrito) {
      carrito = await prisma.carrito.create({ data: { id_usuario: userId } });
    }
    for (const item of items) {
      const { id_producto_variante, cantidad } = item;
      const itemExistente = await prisma.carritoItem.findFirst({
        where: { id_carrito: carrito.id, id_producto_variante }
      });
      if (itemExistente) {
        await prisma.carritoItem.update({
          where: { id: itemExistente.id },
          data: { cantidad: itemExistente.cantidad + cantidad }
        });
      } else {
        await prisma.carritoItem.create({
          data: { id_carrito: carrito.id, id_producto_variante, cantidad }
        });
      }
    }
    res.json({ message: 'Carrito sincronizado exitosamente' });
    return;
  } catch (error) {
    next(error);
  }
};
