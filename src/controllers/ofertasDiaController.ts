import { Request, Response } from 'express';
import prisma from '../config/db';

export const obtenerOfertasDia = async (req: Request, res: Response) => {
  try {
    // Selecciona productos con pocas ventas (<5) o alto stock (>50)
    const rawQuery = `
      SELECT p.id, p.nombre,
        (SELECT ip.url FROM "ImagenProducto" ip WHERE ip.id_producto = p.id ORDER BY ip.id ASC LIMIT 1) AS "imagen_principal",
        MIN(pv.precio) AS "precio_oferta",
        SUM(pv.stock) AS "stock",
        '20%' AS "descuento"
      FROM "Producto" p
      LEFT JOIN "ProductoVariante" pv ON pv.id_producto = p.id
      LEFT JOIN "DetallePedido" dp ON dp.id_producto_variante = pv.id
      GROUP BY p.id
      HAVING COALESCE(SUM(dp.cantidad), 0) < 5 OR SUM(pv.stock) > 50
      ORDER BY p.id
      LIMIT 10;
    `;
    const ofertas = await prisma.$queryRawUnsafe(rawQuery);
    res.json({ ofertas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ofertas del día' });
  }
};
