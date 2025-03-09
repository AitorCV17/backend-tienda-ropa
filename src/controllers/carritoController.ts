import { Request, Response } from 'express';
import prisma from '../config/db';
import { validationResult } from 'express-validator';

// Obtener carrito del usuario
export const obtenerCarrito = async (req: Request, res: Response) => {
  const userId = req.usuario?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Autenticación requerida para obtener el carrito' });
  }
  try {
    const carrito = await prisma.carrito.findUnique({
      where: { id_usuario: userId },
      include: { items: { include: { producto: true } } }
    });
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Agregar item al carrito
export const agregarItemCarrito = async (req: Request, res: Response) => {
  const userId = req.usuario?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Autenticación requerida para agregar items al carrito' });
  }
  const { id_producto, cantidad } = req.body;
  try {
    let carrito = await prisma.carrito.findUnique({ where: { id_usuario: userId } });
    if (!carrito) {
      carrito = await prisma.carrito.create({ data: { id_usuario: userId } });
    }
    const itemExistente = await prisma.carritoItem.findFirst({
      where: { id_carrito: carrito.id, id_producto }
    });
    let item;
    if (itemExistente) {
      item = await prisma.carritoItem.update({
        where: { id: itemExistente.id },
        data: { cantidad: itemExistente.cantidad + cantidad }
      });
    } else {
      item = await prisma.carritoItem.create({
        data: { id_carrito: carrito.id, id_producto, cantidad }
      });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar item al carrito' });
  }
};

// Actualizar item del carrito
export const actualizarItemCarrito = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId, 10);
  const { cantidad } = req.body;
  try {
    const item = await prisma.carritoItem.update({
      where: { id: itemId },
      data: { cantidad }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el item del carrito' });
  }
};

// Eliminar item del carrito
export const eliminarItemCarrito = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId, 10);
  try {
    await prisma.carritoItem.delete({ where: { id: itemId } });
    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el item del carrito' });
  }
};

// Sincronizar carrito (fusionar carrito anónimo con el del usuario)
export const sincronizarCarrito = async (req: Request, res: Response) => {
  const userId = req.usuario?.id;
  const { items } = req.body; // Array de { id_producto, cantidad }
  if (!userId) {
    return res.status(401).json({ error: 'Autenticación requerida para sincronizar el carrito' });
  }
  try {
    let carrito = await prisma.carrito.findUnique({ where: { id_usuario: userId } });
    if (!carrito) {
      carrito = await prisma.carrito.create({ data: { id_usuario: userId } });
    }
    for (const item of items) {
      const { id_producto, cantidad } = item;
      const itemExistente = await prisma.carritoItem.findFirst({
        where: { id_carrito: carrito.id, id_producto }
      });
      if (itemExistente) {
        await prisma.carritoItem.update({
          where: { id: itemExistente.id },
          data: { cantidad: itemExistente.cantidad + cantidad }
        });
      } else {
        await prisma.carritoItem.create({
          data: { id_carrito: carrito.id, id_producto, cantidad }
        });
      }
    }
    res.json({ message: 'Carrito sincronizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al sincronizar el carrito' });
  }
};
