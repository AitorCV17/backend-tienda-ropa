import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const obtenerProductosRecomendados = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.usuario) {
      // Usuario autenticado => basar en historial
      const pedidos = await prisma.pedido.findMany({
        where: { id_usuario: req.usuario.id },
        include: {
          detalles: {
            include: {
              variante: true
            }
          }
        }
      });

      const productosComprados = new Set<number>();
      pedidos.forEach((pedido) => {
        pedido.detalles.forEach((detalle) => {
          productosComprados.add(detalle.variante.id_producto);
        });
      });

      const recomendaciones = await prisma.producto.findMany({
        where: { id: { notIn: Array.from(productosComprados) } },
        take: 5,
        include: { imagenes: true, variantes: true }
      });

      res.json({ recomendaciones });
    } else {
      // Usuario no autenticado => productos populares
      const rawQuery = `
        SELECT p.id, p.nombre,
          (SELECT ip.url FROM "ImagenProducto" ip
            WHERE ip.id_producto = p.id
            ORDER BY ip.id ASC
            LIMIT 1) AS "imagen_principal",
          MIN(pv.precio) AS "precio",
          SUM(pv.stock) AS "stock",
          COALESCE(SUM(dp.cantidad), 0) AS "ventas"
        FROM "Producto" p
        LEFT JOIN "ProductoVariante" pv ON pv.id_producto = p.id
        LEFT JOIN "DetallePedido" dp ON dp.id_producto_variante = pv.id
        GROUP BY p.id
        ORDER BY "ventas" DESC
        LIMIT 5;
      `;
      const recomendaciones = await prisma.$queryRawUnsafe(rawQuery);
      res.json({ recomendaciones });
    }
  } catch (error) {
    next(error);
  }
};
