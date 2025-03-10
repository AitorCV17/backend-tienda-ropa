// src/controllers/productoController.ts
import { Request, Response } from 'express';
import prisma from '../config/db';

export const obtenerProductos = async (req: Request, res: Response) => {
  const { search, categoria, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  try {
    const where: any = {};
    if (search) {
      where.nombre = { contains: search as string, mode: 'insensitive' };
    }
    if (categoria) {
      where.id_categoria = Number(categoria);
    }
    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: Number(limit),
        include: { 
          imagenes: true,
          variantes: true
        }
      }),
      prisma.producto.count({ where })
    ]);
    res.json({ productos, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
