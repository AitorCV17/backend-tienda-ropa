import { Request, Response } from 'express';
import prisma from '../config/db';

export const obtenerResumenCarrito = async (req: Request, res: Response): Promise<void> => {
  const userId = req.usuario?.id;
  if (!userId) {
    res.status(401).json({ error: 'Autenticación requerida' });
    return;
  }
  try {
    const carrito = await prisma.carrito.findUnique({
      where: { id_usuario: userId },
      include: {
        items: {
          include: {
            variante: true
          }
        }
      }
    });

    if (!carrito) {
      res.json({ total_items: 0, subtotal: 0, costo_envio: 0 });
      return;
    }

    let totalItems = 0;
    let subtotal = 0;
    carrito.items.forEach((item) => {
      totalItems += item.cantidad;
      subtotal += item.cantidad * item.variante.precio;
    });

    const costo_envio = subtotal > 100 ? 0 : 5.99;
    res.json({ total_items: totalItems, subtotal, costo_envio });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen del carrito' });
  }
};
