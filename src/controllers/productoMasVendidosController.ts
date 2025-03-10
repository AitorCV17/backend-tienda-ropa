import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const obtenerProductosMasVendidos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categoria, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const categoriaId = categoria ? parseInt(categoria as string, 10) : null;

    const rawQuery = `
      SELECT p.id, p.nombre,
        (SELECT ip.url FROM "ImagenProducto" ip
          WHERE ip.id_producto = p.id
          ORDER BY ip.id ASC
          LIMIT 1) AS "imagen_principal",
        MIN(pv.precio) AS "precio_minimo",
        SUM(pv.stock) AS "stock",
        COALESCE(SUM(dp.cantidad), 0) AS "ventas"
      FROM "Producto" p
      LEFT JOIN "ProductoVariante" pv ON pv.id_producto = p.id
      LEFT JOIN "DetallePedido" dp ON dp.id_producto_variante = pv.id
      ${categoriaId ? 'WHERE p.id_categoria = $1' : ''}
      GROUP BY p.id
      ORDER BY "ventas" DESC
      OFFSET $2 LIMIT $3;
    `;

    // Dependiendo de si se incluye "categoriaId" o no, pasamos los parámetros
    const productos = categoriaId
      ? await prisma.$queryRawUnsafe(rawQuery, categoriaId, skip, limitNum)
      : await prisma.$queryRawUnsafe(rawQuery, skip, limitNum);

    // Consulta para el total de productos
    const countQuery = categoriaId
      ? `SELECT COUNT(*) FROM "Producto" p WHERE p.id_categoria = $1;`
      : `SELECT COUNT(*) FROM "Producto" p;`;

    const countResult: any = categoriaId
      ? await prisma.$queryRawUnsafe(countQuery, categoriaId)
      : await prisma.$queryRawUnsafe(countQuery);

    const total = parseInt(countResult[0].count, 10);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      productos
    });
  } catch (error) {
    next(error);
  }
};
