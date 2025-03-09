import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/db';

export const obtenerCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

export const crearCategoria = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  const { nombre, descripcion } = req.body;
  try {
    const nuevaCategoria = await prisma.categoria.create({ data: { nombre, descripcion } });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

export const actualizarCategoria = async (req: Request, res: Response) => {
  const categoriaId = parseInt(req.params.id, 10);
  const { nombre, descripcion } = req.body;
  try {
    const categoriaActualizada = await prisma.categoria.update({
      where: { id: categoriaId },
      data: { nombre, descripcion }
    });
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

export const eliminarCategoria = async (req: Request, res: Response) => {
  const categoriaId = parseInt(req.params.id, 10);
  try {
    await prisma.categoria.delete({ where: { id: categoriaId } });
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
