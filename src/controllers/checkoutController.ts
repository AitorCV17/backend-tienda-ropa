// src/controllers/checkoutController.ts

import { Request, Response } from 'express';
import prisma from '../config/db';
import { Carrito, CarritoItem, Producto } from '@prisma/client';
import { logger } from '../config/logger';

type CarritoItemConProducto = CarritoItem & {
  producto: Producto;
};

type CarritoConItems = Carrito & {
  items: CarritoItemConProducto[];
};

export const procesarCheckout = async (req: Request, res: Response) => {
  const userId = req.usuario?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Autenticación requerida para checkout' });
  }

  const { id_direccion, metodoPago } = req.body;

  try {
    // Obtener el carrito con items y productos
    const carrito = await prisma.carrito.findUnique({
      where: { id_usuario: userId },
      include: { items: { include: { producto: true } } }
    }) as CarritoConItems | null;

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Verificar stock en tiempo real
    for (const item of carrito.items) {
      if (item.cantidad > item.producto.stock) {
        return res.status(400).json({
          error: `No hay stock suficiente para el producto ${item.producto.nombre}`
        });
      }
    }

    // Simulación de pago ficticio (siempre exitoso)
    const pagoExitoso = true;
    if (!pagoExitoso) {
      return res.status(400).json({ error: 'El pago falló' });
    }

    // Usar una transacción para asegurar la atomicidad del proceso
    const pedido = await prisma.$transaction(async (tx) => {
      let total = 0;
      // Construir detalles del pedido y calcular total
      const detallesData = carrito.items.map((item) => {
        total += item.cantidad * item.producto.precio;
        return {
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio
        };
      });

      // Crear el pedido
      const pedidoCreado = await tx.pedido.create({
        data: {
          id_usuario: userId,
          id_direccion,
          total,
          estado: 'pendiente',
          detalles: { create: detallesData }
        }
      });

      // Actualizar el stock de cada producto
      for (const item of carrito.items) {
        await tx.producto.update({
          where: { id: item.id_producto },
          data: { stock: item.producto.stock - item.cantidad }
        });
      }

      // Limpiar el carrito
      await tx.carritoItem.deleteMany({ where: { id_carrito: carrito.id } });

      return pedidoCreado;
    });

    res.json({ message: 'Checkout procesado exitosamente', pedido });
  } catch (error) {
    logger.error(`Error en procesarCheckout: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ error: 'Error en el proceso de checkout' });
  }
};
