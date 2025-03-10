// src/controllers/checkoutController.ts
import { Request, Response } from 'express';
import prisma from '../config/db';
import { Carrito, CarritoItem } from '@prisma/client';
import { logger } from '../config/logger';

type CarritoItemConVariante = CarritoItem & {
  variante: {
    precio: number;
    stock: number;
    talla: string;
    color: string;
    producto: {
      nombre: string;
      imagenes: any[];
    };
  };
};

type CarritoConItems = Carrito & {
  items: CarritoItemConVariante[];
};

export const procesarCheckout = async (req: Request, res: Response) => {
  const userId = req.usuario?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Autenticación requerida para checkout' });
  }

  const { id_direccion, metodoPago } = req.body;

  try {
    // Se incluye la relación "variante" y, dentro de ella, la información del producto e imágenes.
    const carrito = await prisma.carrito.findUnique({
      where: { id_usuario: userId },
      include: { 
        items: { 
          include: { 
            variante: { include: { producto: { include: { imagenes: true } } } }
          } 
        } 
      }
    }) as CarritoConItems | null;

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Verificar stock en tiempo real para cada variante
    for (const item of carrito.items) {
      if (item.cantidad > item.variante.stock) {
        return res.status(400).json({
          error: `No hay stock suficiente para el producto ${item.variante.producto.nombre} (${item.variante.talla}, ${item.variante.color})`
        });
      }
    }

    // Simulación de pago ficticio (siempre exitoso)
    const pagoExitoso = true;
    if (!pagoExitoso) {
      return res.status(400).json({ error: 'El pago falló' });
    }

    // Transacción para asegurar la atomicidad del proceso
    const pedido = await prisma.$transaction(async (tx) => {
      let total = 0;
      const detallesData = carrito.items.map((item) => {
        total += item.cantidad * item.variante.precio;
        return {
          id_producto_variante: item.id_producto_variante,
          cantidad: item.cantidad,
          precio_unitario: item.variante.precio
        };
      });

      const pedidoCreado = await tx.pedido.create({
        data: {
          id_usuario: userId,
          id_direccion,
          total,
          estado: 'pendiente',
          detalles: { create: detallesData }
        }
      });

      // Actualizar stock de cada variante
      for (const item of carrito.items) {
        await tx.productoVariante.update({
          where: { id: item.id_producto_variante },
          data: { stock: item.variante.stock - item.cantidad }
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
