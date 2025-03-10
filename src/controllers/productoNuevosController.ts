import { Request, Response } from 'express';
import prisma from '../config/db';

export const obtenerProductosNuevos = async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        orderBy: { fecha_creacion: 'desc' },
        skip,
        take: limitNum,
        include: {
          imagenes: true,
          variantes: true
        }
      }),
      prisma.producto.count()
    ]);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      productos
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos nuevos' });
  }
};
