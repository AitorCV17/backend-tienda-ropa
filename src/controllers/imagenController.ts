// src/controllers/imagenController.ts
import { Request, Response } from 'express';
import prisma from '../config/db';
import { validationResult } from 'express-validator';

// Obtener todas las imágenes; opcionalmente filtrar por id_producto
export const obtenerImagenes = async (req: Request, res: Response) => {
  const { id_producto } = req.query;
  try {
    const where = id_producto ? { id_producto: Number(id_producto) } : {};
    const imagenes = await prisma.imagenProducto.findMany({ where });
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
};

// Obtener una imagen por id
export const obtenerImagen = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const imagen = await prisma.imagenProducto.findUnique({ where: { id } });
    if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.json(imagen);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la imagen' });
  }
};

// Obtener imagen por posición (orden ascendente por id)
// Se espera que "posicion" sea 1-indexada (la primera imagen es posición 1)
export const obtenerImagenPorPosicion = async (req: Request, res: Response) => {
  const id_producto = Number(req.params.id_producto);
  const posicion = Number(req.params.posicion);
  try {
    const imagenes = await prisma.imagenProducto.findMany({
      where: { id_producto },
      orderBy: { id: 'asc' }
    });
    if (posicion < 1 || posicion > imagenes.length) {
      return res.status(404).json({ error: 'No se encontró una imagen en la posición solicitada' });
    }
    res.json(imagenes[posicion - 1]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la imagen por posición' });
  }
};

// Crear imagen
export const crearImagen = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  const { id_producto, url } = req.body;
  try {
    const nuevaImagen = await prisma.imagenProducto.create({
      data: { id_producto: Number(id_producto), url }
    });
    res.status(201).json(nuevaImagen);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear imagen' });
  }
};

// Actualizar imagen
export const actualizarImagen = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { url } = req.body;
  try {
    const imagenActualizada = await prisma.imagenProducto.update({
      where: { id },
      data: { url }
    });
    res.json(imagenActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar imagen' });
  }
};

// Eliminar imagen
export const eliminarImagen = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.imagenProducto.delete({ where: { id } });
    res.json({ message: 'Imagen eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};
