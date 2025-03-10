import { Request, Response } from 'express';
import prisma from '../config/db';

export const obtenerCategoriasConProductos = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        productos: {
          take: 5,
          include: {
            imagenes: true,
            variantes: true
          }
        }
      }
    });
    res.json({ categorias });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías con productos' });
  }
};
