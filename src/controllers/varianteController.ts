// src/controllers/varianteController.ts
import { Request, Response } from 'express';
import prisma from '../config/db';
import { validationResult } from 'express-validator';

// Obtener todas las variantes; opcionalmente filtrar por id_producto
export const obtenerVariantes = async (req: Request, res: Response) => {
  const { id_producto } = req.query;
  try {
    const where = id_producto ? { id_producto: Number(id_producto) } : {};
    const variantes = await prisma.productoVariante.findMany({
      where,
      include: { producto: true }
    });
    res.json(variantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener variantes' });
  }
};

// Obtener una variante por id
export const obtenerVariante = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const variante = await prisma.productoVariante.findUnique({
      where: { id },
      include: { producto: true }
    });
    if (!variante) return res.status(404).json({ error: 'Variante no encontrada' });
    res.json(variante);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la variante' });
  }
};

// Crear variante
export const crearVariante = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  const { id_producto, talla, color, precio, stock } = req.body;
  try {
    const nuevaVariante = await prisma.productoVariante.create({
      data: {
        id_producto: Number(id_producto),
        talla,
        color,
        precio: Number(precio),
        stock: Number(stock) || 0
      }
    });
    res.status(201).json(nuevaVariante);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear variante' });
  }
};

// Actualizar variante
export const actualizarVariante = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { talla, color, precio, stock } = req.body;
  try {
    const varianteActualizada = await prisma.productoVariante.update({
      where: { id },
      data: { 
        talla,
        color,
        precio: precio !== undefined ? Number(precio) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined
      }
    });
    res.json(varianteActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la variante' });
  }
};

// Eliminar variante
export const eliminarVariante = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.productoVariante.delete({ where: { id } });
    res.json({ message: 'Variante eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la variante' });
  }
};
